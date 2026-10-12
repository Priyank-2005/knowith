// ────────────────────────────────────────────────────────────────
// Indian Mutual Fund & ETF Performance — built from AMFI's official NAV files.
//
// Sources (all public, no key):
//   • AMFI daily NAV file  — every open-ended scheme, its SEBI category and latest NAV
//   • AMFI NAV history     — NAVs for a date window, all schemes in one file (1Y / 3Y / 5Y returns)
//   • mfapi.in             — full NAV history per scheme (itself compiled from AMFI), used for the
//                            short-term / 10Y returns, SIP returns and NAV-based risk measures
//   • TigZig MF API        — AUM, riskometer, benchmark, fund managers, expense ratio, exit load
//                            per scheme (itself compiled from AMFI / SEBI filings)
//
// mfapi.in and TigZig are optional enrichment: when either is down the page still works and the
// affected columns show "—".
//
// Only the Regular plan (Growth option) is listed — Direct plans are not shown.
//
// Returns follow the AMFI / SEBI convention: periods up to 1Y are point-to-point absolute,
// 3Y / 5Y / 10Y are CAGR, using the latest NAV on or before the same calendar date N years
// before the current NAV date.
// ────────────────────────────────────────────────────────────────

const AMFI_NAV_ALL_URL = 'https://portal.amfiindia.com/spages/NAVAll.txt';
const AMFI_NAV_HISTORY_URL = 'https://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx';
const TIGZIG_DETAILS_URL = 'https://api.tigzig.com/mf/v1/details';
const MFAPI_URL = 'https://api.mfapi.in/mf';

export const INDIAN_MF_CACHE_TAG = 'indian-mf-report';

// AMFI-window horizons (official files). Everything else comes from mfapi.in.
const AMFI_HORIZONS = [1, 3, 5] as const;

// Risk-free rate used for the Sharpe ratio (approx. 91-day T-bill / repo-linked), in %
const RISK_FREE_PCT = 6.5;
const SIP_MONTHLY_AMOUNT = 10000;

export type FundKind = 'mf' | 'etf';

// Phase 1 categories (phase-wise rollout agreed with the client).
// `match` is tested against AMFI's sub-category text, which comes in two
// naming styles ("Equity Scheme - Large Cap Fund" / "Equity Schemes - Large Cap Fund").
export const FUND_CATEGORIES = [
  { id: 'large-cap',      label: 'Large Cap',         group: 'Equity', kind: 'mf',  match: /^large cap fund$/i },
  { id: 'mid-cap',        label: 'Mid Cap',           group: 'Equity', kind: 'mf',  match: /^mid cap fund$/i },
  { id: 'small-cap',      label: 'Small Cap',         group: 'Equity', kind: 'mf',  match: /^small cap fund$/i },
  { id: 'flexi-cap',      label: 'Flexi Cap',         group: 'Equity', kind: 'mf',  match: /^flexi cap fund$/i },
  { id: 'large-mid-cap',  label: 'Large & Mid Cap',   group: 'Equity', kind: 'mf',  match: /^large & mid cap fund$/i },
  { id: 'multi-cap',      label: 'Multi Cap',         group: 'Equity', kind: 'mf',  match: /^multi cap fund$/i },
  { id: 'elss',           label: 'ELSS (Tax Saver)',  group: 'Equity', kind: 'mf',  match: /^elss/i },
  { id: 'aggressive-hybrid', label: 'Aggressive Hybrid', group: 'Hybrid', kind: 'mf', match: /^aggressive hybrid fund$/i },
  { id: 'equity-etf',     label: 'Equity ETFs',       group: 'ETF',    kind: 'etf', match: /^equity etf$/i },
  { id: 'gold-etf',       label: 'Gold ETFs',         group: 'ETF',    kind: 'etf', match: /^gold etf$/i },
  { id: 'silver-etf',     label: 'Silver ETFs',       group: 'ETF',    kind: 'etf', match: /^silver etf$/i },
  { id: 'debt-etf',       label: 'Debt ETFs',         group: 'ETF',    kind: 'etf', match: /^debt etf$/i },
  { id: 'overseas-etf',   label: 'International ETFs', group: 'ETF',   kind: 'etf', match: /^etfs investing overseas$/i },
] as const;

