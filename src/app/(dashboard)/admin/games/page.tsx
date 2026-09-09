"use client";

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const ALL_GAMES = [
  { id: 'chapter1', title: 'Season Survivor' },
  { id: 'chapter2', title: 'Sequence Shuffle' },
  { id: 'chapter3', title: 'The Panic Room' },
  { id: 'chapter4', title: 'Unit Rapid Fire' },
  { id: 'chapter5', title: 'The Contrarian Signal' },
  { id: 'chapter6', title: 'Freedom Stack' },
  { id: 'chapter7', title: 'The Market Cap Challenge' },
  { id: 'chapter8', title: 'Match the Performers' },
  { id: 'global-returns', title: 'Global Asset Allocator' }
];

export default function GameConfigPage() {
  const [activeGames, setActiveGames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/v1/games/config')
      .then(res => res.json())
      .then(data => {
        if (data.activeGames) {
          setActiveGames(data.activeGames);
        } else {
          setActiveGames(ALL_GAMES.map(g => g.id));
        }
        setLoading(false);
      });
  }, []);

  const toggleGame = (id: string) => {
    setActiveGames(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/v1/games/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeGames }),
      });
      alert('Games updated successfully!');
    } catch (e) {
      console.error(e);
      alert('Error saving games');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              Education Games Rotation
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Select which games are currently active and visible to users.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>

        <div className="bg-[#151515]/60 backdrop-blur-xl border border-[#2E2E3E]/50 rounded-2xl p-6 flex flex-col gap-4">
          <p className="text-sm text-gray-400 mb-4">You have selected {activeGames.length} games to display.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALL_GAMES.map(game => {
              const isActive = activeGames.includes(game.id);
              return (
                <div 
                  key={game.id} 
                  onClick={() => toggleGame(game.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isActive 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-[#2E2E3E]/50 bg-[#1E1E2E]/40 hover:bg-[#2A2A3A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                      isActive ? 'bg-blue-500 border-blue-500' : 'border-gray-500'
                    }`}>
                      {isActive && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </div>
                    <span className="font-medium text-gray-200">{game.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
