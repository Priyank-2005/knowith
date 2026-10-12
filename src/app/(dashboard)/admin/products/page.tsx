"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Download, Eye, EyeOff, Pencil, Plus, Trash2, Upload, X, Package } from 'lucide-react';
import { PRODUCT_CATEGORIES, PRODUCT_FIELDS, type Product, type ProductCategory, type ProductInput } from '@/lib/products';

type Row = Product & { isActive: boolean };

const inputClass = 'w-full bg-[#0A0A0F] border border-[#2E2E3E] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500';

// ── Spreadsheet import ──────────────────────────────────────────

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

/** Maps a spreadsheet heading to one of our fields; tolerant of the wording people use. */
function headerToField(raw: string): keyof ProductInput | null {
  const h = raw.toLowerCase().replace(/[^a-z0-9% ]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!h) return null;
  if (/\b(1|one) ?y(ea)?r?\b|\b1 year\b/.test(h)) return 'return1y';
  if (/\b(3|three) ?y(ea)?r?\b|\b3 year\b/.test(h)) return 'return3y';
  if (/\b(5|five) ?y(ea)?r?\b|\b5 year\b/.test(h)) return 'return5y';
  if (/^(name|product|scheme|fund|strategy name|product name|scheme name|fund name)$/.test(h)) return 'name';
  if (/provider|amc|manager|house|company|issuer/.test(h)) return 'provider';
  if (/strateg|categor|type|style/.test(h)) return 'strategy';
  if (/min/.test(h)) return 'minInvestment';
  if (/aum|asset/.test(h)) return 'aum';
  if (/benchmark|index/.test(h)) return 'benchmark';
  if (/fee|expense|charge|cost/.test(h)) return 'fees';
  if (/note|remark|comment|description|about/.test(h)) return 'notes';
  if (/link|url|website|web/.test(h)) return 'url';
  if (/name/.test(h)) return 'name';
  return null;
}

function tableToRows(table: string[][]): ProductInput[] {
  if (table.length < 2) return [];
  const fields = table[0].map(headerToField);
  const claimed = new Set<string>();
  const columns = fields.map(f => {
    if (!f || claimed.has(f)) return null; // first matching column wins
    claimed.add(f);
    return f;
  });
  if (!claimed.has('name')) return [];
  return table.slice(1)
    .map(cells => {
      const row: ProductInput = {};
      columns.forEach((f, i) => { if (f) row[f] = (cells[i] ?? '').toString().trim(); });
      return row;
    })
    .filter(r => r.name);
}

async function parseFile(file: File): Promise<ProductInput[]> {
  if (/\.xlsx$/i.test(file.name)) {
    const { readSheet } = await import('read-excel-file/browser');
    const table = await readSheet(file); // first sheet
    return tableToRows(table.map(r => r.map(c => (c == null ? '' : String(c)))));
  }
  const text = await file.text();
  return tableToRows(text.split(/\r?\n/).filter(l => l.trim()).map(splitCsv));
}

