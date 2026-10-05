"use client";

import { useState, useEffect } from "react";

import { MarketBlueprint as MarketBlueprintUI } from "@/components/market/MarketBlueprint";
import { OrchestratorLoading } from "@/components/chat/OrchestratorLoading";
import { MarketBlueprint } from "@/schemas/market.schema";
import Link from "next/link";
import { RefreshCw, ChevronLeft, ShieldCheck } from "lucide-react";

export default function MarketNewsPage() {
  const [blueprint, setBlueprint] = useState<MarketBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketIntelligence = async (forceRefresh = false) => {
    if (forceRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    
    setError(null);
    
    try {
      const response = await fetch('/api/v1/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceRefresh })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error?.message || "Failed to load market intelligence");

      if (data.data?.blueprint) {
        setBlueprint(data.data.blueprint);
      }
    } catch (err: any) {
      console.error(err);
      setError("Unable to generate market intelligence at this time. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketIntelligence();
  }, []);

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-[#F6F3EC] overflow-hidden print:bg-white print:h-auto print:overflow-visible">
        
        {/* Same header as the other research tools */}
        <header className="h-16 bg-white/60 backdrop-blur-md border-b border-[#E8E2D2] flex items-center gap-3 md:gap-4 px-4 md:px-6 shrink-0 z-10 print:hidden">
          <Link href="/" aria-label="Back to website" className="text-[#839F9D] hover:text-[#0B2E33] transition-colors p-2 rounded-full hover:bg-white/80">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-3 pl-2 border-l border-[#E8E2D2] min-w-0">
            <div className="bg-[#0B2E33] p-1.5 rounded text-[#D9B978] shadow-sm shrink-0"><ShieldCheck size={16} /></div>
            <span className="font-medium text-[#0B2E33] hidden sm:block font-serif text-lg tracking-wide">Knowith Capital</span>
            <span className="text-[#C4D1D0] hidden sm:block">/</span>
            <h1 className="font-semibold text-[#B8873D] tracking-wider text-xs md:text-sm uppercase font-mono truncate">Market Intelligence</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full print:overflow-visible">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <OrchestratorLoading />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-4">
                 <RefreshCw size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Analysis Failed</h3>
              <p className="text-slate-500 mb-6">{error}</p>
              <button 
                onClick={() => fetchMarketIntelligence(true)}
                className="px-6 py-2 bg-[#0B2E33] text-[#F6F3EC] font-medium rounded-lg hover:bg-[#0F3A3F] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : blueprint ? (
            <div className="max-w-6xl mx-auto p-4 md:p-8">
              <MarketBlueprintUI 
                data={blueprint} 
                onRefresh={() => fetchMarketIntelligence(true)} 
                isRefreshing={isRefreshing}
              />
            </div>
          ) : null}
        </main>
      </div>
    </>
  );
}
