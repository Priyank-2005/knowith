import { prisma } from '@/lib/prisma';
import { StaticKnowledgeProvider } from '@/lib/data/support/StaticKnowledgeProvider';
import { IntentRouter } from '../capabilities/IntentRouter';
import { KnowledgeCapability } from '../capabilities/KnowledgeCapability';
import { EducationalCapability } from '../capabilities/EducationalCapability';
import { LeadQualificationCapability } from '../capabilities/LeadQualificationCapability';
import { HumanEscalationCapability } from '../capabilities/HumanEscalationCapability';
import { ComplianceCapability } from '../capabilities/ComplianceCapability';
import { SupportResponse } from '@/schemas/support.schema';

export class SupportEngine {
  private knowledgeProvider = new StaticKnowledgeProvider();

  async processMessage(sessionId: string, message: string): Promise<SupportResponse> {
    console.log(`[SupportEngine] Processing message for session ${sessionId}`);
    
    // 1. Fetch History
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });
    
    const history = session?.messages.map(m => ({ role: m.role, content: m.content })) || [];
    
    // 2. Lead captured earlier in this conversation (one lead per support chat)
    const lead = await prisma.lead.findUnique({ where: { sessionId } });
    const leadData = lead ? { name: lead.name, email: lead.email, phone: lead.phone, city: lead.city, investmentRange: lead.investmentRange } : {};

    // 3. Intent Detection
    let intentResult: any = { intent: 'Unknown', confidence: 0 };
    const lowerMsg = message.trim().toLowerCase();
    
    // Quick bypass for simple greetings to reduce latency
    if (['hi', 'hello', 'hey', 'good morning', 'good evening', 'thanks', 'thank you'].includes(lowerMsg)) {
       intentResult = { intent: 'Greeting', confidence: 100 };
    } else {
       intentResult = await IntentRouter.execute({ history, latestMessage: message });
    }
    console.log(`[SupportEngine] Intent detected: ${intentResult.intent} (${intentResult.confidence}%)`);

    let proposedResponse = '';
    let escalationDetails = undefined;
    let isEscalated = false;
    let capturedLeadData = undefined;

    // 4. Capability Routing
    if (
      intentResult.intent === 'Taxation' ||
      intentResult.intent === 'General Investing' ||
      intentResult.intent === 'International Scenarios' ||
      intentResult.intent === 'Currency'
    ) {
      // Import dynamically to avoid circular dependencies or just rely on top-level imports
      const { DomainExpertCapability } = require('../capabilities/DomainExpertCapability');
      const result = await DomainExpertCapability.execute({ history, latestMessage: message });
      proposedResponse = result.response;
    }
    else if (intentResult.intent === 'Lead Intent') {
      const result = await LeadQualificationCapability.execute({ leadData, history, latestMessage: message });
      proposedResponse = result.response;
      capturedLeadData = result.capturedLeadData;
    }
    else if (intentResult.intent === 'Human Advisor') {
      const result = await HumanEscalationCapability.execute({ leadData, history, latestMessage: message });
      proposedResponse = result.response;
      escalationDetails = result.handoff;
      isEscalated = true;
      capturedLeadData = result.handoff.collectedDetails;
    }
    else if (intentResult.intent === 'Out of Scope') {
      proposedResponse = "I apologize, but as the Knowith Capital Virtual Wealth Assistant, my expertise is strictly focused on **Taxation, General Investing, International Scenarios, and Currency**. I am unable to assist with other topics. How can I help you with your wealth planning today?";
    }
    else {
      // Greeting
      proposedResponse = "Hello! I am your digital relationship manager for Knowith Capital. My expertise includes Taxation, General Investing, International Scenarios, and Currency. How can I assist you today?";
    }

    // 5. Compliance Review (Skip for hardcoded safe responses to reduce latency)
    if (intentResult.intent !== 'Greeting' && intentResult.intent !== 'Out of Scope') {
      const complianceResult = await ComplianceCapability.execute({ proposedResponse });
      if (!complianceResult.isCompliant && complianceResult.revisedResponse) {
        console.log(`[SupportEngine] Compliance intervention triggered. Reason: ${complianceResult.reason}`);
        proposedResponse = complianceResult.revisedResponse;
      }
    }

    // 6. Save the exchange (user → assistant order preserved) and bump the session's activity time
    const now = Date.now();
    await prisma.$transaction([
      prisma.message.createMany({
        data: [
          { sessionId, role: 'user', content: message, createdAt: new Date(now) },
          { sessionId, role: 'assistant', content: proposedResponse, createdAt: new Date(now + 1) },
        ],
      }),
      prisma.session.update({ where: { id: sessionId }, data: { updatedAt: new Date() } }),
    ]);

    // 7. Create or enrich this conversation's lead when contact details were captured
    if (capturedLeadData && (capturedLeadData.name || capturedLeadData.email || capturedLeadData.phone)) {
      const fields = {
        name: capturedLeadData.name || lead?.name || 'Unknown',
        email: capturedLeadData.email ?? lead?.email,
        phone: capturedLeadData.phone ?? lead?.phone,
        city: capturedLeadData.city ?? lead?.city,
        investmentRange: capturedLeadData.investmentRange ?? lead?.investmentRange,
      };
      await prisma.lead.upsert({
        where: { sessionId },
        create: { ...fields, sessionId, status: 'NEW', leadSource: isEscalated ? 'Chatbot – advisor request' : 'Chatbot' },
        update: fields,
      });
      console.log(`[SupportEngine] Lead saved for session ${sessionId}`);
    }

    return {
      message: proposedResponse,
      isEscalated,
      escalationDetails,
      suggestedQuestions: [
        "What are the new LTCG tax rates?",
        "Should I invest in US stocks?",
        "I want to speak to an advisor"
      ]
    };
  }
}