function downloadTemplate(category: ProductCategory) {
  const headers = PRODUCT_FIELDS.map(f => f.header).join(',');
  const example = ['Example Strategy Fund', 'Example AMC', 'Equity Long-Short', '"₹10 lakh"', '12.5', '', '', '"₹1,250 Cr"', 'Nifty 500 TRI', '"1.5% p.a."', 'Short note shown in the table', 'https://example.com'].join(',');
  const blob = new Blob([`﻿${headers}\n${example}\n`], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${category.toLowerCase()}-products-template.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── Page ────────────────────────────────────────────────────────

const EMPTY: Record<string, string> = Object.fromEntries(PRODUCT_FIELDS.map(f => [f.key, '']));

export default function ProductsAdminPage() {
  const [category, setCategory] = useState<ProductCategory>('SIF');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null); // 'new' for the add form
  const [form, setForm] = useState<Record<string, string>>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');

  const meta = PRODUCT_CATEGORIES.find(c => c.id === category)!;

  const load = useCallback(async (cat: ProductCategory) => {
    try {
      const res = await fetch(`/api/v1/admin/products?category=${cat}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not load products');
      setRows(json.products || []);
    } catch (e) {
      setRows([]);
      setMessage({ ok: false, text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/v1/admin/products?category=${category}`)
      .then(async res => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Could not load products');
        return (json.products || []) as Row[];
      })
      .then(list => { if (!cancelled) setRows(list); })
      .catch(e => { if (!cancelled) { setRows([]); setMessage({ ok: false, text: (e as Error).message }); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [category]);

  const call = async (url: string, init: RequestInit, success?: string) => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json' } });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      if (success) setMessage({ ok: true, text: typeof success === 'string' ? success.replace('{added}', String(json.added ?? '')).replace('{skipped}', String(json.skipped ?? 0)) : '' });
      await load(category);
      return true;
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const switchCategory = (c: ProductCategory) => { setLoading(true); setCategory(c); setEditingId(null); setMessage(null); setConfirmDelete(null); };

  const startAdd = () => { setEditingId('new'); setForm(EMPTY); setMessage(null); };
  const startEdit = (r: Row) => {
    setEditingId(r.id);
    setForm(Object.fromEntries(PRODUCT_FIELDS.map(f => {
      const v = (r as unknown as Record<string, unknown>)[f.key];
      return [f.key, v === null || v === undefined ? '' : String(v)];
    })));
    setMessage(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = editingId === 'new'
      ? await call('/api/v1/admin/products', { method: 'POST', body: JSON.stringify({ category, product: form }) }, 'Product added.')
      : await call(`/api/v1/admin/products/${editingId}`, { method: 'PATCH', body: JSON.stringify({ product: form }) }, 'Product updated.');
    if (ok) setEditingId(null);
  };

  const importFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const parsed = await parseFile(file);
      if (parsed.length === 0) throw new Error('No rows with a Name column were found. Use “Download template” for the expected columns.');
      if (importMode === 'replace' && !window.confirm(`Replace all ${rows.length} existing ${meta.label} rows with these ${parsed.length}?`)) return;
      await call('/api/v1/admin/products', { method: 'POST', body: JSON.stringify({ category, rows: parsed, mode: importMode }) },
        importMode === 'replace' ? `List replaced — {added} products imported.` : `{added} products imported ({skipped} skipped).`);
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    }
  };

  const toggle = (r: Row) => call(`/api/v1/admin/products/${r.id}`, { method: 'PATCH', body: JSON.stringify({ isActive: !r.isActive }) });
  const remove = async (id: string) => {
    await call(`/api/v1/admin/products/${id}`, { method: 'DELETE' }, 'Product deleted.');
    setConfirmDelete(null);
  };

  const live = useMemo(() => rows.filter(r => r.isActive).length, [rows]);

  const formEl = (
    <form onSubmit={save} className="p-5 rounded-2xl border border-blue-500/40 bg-[#0A0A0F] flex flex-col gap-3">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRODUCT_FIELDS.map(f => (
          <div key={f.key} className={f.key === 'notes' ? 'sm:col-span-2 lg:col-span-3' : ''}>
            <label className="text-xs text-gray-400 mb-1 block">{f.header}{'required' in f && f.required ? ' *' : ''}</label>
            {f.key === 'notes' ? (
              <textarea rows={2} maxLength={1000} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className={inputClass} />
            ) : (
              <input
                required={'required' in f && f.required}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                className={inputClass}
                inputMode={f.key.startsWith('return') ? 'decimal' : undefined}
                placeholder={f.key.startsWith('return') ? 'e.g. 12.5' : f.key === 'url' ? 'https://…' : ''}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 rounded-lg text-sm bg-[#1E1E2E] border border-[#2E2E3E]">Cancel</button>
        <button disabled={busy} className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 disabled:opacity-50">
          {editingId === 'new' ? 'Add product' : 'Save changes'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Products</h1>
            <p className="text-gray-400 mt-2 text-sm max-w-2xl">
              Curated lists for the Indian Market page (Markets → Indian Market → SIF / Gift City / PMS). There is no free data feed for these, so add them here or upload an Excel/CSV sheet.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#151515] border border-[#2E2E3E] text-sm">
            <span className="text-gray-400">Live on site</span> <span className="font-semibold ml-1">{live}</span>
            <span className="text-gray-600"> / {rows.length}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist">
          {PRODUCT_CATEGORIES.map(c => (
            <button key={c.id} role="tab" aria-selected={c.id === category} onClick={() => switchCategory(c.id)}
              className={`px-4 py-2 rounded-full text-sm border ${c.id === category ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-[#151515] border-[#2E2E3E] text-gray-400 hover:text-white'}`}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border-2 border-dashed border-[#2E2E3E] bg-[#0A0A0F] flex flex-col gap-3">
            <label className="flex items-center gap-4 cursor-pointer">
              <Upload className="w-8 h-8 text-gray-500 shrink-0" />
              <div>
                <div className="text-sm font-semibold">Upload Excel or CSV for {meta.label}</div>
                <div className="text-xs text-gray-500 mt-1">First row = headings. Only <b>Name</b> is required; other columns are optional.</div>
              </div>
              <input type="file" accept=".xlsx,.csv" className="hidden" disabled={busy}
                onChange={e => { importFile(e.target.files?.[0]); e.target.value = ''; }} />
            </label>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <label className="inline-flex items-center gap-1.5"><input type="radio" checked={importMode === 'append'} onChange={() => setImportMode('append')} /> Add to the list</label>
              <label className="inline-flex items-center gap-1.5"><input type="radio" checked={importMode === 'replace'} onChange={() => setImportMode('replace')} /> Replace the whole list</label>
              <button type="button" onClick={() => downloadTemplate(category)} className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 ml-auto"><Download className="w-3.5 h-3.5" /> Download template</button>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-[#2E2E3E] bg-[#0A0A0F] flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">{meta.full}</div>
              <div className="text-xs text-gray-500 mt-1">Add or correct a single product by hand.</div>
            </div>
            {editingId === null && (
              <button onClick={startAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 shrink-0">
                <Plus className="w-4 h-4" /> Add product
              </button>
            )}
          </div>
        </div>

        {message && (
          <div className={`flex items-center gap-3 rounded-xl border p-4 text-sm ${message.ok ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
            {message.ok ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="flex-1">{message.text}</span>
            <button onClick={() => setMessage(null)} aria-label="Dismiss"><X className="w-4 h-4" /></button>
          </div>
        )}

        {editingId === 'new' && formEl}

        <div className="bg-[#151515]/60 border border-[#2E2E3E]/50 rounded-2xl p-4 sm:p-6">
          {loading ? (
            <p className="text-gray-400 py-12 text-center">Loading…</p>
          ) : rows.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Package className="w-10 h-10 mx-auto mb-3 text-gray-600" />
              No {meta.label} products yet — the public page shows a “we are curating this list” message until you add some.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {rows.map(r => (
                editingId === r.id ? <div key={r.id}>{formEl}</div> : (
                  <div key={r.id} className={`flex gap-3 p-4 rounded-xl border border-[#2E2E3E] bg-[#0A0A0F] ${r.isActive ? '' : 'opacity-60'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{r.name}{r.provider ? <span className="text-gray-500 font-normal"> · {r.provider}</span> : null}</div>
                      <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                        {r.strategy && <span>{r.strategy}</span>}
                        {r.minInvestment && <span>Min {r.minInvestment}</span>}
                        {r.return1y !== null && <span>1Y {r.return1y}%</span>}
                        {r.return3y !== null && <span>3Y {r.return3y}%</span>}
                        {r.return5y !== null && <span>5Y {r.return5y}%</span>}
                        {r.aum && <span>AUM {r.aum}</span>}
                        {r.fees && <span>Fees {r.fees}</span>}
                      </div>
                      {!r.isActive && <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-gray-500/15 text-gray-400 border border-gray-500/30">Hidden from the site</span>}
                    </div>
                    <div className="flex items-start gap-1.5 shrink-0">
                      {confirmDelete === r.id ? (
                        <span className="inline-flex gap-2">
                          <button onClick={() => remove(r.id)} className="text-xs px-2 py-1 rounded bg-red-600 text-white">Delete</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-xs px-2 py-1 rounded bg-[#1E1E2E]">Cancel</button>
                        </span>
                      ) : (
                        <>
                          <button onClick={() => toggle(r)} title={r.isActive ? 'Hide from site' : 'Show on site'} className="p-2 rounded-lg bg-[#1E1E2E] border border-[#2E2E3E] hover:border-blue-500">
                            {r.isActive ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                          </button>
                          <button onClick={() => startEdit(r)} title="Edit" className="p-2 rounded-lg bg-[#1E1E2E] border border-[#2E2E3E] hover:border-blue-500"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => setConfirmDelete(r.id)} title="Delete" className="p-2 rounded-lg bg-[#1E1E2E] border border-[#2E2E3E] hover:bg-red-900/30"><Trash2 className="w-4 h-4 text-red-400" /></button>
                        </>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
