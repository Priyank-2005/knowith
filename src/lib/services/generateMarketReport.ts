import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { GeminiSDK } from '@/lib/ai/GeminiSDK';

// Bypass Next.js ESM proxy objects for yahoo-finance2
const yfPkg = require('yahoo-finance2');
const YF = yfPkg.default || yfPkg;
const yahooFinance = typeof YF === 'function' ? new YF() : YF;

// ────────────────────────────────────────────────────────────────
// Country definitions with their primary index & largest stock
// ────────────────────────────────────────────────────────────────
const COUNTRIES = [
  { name: 'United States', flag: '🇺🇸', type: 'Dev', code: 'US', index: '^GSPC',      indexName: 'S&P 500',         largestTicker: 'AAPL' },
  { name: 'China',         flag: '🇨🇳', type: 'EM',  code: 'CN', index: '000001.SS',   indexName: 'SSE Composite',   largestTicker: '600519.SS' },
  { name: 'Japan',         flag: '🇯🇵', type: 'Dev', code: 'JP', index: '^N225',       indexName: 'Nikkei 225',      largestTicker: '7203.T' },
  { name: 'Hong Kong',     flag: '🇭🇰', type: 'Dev', code: 'HK', index: '^HSI',        indexName: 'Hang Seng',       largestTicker: '0700.HK' },
  { name: 'Taiwan',        flag: '🇹🇼', type: 'EM',  code: 'TW', index: '^TWII',       indexName: 'TAIEX',           largestTicker: '2330.TW' },
  { name: 'India',         flag: '🇮🇳', type: 'EM',  code: 'IN', index: '^BSESN',      indexName: 'BSE Sensex',      largestTicker: 'RELIANCE.NS' },
  { name: 'South Korea',   flag: '🇰🇷', type: 'EM',  code: 'KR', index: '^KS11',       indexName: 'KOSPI',           largestTicker: '005930.KS' },
  { name: 'Canada',        flag: '🇨🇦', type: 'Dev', code: 'CA', index: '^GSPTSE',     indexName: 'S&P/TSX',         largestTicker: 'RY.TO' },
  { name: 'United Kingdom',flag: '🇬🇧', type: 'Dev', code: 'GB', index: '^FTSE',       indexName: 'FTSE 100',        largestTicker: 'SHEL.L' },
  { name: 'France',        flag: '🇫🇷', type: 'Dev', code: 'FR', index: '^FCHI',       indexName: 'CAC 40',          largestTicker: 'MC.PA' },
  { name: 'Germany',       flag: '🇩🇪', type: 'Dev', code: 'DE', index: '^GDAXI',      indexName: 'DAX',             largestTicker: 'SAP.DE' },
  { name: 'Saudi Arabia',  flag: '🇸🇦', type: 'EM',  code: 'SA', index: '^TASI.SR',    indexName: 'Tadawul',         largestTicker: '2222.SR' },
  { name: 'Netherlands',   flag: '🇳🇱', type: 'Dev', code: 'NL', index: '^AEX',        indexName: 'AEX',             largestTicker: 'ASML.AS' },
  { name: 'Australia',     flag: '🇦🇺', type: 'Dev', code: 'AU', index: '^AXJO',       indexName: 'ASX 200',         largestTicker: 'BHP.AX' },
  { name: 'Switzerland',   flag: '🇨🇭', type: 'Dev', code: 'CH', index: '^SSMI',       indexName: 'SMI',             largestTicker: 'NESN.SW' },
  { name: 'Sweden',        flag: '🇸🇪', type: 'Dev', code: 'SE', index: '^OMX',        indexName: 'OMX Stockholm',   largestTicker: 'INVE-B.ST' },
  { name: 'Brazil',        flag: '🇧🇷', type: 'EM',  code: 'BR', index: '^BVSP',       indexName: 'Bovespa',         largestTicker: 'VALE3.SA' },
  { name: 'South Africa',  flag: '🇿🇦', type: 'EM',  code: 'ZA', index: '^JN0U.JO',    indexName: 'JSE Top 40',      largestTicker: 'NPN.JO' },
  { name: 'Singapore',     flag: '🇸🇬', type: 'Dev', code: 'SG', index: '^STI',        indexName: 'STI',             largestTicker: 'D05.SI' },
  { name: 'Israel',        flag: '🇮🇱', type: 'Dev', code: 'IL', index: '^TA125.TA',   indexName: 'TA-125',          largestTicker: 'NICE.TA' },
];

