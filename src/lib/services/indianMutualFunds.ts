// ────────────────────────────────────────────────────────────────
// Indian Mutual Fund Performance — built from AMFI's official NAV files.
//
// Sources (all public, no key):
//   • AMFI daily NAV file  — every open-ended scheme, its SEBI category and latest NAV
//   • AMFI NAV history     — NAVs for a date window, all schemes in one file
//   • TigZig MF API        — AUM / riskometer per scheme (itself compiled from AMFI);
//                            optional enrichment, page still works if it is down
//
// Returns follow the AMFI / SEBI convention: 1Y is point-to-point absolute,
// 3Y and 5Y are CAGR, using the latest NAV on or before the same calendar
// date N years before the current NAV date.
// ────────────────────────────────────────────────────────────────

const AMFI_NAV_ALL_URL = 'https://portal.amfiindia.com/spages/NAVAll.txt';
const AMFI_NAV_HISTORY_URL = 'https://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx';
const TIGZIG_DETAILS_URL = 'https://api.tigzig.com/mf/v1/details';

export const INDIAN_MF_CACHE_TAG = 'indian-mf-report';

const TOP_N = 10;
const HORIZONS = [1, 3, 5] as const;
type Horizon = typeof HORIZONS[number];

// Phase 1 categories (phase-wise rollout agreed with the client).
// `match` is tested against AMFI's sub-category text, which comes in two
// naming styles ("Equity Scheme - Large Cap Fund" / "Equity Schemes - Large Cap Fund").
export const FUND_CATEGORIES = [
  { id: 'large-cap',      label: 'Large Cap',         group: 'Equity', match: /^large cap fund$/i },
  { id: 'mid-cap',        label: 'Mid Cap',           group: 'Equity', match: /^mid cap fund$/i },
  { id: 'small-cap',      label: 'Small Cap',         group: 'Equity', match: /^small cap fund$/i },
  { id: 'flexi-cap',      label: 'Flexi Cap',         group: 'Equity', match: /^flexi cap fund$/i },
  { id: 'large-mid-cap',  label: 'Large & Mid Cap',   group: 'Equity', match: /^large & mid cap fund$/i },
  { id: 'multi-cap',      label: 'Multi Cap',         group: 'Equity', match: /^multi cap fund$/i },
  { id: 'elss',           label: 'ELSS (Tax Saver)',  group: 'Equity', match: /^elss/i },
  { id: 'aggressive-hybrid', label: 'Aggressive Hybrid', group: 'Hybrid', match: /^aggressive hybrid fund$/i },
] as const;

export interface FundPerformance {
  schemeCode: string;
  name: string;
  amc: string;
  nav: number;
  returns: Partial<Record<`${Horizon}y`, number>>; // percent, 2dp
  aumCr?: number;
  riskometer?: string;
}

export interface IndianFundReport {
  navDate: string;         // ISO date of the latest NAV used
  generatedAt: string;     // ISO timestamp
  categories: {
    id: string;
    label: string;
    group: string;
    schemeCount: Record<'direct' | 'regular', number>;
    // Top 10 per plan, per ranking horizon
    top: Record<'direct' | 'regular', Record<`${Horizon}y`, FundPerformance[]>>;
  }[];
  sources: string[];
}

// ── Helpers ─────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

function yearsBefore(d: Date, years: number): Date {
  const r = new Date(d);
  r.setUTCFullYear(r.getUTCFullYear() - years);
  return r;
}

async function fetchText(url: string, timeoutMs = 45000): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (KnowithCapital NAV fetcher)' },
    signal: AbortSignal.timeout(timeoutMs),
    cache: 'no-store', // files are several MB; the computed report is what gets cached
  });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res.text();
}

// ── AMFI daily NAV file ─────────────────────────────────────────

