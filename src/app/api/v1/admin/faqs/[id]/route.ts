import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

/** PATCH — { question?, answer?, isActive? } */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = await req.json();

  const data: { question?: string; answer?: string; isActive?: boolean } = {};
  if (typeof body.question === 'string') {
    const q = body.question.trim();
    if (!q || q.length > 300) return NextResponse.json({ error: 'Question must be 1–300 characters' }, { status: 400 });
    data.question = q;
  }
  if (typeof body.answer === 'string') {
    const a = body.answer.trim();
    if (!a || a.length > 2000) return NextResponse.json({ error: 'Answer must be 1–2000 characters' }, { status: 400 });
    data.answer = a;
  }
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive;

  try {
    const faq = await prisma.faq.update({ where: { id }, data });
    return NextResponse.json({ success: true, faq });
  } catch {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }
}

/** DELETE — removes the question */
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  await prisma.faq.deleteMany({ where: { id } });
  return NextResponse.json({ success: true });
}
