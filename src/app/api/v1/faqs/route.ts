import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import defaultFaqs from '@/lib/content/faqs';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/faqs — the homepage "Investors are asking" list.
 * Falls back to the built-in questions until some are saved in Admin → FAQs
 * (or if the table has not been created yet), so the homepage is never empty.
 */
export async function GET() {
  let faqs: { q: string; a: string }[] = defaultFaqs;
  try {
    const rows = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: { question: true, answer: true },
    });
    if (rows.length > 0) faqs = rows.map(r => ({ q: r.question, a: r.answer }));
  } catch (error) {
    console.error('[Faqs] Falling back to default questions:', (error as Error).message);
  }
  return NextResponse.json({ faqs }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
}
