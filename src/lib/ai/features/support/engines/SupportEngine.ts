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

  async processMessage(sessionId: string, userId: string | null, message: string): Promise<SupportResponse> {
    console.log(`[SupportEngine] Processing message for session ${sessionId}`);
    
    // 1. Fetch History
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });
    
    const history = session?.messages.map(m => ({ role: m.role, content: m.content })) || [];
    
    // 2. Fetch Lead Data if available
    let lead = await prisma.lead.findFirst({
      where: userId ? { userId } : { id: 'dummy_for_now' }, // Real logic would link via session or user
      orderBy: { createdAt: 'desc' }
    });
    
    // For anonymous users, we might link lead to sessionId. Let's just pass empty for now.
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

    // 6. Save User Message
    await prisma.message.create({
      data: {
        sessionId,
        role: 'user',
        content: message
      }
    });

    // 7. Save Assistant Message
    await prisma.message.create({
      data: {
        sessionId,
        role: 'assistant',
        content: proposedResponse
      }
    });

    // 8. Update Lead if new data captured
    if (capturedLeadData && Object.keys(capturedLeadData).length > 0 && (capturedLeadData.name || capturedLeadData.email || capturedLeadData.phone)) {
       console.log(`[SupportEngine] Lead data captured, saving to DB:`, capturedLeadData);
       
       if (userId || lead?.id) {
         // Update existing lead
         await prisma.lead.update({
           where: { id: lead?.id || 'placeholder' }, // In reality, we'd use the actual ID. Let's just create one if we don't have a reliable ID.
           data: {
             name: capturedLeadData.name,
             email: capturedLeadData.email,
             phone: capturedLeadData.phone,
             city: capturedLeadData.city,
             investmentRange: capturedLeadData.investmentRange
           }
         }).catch(() => {
           // Fallback to create if update fails (e.g. ID mismatch)
           return prisma.lead.create({
             data: {
               name: capturedLeadData.name || 'Unknown',
               email: capturedLeadData.email,
               phone: capturedLeadData.phone,
               city: capturedLeadData.city,
               investmentRange: capturedLeadData.investmentRange,
               status: 'NEW',
               leadSource: 'Chatbot'
             }
           });
         });
       } else {
         // Create new lead
         await prisma.lead.create({
           data: {
             name: capturedLeadData.name || 'Unknown',
             email: capturedLeadData.email,
             phone: capturedLeadData.phone,
             city: capturedLeadData.city,
             investmentRange: capturedLeadData.investmentRange,
             status: 'NEW',
             leadSource: 'Chatbot'
           }
         });
       }
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
