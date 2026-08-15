import { z } from 'zod';
import { GeminiSDK } from '@/lib/ai/GeminiSDK';
import { IntentClassificationSchema } from '@/schemas/support.schema';

export const IntentRouter = {
  id: 'support_intent_router_v1',
  description: 'Classifies the intent of the user message to route to appropriate capabilities.',
  
  execute: async (context: any) => {
    const prompt = `
You are an Intent Classification router for a premium financial wealth management firm.
Review the recent conversation history and specifically the user's LATEST message to determine their primary intent.

Recent Conversation History:
${JSON.stringify(context.history || [], null, 2)}

User's Latest Message:
"${context.latestMessage}"

Classify into exactly one of these intents:
- Taxation (questions about income tax, LTCG/STCG, tax saving, deductions)
- General Investing (questions about mutual funds, SIPs, stock market basics, portfolio diversification)
- International Scenarios (NRI investing, sending money abroad, foreign tax credits, US stocks)
- Currency (exchange rates, INR depreciation, hedging, forex impact on returns)
- Lead Intent (expressing interest to invest, start SIP, get financial planning, or sharing contact details)
- Human Advisor (explicitly asking to speak with a human or schedule a call)
- Greeting (hello, hi, good morning, thanks)
- Out of Scope (ANYTHING ELSE. This includes general chit-chat, coding, medical advice, cooking, sports, and even unrelated financial topics like credit card disputes or loans. If it doesn't clearly fit the 4 domains or lead/advisor intents, mark it as Out of Scope.)

Also determine a 'confidence' score between 0 and 100 for your classification.
`;

    const { data } = await GeminiSDK.generateStructuredResponse(
      prompt,
      [{ role: 'user', content: 'Classify intent.' }],
      IntentClassificationSchema,
      { model: "gemini-3.5-flash" }
    );

    return data; // { intent, confidence }
  }
};
