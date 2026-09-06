"use client";

import React, { useState, useEffect } from 'react';
import { Plus, FileText, Image as ImageIcon, Trash2, Pencil, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

type Insight = {
  id: string;
  title: string;
  type: string;
  description?: string;
  contentUrl?: string;
  contentBody?: string;
  thumbnailUrl?: string;
  publishedAt: string;
};

export default function InsightsAdminPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('ARTICLE');
  const [description, setDescription] = useState('');
  const [contentBody, setContentBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [extractingText, setExtractingText] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await fetch('/api/v1/insights');
      const data = await res.json();
      setInsights(data.insights || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setType('ARTICLE');
    setDescription('');
    setContentBody('');
    setFile(null);
    setThumbnail(null);
    setEditingInsight(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (insight: Insight) => {
    setEditingInsight(insight);
    setTitle(insight.title);
    setType(insight.type);
    setDescription(insight.description || '');
    setContentBody(insight.contentBody || '');
    setFile(null);
    setThumbnail(null);
    setIsModalOpen(true);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('description', description);
    formData.append('contentBody', contentBody);
    if (file) formData.append('file', file);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    try {
      const url = editingInsight 
        ? `/api/v1/insights/${editingInsight.id}` 
        : '/api/v1/insights';
      const method = editingInsight ? 'PUT' : 'POST';
      
      await fetch(url, { method, body: formData });
      setIsModalOpen(false);
      resetForm();
      fetchInsights();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              Insights
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Manage articles and infographics</p>
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
                      <th className="px-6 py-4 font-medium">Thumbnail</th>
                      <th className="px-6 py-4 font-medium">Title</th>
                      <th className="px-6 py-4 font-medium">Description</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insights.map((insight) => (
                      <tr key={insight.id} className="border-b border-[#2E2E3E]/50 hover:bg-[#1E1E2E]/40 transition-colors">
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2">
                            {insight.type === 'ARTICLE' ? <FileText className="w-4 h-4 text-blue-400" /> : <ImageIcon className="w-4 h-4 text-green-400" />}
                            {insight.type}
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
                        <td className="px-6 py-4 font-medium text-white">{insight.title}</td>
                        <td className="px-6 py-4 truncate max-w-xs">{insight.description}</td>
                        <td className="px-6 py-4">{new Date(insight.publishedAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {editingInsight ? 'Edit Insight' : 'Add New Insight'}
                </h3>
                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="p-1 rounded-lg hover:bg-[#2A2A3A]">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Title {type === 'ARTICLE' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    required={type === 'ARTICLE'}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-[#2E2E3E] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-[#2E2E3E] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ARTICLE">Article (PDF)</option>
                    <option value="INFOGRAPHIC">Infographic (Image)</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Short Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief summary shown on the card..."
                    className="w-full bg-[#0A0A0F] border border-[#2E2E3E] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 h-20 resize-none"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    {type === 'ARTICLE' ? 'PDF File' : 'Infographic Image'}
                    {editingInsight ? ' (leave empty to keep current)' : ''}
                  </label>
                  <input
                    type="file"
                    required={!editingInsight}
                    accept={type === 'ARTICLE' ? '.pdf' : 'image/*'}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1E1E2E] file:text-white hover:file:bg-[#2A2A3A]"
                  />
                  {type === 'ARTICLE' && (
                    <p className="text-xs text-gray-500 mt-1">Text will be automatically extracted from the PDF for the article page.</p>
                  )}
                </div>

                {/* Thumbnail Upload (Articles only) */}
                {type === 'ARTICLE' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Thumbnail Image (for the card)
                      {editingInsight ? ' (leave empty to keep current)' : ''}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1E1E2E] file:text-white hover:file:bg-[#2A2A3A]"
                    />
                  </div>
                )}

                {/* Content Body (Articles only) */}
                {type === 'ARTICLE' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Article Content
                      <span className="text-gray-600 font-normal ml-1">(auto-extracted from PDF, editable)</span>
                    </label>
                    <div className="bg-white rounded-lg overflow-hidden text-black pb-10">
                      <Editor 
                        value={contentBody}
                        onChange={setContentBody}
                        className="h-[500px]"
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => { setIsModalOpen(false); resetForm(); }}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1A1A24] border border-[#2E2E3E] hover:bg-[#252535] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : (editingInsight ? 'Update Insight' : 'Save Insight')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
