'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Trash2, RefreshCw, Clock, Zap, AlertCircle } from 'lucide-react';
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export default function MarketDataAdmin() {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genResult, setGenResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/market-data');
      if (res.ok) {
        const json = await res.json();
        setReport(json.data);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const handleManualGenerate = async () => {
    setIsGenerating(true);
    setGenResult(null);
    try {
      const res = await fetch('/api/v1/market-data/generate', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setGenResult({ success: true, message: 'Report generated successfully!' });
        await fetchReport();
      } else {
        setGenResult({ success: false, message: json.error || 'Generation failed' });
      }
    } catch (error) {
      setGenResult({ success: false, message: 'Network error during generation' });
    }
    setIsGenerating(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/v1/market-data/${id}`, { method: 'DELETE' });
      await fetchReport();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Global Market Concentration</h1>
        <p className="text-gray-400">Auto-generated daily via Vercel Cron + Gemini AI + Yahoo Finance.</p>
      </div>

      {/* Status & Manual Trigger */}
      <div className="bg-[#111118] border border-[#1F1F1F] rounded-xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Automated Report Generation
            </h2>
            <p className="text-gray-400 text-sm max-w-xl">
              A cron job runs daily at <strong className="text-gray-300">6:00 AM IST</strong> to fetch real market data 
              from Yahoo Finance, enrich it with Gemini AI analysis, and store the report in the database. 
              The public page always serves the latest stored report — no tokens are used on page views.
            </p>
          </div>
          <button
            onClick={handleManualGenerate}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shrink-0"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {isGenerating ? 'Generating...' : 'Generate Now (Manual)'}
          </button>
        </div>

        {genResult && (
          <div className={cn(
            "mt-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2",
            genResult.success ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"
          )}>
            {genResult.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {genResult.message}
          </div>
        )}
      </div>

      {/* Report Table */}
      {isLoading ? (
        <div className="text-center text-gray-500 py-12">Loading data...</div>
      ) : report ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Active Report: {report.month}
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">Live</span>
                {report.uploadedBy === 'auto-cron' && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">Auto-generated</span>
                )}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Created: {new Date(report.createdAt).toLocaleString()} · {report.entries?.length || 0} countries
              </p>
            </div>
            <button onClick={() => handleDelete(report.id)} className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm bg-red-400/10 px-3 py-1.5 rounded-lg">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>

          <div className="bg-[#111118] border border-[#1F1F1F] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-[#0A0A0A] border-b border-[#1F1F1F]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Country</th>
                    <th className="px-4 py-3 font-medium">Market Cap</th>
                    <th className="px-4 py-3 font-medium">Top 10 %</th>
                    <th className="px-4 py-3 font-medium">Top 1 %</th>
                    <th className="px-4 py-3 font-medium">1-Yr Return</th>
                    <th className="px-4 py-3 font-medium">Index</th>
                    <th className="px-4 py-3 font-medium">Top Driver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F1F]">
                  {report.entries?.map((entry: any) => (
                    <tr key={entry.id} className="hover:bg-[#1A1A24]">
                      <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                        <span>{entry.flagEmoji}</span> {entry.country}
                        <span className="text-[10px] bg-[#2E2E3E] px-1.5 py-0.5 rounded text-gray-400">{entry.marketType}</span>
                      </td>
                      <td className="px-4 py-3">{entry.marketCapUsd}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {entry.top10ConcentrationPct}%
                          <div className={cn("w-2 h-2 rounded-full", 
                            entry.top10ConcentrationPct < 35 ? "bg-blue-400" :
                            entry.top10ConcentrationPct < 55 ? "bg-amber-400" : "bg-red-400"
                          )} />
                        </div>
                      </td>
                      <td className="px-4 py-3">{entry.top1SharePct}%</td>
                      <td className={cn("px-4 py-3 font-medium", entry.oneYrReturnPct >= 0 ? "text-green-400" : "text-red-400")}>
                        {entry.oneYrReturnPct > 0 ? '+' : ''}{entry.oneYrReturnPct}%
                      </td>
                      <td className="px-4 py-3 text-xs">{entry.indexName}</td>
                      <td className="px-4 py-3 text-xs">
                        <div className="font-medium text-gray-300">{entry.topReturnDriver}</div>
                        <div className="text-gray-500">{entry.largestStock} ({entry.largestStockTicker})</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12 border border-dashed border-[#2E2E3E] rounded-xl">
          <RefreshCw className="w-12 h-12 mx-auto text-gray-600 mb-3" />
          <p>No report found. Click "Generate Now" above or wait for the daily cron job.</p>
        </div>
      )}
    </div>
  );
}