// ────────────────────────────────────────────────────────────────
// Zod schema for Gemini AI output
// ────────────────────────────────────────────────────────────────
const MarketEntryAISchema = z.object({
  entries: z.array(z.object({
    countryCode:           z.string(),
    marketCapUsd:          z.string().describe('e.g. "$6T" or "$81T"'),
    top10ConcentrationPct: z.number().min(0).max(100),
    concentrationLevel:    z.enum(['low', 'medium', 'high']),
    top1SharePct:          z.number().min(0).max(100),
    topReturnDriver:       z.string().describe('e.g. "Tech", "Financials", "Energy"'),
  }))
});

type MarketEntryAI = z.infer<typeof MarketEntryAISchema>;

// ────────────────────────────────────────────────────────────────
// Fetch real quote data from Yahoo Finance
// ────────────────────────────────────────────────────────────────
async function fetchQuoteSafe(symbol: string): Promise<any | null> {
  try {
    const quote = await yahooFinance.quote(symbol);
    return quote;
  } catch (err) {
    console.warn(`[MarketReport] Failed to fetch quote for ${symbol}:`, (err as Error).message);
    return null;
  }
}

// ────────────────────────────────────────────────────────────────
// Main generation function
// ────────────────────────────────────────────────────────────────
export async function generateMarketConcentrationReport(): Promise<{ success: boolean; reportId?: string; error?: string }> {
  console.log('[MarketReport] Starting daily report generation...');

  try {
    // ── Step 1: Fetch real data from Yahoo Finance ──────────────
    const rawData: { country: typeof COUNTRIES[0]; indexQuote: any; stockQuote: any }[] = [];
    
    for (const country of COUNTRIES) {
      const [indexQuote, stockQuote] = await Promise.all([
        fetchQuoteSafe(country.index),
        fetchQuoteSafe(country.largestTicker),
      ]);
      rawData.push({ country, indexQuote, stockQuote });
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300));
    }

    // ── Step 2: Build context for Gemini AI enrichment ──────────
    const marketSummary = rawData.map(d => {
      const idx = d.indexQuote;
      const stk = d.stockQuote;
      return {
        code: d.country.code,
        name: d.country.name,
        indexName: d.country.indexName,
        indexPrice: idx?.regularMarketPrice ?? 'N/A',
        index52wHigh: idx?.fiftyTwoWeekHigh ?? 'N/A',
        index52wLow: idx?.fiftyTwoWeekLow ?? 'N/A',
        indexMarketCap: idx?.marketCap ?? 'N/A',
        largestStock: stk?.shortName || stk?.longName || d.country.largestTicker,
        largestStockTicker: d.country.largestTicker.split('.')[0],
        largestStockMarketCap: stk?.marketCap ?? 'N/A',
        type: d.country.type,
      };
    });

    const prompt = `You are a global equity market analyst at Knowith Capital. 
Based on the real-time market data below, generate a market concentration analysis for each country.

For each country provide:
- marketCapUsd: Total equity market capitalization as a short string like "$6T", "$81T", "$800B". Use your knowledge of current market sizes, the data below is supplementary.
- top10ConcentrationPct: What percentage of the total market cap is held by the top 10 stocks in that country's primary index. Use your knowledge of current index compositions.
- concentrationLevel: "low" (<35%), "medium" (35-55%), "high" (>55%)
- top1SharePct: What percentage the single largest stock represents of the total market cap
- topReturnDriver: The dominant sector driving returns (e.g. "Tech", "Financials", "Energy", "Consumer")

Here is the real-time data for each country:
${JSON.stringify(marketSummary, null, 2)}

Respond with a JSON object with an "entries" array. Each entry must have a "countryCode" field matching the "code" from the input data.
Use realistic, well-researched values. This data will be published on a financial education website.`;

    // ── Step 3: Call Gemini AI ──────────────────────────────────
    const { data: aiResult } = await GeminiSDK.generateStructuredResponse<MarketEntryAI>(
      prompt,
      [{ role: 'user', content: 'Generate the market concentration data now.' }],
      MarketEntryAISchema,
      { temperature: 0.1, model: 'gemini-3.5-flash' }
    );

    // ── Step 4: Build AI lookup map ────────────────────────────
    const aiMap = new Map<string, MarketEntryAI['entries'][0]>();
    for (const entry of aiResult.entries) {
      aiMap.set(entry.countryCode, entry);
    }

    // ── Step 5: Deactivate old reports ─────────────────────────
    await prisma.marketDataReport.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // ── Step 6: Create new report ──────────────────────────────
    const now = new Date();
    const monthLabel = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const report = await prisma.marketDataReport.create({
      data: {
        title: 'Global Market Concentration',
        month: monthLabel,
        isActive: true,
        uploadedBy: 'auto-cron',
      },
    });

    // ── Step 7: Create entries ──────────────────────────────────
    const entries = rawData.map((d, idx) => {
      const ai = aiMap.get(d.country.code);
      const indexQuote = d.indexQuote;
      const stockQuote = d.stockQuote;

      // Calculate 1-year return from Yahoo Finance data
      let oneYrReturn = 0;
      if (indexQuote?.regularMarketPrice && indexQuote?.fiftyTwoWeekLow) {
        // Approximate: use YTD change percent if available, otherwise estimate
        oneYrReturn = indexQuote.regularMarketChangePercent
          ? parseFloat((indexQuote.regularMarketChangePercent * (365 / 30)).toFixed(1)) // rough annualized
          : 0;
        // Better: use 52-week data if we have it
        if (indexQuote.fiftyTwoWeekHigh && indexQuote.fiftyTwoWeekLow) {
          const midPoint = (indexQuote.fiftyTwoWeekHigh + indexQuote.fiftyTwoWeekLow) / 2;
          const priceNow = indexQuote.regularMarketPrice;
          // Approximate 1yr return as current vs ~1yr ago estimate
          const estimatedPriorPrice = midPoint * 0.95; // rough approximation
          oneYrReturn = parseFloat(((priceNow - estimatedPriorPrice) / estimatedPriorPrice * 100).toFixed(1));
        }
      }

      const largestStockName = stockQuote?.shortName || stockQuote?.longName || 'Leading Co';
      const largestStockTicker = d.country.largestTicker.split('.')[0].replace(/^\d+$/, d.country.largestTicker);

      return {
        reportId: report.id,
        country: d.country.name,
        flagEmoji: d.country.flag,
        marketCapUsd: ai?.marketCapUsd || 'N/A',
        top10ConcentrationPct: ai?.top10ConcentrationPct ?? 30,
        concentrationLevel: ai?.concentrationLevel || 'medium',
        top1SharePct: ai?.top1SharePct ?? 5,
        oneYrReturnPct: oneYrReturn,
        indexName: `MSCI ${d.country.name}`,
        topReturnDriver: ai?.topReturnDriver || 'Mixed',
        largestStock: largestStockName,
        largestStockTicker: largestStockTicker,
        marketType: d.country.type,
        hasVolatilityFlag: false,
        sortOrder: idx,
      };
    });

    await prisma.marketDataEntry.createMany({ data: entries });

    console.log(`[MarketReport] Successfully generated report "${report.id}" with ${entries.length} entries.`);
    return { success: true, reportId: report.id };

  } catch (error) {
    console.error('[MarketReport] Generation failed:', error);
    return { success: false, error: (error as Error).message };
  }
}
