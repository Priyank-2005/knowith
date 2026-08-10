'use client';

import { useState, useEffect } from 'react';
import { ArrowUpDown, AlertTriangle } from 'lucide-react';
import styles from './page.module.css';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MarketConcentrationPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'sortOrder', direction: 'asc' });

  useEffect(() => {
    fetch('/api/v1/market-data')
      .then(res => res.json())
      .then(json => {
        setData(json.data);
        setIsLoading(false);
      })
      .catch(e => {
        console.error(e);
        setIsLoading(false);
      });
  }, []);

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEntries = data?.entries ? [...data.entries].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  }).filter(entry => {
    if (filterType !== 'All' && entry.marketType !== filterType) return false;
    if (filterLevel !== 'All') {
      const lvl = entry.top10ConcentrationPct < 35 ? 'Low' : entry.top10ConcentrationPct < 55 ? 'Medium' : 'High';
      if (lvl !== filterLevel) return false;
    }
    return true;
  }) : [];

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{data?.title || 'Global Market Concentration'}</h1>
          <p className={styles.subtitle}>Analysis of top-heavy equity markets across developed and emerging economies.</p>
          {data && <div className={styles.badge}>Data as of {data.month}</div>}
        </div>

        <div className={styles.controls}>
          <div className={styles.filters}>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className={styles.select}>
              <option value="All">All Markets</option>
              <option value="Dev">Developed (Dev)</option>
              <option value="EM">Emerging (EM)</option>
            </select>
            <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className={styles.select}>
              <option value="All">All Concentration Levels</option>
              <option value="Low">Low (&lt;35%)</option>
              <option value="Medium">Medium (35-55%)</option>
              <option value="High">High (&gt;55%)</option>
            </select>
          </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}><span className={styles.dot} style={{backgroundColor: '#60A5FA'}}></span> &lt;35% (Low)</div>
          <div className={styles.legendItem}><span className={styles.dot} style={{backgroundColor: '#FBBF24'}}></span> 35-55% (Med)</div>
          <div className={styles.legendItem}><span className={styles.dot} style={{backgroundColor: '#F87171'}}></span> &gt;55% (High)</div>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading market data...</div>
      ) : !data ? (
        <div className={styles.error}>No market data available at this time.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => handleSort('country')} className={styles.th}>
                  Country <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-50" />
                </th>
                <th onClick={() => handleSort('marketCapUsd')} className={styles.th}>
                  Market Cap <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-50" />
                </th>
                <th onClick={() => handleSort('top10ConcentrationPct')} className={styles.th}>
                  Top-10 % <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-50" />
                </th>
                <th onClick={() => handleSort('top1SharePct')} className={styles.th}>
                  Top-1 % <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-50" />
                </th>
                <th onClick={() => handleSort('oneYrReturnPct')} className={styles.th}>
                  1-Yr Return <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-50" />
                </th>
                <th className={styles.th}>Index & Drivers</th>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.map((entry, idx) => (
                <tr key={idx} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.countryCell}>
                      <span className="text-lg">{entry.flagEmoji}</span>
                      <span className="font-semibold" style={{ color: 'var(--ink)' }}>{entry.country}</span>
                      <span className={styles.typeBadge}>{entry.marketType}</span>
                      {entry.hasVolatilityFlag && (
                        <span title="High Volatility"><AlertTriangle className="w-4 h-4 text-amber-500" /></span>
                      )}
                    </div>
                  </td>
                  <td className={styles.td}>{entry.marketCapUsd}</td>
                  <td className={styles.td}>
                    <div className={styles.progressContainer}>
                      <span className={styles.progressText}>{entry.top10ConcentrationPct}%</span>
                      <div className={styles.progressBarBg}>
                        <div 
                          className={styles.progressBarFill} 
                          style={{ 
                            width: `${Math.min(entry.top10ConcentrationPct, 100)}%`,
                            backgroundColor: entry.top10ConcentrationPct < 35 ? '#60A5FA' : entry.top10ConcentrationPct < 55 ? '#FBBF24' : '#F87171'
                          }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className={styles.td}>{entry.top1SharePct}%</td>
                  <td className={styles.td} style={{ color: entry.oneYrReturnPct >= 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                    {entry.oneYrReturnPct > 0 ? '+' : ''}{entry.oneYrReturnPct}%
                  </td>
                  <td className={styles.td}>
                    <div className={styles.driverInfo}>
                      <div className={styles.indexName}>{entry.indexName}</div>
                      <div className={styles.stockInfo}>
                        <span style={{ color: 'var(--slate)' }}>{entry.topReturnDriver}</span>
                        <span style={{ color: 'var(--slate-soft)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>via {entry.largestStock} ({entry.largestStockTicker})</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.footer}>
        <p>Source: Knowith Capital Intelligence. Market cap and concentration data based on primary indices for each country.</p>
        <p>Return figures are trailing 12-months. Top return drivers indicate the sector or thematic grouping responsible for the majority of the index returns.</p>
      </div>
    </div>
    <Footer />
    </>
  );
}
