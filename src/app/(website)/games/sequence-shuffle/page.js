'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useGameState } from '@/lib/games/gameState';
import { calculateCorpus, getPermutations } from '@/lib/games/mathUtils';
import { chapter2Returns } from '@/lib/games/gameData';
import styles from './page.module.css';

export default function SequenceShuffle() {
  const router = useRouter();
  const { saveScore } = useGameState();
  const [availableChips, setAvailableChips] = useState([...chapter2Returns]);
  const [slots, setSlots] = useState([null, null, null, null, null]);
  const [result, setResult] = useState(null);

  const handleChipClick = (val, idx) => {
    const emptyIdx = slots.findIndex(s => s === null);
    if (emptyIdx !== -1) {
      const newSlots = [...slots];
      newSlots[emptyIdx] = val;
      setSlots(newSlots);
      
      const newChips = [...availableChips];
      newChips.splice(idx, 1);
      setAvailableChips(newChips);
    }
  };

  const handleSlotClick = (idx) => {
    if (slots[idx] !== null) {
      setAvailableChips([...availableChips, slots[idx]]);
      const newSlots = [...slots];
      newSlots[idx] = null;
      setSlots(newSlots);
    }
  };

  const reset = () => {
    setAvailableChips([...chapter2Returns]);
    setSlots([null, null, null, null, null]);
    setResult(null);
  };

  const confirmSequence = () => {
    if (slots.includes(null)) return;
    
    // Simulate current
    const currentSim = calculateCorpus(slots);
    
    // Get all permutations
    const perms = getPermutations([...chapter2Returns]);
    const results = perms.map(p => calculateCorpus(p).finalCorpus);
    results.sort((a, b) => b - a); // descending
    
    // Find rank
    const myCorpus = currentSim.finalCorpus;
    // Rank is 1-indexed, finding first index where we match or exceed
    let rank = results.findIndex(c => Math.abs(c - myCorpus) < 0.01) + 1;
    if (rank === 0) rank = results.length; // fallback
    
    const worstCorpus = results[results.length - 1];
    const bestCorpus = results[0];
    
    // Scoring logic
    const totalPerms = results.length;
    // percentile rank: closer to 1 is better. 1 = 100%, 120 = 0%
    const score = Math.round(((totalPerms - rank + 1) / totalPerms) * 100);
    const vaultUnits = score * 10;
    
    setResult({
      corpus: myCorpus.toFixed(2),
      rank,
      totalPerms,
      bestCorpus: bestCorpus.toFixed(2),
      worstCorpus: worstCorpus.toFixed(2),
      score,
      vaultUnits,
      unitsTotal: currentSim.totalUnits.toFixed(2)
    });
    
    saveScore('chapter2', score, vaultUnits);
  };

  const proceed = () => {
    router.push('/games/panic-room');
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Chapter 2: Sequence Shuffle</h1>
          <p>You have 5 years of returns. Place them in order to maximize your final wealth. (₹1000 invested yearly)</p>
        </div>
        
        {!result ? (
          <div className={styles.gameArea}>
            <div className={styles.slotsContainer}>
              {slots.map((val, i) => (
                <div key={i} className={styles.slot} onClick={() => handleSlotClick(i)}>
                  <span className={styles.statLabel}>Year {i + 1}</span>
                  {val !== null && (
                    <div className={`${styles.chip} ${val < 0 ? styles.negative : styles.positive}`}>
                      {val > 0 ? '+' : ''}{val}%
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.chipsContainer}>
              {availableChips.map((val, i) => (
                <button 
                  key={i} 
                  className={`${styles.chipButton} ${val < 0 ? styles.negative : styles.positive}`}
                  onClick={() => handleChipClick(val, i)}
                >
                  {val > 0 ? '+' : ''}{val}%
                </button>
              ))}
            </div>

            <div className={styles.controls}>
              <button className={styles.btnReset} onClick={reset}>Reset</button>
              <button 
                className={`${styles.btn} ${styles.btnConfirm}`} 
                onClick={confirmSequence}
                disabled={slots.includes(null)}
              >
                Confirm Sequence
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.results}>
            <h2 className={styles.rank}>Your arrangement ranked #{result.rank} out of {result.totalPerms}</h2>
            
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Your Corpus</span>
                <span className={styles.statValue}>₹{result.corpus}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Units Accumulated</span>
                <span className={styles.statValue}>{result.unitsTotal}</span>
              </div>
            </div>
            
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Best Possible (Worst yrs first)</span>
                <span className={styles.statValue}>₹{result.bestCorpus}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Worst Possible (Best yrs first)</span>
                <span className={styles.statValue}>₹{result.worstCorpus}</span>
              </div>
            </div>
            
            <p className={styles.insight}>
              Same returns. Same NAV. But 58% more wealth just because the bad years came first. When accumulating units, bad years are your best friend!
            </p>
            
            <div className={styles.controls} style={{marginTop: '2rem'}}>
              <button className={styles.btnReset} onClick={reset}>Try Again</button>
              <button className={`${styles.btn} ${styles.btnConfirm}`} onClick={proceed}>Next Chapter</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