export type ReturnKey = '1m' | '3m' | '6m' | 'ytd' | '1y' | '3y' | '5y' | '10y';
export type SipKey = '1y' | '3y' | '5y';

export interface FundPerformance {
  schemeCode: string;
  name: string;
  amc: string;
  nav: number;
  returns: Partial<Record<ReturnKey, number>>;       // percent, 2dp
  sip?: Partial<Record<SipKey, number>>;             // annualised SIP return (XIRR), percent
  risk?: {
    volatility?: number;                              // annualised std-dev of daily returns, 3Y, percent
    maxDrawdown?: number;                             // worst peak-to-trough fall over 3Y, percent (negative)
    sharpe?: number;                                  // 3Y, vs RISK_FREE_PCT
    high52?: number;                                  // 52-week NAV high
    low52?: number;                                   // 52-week NAV low
  };
  aumCr?: number;
  riskometer?: string;
  benchmark?: string;
  expenseRatio?: number;                              // % (Regular plan TER)
  exitLoad?: string;
  minInvestment?: string;
  launchDate?: string;                                // ISO date
  assetAllocation?: string;
  managers?: { name: string; since?: string }[];
}

export interface IndianFundReport {
  navDate: string;         // ISO date of the latest NAV used
  generatedAt: string;     // ISO timestamp
  categories: {
    id: string;
    label: string;
    group: string;
    kind: FundKind;
    count: number;
    funds: FundPerformance[];   // every fund in the category, best 1Y return first
  }[];
  sources: string[];
}

// ── Helpers ─────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 86400000;

function parseAmfiDate(s: string): Date | null {
  const m = /^(\d{2})-([A-Za-z]{3})-(\d{4})$/.exec(s.trim());
  if (!m) return null;
  const month = MONTHS.indexOf(m[2][0].toUpperCase() + m[2].slice(1).toLowerCase());
  if (month < 0) return null;
  return new Date(Date.UTC(+m[3], month, +m[1]));
}

