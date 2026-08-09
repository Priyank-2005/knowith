import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GeminiSDK } from '@/lib/ai/GeminiSDK';
import { TaxChatRequestSchema, TaxAIResponseSchema } from '@/schemas/tax.schema';
import { taxConfig } from '@/lib/config/tax.config';
import { WorkflowExecutor } from '@/lib/ai/core/orchestrator/WorkflowExecutor';
import { TaxWorkflow } from '@/lib/ai/features/tax/TaxWorkflow';
import { TaxCalculatorCapability } from '@/lib/ai/features/tax/capabilities/TaxCalculatorCapability';
import { TaxStrategistCapability } from '@/lib/ai/features/tax/capabilities/TaxStrategistCapability';

// @ts-ignore
import { logChatSequence } from '@/lib/chatLogger';

const taxRegistry = new Map();
taxRegistry.set(TaxCalculatorCapability.id, TaxCalculatorCapability);
taxRegistry.set(TaxStrategistCapability.id, TaxStrategistCapability);

const workflowExecutor = new WorkflowExecutor(
  TaxWorkflow,
  taxRegistry,
  { maxConcurrent: 1, maxRetries: 3 }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const parsed = TaxChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.message } },
        { status: 400 }
      );
    }

    const { message, currentState, history = [] } = parsed.data;
    const sessionId = body.sessionId || `session-${Date.now()}`;

    const messages = [
      { 
        role: 'system' as const, 
        content: `Current Profile State Data: ${JSON.stringify(currentState || {})}`
      },
      ...history.map((h: any) => ({ role: h.role as any, content: h.content })),
      { 
        role: 'user' as const, 
        content: message 
      }
    ];

    const { data: aiData, usage } = await GeminiSDK.generateStructuredResponse<z.infer<typeof TaxAIResponseSchema>>(
      taxConfig.systemPrompt,
      messages,
      TaxAIResponseSchema, 
      { temperature: 0.1, model: 'gemini-3.5-flash' } 
    );

    let massiveBlueprint = null;

    if (aiData.nextState === 'REPORT_READY') {
      console.log("[Orchestrator] Initiating Multi-Agent Workflow: tax_strategist_workflow");
      
      const mathContext = {
        profile: aiData.updatedProfile
      };

      const workflowResult = await workflowExecutor.execute(
        sessionId,
        mathContext
      );

      if (workflowResult.status === 'ERROR') {
        throw new Error(`Orchestration failed: ${workflowResult.telemetry.warnings.join(', ')}`);
      }

      console.log(`[Orchestrator] Workflow Complete. Latency: ${workflowResult.telemetry.totalDurationMs}ms`);
      massiveBlueprint = workflowResult.data;
    }

    const botResponseStr = aiData.message || (massiveBlueprint ? "Here is your generated tax optimization blueprint." : "Please provide the next piece of information.");
    
    // Log to DB
    await logChatSequence(
      sessionId,
      'TAX',
      body.userId || null,
      message,
      botResponseStr,
      'v1.0.0'
    );

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        updatedProfile: aiData.updatedProfile,
        botResponse: botResponseStr,
        cards: aiData.cards, 
        blueprint: massiveBlueprint || undefined,
        nextState: aiData.nextState,
        missingFields: aiData.missingFields
      }
    });

  } catch (error: any) {
    console.error('Tax API Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
