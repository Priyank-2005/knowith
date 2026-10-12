"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Eye, EyeOff, HelpCircle, Pencil, Plus, Trash2, X } from 'lucide-react';

type Faq = { id: string; question: string; answer: string; sortOrder: number; isActive: boolean };

const inputClass = 'w-full bg-[#0A0A0F] border border-[#2E2E3E] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500';
const MAX_QUESTION = 300;
const MAX_ANSWER = 2000;

export default function FaqAdminPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null); // 'new' for the add form
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/faqs');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not load questions');
      setFaqs(json.faqs || []);
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/v1/admin/faqs')
      .then(async res => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Could not load questions');
        return (json.faqs || []) as Faq[];
      })
      .then(list => { if (!cancelled) setFaqs(list); })
      .catch(e => { if (!cancelled) setMessage({ ok: false, text: (e as Error).message }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const call = async (url: string, init: RequestInit, success?: string) => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json' } });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      if (success) setMessage({ ok: true, text: success });
      await load();
      return true;
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const startAdd = () => { setEditingId('new'); setQuestion(''); setAnswer(''); setMessage(null); };
  const startEdit = (f: Faq) => { setEditingId(f.id); setQuestion(f.question); setAnswer(f.answer); setMessage(null); };
  const cancelEdit = () => setEditingId(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = editingId === 'new'
      ? await call('/api/v1/admin/faqs', { method: 'POST', body: JSON.stringify({ question, answer }) }, 'Question added — it is live on the homepage.')
      : await call(`/api/v1/admin/faqs/${editingId}`, { method: 'PATCH', body: JSON.stringify({ question, answer }) }, 'Question updated.');
    if (ok) setEditingId(null);
  };

  const move = (index: number, delta: -1 | 1) => {
    const next = [...faqs];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setFaqs(next); // optimistic; reloaded after the save
    call('/api/v1/admin/faqs', { method: 'POST', body: JSON.stringify({ order: next.map(f => f.id) }) });
  };

  const toggle = (f: Faq) =>
    call(`/api/v1/admin/faqs/${f.id}`, { method: 'PATCH', body: JSON.stringify({ isActive: !f.isActive }) });

  const remove = async (id: string) => {
    await call(`/api/v1/admin/faqs/${id}`, { method: 'DELETE' }, 'Question deleted.');
    setConfirmDelete(null);
  };

  const importDefaults = () =>
    call('/api/v1/admin/faqs', { method: 'POST', body: JSON.stringify({ seedDefaults: true }) }, 'Starter questions imported — edit them to suit.');

  const form = (
    <form onSubmit={save} className="p-5 rounded-2xl border border-blue-500/40 bg-[#0A0A0F] flex flex-col gap-3">
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Question</label>
        <input required maxLength={MAX_QUESTION} value={question} onChange={e => setQuestion(e.target.value)} className={inputClass} placeholder="e.g. Should I invest a lump sum now or start a SIP?" />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Answer <span className="text-gray-600">({answer.length}/{MAX_ANSWER}) — keep it short; a “book a consultation” link is added automatically</span></label>
        <textarea required maxLength={MAX_ANSWER} rows={4} value={answer} onChange={e => setAnswer(e.target.value)} className={inputClass} />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded-lg text-sm bg-[#1E1E2E] border border-[#2E2E3E]">Cancel</button>
        <button disabled={busy} className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 disabled:opacity-50">
          {editingId === 'new' ? 'Add question' : 'Save changes'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">FAQs</h1>
            <p className="text-gray-400 mt-2 text-sm max-w-2xl">
              The “Investors are asking” box on the homepage. Add as many questions as you like — the box scrolls. Changes appear on the site within a minute.
            </p>
          </div>
          {editingId === null && (
            <button onClick={startAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600">
              <Plus className="w-4 h-4" /> Add question
            </button>
          )}
        </div>

        {message && (
          <div className={`flex items-center gap-3 rounded-xl border p-4 text-sm ${message.ok ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
            {message.ok ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="flex-1">{message.text}</span>
            <button onClick={() => setMessage(null)} aria-label="Dismiss"><X className="w-4 h-4" /></button>
          </div>
        )}

        {editingId === 'new' && form}

        <div className="bg-[#151515]/60 border border-[#2E2E3E]/50 rounded-2xl p-4 sm:p-6 flex flex-col gap-3">
          {loading ? (
            <p className="text-gray-400 py-12 text-center">Loading…</p>
          ) : faqs.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <HelpCircle className="w-10 h-10 mx-auto mb-3 text-gray-600" />
              <p>No custom questions yet — the homepage is showing the built-in starter set.</p>
              <p className="text-xs text-gray-500 mt-1">Adding your first question replaces the starter set, so import it first if you want to keep any of it.</p>
              <button onClick={importDefaults} disabled={busy} className="mt-4 px-4 py-2 rounded-lg text-sm bg-[#1E1E2E] border border-[#2E2E3E] hover:border-blue-500 disabled:opacity-50">
                Import the starter questions to edit them
              </button>
            </div>
          ) : (
            faqs.map((f, i) => (
              editingId === f.id ? <div key={f.id}>{form}</div> : (
                <div key={f.id} className={`flex gap-3 p-4 rounded-xl border bg-[#0A0A0F] ${f.isActive ? 'border-[#2E2E3E]' : 'border-[#2E2E3E] opacity-60'}`}>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button disabled={i === 0 || busy} onClick={() => move(i, -1)} className="p-1.5 rounded bg-[#1E1E2E] border border-[#2E2E3E] disabled:opacity-30" aria-label="Move up"><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button disabled={i === faqs.length - 1 || busy} onClick={() => move(i, 1)} className="p-1.5 rounded bg-[#1E1E2E] border border-[#2E2E3E] disabled:opacity-30" aria-label="Move down"><ArrowDown className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{f.question}</div>
                    <p className="text-sm text-gray-400 mt-1 whitespace-pre-line">{f.answer}</p>
                    {!f.isActive && <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-gray-500/15 text-gray-400 border border-gray-500/30">Hidden from the site</span>}
                  </div>
                  <div className="flex items-start gap-1.5 shrink-0">
                    {confirmDelete === f.id ? (
                      <span className="inline-flex gap-2">
                        <button onClick={() => remove(f.id)} className="text-xs px-2 py-1 rounded bg-red-600 text-white">Delete</button>
                        <button onClick={() => setConfirmDelete(null)} className="text-xs px-2 py-1 rounded bg-[#1E1E2E]">Cancel</button>
                      </span>
                    ) : (
                      <>
                        <button onClick={() => toggle(f)} title={f.isActive ? 'Hide from site' : 'Show on site'} className="p-2 rounded-lg bg-[#1E1E2E] border border-[#2E2E3E] hover:border-blue-500">
                          {f.isActive ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                        </button>
                        <button onClick={() => startEdit(f)} title="Edit" className="p-2 rounded-lg bg-[#1E1E2E] border border-[#2E2E3E] hover:border-blue-500"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setConfirmDelete(f.id)} title="Delete" className="p-2 rounded-lg bg-[#1E1E2E] border border-[#2E2E3E] hover:bg-red-900/30"><Trash2 className="w-4 h-4 text-red-400" /></button>
                      </>
                    )}
                  </div>
                </div>
              )
            ))
          )}
        </div>
      </div>
    </div>
  );
}