function formatAmfiDate(d: Date): string {
  return `${String(d.getUTCDate()).padStart(2, '0')}-${MONTHS[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
}

/** Same calendar day `n` months earlier (clamped to the month's last day). */
function monthsBefore(d: Date, n: number): Date {
  const total = d.getUTCFullYear() * 12 + d.getUTCMonth() - n;
  const year = Math.floor(total / 12);
  const month = ((total % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(d.getUTCDate(), lastDay)));
}

const yearsBefore = (d: Date, years: number) => monthsBefore(d, years * 12);

const round2 = (v: number) => Math.round(v * 100) / 100;

async function fetchText(url: string, timeoutMs = 45000): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (KnowithCapital NAV fetcher)' },
    signal: AbortSignal.timeout(timeoutMs),
    cache: 'no-store', // files are several MB; the computed report is what gets cached
  });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res.text();
}

/** Runs `fn` over `items` with at most `limit` in flight. */
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  }));
  return out;
}

// ── AMFI daily NAV file ─────────────────────────────────────────

interface SchemeRow {
  code: string;
  name: string;
  amc: string;
  categoryId: string;
  kind: FundKind;
  nav: number;
  navDate: Date;
}

function detectPlan(planField: string, name: string): 'direct' | 'regular' | null {
  const s = `${planField} ${name}`.toLowerCase();
  if (s.includes('direct')) return 'direct';
  if (s.includes('regular')) return 'regular';
  return null;
}

function isGrowthOption(optionField: string, name: string): boolean {
  const s = `${optionField} ${name}`.toLowerCase();
  if (/idcw|dividend|bonus|payout|reinvest|segregated/.test(s)) return false;
  return s.includes('growth');
}

/** AMFI sometimes files gold / silver ETFs under "Equity ETF"; the fund name is the reliable signal. */
function etfCategoryId(declared: string, name: string): string {
  if (declared !== 'equity-etf') return declared;
  if (/\bsilver\b/i.test(name)) return 'silver-etf';
  if (/\bgold\b/i.test(name)) return 'gold-etf';
  return declared;
}

/** "Axis Bluechip Fund - Regular Plan - Growth" → "Axis Bluechip Fund" */
function cleanMfName(name: string): string {
  return name.replace(/\s*[-–(]\s*regular.*$/i, '').trim() || name;
}

function parseNavAll(text: string): SchemeRow[] {
  const rows: SchemeRow[] = [];
  const seen = new Set<string>();
  let category: (typeof FUND_CATEGORIES)[number] | null = null;
  let amc = '';

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    const header = /^Open Ended Schemes\s*\((.+)\)$/.exec(line);
    if (header) {
      // "Equity Scheme - Large Cap Fund" → "Large Cap Fund"
      const sub = header[1].split(' - ').slice(1).join(' - ').trim();
      category = FUND_CATEGORIES.find(c => c.match.test(sub)) ?? null;
      continue;
    }
    if (/^(Close Ended|Interval Fund) Schemes/i.test(line)) { category = null; continue; }

    const cols = line.split(';');
    if (cols.length < 8) {
      if (!line.includes(';')) amc = line; // AMC name line
      continue;
    }
    if (!category) continue;

    const [code, , , name, planField, optionField, navStr, dateStr] = cols;
    const nav = parseFloat(navStr);
    const navDate = parseAmfiDate(dateStr);
    if (!(nav > 0) || !navDate || seen.has(code.trim())) continue;

    if (category.kind === 'mf') {
      // Regular plan, Growth option only — Direct plans are not shown
      if (detectPlan(planField, name) !== 'regular' || !isGrowthOption(optionField, name)) continue;
    } else if (/idcw|dividend|payout|reinvest/i.test(`${optionField} ${name}`)) {
      continue; // ETFs have a single NAV; skip any income-distribution lines
    }

    seen.add(code.trim());
    rows.push({
      code: code.trim(),
      name: category.kind === 'mf' ? cleanMfName(name.trim()) : name.trim(),
      amc,
      categoryId: category.kind === 'etf' ? etfCategoryId(category.id, name) : category.id,
      kind: category.kind,
      nav,
      navDate,
    });
  }
  return rows;
}

// ── AMFI NAV history (one window around a target date) ─────────

/** Returns schemeCode → NAV on the latest date <= target within a 7-day lookback. */
async function fetchNavsOnOrBefore(target: Date): Promise<Map<string, number>> {
  const from = new Date(target);
  from.setUTCDate(from.getUTCDate() - 7);
  const url = `${AMFI_NAV_HISTORY_URL}?frmdt=${formatAmfiDate(from)}&todt=${formatAmfiDate(target)}`;
  const text = await fetchText(url);

  const best = new Map<string, { date: number; nav: number }>();
  for (const line of text.split(/\r?\n/)) {
    const cols = line.split(';');
    if (cols.length < 8) continue;
    const code = cols[0].trim();
    const nav = parseFloat(cols[6]);
    const date = parseAmfiDate(cols[7]);
    if (!/^\d+$/.test(code) || !(nav > 0) || !date || date > target) continue;
    const prev = best.get(code);
    if (!prev || date.getTime() > prev.date) best.set(code, { date: date.getTime(), nav });
  }
  return new Map([...best].map(([code, v]) => [code, v.nav]));
}

// ── mfapi.in: NAV-history based metrics (best effort) ──────────

type NavHistory = { times: number[]; navs: number[] }; // ascending

async function fetchNavHistory(code: string): Promise<NavHistory | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${MFAPI_URL}/${code}`, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
      if (!res.ok) continue;
      const json = await res.json();
      const data: { date: string; nav: string }[] = json?.data ?? [];
      const times: number[] = [];
      const navs: number[] = [];
      for (let i = data.length - 1; i >= 0; i--) { // API is newest-first
        const [d, m, y] = data[i].date.split('-').map(Number);
        const nav = parseFloat(data[i].nav);
        if (!(nav > 0) || !d || !m || !y) continue;
        times.push(Date.UTC(y, m - 1, d));
        navs.push(nav);
      }
      return times.length > 1 ? { times, navs } : null;
    } catch {
      /* retry once */
    }
  }
  return null;
}

