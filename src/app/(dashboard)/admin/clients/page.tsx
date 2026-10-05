"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Upload, Plus, Search, Trash2, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

type Client = { id: string; name: string | null; email: string; isActive: boolean; lastLoginAt: string | null; createdAt: string };

const inputClass = 'bg-[#0A0A0F] border border-[#2E2E3E] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500';

/** Splits a CSV line, honouring quoted fields. */
function splitCsv(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { cur += '"'; i++; } else quoted = !quoted;
    } else if (ch === ',' && !quoted) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out.map(s => s.trim());
}

/** Finds the name and email columns from a header row (falls back to detecting emails). */
function toRows(table: string[][]): { name: string; email: string }[] {
  if (table.length === 0) return [];
  const header = table[0].map(h => h.toLowerCase());
  let emailCol = header.findIndex(h => h.includes('email') || h.includes('e-mail'));
  let nameCol = header.findIndex(h => h === 'name' || h.includes('client') || h.includes('holder') || h.includes('name'));
  let body = table.slice(1);
  if (emailCol < 0) {
    // No header row — detect the column that holds emails
    body = table;
    emailCol = table[0].findIndex(c => /@/.test(c));
    nameCol = emailCol === 0 ? 1 : 0;
  }
  return body
    .map(r => ({ name: (r[nameCol] ?? '').toString().trim(), email: (r[emailCol] ?? '').toString().trim() }))
    .filter(r => r.email);
}

async function parseFile(file: File): Promise<{ name: string; email: string }[]> {
  if (/\.xlsx$/i.test(file.name)) {
    const { readSheet } = await import('read-excel-file/browser');
    const table = await readSheet(file); // first sheet
    return toRows(table.map(r => r.map(c => (c == null ? '' : String(c)))));
  }
  const text = await file.text();
  return toRows(text.split(/\r?\n/).filter(l => l.trim()).map(splitCsv));
}

export default function ClientAccessPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = () =>
    fetch('/api/v1/admin/clients')
      .then(res => res.json())
      .then(json => {
        setClients(json.clients || []);
        setStats({ total: json.total || 0, active: json.active || 0 });
        setLoading(false);
      });

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? clients.filter(c => c.email.includes(q) || (c.name || '').toLowerCase().includes(q)) : clients;
  }, [clients, query]);

  const submitRows = async (rows: { name?: string; email: string }[]) => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch('/api/v1/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Import failed');
      const parts = [`${json.added} added`, `${json.updated} already on the list`];
      if (json.invalid?.length) parts.push(`${json.invalid.length} skipped (invalid email)`);
      setMessage({ ok: true, text: parts.join(' · ') });
      await load();
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const addOne = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitRows([{ name, email }]);
    setName('');
    setEmail('');
  };

  const importFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const rows = await parseFile(file);
      if (rows.length === 0) throw new Error('No rows with an email address were found in that file');
      await submitRows(rows);
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    }
  };

  const setActive = async (c: Client, isActive: boolean) => {
    await fetch(`/api/v1/admin/clients/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive }) });
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/v1/admin/clients/${id}`, { method: 'DELETE' });
    setConfirmDelete(null);
    load();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Client Access</h1>
            <p className="text-gray-400 mt-2 text-sm max-w-2xl">
              Only emails on this list can sign in with a one-time code (Login → Research &amp; tools). Upload your client list or add people one at a time.
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <div className="px-4 py-2 rounded-xl bg-[#151515] border border-[#2E2E3E]"><span className="text-gray-400">Approved</span> <span className="font-semibold ml-1">{stats.active}</span></div>
            <div className="px-4 py-2 rounded-xl bg-[#151515] border border-[#2E2E3E]"><span className="text-gray-400">Total</span> <span className="font-semibold ml-1">{stats.total}</span></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-[#2E2E3E] bg-[#0A0A0F] cursor-pointer hover:border-blue-500/60 transition-colors">
            <Upload className="w-8 h-8 text-gray-500 shrink-0" />
            <div>
              <div className="text-sm font-semibold">Upload Excel or CSV</div>
              <div className="text-xs text-gray-500 mt-1">A sheet with a <b>Name</b> and an <b>Email</b> column (.xlsx or .csv). Existing emails are kept, not duplicated.</div>
            </div>
            <input type="file" accept=".xlsx,.csv" className="hidden" disabled={busy}
              onChange={e => { importFile(e.target.files?.[0]); e.target.value = ''; }} />
          </label>

          <form onSubmit={addOne} className="p-5 rounded-2xl border border-[#2E2E3E] bg-[#0A0A0F] flex flex-wrap items-center gap-3">
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className={`${inputClass} flex-1 min-w-[140px]`} />
            <input placeholder="Email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className={`${inputClass} flex-1 min-w-[180px]`} />
            <button disabled={busy} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 disabled:opacity-50">
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>
        </div>

        {message && (
          <div className={`flex items-center gap-3 rounded-xl border p-4 text-sm ${message.ok ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
            {message.ok ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="bg-[#151515]/60 border border-[#2E2E3E]/50 rounded-2xl p-6 flex flex-col gap-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input placeholder="Search name or email" value={query} onChange={e => setQuery(e.target.value)} className={`${inputClass} w-full pl-9`} />
          </div>

          {loading ? (
            <p className="text-gray-400 py-12 text-center">Loading…</p>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <UserCheck className="w-10 h-10 mx-auto mb-3 text-gray-600" />
              {clients.length === 0 ? 'No approved clients yet — upload your client list to get started.' : 'No matches.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs uppercase bg-[#1E1E2E]/40 border-b border-[#2E2E3E]/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Access</th>
                    <th className="px-4 py-3 font-medium">Last sign-in</th>
                    <th className="px-4 py-3 font-medium text-right">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} className="border-b border-[#2E2E3E]/50 hover:bg-[#1E1E2E]/40">
                      <td className="px-4 py-3 text-white">{c.name || '—'}</td>
                      <td className="px-4 py-3">{c.email}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setActive(c, !c.isActive)}
                          className={`text-xs px-2.5 py-1 rounded-full border ${c.isActive ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-gray-500/15 text-gray-400 border-gray-500/30'}`}>
                          {c.isActive ? 'Approved' : 'Suspended'}
                        </button>
                      </td>
                      <td className="px-4 py-3">{c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Never'}</td>
                      <td className="px-4 py-3 text-right">
                        {confirmDelete === c.id ? (
                          <span className="inline-flex gap-2">
                            <button onClick={() => remove(c.id)} className="text-xs px-2 py-1 rounded bg-red-600 text-white">Remove</button>
                            <button onClick={() => setConfirmDelete(null)} className="text-xs px-2 py-1 rounded bg-[#1E1E2E]">Cancel</button>
                          </span>
                        ) : (
                          <button onClick={() => setConfirmDelete(c.id)} className="p-2 rounded-lg bg-[#1E1E2E] border border-[#2E2E3E] hover:bg-red-900/30" title="Remove">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
