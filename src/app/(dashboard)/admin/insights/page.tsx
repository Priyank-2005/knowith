"use client";

import React, { useState, useEffect } from 'react';
import { Plus, FileText, Image as ImageIcon, Trash2, Pencil, X, BookOpen, Eye, UploadCloud, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { uploadFile } from '@/lib/uploadClient';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

type InsightType = 'REPORT' | 'ARTICLE' | 'INFOGRAPHIC';

type Insight = {
  id: string;
  title: string;
  type: InsightType;
  description?: string;
  contentUrl?: string;
  contentBody?: string;
  thumbnailUrl?: string;
  publishedAt: string;
  isActive: boolean;
};

type ConvertStage = 'idle' | 'uploading' | 'converting' | 'done' | 'error';

const TYPE_META: Record<InsightType, { label: string; hint: string; icon: React.ReactNode }> = {
  REPORT: { label: 'PDF Report', hint: 'Upload a PDF — it is converted into a formatted research article', icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
  ARTICLE: { label: 'Written Article', hint: 'Write the article in the editor', icon: <FileText className="w-4 h-4 text-blue-400" /> },
  INFOGRAPHIC: { label: 'Infographic', hint: 'A single image shown in the insights carousel', icon: <ImageIcon className="w-4 h-4 text-green-400" /> },
};

const inputClass = 'w-full bg-[#0A0A0F] border border-[#2E2E3E] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500';
const fileClass = 'w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1E1E2E] file:text-white hover:file:bg-[#2A2A3A]';

export default function InsightsAdminPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [type, setType] = useState<InsightType>('REPORT');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentBody, setContentBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // PDF report conversion
  const [stage, setStage] = useState<ConvertStage>('idle');
  const [converted, setConverted] = useState<Insight | null>(null);

  const fetchInsights = () =>
    fetch('/api/v1/insights?all=1')
      .then(res => res.json())
      .then(data => setInsights(data.insights || []))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));

  useEffect(() => {
    fetchInsights();
  }, []);

  const resetForm = () => {
    setType('REPORT');
    setTitle('');
    setDescription('');
    setContentBody('');
    setFile(null);
    setThumbnail(null);
    setEditingInsight(null);
    setError(null);
    setStage('idle');
    setConverted(null);
  };

  const closeModal = () => {
    if (stage === 'uploading' || stage === 'converting') return;
    setIsModalOpen(false);
    resetForm();
    fetchInsights();
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = async (insight: Insight) => {
    resetForm();
    setEditingInsight(insight);
    setType(insight.type);
    setTitle(insight.title);
    setDescription(insight.description || '');
    setIsModalOpen(true);
    if (insight.type === 'ARTICLE') {
      // The list omits the body; load it for the editor
      const res = await fetch(`/api/v1/insights/${insight.id}?preview=1`);
      const data = await res.json();
      setContentBody(data.insight?.contentBody || '');
    }
  };

  const updateInsight = async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`/api/v1/insights/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Update failed');
    return json.insight as Insight;
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/v1/insights/${id}`, { method: 'DELETE' });
      setDeleteConfirmId(null);
      fetchInsights();
    } catch (e) {
      console.error(e);
    }
  };

  const togglePublished = async (insight: Insight) => {
    try {
      await updateInsight(insight.id, { isActive: !insight.isActive });
      fetchInsights();
    } catch (e) {
      console.error(e);
    }
  };

  /** Upload a PDF and convert it (new draft, or re-convert an existing report). */
  const convertPdf = async () => {
    if (!file) return;
    setError(null);
    try {
      setStage('uploading');
      const pdfUrl = await uploadFile(file, 'insights/pdf');
      setStage('converting');
      const res = await fetch('/api/v1/insights/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfUrl, insightId: editingInsight?.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Conversion failed');
      setConverted(json.insight);
      setEditingInsight(json.insight);
      setTitle(json.insight.title);
      setDescription(json.insight.description || '');
      setFile(null);
      setStage('done');
    } catch (e) {
      setError((e as Error).message);
      setStage('error');
    }
  };

  /** Save title/description/cover (and optionally publish) for a report. */
  const saveReport = async (publish?: boolean) => {
    const target = converted ?? editingInsight;
    if (!target) return;
    setSaving(true);
    setError(null);
    try {
      const thumbnailUrl = thumbnail ? await uploadFile(thumbnail, 'insights/covers') : undefined;
      await updateInsight(target.id, {
        title,
        description,
        ...(thumbnailUrl ? { thumbnailUrl } : {}),
        ...(publish !== undefined ? { isActive: publish } : {}),
      });
      setIsModalOpen(false);
      resetForm();
      fetchInsights();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'REPORT') {
      if (editingInsight) return saveReport();
      return convertPdf();
    }

    setSaving(true);
    setError(null);
    try {
      const contentUrl = file ? await uploadFile(file, 'insights/images') : undefined;
      const thumbnailUrl = thumbnail ? await uploadFile(thumbnail, 'insights/covers') : undefined;
      const payload = { title, type, description, contentBody, contentUrl, thumbnailUrl };

      const res = editingInsight
        ? await fetch(`/api/v1/insights/${editingInsight.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/v1/insights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');

      setIsModalOpen(false);
      resetForm();
      fetchInsights();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const busy = stage === 'uploading' || stage === 'converting';
  const reportReady = type === 'REPORT' && (stage === 'done' || (editingInsight && stage === 'idle'));

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              Insights
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Publish research reports, articles and infographics</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Insight
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#151515]/60 backdrop-blur-xl border border-[#2E2E3E]/50 rounded-2xl shadow-2xl overflow-hidden p-6 flex flex-col gap-6">
          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-400">Loading insights...</p>
              </div>
            ) : insights.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
                <p className="text-gray-400">No insights uploaded yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="text-xs uppercase bg-[#1E1E2E]/40 border-b border-[#2E2E3E]/50">
                    <tr>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Cover</th>
                      <th className="px-6 py-4 font-medium">Title</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insights.map((insight) => (
                      <tr key={insight.id} className="border-b border-[#2E2E3E]/50 hover:bg-[#1E1E2E]/40 transition-colors">
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            {TYPE_META[insight.type]?.icon}
                            {TYPE_META[insight.type]?.label ?? insight.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {(insight.thumbnailUrl || (insight.type === 'INFOGRAPHIC' && insight.contentUrl)) ? (
                            <img
                              src={insight.thumbnailUrl || insight.contentUrl}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover border border-[#2E2E3E]"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-[#1E1E2E] border border-[#2E2E3E] flex items-center justify-center">
                              <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{insight.title || '(untitled)'}</div>
                          {insight.description && <div className="truncate max-w-xs text-xs mt-1">{insight.description}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => togglePublished(insight)}
                            title={insight.isActive ? 'Click to unpublish' : 'Click to publish'}
                            className={`text-xs px-2.5 py-1 rounded-full border whitespace-nowrap ${insight.isActive
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}
                          >
                            {insight.isActive ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(insight.publishedAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {insight.type !== 'INFOGRAPHIC' && (
                              <a
                                href={`/insights/${insight.id}?preview=1`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-[#1E1E2E] border border-[#2E2E3E] hover:bg-[#2A2A3A] transition-colors"
                                title="Preview"
                              >
                                <Eye className="w-4 h-4 text-gray-300" />
                              </a>
                            )}
                            <button
                              onClick={() => openEditModal(insight)}
                              className="p-2 rounded-lg bg-[#1E1E2E] border border-[#2E2E3E] hover:bg-[#2A2A3A] transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4 text-blue-400" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(insight.id)}
                              className="p-2 rounded-lg bg-[#1E1E2E] border border-[#2E2E3E] hover:bg-red-900/30 hover:border-red-800/50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#151515] border border-[#2E2E3E] rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
            >
              <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Delete Insight?</h3>
              <p className="text-gray-400 text-sm mb-6">This action cannot be undone. The insight and its uploaded files will be permanently removed.</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1A1A24] border border-[#2E2E3E] hover:bg-[#252535] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#151515] border border-[#2E2E3E] rounded-2xl p-8 max-w-5xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingInsight && !converted ? 'Edit Insight' : 'Add New Insight'}
                </h3>
                <button onClick={closeModal} disabled={busy} className="p-1 rounded-lg hover:bg-[#2A2A3A] disabled:opacity-40">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                {/* Type picker (new insights only) */}
                {!editingInsight && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(Object.keys(TYPE_META) as InsightType[]).map(t => (
                      <button
                        key={t}
                        type="button"
                        disabled={busy}
                        onClick={() => { setType(t); setFile(null); setError(null); }}
                        className={`text-left p-4 rounded-xl border transition-colors ${type === t
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-[#2E2E3E] bg-[#0A0A0F] hover:border-[#3E3E4E]'}`}
                      >
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                          {TYPE_META[t].icon}
                          {TYPE_META[t].label}
                          {t === 'REPORT' && <span className="text-[10px] uppercase tracking-wider text-amber-400">Recommended</span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">{TYPE_META[t].hint}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* ── PDF report ── */}
                {type === 'REPORT' && !reportReady && (
                  <div className="space-y-4">
                    <label className="block border-2 border-dashed border-[#2E2E3E] rounded-xl p-8 text-center cursor-pointer hover:border-blue-500/60 transition-colors">
                      <UploadCloud className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                      <div className="text-sm text-white font-medium">{file ? file.name : 'Choose the report PDF'}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : 'Up to 30 MB. Text, tables, photos and charts are converted into a web article.'}
                      </div>
                      <input type="file" accept="application/pdf,.pdf" className="hidden" disabled={busy}
                        onChange={(e) => { setFile(e.target.files?.[0] || null); setStage('idle'); setError(null); }} />
                    </label>

                    {busy && (
                      <div className="rounded-xl border border-[#2E2E3E] bg-[#0A0A0F] p-5 space-y-3 text-sm">
                        <StageRow label="Uploading PDF" state={stage === 'uploading' ? 'active' : 'done'} />
                        <StageRow label="Reading pages, rebuilding tables & figures (1–2 minutes)" state={stage === 'converting' ? 'active' : 'pending'} />
                      </div>
                    )}
                  </div>
                )}

                {/* Converted / existing report: review details */}
                {reportReady && (
                  <div className="space-y-4">
                    {stage === 'done' && (
                      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          Converted and saved as a draft. Preview it, adjust the title or summary if needed, then publish.
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`/insights/${(converted ?? editingInsight)!.id}?preview=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#1E1E2E] border border-[#2E2E3E] hover:bg-[#2A2A3A]"
                      >
                        <Eye className="w-4 h-4" /> Preview article
                      </a>
                    </div>
                    <Field label="Title" required>
                      <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Summary (shown under the headline and on the card)">
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} h-24 resize-none`} />
                    </Field>
                    <Field label="Cover image (optional — replaces the photo picked from the PDF)">
                      <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className={fileClass} />
                    </Field>
                    {editingInsight && stage === 'idle' && (
                      <details className="rounded-xl border border-[#2E2E3E] bg-[#0A0A0F] p-4">
                        <summary className="cursor-pointer text-sm text-gray-300 flex items-center gap-2">
                          <RefreshCw className="w-4 h-4" /> Replace with an updated PDF
                        </summary>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <input type="file" accept="application/pdf,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className={fileClass} />
                          <button type="button" disabled={!file} onClick={convertPdf}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1E1E2E] border border-[#2E2E3E] hover:bg-[#2A2A3A] disabled:opacity-40">
                            Re-convert
                          </button>
                        </div>
                      </details>
                    )}
                  </div>
                )}

                {/* Re-convert in progress (editing an existing report) */}
                {type === 'REPORT' && editingInsight && busy && (
                  <div className="rounded-xl border border-[#2E2E3E] bg-[#0A0A0F] p-5 space-y-3 text-sm">
                    <StageRow label="Uploading PDF" state={stage === 'uploading' ? 'active' : 'done'} />
                    <StageRow label="Reading pages, rebuilding tables & figures (1–2 minutes)" state={stage === 'converting' ? 'active' : 'pending'} />
                  </div>
                )}

                {/* ── Written article / infographic ── */}
                {type !== 'REPORT' && (
                  <>
                    <Field label="Title" required={type === 'ARTICLE'}>
                      <input type="text" required={type === 'ARTICLE'} value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Short Description">
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief summary shown on the card..." className={`${inputClass} h-20 resize-none`} />
                    </Field>
                    {type === 'INFOGRAPHIC' ? (
                      <Field label={`Infographic Image${editingInsight ? ' (leave empty to keep current)' : ''}`}>
                        <input type="file" required={!editingInsight} accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className={fileClass} />
                      </Field>
                    ) : (
                      <>
                        <Field label={`Cover Image${editingInsight ? ' (leave empty to keep current)' : ''}`}>
                          <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className={fileClass} />
                        </Field>
                        <Field label="Article Content">
                          <div className="bg-white rounded-lg overflow-hidden text-black pb-10">
                            <Editor value={contentBody} onChange={setContentBody} className="h-[500px]" />
                          </div>
                        </Field>
                      </>
                    )}
                  </>
                )}

                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>{error}</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} disabled={busy}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1A1A24] border border-[#2E2E3E] hover:bg-[#252535] transition-colors disabled:opacity-40">
                    {stage === 'done' ? 'Close' : 'Cancel'}
                  </button>

                  {type === 'REPORT' && !reportReady && (
                    <button type="submit" disabled={!file || busy}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                      {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                      {busy ? 'Converting…' : 'Upload & Convert'}
                    </button>
                  )}

                  {reportReady && (
                    <>
                      <button type="button" disabled={saving} onClick={() => saveReport()}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1E1E2E] border border-[#2E2E3E] hover:bg-[#2A2A3A] disabled:opacity-50">
                        {(converted ?? editingInsight)?.isActive ? 'Save changes' : 'Save as draft'}
                      </button>
                      {!(converted ?? editingInsight)?.isActive && (
                        <button type="button" disabled={saving} onClick={() => saveReport(true)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
                          {saving ? 'Saving…' : 'Publish'}
                        </button>
                      )}
                    </>
                  )}

                  {type !== 'REPORT' && (
                    <button type="submit" disabled={saving}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                      {saving ? 'Saving...' : (editingInsight ? 'Update Insight' : 'Save Insight')}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function StageRow({ label, state }: { label: string; state: 'pending' | 'active' | 'done' }) {
  return (
    <div className={`flex items-center gap-3 ${state === 'pending' ? 'text-gray-600' : 'text-gray-200'}`}>
      {state === 'active' ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
        : state === 'done' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        : <div className="w-4 h-4 rounded-full border border-gray-700" />}
      {label}
    </div>
  );
}
