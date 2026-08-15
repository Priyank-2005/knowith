import { NextResponse } from 'next/server';
import { LiveMarketDataProvider } from '@/lib/data/market/LiveMarketDataProvider';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const dataProvider = new LiveMarketDataProvider();
    const snapshot = await dataProvider.getMarketSnapshot();

    return NextResponse.json({ success: true, data: snapshot });
  } catch (error) {
    console.error('[Ticker API] Failed to fetch market snapshot:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch market data' }, { status: 500 });
  }
}
