import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = await prisma.marketDataReport.findFirst({
      where: { isActive: true },
      include: {
        entries: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!report) {
      return NextResponse.json({ data: null });
    }
    
    return NextResponse.json({ data: report });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
