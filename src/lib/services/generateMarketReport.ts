import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { GeminiSDK } from '@/lib/ai/GeminiSDK';

// Bypass Next.js ESM proxy objects for yahoo-finance2
const yfPkg = require('yahoo-finance2');
const YF = yfPkg.default || yfPkg;
const yahooFinance = typeof YF === 'function' ? new YF() : YF;

// ────────────────────────────────────────────────────────────────
// Country definitions: primary index + candidates for the largest listed
// company. The largest is picked live by market cap each run, so it stays
// correct as leadership changes (e.g. NVDA vs AAPL, MUFG vs Toyota).
// ────────────────────────────────────────────────────────────────
const COUNTRIES = [
  { name: 'United States', flag: '🇺🇸', type: 'Dev', code: 'US', index: '^GSPC',     indexName: 'S&P 500',           candidates: ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AVGO'] },
  { name: 'China',         flag: '🇨🇳', type: 'EM',  code: 'CN', index: '000001.SS', indexName: 'SSE Composite',     candidates: ['601398.SS', '601288.SS', '600519.SS', '601857.SS', '601988.SS', '600941.SS'] },
  { name: 'Japan',         flag: '🇯🇵', type: 'Dev', code: 'JP', index: '^N225',     indexName: 'Nikkei 225',        candidates: ['8306.T', '7203.T', '6758.T', '9983.T', '6501.T', '8035.T'] },
  { name: 'Hong Kong',     flag: '🇭🇰', type: 'Dev', code: 'HK', index: '^HSI',      indexName: 'Hang Seng',         candidates: ['0700.HK', '0939.HK', '1398.HK', '9988.HK', '0005.HK', '1299.HK', '0941.HK'] },
  { name: 'Taiwan',        flag: '🇹🇼', type: 'EM',  code: 'TW', index: '^TWII',     indexName: 'TAIEX',             candidates: ['2330.TW', '2317.TW', '2454.TW'] },
  { name: 'India',         flag: '🇮🇳', type: 'EM',  code: 'IN', index: '^BSESN',    indexName: 'BSE Sensex',        candidates: ['RELIANCE.NS', 'HDFCBANK.NS', 'TCS.NS', 'BHARTIARTL.NS', 'ICICIBANK.NS'] },
  { name: 'South Korea',   flag: '🇰🇷', type: 'EM',  code: 'KR', index: '^KS11',     indexName: 'KOSPI',             candidates: ['005930.KS', '000660.KS', '373220.KS'] },
  { name: 'Canada',        flag: '🇨🇦', type: 'Dev', code: 'CA', index: '^GSPTSE',   indexName: 'S&P/TSX Composite', candidates: ['RY.TO', 'SHOP.TO', 'TD.TO', 'ENB.TO'] },
  { name: 'United Kingdom',flag: '🇬🇧', type: 'Dev', code: 'GB', index: '^FTSE',     indexName: 'FTSE 100',          candidates: ['AZN.L', 'SHEL.L', 'HSBA.L', 'ULVR.L'] },
  { name: 'France',        flag: '🇫🇷', type: 'Dev', code: 'FR', index: '^FCHI',     indexName: 'CAC 40',            candidates: ['MC.PA', 'RMS.PA', 'OR.PA', 'TTE.PA', 'SAN.PA', 'AIR.PA'] },
  { name: 'Germany',       flag: '🇩🇪', type: 'Dev', code: 'DE', index: '^GDAXI',    indexName: 'DAX',               candidates: ['SAP.DE', 'SIE.DE', 'ALV.DE', 'DTE.DE', 'RHM.DE'] },
  { name: 'Saudi Arabia',  flag: '🇸🇦', type: 'EM',  code: 'SA', index: '^TASI.SR',  indexName: 'Tadawul All Share', candidates: ['2222.SR', '1120.SR', '7010.SR'] },
  { name: 'Netherlands',   flag: '🇳🇱', type: 'Dev', code: 'NL', index: '^AEX',      indexName: 'AEX',               candidates: ['ASML.AS', 'PRX.AS', 'INGA.AS', 'ADYEN.AS'] },
  { name: 'Australia',     flag: '🇦🇺', type: 'Dev', code: 'AU', index: '^AXJO',     indexName: 'S&P/ASX 200',       candidates: ['CBA.AX', 'BHP.AX', 'CSL.AX'] },
  { name: 'Switzerland',   flag: '🇨🇭', type: 'Dev', code: 'CH', index: '^SSMI',     indexName: 'SMI',               candidates: ['NOVN.SW', 'NESN.SW', 'ROG.SW', 'UBSG.SW'] },
  { name: 'Sweden',        flag: '🇸🇪', type: 'Dev', code: 'SE', index: '^OMX',      indexName: 'OMX Stockholm 30',  candidates: ['ABB.ST', 'INVE-B.ST', 'ATCO-A.ST', 'VOLV-B.ST', 'ERIC-B.ST'] },
  { name: 'Brazil',        flag: '🇧🇷', type: 'EM',  code: 'BR', index: '^BVSP',     indexName: 'Ibovespa',          candidates: ['PETR4.SA', 'ITUB4.SA', 'VALE3.SA'] },
  { name: 'South Africa',  flag: '🇿🇦', type: 'EM',  code: 'ZA', index: '^J200.JO',  indexName: 'FTSE/JSE Top 40',   candidates: ['NPN.JO', 'BTI.JO', 'AGL.JO', 'FSR.JO'] },
  { name: 'Singapore',     flag: '🇸🇬', type: 'Dev', code: 'SG', index: '^STI',      indexName: 'Straits Times',     candidates: ['D05.SI', 'O39.SI', 'U11.SI', 'Z74.SI'] },
  { name: 'Israel',        flag: '🇮🇱', type: 'Dev', code: 'IL', index: '^TA125.TA', indexName: 'TA-125',            candidates: ['TEVA.TA', 'LUMI.TA', 'POLI.TA', 'ESLT.TA', 'NICE.TA'] },
];

// Yahoo quotes some exchanges in minor units; market caps are in the major unit.
const MAJOR_CURRENCY: Record<string, string> = { GBp: 'GBP', ZAc: 'ZAR', ILA: 'ILS' };

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
// Fetch real data from Yahoo Finance
// ────────────────────────────────────────────────────────────────
async function fetchQuoteSafe(symbol: string | string[]): Promise<any | null> {
  try {
    return await yahooFinance.quote(symbol);
  } catch (err) {
    console.warn(`[MarketReport] Failed to fetch quote for ${symbol}:`, (err as Error).message);
    return null;
  }
}

/** Trailing 1-year price return: current level vs the last close on/before the same date a year ago. */
async function fetchOneYearReturn(symbol: string, indexQuote: any): Promise<number | null> {
  const price = indexQuote?.regularMarketPrice;
  if (price) {
    try {
      const target = new Date();
      target.setFullYear(target.getFullYear() - 1);
      const chart = await yahooFinance.chart(symbol, {
        period1: new Date(target.getTime() - 10 * 86400000),
        period2: new Date(target.getTime() + 86400000),
        interval: '1d',
      });
      const past = (chart?.quotes ?? []).filter((q: any) => q.close != null && q.date <= target).at(-1);
      if (past?.close) return parseFloat(((price / past.close - 1) * 100).toFixed(1));
    } catch (err) {
      console.warn(`[MarketReport] No 1Y history for ${symbol}:`, (err as Error).message);
    }
  }
  // Some indices (e.g. Tadawul) have no chart history on Yahoo; use Yahoo's own 52-week change
  const yahoo52w = indexQuote?.fiftyTwoWeekChangePercent;
  return typeof yahoo52w === 'number' ? parseFloat(yahoo52w.toFixed(1)) : null;
}

// ────────────────────────────────────────────────────────────────
// Main generation function
// ────────────────────────────────────────────────────────────────
export async function generateMarketConcentrationReport(): Promise<{ success: boolean; reportId?: string; error?: string }> {
  console.log('[MarketReport] Starting daily report generation...');

  try {
    // ── Step 1: Fetch real data from Yahoo Finance ──────────────
    const rawData: { country: typeof COUNTRIES[0]; indexQuote: any; oneYrReturn: number | null; largest: any }[] = [];

    for (const country of COUNTRIES) {
      const [indexQuote, candidateQuotes] = await Promise.all([
        fetchQuoteSafe(country.index),
        fetchQuoteSafe(country.candidates),
      ]);
      const oneYrReturn = await fetchOneYearReturn(country.index, indexQuote);
      const largest = (Array.isArray(candidateQuotes) ? candidateQuotes : [])
        .filter((q: any) => q?.marketCap)
        .sort((a: any, b: any) => b.marketCap - a.marketCap)[0] ?? null;
      rawData.push({ country, indexQuote, oneYrReturn, largest });
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300));
    }

    // Convert each largest company's market cap to USD so the AI estimates are anchored to real numbers
    const currencies = [...new Set(
      rawData.map(d => d.largest?.currency).filter(Boolean).map((c: string) => MAJOR_CURRENCY[c] ?? c)
    )].filter(c => c !== 'USD');
    const fxQuotes = currencies.length ? await fetchQuoteSafe(currencies.map(c => `${c}USD=X`)) : [];
    const usdPer: Record<string, number> = { USD: 1 };
    for (const q of Array.isArray(fxQuotes) ? fxQuotes : []) {
      if (q?.regularMarketPrice) usdPer[q.symbol.slice(0, 3)] = q.regularMarketPrice;
    }
    const toUsd = (amount: number | undefined, currency: string | undefined) => {
      const rate = currency ? usdPer[MAJOR_CURRENCY[currency] ?? currency] : undefined;
      return amount && rate ? amount * rate : null;
    };

    // ── Step 2: Build context for Gemini AI enrichment ──────────
    const marketSummary = rawData.map(d => {
      const usdCap = toUsd(d.largest?.marketCap, d.largest?.currency);
      return {
        code: d.country.code,
        name: d.country.name,
        indexName: d.country.indexName,
        indexLevel: d.indexQuote?.regularMarketPrice ?? 'N/A',
        indexOneYearReturnPct: d.oneYrReturn ?? 'N/A',
        largestListedCompany: d.largest?.longName || d.largest?.shortName || 'N/A',
        largestCompanyMarketCapUsdBillions: usdCap ? Math.round(usdCap / 1e9) : 'N/A',
        type: d.country.type,
      };
    });

    const prompt = `You are a global equity market analyst at Knowith Capital. 
Based on the real-time market data below, generate a market concentration analysis for each country.

For each country provide:
- marketCapUsd: Total equity market capitalization as a short string like "$6T", "$81T", "$800B". Use your knowledge of current market sizes.
- top10ConcentrationPct: What percentage of the total market cap is held by the top 10 stocks in that country's primary index. Use your knowledge of current index compositions.
- concentrationLevel: "low" (<35%), "medium" (35-55%), "high" (>55%)
- top1SharePct: What percentage the largest listed company represents of the total market cap. Its real market cap in USD is given below; keep top1SharePct consistent with it and with your marketCapUsd.
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
      const largestSymbol: string = d.largest?.symbol ?? '';

      return {
        reportId: report.id,
        country: d.country.name,
        flagEmoji: d.country.flag,
        marketCapUsd: ai?.marketCapUsd || 'N/A',
        top10ConcentrationPct: ai?.top10ConcentrationPct ?? 30,
        concentrationLevel: ai?.concentrationLevel || 'medium',
        top1SharePct: ai?.top1SharePct ?? 5,
        oneYrReturnPct: d.oneYrReturn ?? 0,
        indexName: d.country.indexName,
        topReturnDriver: ai?.topReturnDriver || 'Mixed',
        largestStock: d.largest?.shortName || d.largest?.longName || 'N/A',
        // "RELIANCE.NS" -> "RELIANCE"; numeric codes keep their exchange suffix ("2330.TW")
        largestStockTicker: /^\d/.test(largestSymbol) ? largestSymbol : largestSymbol.split('.')[0],
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
