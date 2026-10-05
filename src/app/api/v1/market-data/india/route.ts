import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { generateIndianFundReport, INDIAN_MF_CACHE_TAG } from '@/lib/services/indianMutualFunds';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// AMFI publishes NAVs once per business day, so the computed report is cached
// for a day. The daily market-data cron also expires this tag (see ../generate).
const getCachedReport = unstable_cache(generateIndianFundReport, ['indian-mf-report-v1'], {
  tags: [INDIAN_MF_CACHE_TAG],
  revalidate: 86400,
});

export async function GET() {
  try {
    const report = await getCachedReport();
    return NextResponse.json({ data: report });
  } catch (error) {
    console.error('[IndianMF] Failed to build report:', error);
    return NextResponse.json({ data: null, error: 'Indian fund data is temporarily unavailable' }, { status: 502 });
  }
}
