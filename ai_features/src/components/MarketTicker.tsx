"use client";

import { useEffect, useState } from 'react';

type TickerItem = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

export default function MarketTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTicker() {
      try {
        const res = await fetch('/api/v1/market/ticker');
        const json = await res.json();
        if (json.success && json.data) {
          setItems(json.data);
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

  if (loading || items.length === 0) return null;

  return (
    <div className="w-full bg-[#0a0a0a] border-b border-[#1f1f1f] py-2 overflow-hidden flex items-center shrink-0">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Render items twice for infinite loop effect */}
        {[...items, ...items].map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center mx-6 text-sm font-medium">
            <span className="text-gray-300 mr-2">{item.name}</span>
            <span className="text-white mr-2">{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className={`text-xs ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)} ({Math.abs(item.changePercent).toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
