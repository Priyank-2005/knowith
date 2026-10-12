import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/guards';
import { sanitizeProduct, type ProductInput } from '@/lib/products';

export const dynamic = 'force-dynamic';

/** PATCH — { isActive } toggles visibility; { product } replaces the editable fields */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive;
  if (body.product) {
    const clean = sanitizeProduct(body.product as ProductInput);
    if (!clean) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    Object.assign(data, clean);
  }

  try {
    const product = await prisma.productListing.update({ where: { id }, data });
    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}

/** DELETE — removes the row */
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  await prisma.productListing.deleteMany({ where: { id } });
  return NextResponse.json({ success: true });
}
