import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { generateIndianFundReport, INDIAN_MF_CACHE_TAG } from '@/lib/services/indianMutualFunds';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// AMFI publishes NAVs once per business day, so the computed report is cached
// for a day. The daily market-data cron also expires this tag (see ../generate).
const getCachedReport = unstable_cache(generateIndianFundReport, ['indian-mf-report-v2'], {
  tags: [INDIAN_MF_CACHE_TAG],
  revalidate: 86400,
});

/** GET /api/v1/market-data/india?kind=mf|etf — omit `kind` for everything */
export async function GET(req: NextRequest) {
  try {
    const report = await getCachedReport();
    const kind = req.nextUrl.searchParams.get('kind');
    const data = kind === 'mf' || kind === 'etf'
      ? { ...report, categories: report.categories.filter(c => c.kind === kind) }
      : report;
    return NextResponse.json({ data });
  } catch (error) {
    console.error('[IndianMF] Failed to build report:', error);
    return NextResponse.json({ data: null, error: 'Indian fund data is temporarily unavailable' }, { status: 502 });
  }
}
