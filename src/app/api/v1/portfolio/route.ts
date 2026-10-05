import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GeminiSDK } from '@/lib/ai/GeminiSDK';
import { PortfolioChatRequestSchema, PortfolioAIResponseSchema } from '@/schemas/portfolio.schema';
import { portfolioConfig } from '@/lib/config/portfolio.config';
import { WorkflowExecutor } from '@/lib/ai/core/orchestrator/WorkflowExecutor';
import { PortfolioWorkflow } from '@/lib/ai/features/portfolio/PortfolioWorkflow';
import { PortfolioAnalystCapability } from '@/lib/ai/features/portfolio/capabilities/PortfolioAnalystCapability';
import { RiskManagerCapability } from '@/lib/ai/features/portfolio/capabilities/RiskManagerCapability';
import { RebalancingStrategistCapability } from '@/lib/ai/features/portfolio/capabilities/RebalancingStrategistCapability';

import { getChatActor, logChatTurn, resolveSessionId } from '@/lib/chatLogger';

const portfolioRegistry = new Map();
portfolioRegistry.set(PortfolioAnalystCapability.id, PortfolioAnalystCapability);
portfolioRegistry.set(RiskManagerCapability.id, RiskManagerCapability);
portfolioRegistry.set(RebalancingStrategistCapability.id, RebalancingStrategistCapability);

const workflowExecutor = new WorkflowExecutor(
  PortfolioWorkflow,
  portfolioRegistry,
  { maxConcurrent: 1, maxRetries: 3 }
);

export async function POST(request: Request) {
  // Lets the error handler record a failed turn in the conversation log
  let turn: { sessionId: string; actor: Awaited<ReturnType<typeof getChatActor>>; message: string } | null = null;
  try {
    const body = await request.json();
    
    const parsed = PortfolioChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.message } },
        { status: 400 }
      );
    }

    const { message, currentState, history = [] } = parsed.data;
    // One conversation = one session (validated server-side); identity comes from the signed cookie
    const actor = await getChatActor();
    const sessionId = await resolveSessionId(body.sessionId, 'PORTFOLIO', actor);
    turn = { sessionId, actor, message };

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

    const { data: aiData, usage } = await GeminiSDK.generateStructuredResponse<z.infer<typeof PortfolioAIResponseSchema>>(
      portfolioConfig.systemPrompt,
      messages,
      PortfolioAIResponseSchema, 
      { temperature: 0.1, model: 'gemini-3.5-flash' } 
    );

    let massiveBlueprint = null;

    if (aiData.nextState === 'REPORT_READY') {
      console.log("[Orchestrator] Initiating Multi-Agent Workflow: portfolio_analyzer_workflow");
      
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

    const botResponseStr = aiData.message || (massiveBlueprint ? "Here is your generated portfolio analysis blueprint." : "Please provide the next piece of information.");

    // Log to DB
    await logChatTurn({
      sessionId,
      feature: 'PORTFOLIO',
      actor,
      userMessage: message,
      assistantMessage: botResponseStr,
      profile: { ...(currentState || {}), ...(aiData.updatedProfile || {}) },
      report: massiveBlueprint ?? undefined,
    });

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
    console.error('Portfolio API Error:', error);
    if (turn) {
      await logChatTurn({
        ...turn,
        feature: 'PORTFOLIO',
        userMessage: turn.message,
        assistantMessage: `⚠️ The assistant could not respond (${error?.message || 'unknown error'}).`,
      });
    }
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
