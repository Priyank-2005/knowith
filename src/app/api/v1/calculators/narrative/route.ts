import { GeminiService } from '@/lib/services/GeminiService';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an expert financial planner. The user will provide a free-text narrative describing their financial goals (like retirement, marriage, buying a house, etc.), savings, and investments.
Your job is to extract the financial parameters from their narrative and return them in STRICT JSON format.

The JSON schema must exactly match:
{
  "initialInvestment": number | null,
  "monthlyInvestment": number | null,
  "targetAmount": number | null,
  "timeHorizonYears": number | null,
  "assumedReturnRate": number,
  "clarificationNeeded": string | null
}

Rules:
1. Extract existing savings/lump sums to "initialInvestment".
2. Extract SIP/monthly savings to "monthlyInvestment".
3. Extract any goal corpus (e.g. "I want 20 lakhs for my marriage", "millionaire") to "targetAmount". (Millionaire = 10,000,000 in India).
4. Extract timelines (e.g. "in 5 years", "at age 50") to "timeHorizonYears".
5. Default "assumedReturnRate" to 12 if not mentioned.
6. AUTO-CALCULATION (CRITICAL):
   - If the user provides a goal ("targetAmount") and a timeline ("timeHorizonYears"), but NO monthly savings, you MUST estimate the required monthly SIP to reach that goal (assuming the return rate) and put that estimated number in "monthlyInvestment". Also set "clarificationNeeded" to explain: "To reach your goal in [X] years, I've estimated you'll need a monthly SIP of roughly ₹[Y]."
   - If the user provides a goal and a monthly SIP, but NO timeline, estimate the years required and fill "timeHorizonYears". Set "clarificationNeeded" to: "With a monthly SIP of ₹[X], it will take you roughly [Y] years to reach your goal."
7. If the text is completely vague, asks for advice without numbers (e.g. "I don't know what to do"), or is missing a goal/timeline to do the above math, set "clarificationNeeded" to a friendly 1-2 sentence response asking for the missing info.
8. Strip all commas and formatting from numbers (e.g., 10 lakhs -> 1000000).`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Narrative text is required.' },
        { status: 400 }
      );
    }

    const messages = [
      { role: 'user' as const, content: text }
    ];

    const { data } = await GeminiService.generateStructuredOutput<any>(
      SYSTEM_PROMPT,
      messages,
      { 
        model: 'gemini-3.5-flash',
        temperature: 0.1, // Low temperature for deterministic extraction
        jsonMode: true
      }
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