/** Index of the last point on or before `t`, or -1 when the history starts later. */
function indexOnOrBefore(times: number[], t: number): number {
  let lo = 0, hi = times.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (times[mid] <= t) { ans = mid; lo = mid + 1; } else hi = mid - 1;
  }
  return ans;
}

/** Annualised return of equal monthly instalments, all redeemed at the latest NAV (XIRR). */
function sipReturn(h: NavHistory, latest: Date, months: number): number | undefined {
  const endIdx = h.times.length - 1;
  if (h.times[0] > monthsBefore(latest, months).getTime()) return undefined; // no full track record
  let units = 0;
  const flows: { years: number }[] = [];
  for (let k = months; k >= 1; k--) {
    const when = monthsBefore(latest, k);
    const idx = indexOnOrBefore(h.times, when.getTime());
    if (idx < 0) return undefined;
    units += SIP_MONTHLY_AMOUNT / h.navs[idx];
    flows.push({ years: (latest.getTime() - when.getTime()) / (365 * DAY_MS) });
  }
  const value = units * h.navs[endIdx];
  // Solve Σ amount·(1+r)^years = value  (monotonic in r)
  const f = (r: number) => flows.reduce((s, c) => s + SIP_MONTHLY_AMOUNT * Math.pow(1 + r, c.years), 0) - value;
  let lo = -0.95, hi = 10;
  if (f(lo) > 0 || f(hi) < 0) return undefined;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > 0) hi = mid; else lo = mid;
  }
  return round2(((lo + hi) / 2) * 100);
}

/**
 * ETFs (and the odd fund) re-base their NAV when units are split or consolidated, which makes
 * older NAVs incomparable. Keep only the series after the last day-on-day move beyond ±40%.
 */
function consistentSeries(h: NavHistory): { series: NavHistory; validFrom: number } {
  let cut = 0;
  for (let i = 1; i < h.navs.length; i++) {
    if (Math.abs(h.navs[i] / h.navs[i - 1] - 1) > 0.4) cut = i;
  }
  if (cut === 0) return { series: h, validFrom: 0 };
  return { series: { times: h.times.slice(cut), navs: h.navs.slice(cut) }, validFrom: h.times[cut] };
}

