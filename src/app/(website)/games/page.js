'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import React from 'react';
import { GameProvider, useGameState } from '@/lib/games/gameState';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const chapters = [
  {
    id: 'chapter1',
    num: '01',
    title: 'Season Survivor',
    desc: '10 years. 1 decision per year. Can you hold through the winters?',
    href: '/games/season-survivor',
    color: '#45D483' // spring green
  },
  {
    id: 'chapter2',
    num: '02',
    title: 'Sequence Shuffle',
    desc: '5 returns, you choose the order. Learn how sequence matters.',
    href: '/games/sequence-shuffle',
    color: '#FFC94A' // summer gold
  },
  {
    id: 'chapter3',
    num: '03',
    title: 'The Panic Room',
    desc: '6 real crises, 12 seconds each. Do you hit sell?',
    href: '/games/panic-room',
    color: '#FF5F73' // winter red
  },
  {
    id: 'chapter4',
    num: '04',
    title: 'Unit Rapid Fire',
    desc: '10 questions, 15 seconds each. Test your market mechanics.',
    href: '/games/rapid-fire',
    color: '#8FA3C8' // autumn blue-grey
  },
  {
    id: 'chapter5',
    num: '05',
    title: 'The Contrarian Signal',
    desc: 'Read real market extreme headlines, make a call, see what happened next.',
    href: '/games/contrarian-signal',
    color: '#3B82F6' // royal blue
  },
  {
    id: 'chapter6',
    num: '06',
    title: 'Freedom Stack',
    desc: '120 seconds. Sort financial situations into 5 pillars. Build your freedom floor.',
    href: '/games/freedom-stack',
    color: '#F59E0B' // amber gold
  },
  {
    id: 'chapter7',
    num: '07',
    title: 'The Market Cap Challenge',
    desc: '20-year market memory game. Guess each year\'s winning cap and watch ₹1 lakh a year grow.',
    href: '/games/market-cap-challenge',
    color: '#9C27B0' // purple
  },
  {
    id: 'chapter8',
    num: '08',
    title: 'Match the Performers',
    desc: 'The past is on the left. Place your forecast on the right. Nine funds, nine returns, and one revealing lesson about repeatability.',
    href: '/games/match-performers',
    color: '#2e7d32' // green
  }
];

function HubContent() {
  const { getTotalScore, scores, resetGame, playerName, setPlayerName } = useGameState();
  const allCompleted = scores.chapter1 !== null && scores.chapter2 !== null && scores.chapter3 !== null && scores.chapter4 !== null && scores.chapter5 !== null && scores.chapter6 !== null && scores.chapter7 !== null && scores.chapter8 !== null;

  const [tempName, setTempName] = React.useState('');

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setPlayerName(tempName.trim());
    }
  };

  return (
    <>
      <Navbar />
      
      <main className={styles.hubMain}>
        <motion.section 
          className={styles.hero}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className={styles.subtitle}>An Investor Almanac by Knowith Capital</motion.div>
          <motion.h1 variants={fadeInUp} className={styles.title}>The Unit Vault</motion.h1>
          <motion.div variants={fadeInUp} className={styles.tagline}>Four seasons. One habit.</motion.div>
          <motion.blockquote variants={fadeInUp} className={styles.quote}>
            "Wealth in a SIP is not built by the returns you get. It is built by the units you own when the returns finally arrive."
          </motion.blockquote>

          <motion.div variants={fadeInUp} className={styles.vaultCounter}>
            <div className={styles.vaultLabel}>Total Score</div>
            <div className={styles.vaultValue}>{getTotalScore().toLocaleString()}</div>
            
            {playerName ? (
              <div style={{ marginTop: '1rem', color: 'var(--slate)', fontSize: '0.9rem' }}>
                Playing as: <strong>{playerName}</strong>
              </div>
            ) : (
              <form onSubmit={handleNameSubmit} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter your name to join Leaderboard"
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: 'transparent', color: '#fff' }}
                  required
                />
                <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '4px', background: '#b83b3b', color: '#fff', border: 'none', cursor: 'pointer' }}>
                  Save Name
                </button>
              </form>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <Link href="/games/leaderboard" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#FFC94A', border: 'none', color: '#000', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 'bold' }}>
                  View Leaderboard
                </button>
              </Link>
              {getTotalScore() > 0 && (
                <button 
                  onClick={resetGame} 
                  style={{ background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--slate)', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.9rem', cursor: 'pointer' }}
                  title="Restart your session progress"
                >
                  Reset Progress
                </button>
              )}
            </div>
          </motion.div>
        </motion.section>

        <section className={styles.chaptersSection}>
          <div className={styles.chaptersGrid}>
            {chapters.map((chapter, i) => {
              const isComplete = scores[chapter.id] !== null;
              const score = scores[chapter.id];

              return (
                <motion.div 
                  key={chapter.id}
                  className={styles.chapterCard}
                  style={{ borderTop: `4px solid ${chapter.color}` }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={styles.chapterNum}>Chapter {chapter.num}</div>
                  <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                  <p className={styles.chapterDesc}>{chapter.desc}</p>
                  
                  <div className={styles.chapterAction}>
                    {isComplete ? (
                      <div className={styles.completedBadge}>
                        Completed ✓ (Score: {score})
                      </div>
                    ) : (
                      <Link href={chapter.href} className={styles.playButton}>
                        Play Chapter
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            className={styles.finalScorecard}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3>Final Scorecard</h3>
            <p>Complete all chapters to unlock your investor profile.</p>
            {allCompleted ? (
              <button className={styles.revealButton}>Reveal Your Investor DNA</button>
            ) : (
              <button className={styles.lockedButton} disabled>Locked (Complete all chapters)</button>
            )}
          </motion.div>
        </section>
      </main>

      <div className={styles.disclaimer}>
        AMFI Registered Mutual Fund Distributor. Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
      </div>
      <Footer />
    </>
  );
}

export default function GamesHub() {
  return <HubContent />;
}
