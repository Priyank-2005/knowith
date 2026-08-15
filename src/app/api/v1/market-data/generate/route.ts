import { NextResponse } from 'next/server';
import { generateMarketConcentrationReport } from '@/lib/services/generateMarketReport';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for Vercel

/**
 * POST /api/v1/market-data/generate
 * 
 * Called by Vercel Cron daily. Protected by CRON_SECRET.
 * Generates the Global Market Concentration report using 
 * Yahoo Finance (real data) + Gemini AI (analysis enrichment).
 */
export async function GET(request: Request) {
  // Vercel Cron sends GET requests
  // Verify the cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await generateMarketConcentrationReport();

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Market concentration report generated successfully.',
        reportId: result.reportId 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('[CronEndpoint] Fatal error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

/**
 * POST handler - for manual triggering from admin or testing
 */
export async function POST(request: Request) {
  // For manual triggers, just run the generation
  try {
    const result = await generateMarketConcentrationReport();

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Report generated successfully.',
        reportId: result.reportId 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('[ManualGenerate] Fatal error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
