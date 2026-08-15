'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GameHeader from '@/components/GameHeader';
import { motion } from 'framer-motion';

export default function Leaderboard() {
  const [topScores, setTopScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/v1/games/leaderboard');
        if (res.ok) {
          const data = await res.json();
          setTopScores(data);
        }
      } catch (error) {
        console.error('Failed to load leaderboard', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <>
      <GameHeader />
      <div style={{ backgroundColor: '#f1efdf', minHeight: '100vh', padding: '4rem 2rem', fontFamily: "'Times New Roman', Times, serif" }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#1a1a1a', margin: '0 0 1rem 0' }}>The Unit Vault Leaderboard</h1>
            <p style={{ fontSize: '1.2rem', color: '#4a4a4a', fontFamily: 'var(--font-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Top 10 Investors
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.2)', padding: '2rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Loading scores...</div>
            ) : topScores.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No scores recorded yet. Be the first!</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #1a1a1a' }}>
                    <th style={{ textAlign: 'left', padding: '1rem', fontFamily: 'var(--font-mono), monospace', fontSize: '0.85rem', textTransform: 'uppercase' }}>Rank</th>
                    <th style={{ textAlign: 'left', padding: '1rem', fontFamily: 'var(--font-mono), monospace', fontSize: '0.85rem', textTransform: 'uppercase' }}>Player Name</th>
                    <th style={{ textAlign: 'right', padding: '1rem', fontFamily: 'var(--font-mono), monospace', fontSize: '0.85rem', textTransform: 'uppercase' }}>Total Vault Units</th>
                  </tr>
                </thead>
                <tbody>
                  {topScores.map((score, index) => (
                    <motion.tr 
                      key={score.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{ 
                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                        backgroundColor: index === 0 ? 'rgba(255,201,74,0.1)' : index === 1 ? 'rgba(143,163,200,0.1)' : index === 2 ? 'rgba(184,59,59,0.05)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '1rem', fontSize: '1.2rem', fontWeight: index < 3 ? 'bold' : 'normal' }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '1.2rem', fontWeight: index < 3 ? 'bold' : 'normal' }}>
                        {score.playerName}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'right', color: '#b83b3b' }}>
                        {score.totalScore.toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