function metricsFromHistory(full: NavHistory): Pick<FundPerformance, 'returns' | 'sip' | 'risk' | 'launchDate'> & { validFrom: number } {
  const { series: h, validFrom } = consistentSeries(full);
  const last = h.times.length - 1;
  const latest = new Date(h.times[last]);
  const latestNav = h.navs[last];
  const returns: FundPerformance['returns'] = {};

  const navAt = (d: Date) => {
    const idx = indexOnOrBefore(h.times, d.getTime());
    return idx < 0 ? undefined : h.navs[idx];
  };

  for (const [key, months] of [['1m', 1], ['3m', 3], ['6m', 6]] as const) {
    const past = navAt(monthsBefore(latest, months));
    if (past) returns[key] = round2((latestNav / past - 1) * 100);
  }
  const yearEnd = navAt(new Date(Date.UTC(latest.getUTCFullYear() - 1, 11, 31)));
  if (yearEnd) returns.ytd = round2((latestNav / yearEnd - 1) * 100);
  const tenYear = navAt(yearsBefore(latest, 10));
  if (tenYear) returns['10y'] = round2((Math.pow(latestNav / tenYear, 1 / 10) - 1) * 100);

  const sip: FundPerformance['sip'] = {};
  for (const [key, months] of [['1y', 12], ['3y', 36], ['5y', 60]] as const) {
    const v = sipReturn(h, latest, months);
    if (v !== undefined) sip[key] = v;
  }

  // Risk over the trailing 3 years (needs a full 3Y track record)
  const risk: NonNullable<FundPerformance['risk']> = {};
  const from3y = yearsBefore(latest, 3).getTime();
  if (h.times[0] <= from3y) {
    const start = Math.max(0, indexOnOrBefore(h.times, from3y));
    const rets: number[] = [];
    let peak = h.navs[start];
    let maxDd = 0;
    for (let i = start + 1; i <= last; i++) {
      rets.push(h.navs[i] / h.navs[i - 1] - 1);
      peak = Math.max(peak, h.navs[i]);
      maxDd = Math.min(maxDd, h.navs[i] / peak - 1);
    }
    if (rets.length > 100) {
      const mean = rets.reduce((s, v) => s + v, 0) / rets.length;
      const sd = Math.sqrt(rets.reduce((s, v) => s + (v - mean) ** 2, 0) / (rets.length - 1));
      const vol = sd * Math.sqrt(252) * 100;
      risk.volatility = round2(vol);
      risk.maxDrawdown = round2(maxDd * 100);
      const cagr3 = (Math.pow(latestNav / h.navs[start], 1 / 3) - 1) * 100;
      if (vol > 0) risk.sharpe = round2((cagr3 - RISK_FREE_PCT) / vol);
    }
  }
  const from52 = indexOnOrBefore(h.times, latest.getTime() - 365 * DAY_MS);
  const recent = h.navs.slice(Math.max(0, from52));
  risk.high52 = Math.max(...recent);
  risk.low52 = Math.min(...recent);

  return { returns, sip, risk, launchDate: new Date(full.times[0]).toISOString().slice(0, 10), validFrom };
}

// ── Optional TigZig enrichment: AUM, riskometer, managers, fees ─

type SchemeDetails = Pick<FundPerformance, 'aumCr' | 'riskometer' | 'benchmark' | 'expenseRatio' | 'exitLoad' | 'minInvestment' | 'launchDate' | 'assetAllocation' | 'managers'>;

const clip = (s: unknown, max: number) => {
  const t = typeof s === 'string' ? s.replace(/\s*\n\s*/g, '; ').trim() : '';
  return t ? (t.length > max ? `${t.slice(0, max - 1)}…` : t) : undefined;
};

async function fetchSchemeDetails(codes: string[]): Promise<Map<string, SchemeDetails>> {
  const out = new Map<string, SchemeDetails>();
  const batches: string[][] = [];
  for (let i = 0; i < codes.length; i += 50) batches.push(codes.slice(i, i + 50));

  await mapLimit(batches, 4, async batch => {
    try {
      const res = await fetch(`${TIGZIG_DETAILS_URL}?schemes=${batch.join(',')}`, {
        signal: AbortSignal.timeout(25000),
        cache: 'no-store',
      });
      if (!res.ok) return;
      const json = await res.json();
      for (const d of json?.data ?? []) {
        const aum = d?.amfi_daily?.fund_aum_cr_all_plans;
        const ssd = d?.ssd ?? {};
        const ter = d?.ter?.regular ?? d?.ter?.direct;
        const minAmount = clip(ssd.min_application_amount, 20);
        out.set(String(d.scheme_code), {
          aumCr: typeof aum === 'number' ? Math.round(aum) : undefined,
          riskometer: d?.amfi_daily?.riskometer ?? undefined,
          benchmark: clip(d?.amfi_daily?.benchmark ?? ssd.benchmark_tier1_std, 80),
          expenseRatio: typeof ter === 'number' ? ter : undefined,
          exitLoad: clip(ssd.exit_load, 140),
          minInvestment: minAmount && /^[\d,.]+$/.test(minAmount) ? `₹${Number(minAmount.replace(/,/g, '')).toLocaleString('en-IN')}` : minAmount,
          launchDate: typeof ssd.allotment_date === 'string' ? ssd.allotment_date.slice(0, 10) : undefined,
          assetAllocation: clip(ssd.asset_allocation, 200),
          managers: Array.isArray(ssd.fund_managers)
            ? ssd.fund_managers
                .filter((m: { name?: string }) => m?.name)
                .map((m: { name: string; since?: string }) => ({ name: m.name, since: m.since ?? undefined }))
            : undefined,
        });
      }
    } catch (err) {
      console.warn('[IndianMF] Scheme details enrichment failed for a batch:', (err as Error).message);
    }
  });
  return out;
}

