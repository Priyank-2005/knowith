"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Insight = {
  id: string;
  title: string;
  type: string;
  description?: string;
  contentUrl?: string;
  publishedAt: string;
};

export default function InsightsAdminPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('ARTICLE');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('description', description);
    if (file) {
      formData.append('file', file);
    }

    try {
      await fetch('/api/v1/insights', {
        method: 'POST',
        body: formData,
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setFile(null);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              Insights
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Manage articles and infographics</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Insight
          </button>
        </div>

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
                        <td className="px-6 py-4 font-medium text-white">{insight.title}</td>
                        <td className="px-6 py-4 truncate max-w-xs">{insight.description}</td>
                        <td className="px-6 py-4">{new Date(insight.publishedAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                           {insight.contentUrl && (
                             <a href={insight.contentUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                               View File
                             </a>
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
              className="bg-[#151515] border border-[#2E2E3E] rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-4">Add New Insight</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-[#2E2E3E] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-[#2E2E3E] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">File (PDF/Image)</label>
                  <input
                    type="file"
                    required
                    accept={type === 'ARTICLE' ? '.pdf' : 'image/*'}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1E1E2E] file:text-white hover:file:bg-[#2A2A3A]"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1A1A24] border border-[#2E2E3E] hover:bg-[#252535] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {saving ? 'Uploading...' : 'Save Insight'}
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