interface SchemeRow {
  code: string;
  name: string;
  amc: string;
  plan: 'direct' | 'regular';
  categoryId: string;
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

function parseNavAll(text: string): SchemeRow[] {
  const rows: SchemeRow[] = [];
  let categoryId: string | null = null;
  let amc = '';

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    const header = /^Open Ended Schemes\s*\((.+)\)$/.exec(line);
    if (header) {
      // "Equity Scheme - Large Cap Fund" → "Large Cap Fund"
      const sub = header[1].split(' - ').slice(1).join(' - ').trim();
      categoryId = FUND_CATEGORIES.find(c => c.match.test(sub))?.id ?? null;
      continue;
    }
    if (/^(Close Ended|Interval Fund) Schemes/i.test(line)) { categoryId = null; continue; }

    const cols = line.split(';');
    if (cols.length < 8) {
      if (!line.includes(';')) amc = line; // AMC name line
      continue;
    }
    if (!categoryId) continue;

    const [code, , , name, planField, optionField, navStr, dateStr] = cols;
    const plan = detectPlan(planField, name);
    const nav = parseFloat(navStr);
    const navDate = parseAmfiDate(dateStr);
    if (!plan || !isGrowthOption(optionField, name) || !(nav > 0) || !navDate) continue;

    rows.push({ code: code.trim(), name: name.trim(), amc, plan, categoryId, nav, navDate });
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

// ── Optional AUM / riskometer enrichment ───────────────────────

async function fetchSchemeDetails(codes: string[]): Promise<Map<string, { aumCr?: number; riskometer?: string }>> {
  const out = new Map<string, { aumCr?: number; riskometer?: string }>();
  for (let i = 0; i < codes.length; i += 50) {
    const batch = codes.slice(i, i + 50);
    try {
      const res = await fetch(`${TIGZIG_DETAILS_URL}?schemes=${batch.join(',')}`, {
        signal: AbortSignal.timeout(20000),
        cache: 'no-store',
      });
      if (!res.ok) continue;
      const json = await res.json();
      for (const d of json?.data ?? []) {
        const aum = d?.amfi_daily?.fund_aum_cr_all_plans;
        out.set(String(d.scheme_code), {
          aumCr: typeof aum === 'number' ? Math.round(aum) : undefined,
          riskometer: d?.amfi_daily?.riskometer ?? undefined,
        });
      }
    } catch (err) {
      console.warn('[IndianMF] Scheme details enrichment failed for a batch:', (err as Error).message);
    }
  }
  return out;
}

// ── Main ────────────────────────────────────────────────────────

export async function generateIndianFundReport(): Promise<IndianFundReport> {
  const rows = parseNavAll(await fetchText(AMFI_NAV_ALL_URL));
  if (rows.length === 0) throw new Error('AMFI NAV file returned no matching schemes');

  // Latest NAV date across the file; drop schemes whose NAV is stale (suspended / wound up)
  const latest = new Date(Math.max(...rows.map(r => r.navDate.getTime())));
  const staleCutoff = latest.getTime() - 7 * 86400000;
  const live = rows.filter(r => r.navDate.getTime() >= staleCutoff);

  const historical = new Map<Horizon, Map<string, number>>();
  await Promise.all(HORIZONS.map(async h => {
    historical.set(h, await fetchNavsOnOrBefore(yearsBefore(latest, h)));
  }));

  const withReturns: (SchemeRow & { returns: FundPerformance['returns'] })[] = live.map(r => {
    const returns: FundPerformance['returns'] = {};
    for (const h of HORIZONS) {
      const past = historical.get(h)?.get(r.code);
      if (!past) continue;
      const ratio = r.nav / past;
      const pct = h === 1 ? (ratio - 1) * 100 : (Math.pow(ratio, 1 / h) - 1) * 100;
      returns[`${h}y`] = Math.round(pct * 100) / 100;
    }
    return { ...r, returns };
  });

  const categories: IndianFundReport['categories'] = FUND_CATEGORIES.map(cat => {
    const top = { direct: {}, regular: {} } as IndianFundReport['categories'][0]['top'];
    const schemeCount = { direct: 0, regular: 0 };
    for (const plan of ['direct', 'regular'] as const) {
      const pool = withReturns.filter(r => r.categoryId === cat.id && r.plan === plan);
      schemeCount[plan] = pool.length;
      for (const h of HORIZONS) {
        const key = `${h}y` as const;
        top[plan][key] = pool
          .filter(r => r.returns[key] !== undefined)
          .sort((a, b) => b.returns[key]! - a.returns[key]!)
          .slice(0, TOP_N)
          .map(r => ({ schemeCode: r.code, name: r.name, amc: r.amc, nav: r.nav, returns: r.returns }));
      }
    }
    return { id: cat.id, label: cat.label, group: cat.group, schemeCount, top };
  });

  // Enrich only the funds that will actually be shown
  const shown = new Set<string>();
  for (const c of categories) for (const plan of Object.values(c.top)) for (const list of Object.values(plan)) for (const f of list) shown.add(f.schemeCode);
  const details = await fetchSchemeDetails([...shown]);
  for (const c of categories) for (const plan of Object.values(c.top)) for (const list of Object.values(plan)) {
    for (const f of list) Object.assign(f, details.get(f.schemeCode));
  }

  return {
    navDate: latest.toISOString().slice(0, 10),
    generatedAt: new Date().toISOString(),
    categories,
    sources: [
      'AMFI India — daily NAV & historical NAV (amfiindia.com)',
      'AUM & riskometer: AMFI data via TigZig MF API (api.tigzig.com)',
    ],
  };
}
