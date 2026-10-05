"use client";

import { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Headphones, Target, ShieldCheck, PieChart, Activity, Search, User, Clock, MessageSquare, RefreshCw, FileText, UserCheck, Phone, Mail, Calculator } from 'lucide-react';
import { advisorConfig } from '@/lib/config/advisor.config';
import { healthConfig } from '@/lib/config/health.config';
import { portfolioConfig } from '@/lib/config/portfolio.config';
import { taxConfig } from '@/lib/config/tax.config';

type ChatMessage = { id: string; role: string; content: string; createdAt: string };
type Lead = { name: string; email: string | null; phone: string | null; city: string | null; investmentRange: string | null; status: string };
type ChatSession = {
  id: string;
  feature: string;
  createdAt: string;
  updatedAt: string;
  actorEmail: string | null;
  actorName: string | null;
  profile: Record<string, unknown> | null;
  report: unknown;
  messages: ChatMessage[];
  client: { name: string | null; email: string; isActive: boolean } | null;
  user: { name: string | null; email: string } | null;
  lead: Lead | null;
};

const fmt = (d: string, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-IN', opts).format(new Date(d));
const formatTime = (d: string) => fmt(d, { hour: '2-digit', minute: '2-digit' });
const formatShort = (d: string) => fmt(d, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const formatLong = (d: string) => fmt(d, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const FEATURES = [
  { id: 'ALL', name: 'All Chats', icon: MessageSquare },
  { id: 'SUPPORT', name: 'Website Assistant', icon: Headphones },
  { id: 'ADVISOR', name: 'Investment Advisor', icon: Target },
  { id: 'HEALTH', name: 'Financial Health', icon: Activity },
  { id: 'PORTFOLIO', name: 'Portfolio Analyzer', icon: PieChart },
  { id: 'TAX', name: 'Tax Advisor', icon: ShieldCheck },
  { id: 'SIP', name: 'SIP Planner', icon: Calculator },
];
const FEATURE_NAME = Object.fromEntries(FEATURES.map(f => [f.id, f.name]));

// Human labels for collected profile fields, per tool
const FIELD_LABELS: Record<string, Record<string, string>> = {
  ADVISOR: Object.fromEntries(advisorConfig.profileFields.map(f => [f.id, f.label])),
  HEALTH: Object.fromEntries(healthConfig.profileFields.map(f => [f.id, f.label])),
  PORTFOLIO: Object.fromEntries(portfolioConfig.profileFields.map(f => [f.id, f.label])),
  TAX: Object.fromEntries(taxConfig.profileFields.map(f => [f.id, f.label])),
  SIP: { targetAmount: 'Goal amount (₹)', durationYears: 'Years', expectedReturn: 'Expected return (%)', monthlySip: 'Monthly SIP (₹)' },
};

const who = (s: ChatSession) => s.client?.name || s.actorName || s.user?.name || s.client?.email || s.actorEmail || s.user?.email || s.lead?.name || 'Website visitor';
const whoEmail = (s: ChatSession) => s.client?.email || s.actorEmail || s.user?.email || s.lead?.email || null;
const plain = (md: string) => md.replace(/[*_`#>]/g, '').replace(/\s+/g, ' ').trim();
const display = (v: unknown) => (v == null || v === '' ? null : typeof v === 'object' ? JSON.stringify(v) : String(v));

export default function ChatLogsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [truncated, setTruncated] = useState(false);
  const [feature, setFeature] = useState('ALL');
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (feature !== 'ALL') params.set('feature', feature);
    if (debounced) params.set('q', debounced);
    fetch(`/api/v1/admin/chats?${params}`)
      .then(res => res.json())
      .then(data => {
        if (cancelled || !data.success) return;
        setSessions(data.sessions);
        setCounts(data.counts || {});
        setTruncated(Boolean(data.truncated));
      })
      .catch(error => console.error('Failed to fetch sessions:', error))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [feature, debounced, reloadKey]);

  const selected = useMemo(() => sessions.find(s => s.id === selectedId) ?? null, [sessions, selectedId]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const profileEntries = selected?.profile
    ? Object.entries(selected.profile)
        .map(([k, v]) => [FIELD_LABELS[selected.feature]?.[k] ?? k, display(v)] as const)
        .filter(([, v]) => v !== null)
    : [];
  const hasDetails = Boolean(selected && (profileEntries.length > 0 || selected.lead || selected.report != null));

  // Lead / collected details / report — a side panel on very wide screens, a strip under the header otherwise
  const detailsBody = selected && (
    <>
      {selected.lead && (
        <section>
          <h4 className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Lead captured</h4>
          <div className="space-y-1.5 text-gray-200">
            <div className="font-medium">{selected.lead.name}</div>
            {selected.lead.email && <div className="flex items-center gap-2 text-gray-400"><Mail className="w-3.5 h-3.5" />{selected.lead.email}</div>}
            {selected.lead.phone && <div className="flex items-center gap-2 text-gray-400"><Phone className="w-3.5 h-3.5" />{selected.lead.phone}</div>}
            {selected.lead.city && <div className="text-gray-400">{selected.lead.city}</div>}
            {selected.lead.investmentRange && <div className="text-gray-400">Range: {selected.lead.investmentRange}</div>}
            <div className="text-xs text-gray-500">Status: {selected.lead.status}</div>
          </div>
        </section>
      )}
      {profileEntries.length > 0 && (
        <section>
          <h4 className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Details shared</h4>
          <dl className="grid grid-cols-2 2xl:grid-cols-1 gap-x-4 gap-y-2">
            {profileEntries.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-xs text-gray-500">{label}</dt>
                <dd className="text-gray-200 break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {selected.report != null && (
        <section>
          <h4 className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Report</h4>
          <div className="flex items-center gap-2 text-amber-400 mb-2"><FileText className="w-4 h-4" /> Report generated</div>
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-400 hover:text-white">View report data</summary>
            <pre className="mt-2 p-2 rounded bg-[#111118] border border-[#1F1F1F] text-gray-300 whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
              {JSON.stringify(selected.report, null, 2)}
            </pre>
          </details>
        </section>
      )}
    </>
  );

  return (
    <div className="flex h-full overflow-hidden">
      {/* Conversation list with filter + search. On phones it gives way to the open conversation. */}
      <div className={`w-full md:w-80 lg:w-96 shrink-0 border-r border-[#1F1F1F] bg-[#0A0A0A] flex-col ${selected ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-[#1F1F1F] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Chat Logs</h2>
            <button
              onClick={() => { setLoading(true); setReloadKey(k => k + 1); }}
              title="Refresh"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#111118]"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <select
            value={feature}
            onChange={e => { setLoading(true); setFeature(e.target.value); setSelectedId(null); }}
            className="w-full bg-[#111118] border border-[#1F1F1F] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#2E2E3E]"
            aria-label="Filter by tool"
          >
            {FEATURES.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.id === 'ALL' ? total : counts[f.id] ?? 0})
              </option>
            ))}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setLoading(true); }}
              placeholder="Search name, email or message…"
              className="w-full bg-[#111118] border border-[#1F1F1F] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#2E2E3E]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {loading && sessions.length === 0 ? (
            <div className="text-gray-500 text-sm p-4 text-center">Loading conversations…</div>
          ) : sessions.length === 0 ? (
            <div className="text-gray-500 text-sm p-4 text-center">{debounced ? 'No conversations match your search.' : 'No conversations yet.'}</div>
          ) : (
            <>
              {sessions.map(s => {
                const last = s.messages[s.messages.length - 1];
                const Icon = FEATURES.find(f => f.id === s.feature)?.icon ?? MessageSquare;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={`w-full text-left p-3 rounded-lg mb-1.5 border transition-all ${
                      selectedId === s.id ? 'bg-[#111118] border-blue-500/30' : 'border-transparent hover:bg-[#111118] hover:border-[#1F1F1F]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1 gap-2">
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-400 uppercase tracking-wide truncate">
                        <Icon className="w-3.5 h-3.5 shrink-0" />{FEATURE_NAME[s.feature] ?? s.feature}
                      </span>
                      <span className="text-[10px] text-gray-500 shrink-0">{formatShort(s.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-200 font-medium truncate mb-1">
                      {s.client && <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      <span className="truncate">{who(s)}</span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">{last ? plain(last.content) : ''}</div>
                    <div className="flex flex-wrap gap-x-2 mt-1.5 text-[10px] text-gray-500">
                      <span>{s.messages.length} messages</span>
                      {s.report != null && <span className="text-amber-400">• Report generated</span>}
                      {s.lead && <span className="text-emerald-400">• Lead captured</span>}
                    </div>
                  </button>
                );
              })}
              {truncated && <p className="text-[11px] text-gray-600 text-center py-2">Showing the 100 most recent. Use search to find older chats.</p>}
            </>
          )}
        </div>
      </div>

      {/* Conversation */}
      <div className={`flex-1 min-w-0 bg-[#050505] flex-col h-full ${selected ? 'flex' : 'hidden md:flex'}`}>
        {selected ? (
          <>
            <div className="px-4 md:px-6 py-4 border-b border-[#1F1F1F] bg-[#0A0A0A] shrink-0">
              <button onClick={() => setSelectedId(null)} className="md:hidden text-xs text-blue-400 mb-2">← All conversations</button>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-white font-medium text-lg">{who(selected)}</h3>
                {selected.client && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Approved client</span>
                )}
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">{FEATURE_NAME[selected.feature] ?? selected.feature}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-1.5 text-xs text-gray-400">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {whoEmail(selected) || 'Not signed in'}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Started {formatLong(selected.createdAt)}</span>
                <span>Last activity {formatLong(selected.updatedAt)}</span>
              </div>
              {hasDetails && (
                <details className="2xl:hidden mt-3 rounded-lg border border-[#1F1F1F] bg-[#050505] text-sm" open>
                  <summary className="cursor-pointer px-3 py-2 text-xs uppercase tracking-wider text-gray-400 hover:text-white">
                    Collected details{selected.lead ? ' · lead' : ''}{selected.report != null ? ' · report' : ''}
                  </summary>
                  <div className="px-3 pb-3 grid gap-4 sm:grid-cols-2">{detailsBody}</div>
                </details>
              )}
            </div>

            <div className="flex-1 flex min-h-0">
              <div className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6 space-y-4">
                {selected.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] lg:max-w-[70%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-[#1A1A24] text-gray-200 border border-[#2E2E3E] rounded-bl-none'
                    }`}>
                      <div className="text-[11px] opacity-60 mb-1 flex justify-between gap-6 whitespace-nowrap">
                        <span className="truncate">{msg.role === 'user' ? who(selected) : 'Knowith AI'}</span>
                        <span>{formatTime(msg.createdAt)}</span>
                      </div>
                      <div className="text-sm leading-relaxed prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasDetails && (
                <aside className="hidden 2xl:block w-80 shrink-0 border-l border-[#1F1F1F] bg-[#0A0A0A] overflow-y-auto p-5 space-y-6 text-sm">
                  {detailsBody}
                </aside>
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a conversation to view it</p>
          </div>
        )}
      </div>
    </div>
  );
}
