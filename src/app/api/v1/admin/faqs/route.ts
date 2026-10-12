import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/guards';
import defaultFaqs from '@/lib/content/faqs';

export const dynamic = 'force-dynamic';

const MAX_QUESTION = 300;
const MAX_ANSWER = 2000;

/** GET /api/v1/admin/faqs — every question (active or not) in display order */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const faqs = await prisma.faq.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
    return NextResponse.json({ faqs });
  } catch (error) {
    console.error('[AdminFaqs] List failed:', error);
    return NextResponse.json({ error: 'FAQ table is not ready. Run `npx prisma db push` (or redeploy) to create it.' }, { status: 500 });
  }
}

/**
 * POST /api/v1/admin/faqs
 *   { question, answer }          → add one question at the end of the list
 *   { seedDefaults: true }        → import the built-in questions (only when the list is empty)
 *   { order: [id, id, …] }        → save a new display order
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await req.json();

    if (body.seedDefaults) {
      if ((await prisma.faq.count()) > 0) {
        return NextResponse.json({ error: 'Questions already exist — nothing was imported.' }, { status: 409 });
      }
      await prisma.faq.createMany({
        data: defaultFaqs.map((f, i) => ({ question: f.q, answer: f.a, sortOrder: i })),
      });
      return NextResponse.json({ success: true, imported: defaultFaqs.length });
    }

    if (Array.isArray(body.order)) {
      const ids = body.order.filter((id: unknown): id is string => typeof id === 'string');
      await prisma.$transaction(ids.map((id: string, i: number) => prisma.faq.update({ where: { id }, data: { sortOrder: i } })));
      return NextResponse.json({ success: true });
    }

    const question = String(body.question ?? '').trim();
    const answer = String(body.answer ?? '').trim();
    if (!question || !answer) {
      return NextResponse.json({ error: 'Both a question and an answer are required' }, { status: 400 });
    }
    if (question.length > MAX_QUESTION || answer.length > MAX_ANSWER) {
      return NextResponse.json({ error: `Question is limited to ${MAX_QUESTION} characters and the answer to ${MAX_ANSWER}` }, { status: 400 });
    }
    const last = await prisma.faq.aggregate({ _max: { sortOrder: true } });
    const faq = await prisma.faq.create({ data: { question, answer, sortOrder: (last._max.sortOrder ?? -1) + 1 } });
    return NextResponse.json({ success: true, faq });
  } catch (error) {
    console.error('[AdminFaqs] Save failed:', error);
    return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 });
  }
}
