'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Trash2, Edit2, AlertCircle } from 'lucide-react';
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export default function MarketDataAdmin() {
  const [file, setFile] = useState<File | null>(null);
  const [month, setMonth] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleUpload = async () => {
    if (!file || !month) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('month', month);

    try {
      const res = await fetch('/api/v1/market-data', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        await fetchReport();
        setFile(null);
        setMonth('');
      }
    } catch (error) {
      console.error('Upload failed', error);
    }
    setIsUploading(false);
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
        <h1 className="text-2xl font-bold text-white mb-2">Global Market Concentration Manager</h1>
        <p className="text-gray-400">Upload PDF reports to extract and publish market data.</p>
      </div>

      <div className="bg-[#111118] border border-[#1F1F1F] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Upload New Report</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2 flex-1 min-w-[300px]">
            <label className="text-sm text-gray-400">Report Title / Date</label>
            <input 
              type="text" 
              placeholder="e.g. Daily Update - Aug 10"
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2E2E3E] rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-2 flex-1 min-w-[300px]">
            <label className="text-sm text-gray-400">PDF File</label>
            <input 
              type="file" 
              accept=".pdf"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="w-full bg-[#0A0A0A] border border-[#2E2E3E] rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
          </div>
          <button 
            onClick={handleUpload}
            disabled={!file || !month || isUploading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isUploading ? <Upload className="w-4 h-4 animate-bounce" /> : <Upload className="w-4 h-4" />}
            {isUploading ? 'Uploading & Parsing...' : 'Upload Report'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500 py-12">Loading data...</div>
      ) : report ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Active Report: {report.month}
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">Live</span>
              </h2>
            </div>
            <button onClick={() => handleDelete(report.id)} className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm bg-red-400/10 px-3 py-1.5 rounded-lg">
              <Trash2 className="w-4 h-4" /> Delete Report
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
                  {report.entries.map((entry: any) => (
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
          <FileText className="w-12 h-12 mx-auto text-gray-600 mb-3" />
          <p>No active report found. Upload one to get started.</p>
        </div>
      )}
    </div>
  );
}
