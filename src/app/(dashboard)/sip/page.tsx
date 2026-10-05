"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ChevronLeft, Loader2, ShieldCheck, Target } from "lucide-react";

const inr = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

/** Same formula as the server: SIP paid at the start of each month */
function requiredSip(target: number, years: number, annualReturnPct: number): number {
  const n = Math.round(years * 12);
  const i = annualReturnPct / 12 / 100;
  if (i === 0) return Math.round(target / n);
  return Math.round((target * i) / ((Math.pow(1 + i, n) - 1) * (1 + i)));
}

const inputClass =
  "w-full bg-white border border-[#E8E2D2] rounded-xl px-4 py-3 text-[#0B2E33] font-medium placeholder:text-[#B3BFBE] focus:outline-none focus:border-[#D9B978] transition-colors";

export default function SIPCalculatorPage() {
  const [form, setForm] = useState({ targetAmount: "", durationYears: "", expectedReturn: "12" });
  const [result, setResult] = useState<{ sip: number; totalInvested: number; growth: number } | null>(null);
  const [guidance, setGuidance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number(form.targetAmount);
    const years = Number(form.durationYears);
    const rate = Number(form.expectedReturn);
    const sip = requiredSip(target, years, rate);
    const totalInvested = sip * Math.round(years * 12);
    setResult({ sip, totalInvested, growth: target - totalInvested });
    setGuidance(null);
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/sip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult({ sip: data.sip, totalInvested: data.totalInvested, growth: data.estimatedGrowth });
      setGuidance(data.guidance);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const set = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const investedShare = result && result.totalInvested > 0 ? Math.min(100, Math.max(0, (result.totalInvested / (result.totalInvested + Math.max(result.growth, 0))) * 100)) : 0;

  return (
    <div className="flex flex-col h-full bg-[#F6F3EC] min-w-0">
      <header className="h-16 bg-white/60 backdrop-blur-md border-b border-[#E8E2D2] flex items-center gap-3 md:gap-4 px-4 md:px-6 shrink-0">
        <Link href="/" aria-label="Back to website" className="text-[#839F9D] hover:text-[#0B2E33] transition-colors p-2 rounded-full hover:bg-white/80">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex items-center gap-3 pl-2 border-l border-[#E8E2D2] min-w-0">
          <div className="bg-[#0B2E33] p-1.5 rounded text-[#D9B978] shadow-sm shrink-0"><ShieldCheck size={16} /></div>
          <span className="font-medium text-[#0B2E33] hidden sm:block font-serif text-lg tracking-wide">Knowith Capital</span>
          <span className="text-[#C4D1D0] hidden sm:block">/</span>
          <h1 className="font-semibold text-[#B8873D] tracking-wider text-xs md:text-sm uppercase font-mono truncate">SIP Goal Planner</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* Inputs + result */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-white border border-[#E8E2D2] rounded-2xl p-6 shadow-sm space-y-5">
              <div>
                <h2 className="font-serif text-2xl text-[#0B2E33]">Plan a goal</h2>
                <p className="text-sm text-[#839F9D] mt-1">How much should you invest every month to get there?</p>
              </div>
              <label className="block">
                <span className="block text-[11px] font-mono uppercase tracking-widest text-[#839F9D] mb-1.5">Goal amount (₹)</span>
                <input required min="1" type="number" name="targetAmount" value={form.targetAmount} onChange={set} className={inputClass} placeholder="e.g. 1,00,00,000" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-[11px] font-mono uppercase tracking-widest text-[#839F9D] mb-1.5">Years</span>
                  <input required min="1" max="60" step="0.5" type="number" name="durationYears" value={form.durationYears} onChange={set} className={inputClass} placeholder="e.g. 15" />
                </label>
                <label className="block">
                  <span className="block text-[11px] font-mono uppercase tracking-widest text-[#839F9D] mb-1.5">Return % / yr</span>
                  <input required min="0" max="30" step="0.5" type="number" name="expectedReturn" value={form.expectedReturn} onChange={set} className={inputClass} />
                </label>
              </div>
              <button disabled={isLoading} type="submit"
                className="w-full bg-[#0B2E33] hover:bg-[#0F3A3F] disabled:opacity-60 text-[#F6F3EC] font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5 text-[#D9B978]" />}
                {isLoading ? "Preparing your plan…" : "Calculate my SIP"}
              </button>
            </form>

            {result && (
              <div className="bg-[#0B2E33] text-[#F6F3EC] rounded-2xl p-6 shadow-sm">
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#D9B978]">Required monthly SIP</div>
                <div className="font-serif text-4xl mt-2">{inr(result.sip)}</div>
                <div className="mt-6 h-2 rounded-full bg-[#1A5C66] overflow-hidden">
                  <div className="h-full bg-[#D9B978]" style={{ width: `${investedShare}%` }} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2 text-[#C4D1D0]"><span className="w-2 h-2 rounded-full bg-[#D9B978]" /> You invest</div>
                    <div className="font-semibold mt-0.5">{inr(result.totalInvested)}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[#C4D1D0]"><span className="w-2 h-2 rounded-full bg-[#1A5C66] border border-[#2A7C88]" /> Estimated growth</div>
                    <div className="font-semibold mt-0.5">{inr(Math.max(result.growth, 0))}</div>
                  </div>
                </div>
                <p className="text-[11px] text-[#839F9D] mt-4">Illustrative, assuming a constant return. Actual returns vary.</p>
              </div>
            )}
          </div>

          {/* AI guidance */}
          <div className="bg-white border border-[#E8E2D2] rounded-2xl p-6 md:p-8 shadow-sm min-h-[420px]">
            <h2 className="font-serif text-2xl text-[#0B2E33] mb-1">Your plan, explained</h2>
            <p className="text-sm text-[#839F9D] mb-6">Feasibility check and suggested approach from the Knowith AI planner.</p>
            {isLoading ? (
              <div className="h-[280px] flex flex-col items-center justify-center gap-3 text-[#839F9D]">
                <Loader2 className="w-8 h-8 animate-spin text-[#D9B978]" />
                <p className="text-xs font-mono uppercase tracking-widest">Analysing your goal…</p>
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
            ) : guidance ? (
              <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0B2E33] prose-h3:text-lg prose-strong:text-[#0B2E33] prose-p:leading-relaxed text-[15px]">
                <ReactMarkdown>{guidance}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center text-center text-[#839F9D]">
                <div className="w-14 h-14 rounded-2xl bg-[#F6F3EC] border border-[#E8E2D2] flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-[#D9B978]" />
                </div>
                <p className="text-sm max-w-xs">Enter your goal to see the monthly SIP and a personalised explanation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
