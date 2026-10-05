import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

/** PATCH — { name?, isActive? } */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = await req.json();

  const data: { name?: string | null; isActive?: boolean } = {};
  if (typeof body.name === 'string') data.name = body.name.trim() || null;
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive;

  try {
    const client = await prisma.approvedClient.update({ where: { id }, data });
    return NextResponse.json({ success: true, client });
  } catch {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }
}

/** DELETE — removes the email from the approved list */
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  await prisma.approvedClient.deleteMany({ where: { id } });
  return NextResponse.json({ success: true });
}
