'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useGameState } from '@/lib/games/gameState';
import styles from './page.module.css';

export default function Scorecard() {
  const router = useRouter();
  const { scores, vaultUnits, resetGames } = useGameState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If not all completed, normally we would redirect, but for dev we might just show it.
    // Uncomment to enforce:
    /*
    if (!scores.chapter1 || !scores.chapter2 || !scores.chapter3 || !scores.chapter4 || !scores.chapter5) {
      router.push('/games');
    }
    */
  }, [scores, router]);

  if (!mounted) return null;

  // Calculate Average
  const allCompleted = scores.chapter1 !== null && 
                       scores.chapter2 !== null && 
                       scores.chapter3 !== null && 
                       scores.chapter4 !== null &&
                       scores.chapter5 !== null;
  const allScores = [scores.chapter1, scores.chapter2, scores.chapter3, scores.chapter4, scores.chapter5].filter(s => s !== null);
  const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

  // DNA Rank
  let dnaRank = 'Panic Prone';
  if (avgScore >= 90) dnaRank = 'Unit Master';
  else if (avgScore >= 75) dnaRank = 'Disciplined Compounder';
  else if (avgScore >= 50) dnaRank = 'Steady SIPper';
  else if (avgScore >= 30) dnaRank = 'Fair-Weather Investor';

  const copyResult = () => {
    const text = `I just discovered my Investor DNA is "${dnaRank}" on The Unit Games!\nAverage Score: ${avgScore}/100\nVault Units Earned: ${vaultUnits}\nPlay now!`;
    navigator.clipboard.writeText(text);
    alert('Result copied to clipboard!');
  };

  const restart = () => {
    resetGame();
    router.push('/games'); // Assuming hub is at /games
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Your Investor DNA</h1>
          
          <div className={styles.dnaBadge}>
            {dnaRank}
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCol}>
              <span className={styles.statLabel}>Average Score</span>
              <span className={styles.statValue}>{avgScore}/100</span>
            </div>
            <div className={styles.statCol}>
              <span className={styles.statLabel}>Total Vault Units</span>
              <span className={styles.statValue} style={{color: 'var(--gold)'}}>{vaultUnits}</span>
            </div>
          </div>
          
          <div className={styles.lessonsArea}>
            <h2 className={styles.lessonsTitle}>5 Golden Lessons Unlocked</h2>
            <ul className={styles.lessonList}>
              <li className={styles.lessonItem}>
                <strong>1. The NAV Illusion:</strong> High NAV doesn't mean expensive. Low NAV doesn't mean cheap. It's about growth percentage.
              </li>
              <li className={styles.lessonItem}>
                <strong>2. Sequence of Returns:</strong> When you're buying via SIP, you want market crashes early. Accumulate cheap units!
              </li>
              <li className={styles.lessonItem}>
                <strong>3. Emotional Discipline:</strong> Panic selling during a crisis is the #1 wealth destroyer. Keep the SIP running.
              </li>
              <li className={styles.lessonItem}>
                <strong>4. Compound Knowledge:</strong> Understanding basics like LTCG tax and Expense Ratios prevents expensive mistakes.
              </li>
              <li className={styles.lessonItem}>
                <strong>5. The Contrarian Signal:</strong> Maximum pessimism is usually the best time to buy. Euphoria is the time to be cautious.
              </li>
            </ul>
          </div>
          
          <div className={styles.controls}>
            <button className={`${styles.btn} ${styles.btnCopy}`} onClick={copyResult}>
              Copy My Result
            </button>
            <button className={`${styles.btn} ${styles.btnRestart}`} onClick={restart}>
              Play Series Again
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
