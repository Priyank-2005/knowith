import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getChatActor, logChatTurn } from '@/lib/chatLogger';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MODELS = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest'];

const SYSTEM_PROMPT = `You are the SIP Goal Planner for Knowith Capital, an Indian mutual fund advisory firm.
The client gives a goal amount, a time horizon and an expected return; the required monthly SIP has already been calculated exactly — do not recalculate it differently.
In clear, warm Markdown (short sections with ### headings, bullets, no tables wider than 3 columns):
1. Explain in plain words how the monthly SIP gets them to the goal (total invested vs. growth).
2. Assess whether the expected return is realistic for the horizon (equity ~10–12% long term, hybrid ~8–10%, debt ~6–7%), and say what changes if returns are 2% lower.
3. Suggest a sensible fund-category mix for the horizon and a yearly step-up idea.
Keep it under 350 words. Do not name specific schemes. End with one line inviting them to book a consultation with Knowith Capital.`;

/** FV of a monthly SIP paid at the start of each month = P × ((1+i)^n − 1) / i × (1+i) */
function requiredSip(target: number, years: number, annualReturnPct: number): number {
  const n = Math.round(years * 12);
  const i = annualReturnPct / 12 / 100;
  if (i === 0) return Math.round(target / n);
  return Math.round((target * i) / ((Math.pow(1 + i, n) - 1) * (1 + i)));
}

const inr = (v: number) => `₹${Math.round(v).toLocaleString('en-IN')}`;

export async function POST(request: Request) {
  try {
    const { targetAmount, durationYears, expectedReturn } = await request.json();
    const target = Number(targetAmount);
    const years = Number(durationYears);
    const rate = Number(expectedReturn);

    if (!(target > 0) || !(years > 0 && years <= 60) || !(rate >= 0 && rate <= 30)) {
      return NextResponse.json({ error: 'Enter a positive target, a duration up to 60 years and a return between 0% and 30%.' }, { status: 400 });
    }

    const sip = requiredSip(target, years, rate);
    const totalInvested = sip * Math.round(years * 12);
    const summary = `Goal ${inr(target)} in ${years} years at ${rate}% a year → monthly SIP ${inr(sip)} (total invested ${inr(totalInvested)}, estimated growth ${inr(target - totalInvested)}).`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    let guidance = '';
    let lastError: unknown;
    outer: for (const name of MODELS) {
      // Retry transient overload errors (503/429) before falling back to the next model
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const model = genAI.getGenerativeModel({ model: name, systemInstruction: SYSTEM_PROMPT });
          const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: summary }] }],
            generationConfig: { temperature: 0.5, maxOutputTokens: 1500 },
          });
          guidance = result.response.text().trim();
          if (guidance) break outer;
        } catch (err) {
          lastError = err;
          const message = (err as Error).message ?? '';
          console.warn(`[SIP] ${name} attempt ${attempt} failed:`, message.slice(0, 160));
          if (!/429|500|503|overloaded|high demand/i.test(message)) break;
          await new Promise(r => setTimeout(r, attempt * 2500));
        }
      }
    }

    const actor = await getChatActor();
    if (!guidance) {
      await logChatTurn({
        sessionId: randomUUID(), feature: 'SIP', actor, userMessage: summary,
        assistantMessage: `⚠️ The planner could not respond (${(lastError as Error)?.message?.slice(0, 120) || 'unknown error'}).`,
        profile: { targetAmount: target, durationYears: years, expectedReturn: rate, monthlySip: sip },
      });
      throw lastError ?? new Error('No guidance generated');
    }

    // Each calculation is its own entry in the admin chat logs
    await logChatTurn({
      sessionId: randomUUID(),
      feature: 'SIP',
      actor,
      userMessage: summary,
      assistantMessage: guidance,
      profile: { targetAmount: target, durationYears: years, expectedReturn: rate, monthlySip: sip },
    });

    return NextResponse.json({ sip, totalInvested, estimatedGrowth: target - totalInvested, guidance });
  } catch (error) {
    console.error('[SIP] Failed:', error);
    return NextResponse.json({ error: 'Could not generate guidance right now. Please try again.' }, { status: 500 });
  }
}
