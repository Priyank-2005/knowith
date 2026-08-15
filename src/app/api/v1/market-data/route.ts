import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const month = formData.get('month') as string;
    
    if (!file || !month) {
      return NextResponse.json({ error: 'File and month are required' }, { status: 400 });
    }
    
    // Simulate parsing delay for mockup
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Deactivate previous
    await prisma.marketDataReport.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });
    
    // Create new
    const report = await prisma.marketDataReport.create({
      data: {
        title: 'Global Market Concentration',
        month: month,
        isActive: true,
        uploadedBy: 'admin',
      }
    });
    
    const countries = [
      { name: 'United States', flag: '🇺🇸', type: 'Dev' },
      { name: 'China', flag: '🇨🇳', type: 'EM' },
      { name: 'Japan', flag: '🇯🇵', type: 'Dev' },
      { name: 'Hong Kong', flag: '🇭🇰', type: 'Dev' },
      { name: 'Taiwan', flag: '🇹🇼', type: 'EM' },
      { name: 'India', flag: '🇮🇳', type: 'EM' },
      { name: 'South Korea', flag: '🇰🇷', type: 'EM' },
      { name: 'Canada', flag: '🇨🇦', type: 'Dev' },
      { name: 'United Kingdom', flag: '🇬🇧', type: 'Dev' },
      { name: 'France', flag: '🇫🇷', type: 'Dev' },
      { name: 'Germany', flag: '🇩🇪', type: 'Dev' },
      { name: 'Saudi Arabia', flag: '🇸🇦', type: 'EM' },
      { name: 'Netherlands', flag: '🇳🇱', type: 'Dev' },
      { name: 'Australia', flag: '🇦🇺', type: 'Dev' },
      { name: 'Switzerland', flag: '🇨🇭', type: 'Dev' },
      { name: 'Sweden', flag: '🇸🇪', type: 'Dev' },
      { name: 'Brazil', flag: '🇧🇷', type: 'EM' },
      { name: 'South Africa', flag: '🇿🇦', type: 'EM' },
      { name: 'Singapore', flag: '🇸🇬', type: 'Dev' },
      { name: 'Israel', flag: '🇮🇱', type: 'Dev' }
    ];
    
    let entries = [];
    
    // Simple text parser fallback - real extraction would require complex regex per row
    // Assuming simple line based layout for mockup
    for (let i = 0; i < countries.length; i++) {
      const c = countries[i];
      // Default values simulating parsing
      entries.push({
        reportId: report.id,
        country: c.name,
        flagEmoji: c.flag,
        marketCapUsd: '$' + Math.floor(Math.random() * 50 + 1) + 'T',
        top10ConcentrationPct: Math.floor(Math.random() * 40 + 20),
        concentrationLevel: 'medium',
        top1SharePct: Math.floor(Math.random() * 10 + 2),
        oneYrReturnPct: Math.floor(Math.random() * 30 - 10),
        indexName: 'MSCI ' + c.name,
        topReturnDriver: 'Tech',
        largestStock: 'Leading Co',
        largestStockTicker: 'LCO',
        marketType: c.type,
        hasVolatilityFlag: Math.random() > 0.8,
        sortOrder: i
      });
    }
    
    await prisma.marketDataEntry.createMany({
      data: entries
    });
    
    const fullReport = await prisma.marketDataReport.findUnique({
      where: { id: report.id },
      include: { entries: true }
    });
    
    return NextResponse.json({ success: true, data: fullReport });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
