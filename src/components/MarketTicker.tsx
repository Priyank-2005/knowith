"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type TickerItem = {
  indexName: string;
  currentValue: number;
  changeAmount: number;
  changePercentage: number;
  trend: string;
};

// Global cache outside component so it survives unmounts
let cachedTickerData: TickerItem[] | null = null;
let lastFetchTime: number = 0;

export default function MarketTicker() {
  const [items, setItems] = useState<TickerItem[]>(cachedTickerData || []);
  const [loading, setLoading] = useState(!cachedTickerData);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchTicker() {
      // Avoid fetching if we fetched within the last 60 seconds
      if (cachedTickerData && Date.now() - lastFetchTime < 60000) {
        setItems(cachedTickerData);
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch('/api/v1/market/ticker');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            cachedTickerData = json.data;
            lastFetchTime = Date.now();
            setItems(json.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch ticker data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTicker();
    const interval = setInterval(fetchTicker, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Hide on games paths
  if (pathname?.startsWith('/games')) return null;
  if (loading || items.length === 0) return null;

  return (
    <div style={{ width: '100%', backgroundColor: '#1b433a', padding: '8px 0', overflow: 'hidden', borderBottom: '1px solid #13302a', display: 'block' }}>
      <div className="animate-marquee" style={{ display: 'inline-flex', flexWrap: 'nowrap', width: 'fit-content' }}>
        {[...items, ...items, ...items].map((item, i) => (
          <div key={`${item.indexName}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', fontSize: '12px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#84a39b', fontWeight: 600, letterSpacing: '0.025em', marginRight: '8px' }}>{item.indexName}</span>
            <span style={{ color: 'white', fontWeight: 700, marginRight: '8px' }}>
              {item.currentValue != null ? item.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}
            </span>
            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', color: item.changeAmount >= 0 ? '#34d399' : '#f87171' }}>
              {item.changeAmount >= 0 ? '▲' : '▼'} {Math.abs(item.changePercentage || 0).toFixed(2)}%
            </span>
            <span style={{ margin: '0 24px', color: '#4a6b62' }}>·</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}
