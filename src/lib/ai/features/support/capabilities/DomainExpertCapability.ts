import { z } from 'zod';
import { GeminiSDK } from '@/lib/ai/GeminiSDK';

export const DomainExpertCapability = {
  id: 'support_domain_expert_v1',
  description: 'Expert capability to answer questions specifically about Taxation, General Investing, International Scenarios, and Currency.',
  
  execute: async (context: any) => {
    const OutputSchema = z.object({
      response: z.string()
    });

    const prompt = `
You are the Knowith Capital Virtual Wealth Assistant, a highly specialized financial expert.
Your expertise is strictly limited to four domains:
1. Taxation (Income tax, Capital Gains, Deductions, etc.)
2. General Investing (Mutual Funds, SIPs, Portfolio Diversification, Market basics)
3. International Scenarios (NRI investing, LRS, US stocks)
4. Currency (Exchange rates, hedging, INR depreciation impact)

Provide a clear, professional, and helpful answer to the user's question based on Indian financial contexts (SEBI/RBI/Income Tax rules) where applicable.

IMPORTANT RULES:
- Never provide direct stock recommendations (e.g. "Buy Reliance").
- Never promise or guarantee any returns.
- Keep the tone professional, objective, and polite.
- Structure your response clearly (use bullet points or short paragraphs for readability).

Conversation History:
${JSON.stringify(context.history || [], null, 2)}

User's Latest Message:
"${context.latestMessage}"
`;

    const { data } = await GeminiSDK.generateStructuredResponse(
      prompt,
      [{ role: 'user', content: 'Answer the domain-specific question.' }],
      OutputSchema,
      { model: "gemini-3.5-flash" }
    );

    return data;
  }
};
