'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

type Plan = 'regular' | 'direct';
type Horizon = '1y' | '3y' | '5y';

interface Fund {
  schemeCode: string;
  name: string;
  amc: string;
  nav: number;
  returns: Partial<Record<Horizon, number>>;
  aumCr?: number;
  riskometer?: string;
}

interface Report {
  navDate: string;
  categories: {
    id: string;
    label: string;
    group: string;
    schemeCount: Record<Plan, number>;
    top: Record<Plan, Record<Horizon, Fund[]>>;
  }[];
  sources: string[];
}

const HORIZON_LABELS: Record<Horizon, string> = { '1y': '1 Year', '3y': '3 Years', '5y': '5 Years' };

const formatPct = (v?: number) => (v === undefined ? '—' : `${v > 0 ? '+' : ''}${v.toFixed(2)}%`);
const pctColor = (v?: number) => (v === undefined ? 'var(--slate-soft)' : v >= 0 ? '#16a34a' : '#dc2626');
const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export default function IndianFundsView() {
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [plan, setPlan] = useState<Plan>('regular');
  const [horizon, setHorizon] = useState<Horizon>('1y');

  useEffect(() => {
    fetch('/api/v1/market-data/india')
      .then(res => res.json())
      .then(json => {
        setReport(json.data);
        setCategoryId(json.data?.categories?.[0]?.id ?? null);
      })
      .catch(e => console.error(e))
      .finally(() => setIsLoading(false));
  }, []);

  const category = report?.categories.find(c => c.id === categoryId);
  const funds = category?.top[plan][horizon] ?? [];

  return (
    <>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Indian Market</span>
        <h1 className={styles.title}>Top Performing Mutual Funds</h1>
        <p className={styles.subtitle}>The 10 best-performing open-ended funds in each category, ranked on NAV returns published by AMFI.</p>
        <div className={styles.metaRow}>
          {report && <div className={styles.badge}>NAV as of {formatDate(report.navDate)}</div>}
          <span className={styles.metaNote}>* Updated once every day</span>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Fetching the latest NAVs from AMFI…</div>
      ) : !report ? (
        <div className={styles.error}>Mutual fund data is temporarily unavailable. Please check back shortly.</div>
      ) : (
        <>
          <div className={styles.categoryTabs} role="tablist" aria-label="Fund category">
            {report.categories.map(c => (
              <button
                key={c.id}
                role="tab"
                aria-selected={c.id === categoryId}
                className={`${styles.categoryTab} ${c.id === categoryId ? styles.categoryTabActive : ''}`}
                onClick={() => setCategoryId(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className={styles.controls}>
            <div className={styles.filters}>
              <div className={styles.segmented} role="group" aria-label="Plan">
                {(['regular', 'direct'] as Plan[]).map(p => (
                  <button key={p} className={plan === p ? styles.segmentActive : ''} onClick={() => setPlan(p)}>
                    {p === 'regular' ? 'Regular Plan' : 'Direct Plan'}
                  </button>
                ))}
              </div>
              <select value={horizon} onChange={e => setHorizon(e.target.value as Horizon)} className={styles.select} aria-label="Rank by">
                {(Object.keys(HORIZON_LABELS) as Horizon[]).map(h => (
                  <option key={h} value={h}>Rank by {HORIZON_LABELS[h]} return</option>
                ))}
              </select>
            </div>
            {category && (
              <span className={styles.metaNote}>
                {category.label} · {category.schemeCount[plan]} funds tracked · Growth option
              </span>
            )}
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thStatic}>#</th>
                  <th className={styles.thStatic}>Fund</th>
                  {(Object.keys(HORIZON_LABELS) as Horizon[]).map(h => (
                    <th key={h} className={`${styles.thStatic} ${styles.numCol} ${h === horizon ? styles.thRanked : ''}`}>
                      {h.toUpperCase()} {h === '1y' ? 'Return' : 'CAGR'}
                    </th>
                  ))}
                  <th className={`${styles.thStatic} ${styles.numCol}`}>AUM (₹ Cr)</th>
                  <th className={`${styles.thStatic} ${styles.numCol}`}>NAV (₹)</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((f, i) => (
                  <tr key={f.schemeCode} className={styles.tr}>
                    <td className={`${styles.td} ${styles.rank}`}>{i + 1}</td>
                    <td className={styles.td}>
                      <div className={styles.fundName}>{f.name}</div>
                      <div className={styles.fundMeta}>
                        {f.amc}
                        {f.riskometer && <span className={styles.typeBadge}>{f.riskometer} risk</span>}
                      </div>
                    </td>
                    {(Object.keys(HORIZON_LABELS) as Horizon[]).map(h => (
                      <td
                        key={h}
                        className={`${styles.td} ${styles.numCol}`}
                        style={{ color: pctColor(f.returns[h]), fontWeight: h === horizon ? 700 : 500 }}
                      >
                        {formatPct(f.returns[h])}
                      </td>
                    ))}
                    <td className={`${styles.td} ${styles.numCol}`}>{f.aumCr?.toLocaleString('en-IN') ?? '—'}</td>
                    <td className={`${styles.td} ${styles.numCol}`}>{f.nav.toLocaleString('en-IN', { maximumFractionDigits: 4 })}</td>
                  </tr>
                ))}
                {funds.length === 0 && (
                  <tr><td className={styles.td} colSpan={7}>No funds in this category have a {HORIZON_LABELS[horizon].toLowerCase()} track record yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.footer}>
            <p>Source: {report.sources.join(' · ')}.</p>
            <p>
              1Y is the point-to-point absolute return; 3Y and 5Y are annualised (CAGR), measured from the latest NAV on or before the same date in the
              earlier year. Only funds with a full track record for the selected period are ranked. &ldquo;—&rdquo; means the fund (or its current scheme
              code) is younger than that period.
            </p>
            <p>Mutual fund investments are subject to market risks; read all scheme-related documents carefully. Past performance is not indicative of future returns.</p>
          </div>
        </>
      )}
    </>
  );
}
