import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/guards';
import { isProductCategory, sanitizeProduct, type ProductInput } from '@/lib/products';

export const dynamic = 'force-dynamic';

const MAX_ROWS = 2000;

/** GET /api/v1/admin/products?category= — every row (active or not) */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const category = req.nextUrl.searchParams.get('category');
  try {
    const products = await prisma.productListing.findMany({
      where: isProductCategory(category) ? { category } : {},
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error('[AdminProducts] List failed:', error);
    return NextResponse.json({ error: 'Product table is not ready. Run `npx prisma db push` (or redeploy) to create it.' }, { status: 500 });
  }
}

/**
 * POST /api/v1/admin/products
 *   { category, product }                    → add one
 *   { category, rows: [...], mode? }         → bulk import; mode "replace" clears the category first, default "append"
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await req.json();
    if (!isProductCategory(body.category)) {
      return NextResponse.json({ error: 'category must be SIF, GIFT_CITY or PMS' }, { status: 400 });
    }
    const category = body.category;
    const inputs: ProductInput[] = Array.isArray(body.rows) ? body.rows : [body.product ?? {}];
    if (inputs.length > MAX_ROWS) {
      return NextResponse.json({ error: `Too many rows (limit ${MAX_ROWS})` }, { status: 400 });
    }

    const rows = inputs.map(sanitizeProduct);
    const valid = rows.filter((r): r is NonNullable<typeof r> => r !== null);
    const skipped = rows.length - valid.length;
    if (valid.length === 0) {
      return NextResponse.json({ error: 'No rows with a Name were found', skipped }, { status: 400 });
    }

    const replace = body.mode === 'replace';
    const last = replace ? null : await prisma.productListing.aggregate({ where: { category }, _max: { sortOrder: true } });
    const start = replace ? 0 : (last?._max.sortOrder ?? -1) + 1;

    await prisma.$transaction([
      ...(replace ? [prisma.productListing.deleteMany({ where: { category } })] : []),
      prisma.productListing.createMany({ data: valid.map((r, i) => ({ ...r, category, sortOrder: start + i })) }),
    ]);
    return NextResponse.json({ success: true, added: valid.length, skipped, replaced: replace });
  } catch (error) {
    console.error('[AdminProducts] Save failed:', error);
    return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 });
  }
}
