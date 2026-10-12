import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isProductCategory } from '@/lib/products';

export const dynamic = 'force-dynamic';

/** GET /api/v1/products?category=SIF|GIFT_CITY|PMS — the curated list shown on the Indian Market page */
export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category');
  if (!isProductCategory(category)) {
    return NextResponse.json({ error: 'category must be SIF, GIFT_CITY or PMS' }, { status: 400 });
  }
  try {
    const products = await prisma.productListing.findMany({
      where: { category, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: {
        id: true, category: true, name: true, provider: true, strategy: true, minInvestment: true,
        return1y: true, return3y: true, return5y: true, aum: true, benchmark: true, fees: true, notes: true, url: true,
      },
    });
    return NextResponse.json({ products }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (error) {
    // Table not created yet → behave like an empty list rather than breaking the page
    console.error('[Products] List failed:', (error as Error).message);
    return NextResponse.json({ products: [] });
  }
}