// ── Main ────────────────────────────────────────────────────────

export async function generateIndianFundReport(): Promise<IndianFundReport> {
  const startedAt = Date.now();
  const rows = parseNavAll(await fetchText(AMFI_NAV_ALL_URL));
  if (rows.length === 0) throw new Error('AMFI NAV file returned no matching schemes');

  // Latest NAV date across the file; drop schemes whose NAV is stale (suspended / wound up)
  const latest = new Date(Math.max(...rows.map(r => r.navDate.getTime())));
  const staleCutoff = latest.getTime() - 7 * DAY_MS;
  const live = rows.filter(r => r.navDate.getTime() >= staleCutoff);
  const codes = live.map(r => r.code);

  // Everything below runs concurrently: official 1Y/3Y/5Y NAVs (required), plus best-effort enrichment
  const historical = new Map<number, Map<string, number>>();
  const required = Promise.all(AMFI_HORIZONS.map(async h => {
    historical.set(h, await fetchNavsOnOrBefore(yearsBefore(latest, h)));
  }));
  const detailsPromise = fetchSchemeDetails(codes);

  // mfapi.in is time-boxed so a slow day never blocks the report
  const histories = new Map<string, ReturnType<typeof metricsFromHistory>>();
  const mfapiDeadline = startedAt + 45000;
  const metricsPromise = mapLimit(codes, 24, async code => {
    if (Date.now() > mfapiDeadline) return;
    const h = await fetchNavHistory(code);
    if (h) histories.set(code, metricsFromHistory(h));
  });

  await required;
  const [details] = await Promise.all([detailsPromise, metricsPromise]);

  const funds = live.map((r): { categoryId: string; fund: FundPerformance } => {
    const returns: FundPerformance['returns'] = {};
    const extra = histories.get(r.code);
    for (const h of AMFI_HORIZONS) {
      const past = historical.get(h)?.get(r.code);
      if (!past) continue;
      // The NAV was re-based (unit split / consolidation) inside this window — not comparable
      if (extra && yearsBefore(latest, h).getTime() < extra.validFrom) continue;
      const ratio = r.nav / past;
      returns[`${h}y`] = round2(h === 1 ? (ratio - 1) * 100 : (Math.pow(ratio, 1 / h) - 1) * 100);
    }
    const det = details.get(r.code);
    return {
      categoryId: r.categoryId,
      fund: {
        schemeCode: r.code,
        name: r.name,
        amc: r.amc,
        nav: r.nav,
        ...det,
        launchDate: det?.launchDate ?? extra?.launchDate,
        returns: { ...extra?.returns, ...returns }, // official AMFI figures win for 1Y/3Y/5Y
        sip: extra?.sip && Object.keys(extra.sip).length ? extra.sip : undefined,
        risk: extra?.risk,
      },
    };
  });

  const categories: IndianFundReport['categories'] = FUND_CATEGORIES.map(cat => {
    const inCat = funds
      .filter(f => f.categoryId === cat.id)
      .map(f => f.fund)
      .sort((a, b) => (b.returns['1y'] ?? -Infinity) - (a.returns['1y'] ?? -Infinity));
    return { id: cat.id, label: cat.label, group: cat.group, kind: cat.kind, count: inCat.length, funds: inCat };
  }).filter(c => c.count > 0);

  return {
    navDate: latest.toISOString().slice(0, 10),
    generatedAt: new Date().toISOString(),
    categories,
    sources: [
      'AMFI India — daily NAV & historical NAV (amfiindia.com)',
      'NAV history, SIP & risk measures: mfapi.in (AMFI data)',
      'AUM, riskometer, fund managers & fees: AMFI / SEBI filings via TigZig MF API (api.tigzig.com)',
    ],
  };
}
