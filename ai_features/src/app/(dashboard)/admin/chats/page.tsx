"use client";

import { useState, useEffect } from 'react';
import { Headphones, Target, ShieldCheck, PieChart, Activity, Search, User, Clock, MessageSquare } from 'lucide-react';

const formatTime = (date: any) => new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(date));
const formatShortDate = (date: any) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(date));
const formatLongDate = (date: any) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(date));

const FEATURES = [
  { id: 'ALL', name: 'All Chats', icon: MessageSquare },
  { id: 'SUPPORT', name: 'Support Assistant', icon: Headphones },
  { id: 'ADVISOR', name: 'Investment Advisor', icon: Target },
  { id: 'TAX', name: 'Tax Advisor', icon: ShieldCheck },
  { id: 'PORTFOLIO', name: 'Portfolio Analyzer', icon: PieChart },
  { id: 'HEALTH', name: 'Financial Health', icon: Activity },
];

export default function ChatLogsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedFeature, setSelectedFeature] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  useEffect(() => {
    fetchSessions();
  }, [selectedFeature]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const url = selectedFeature === 'ALL' 
        ? '/api/v1/admin/chats' 
        : `/api/v1/admin/chats?feature=${selectedFeature}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions);
        setSelectedSession(null);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar / Filters */}
      <div className="w-64 border-r border-[#1F1F1F] bg-[#0A0A0A] p-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold mb-4 text-white">Chat Logs</h2>
        {FEATURES.map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedFeature(f.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selectedFeature === f.id ? 'bg-[#1E1E2E] text-blue-400 border border-[#2E2E3E]' : 'text-gray-400 hover:text-white hover:bg-[#111118]'
            }`}
          >
            <f.icon className="w-4 h-4" />
            {f.name}
          </button>
        ))}
      </div>

      {/* Session List */}
      <div className="w-80 border-r border-[#1F1F1F] bg-[#0A0A0A] flex flex-col">
        <div className="p-4 border-b border-[#1F1F1F]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search sessions..." 
              className="w-full bg-[#111118] border border-[#1F1F1F] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#2E2E3E]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="text-gray-500 text-sm p-4 text-center">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="text-gray-500 text-sm p-4 text-center">No chats found for this feature.</div>
          ) : (
            sessions.map((s: any) => (
              <div 
                key={s.id}
                onClick={() => setSelectedSession(s)}
                className={`p-3 rounded-lg cursor-pointer mb-2 border transition-all ${
                  selectedSession?.id === s.id ? 'bg-[#111118] border-blue-500/30' : 'border-transparent hover:bg-[#111118] hover:border-[#1F1F1F]'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-semibold text-blue-400">{s.feature}</span>
                  <span className="text-[10px] text-gray-500">{formatShortDate(s.updatedAt)}</span>
                </div>
                <div className="text-sm text-gray-300 font-medium truncate mb-1">
                  {s.user?.name || s.user?.email || 'Anonymous User'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {s.messages.length > 0 ? s.messages[s.messages.length - 1].content : 'Empty session'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message View */}
      <div className="flex-1 bg-[#050505] flex flex-col h-full">
        {selectedSession ? (
          <>
            <div className="p-4 border-b border-[#1F1F1F] bg-[#0A0A0A] flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-white font-medium">Session ID: <span className="text-gray-400 font-mono text-xs">{selectedSession.id}</span></h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><User className="w-3 h-3"/> {selectedSession.user?.email || 'Anonymous'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> Started: {formatLongDate(selectedSession.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {selectedSession.messages.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-[#1A1A24] text-gray-200 border border-[#2E2E3E] rounded-bl-none'
                  }`}>
                    <div className="text-xs opacity-50 mb-1 flex justify-between">
                      <span>{msg.role === 'user' ? 'User' : 'Knowith AI'}</span>
                      <span>{formatTime(msg.createdAt)}</span>
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              {selectedSession.messages.length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No messages in this session.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a session to view the chat history</p>
          </div>
        )}
      </div>
    </div>
  );
}
