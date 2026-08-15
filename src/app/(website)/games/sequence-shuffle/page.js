'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/games/gameState';
import { calculateCorpus, getPermutations } from '@/lib/games/mathUtils';
import { chapter2Returns } from '@/lib/games/gameData';
import styles from './page.module.css';
import GameHeader from '@/components/GameHeader';

export default function SequenceShuffle() {
  const router = useRouter();
  const { saveScore } = useGameState();
  const [baseReturns, setBaseReturns] = useState([]);
  const [availableChips, setAvailableChips] = useState([]);
  const [slots, setSlots] = useState([null, null, null, null, null]);
  const [result, setResult] = useState(null);

  const initRandomReturns = () => {
    const arr = [];
    arr.push(Math.floor(Math.random() * -20) - 5); // -5 to -24
    arr.push(Math.floor(Math.random() * -10) - 1); // -1 to -10
    arr.push(Math.floor(Math.random() * 20) + 5);  // 5 to 24
    arr.push(Math.floor(Math.random() * 30) + 15); // 15 to 44
    arr.push(Math.floor(Math.random() * 40) + 20); // 20 to 59
    
    // Shuffle
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    setBaseReturns(arr);
    setAvailableChips([...arr]);
    setSlots([null, null, null, null, null]);
    setResult(null);
  };

  useEffect(() => {
    initRandomReturns();
  }, []);

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
    setAvailableChips([...baseReturns]);
    setSlots([null, null, null, null, null]);
    setResult(null);
  };

  const confirmSequence = () => {
    if (slots.includes(null)) return;
    
    // Simulate current
    const currentSim = calculateCorpus(slots);
    
    // Get all permutations
    const perms = getPermutations([...baseReturns]);
    const results = perms.map(p => {
      const res = calculateCorpus(p);
      return { finalCorpus: res.finalCorpus, history: res.history, sequence: p };
    });
    results.sort((a, b) => b.finalCorpus - a.finalCorpus); // descending
    
    // Find rank
    const myCorpus = currentSim.finalCorpus;
    let rank = results.findIndex(c => Math.abs(c.finalCorpus - myCorpus) < 0.01) + 1;
    if (rank === 0) rank = results.length; // fallback
    
    const worstSim = results[results.length - 1];
    const bestSim = results[0];
    const worstCorpus = worstSim.finalCorpus;
    const bestCorpus = bestSim.finalCorpus;
    
    // Scoring logic
    const totalPerms = results.length;
    const score = Math.round(((totalPerms - rank + 1) / totalPerms) * 100);
    const percentDiff = Math.round(((bestCorpus - worstCorpus) / worstCorpus) * 100);

    setResult({
      corpus: myCorpus.toFixed(2),
      rank,
      totalPerms,
      bestCorpus: bestCorpus.toFixed(2),
      worstCorpus: worstCorpus.toFixed(2),
      percentDiff,
      score,
      unitsTotal: currentSim.totalUnits.toFixed(2),
      userHistory: currentSim.history,
      idealHistory: bestSim.history
    });
    
    saveScore('chapter2', score);
  };

  const proceed = () => {
    router.push('/games/panic-room');
  };

  return (
    <>
      <GameHeader />
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
            
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>Portfolio Growth Comparison</h3>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <h4 style={{ textAlign: 'center', color: 'var(--gold)', marginBottom: '1rem' }}>Your Sequence</h4>
                  <Chart 
                    history={result.userHistory} 
                    color="var(--gold)" 
                    globalMax={Math.max(...result.userHistory.map(d=>d.corpus), ...result.idealHistory.map(d=>d.corpus))} 
                  />
                </div>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <h4 style={{ textAlign: 'center', color: '#45D483', marginBottom: '1rem' }}>Ideal Sequence (Worst first)</h4>
                  <Chart 
                    history={result.idealHistory} 
                    color="#45D483" 
                    globalMax={Math.max(...result.userHistory.map(d=>d.corpus), ...result.idealHistory.map(d=>d.corpus))} 
                  />
                </div>
              </div>
            </div>

            <p className={styles.insight}>
              Same returns. Same NAV. But {result.percentDiff}% more wealth just because the bad years came first. When accumulating units, bad years are your best friend!
            </p>
            
            <div className={styles.controls} style={{marginTop: '2rem'}}>
              <button className={styles.btnReset} onClick={initRandomReturns}>Play Another Round</button>
              <button className={`${styles.btn} ${styles.btnConfirm}`} onClick={proceed}>Next Chapter</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Chart({ history, color, globalMax }) {
  if (!history) return null;

  const width = 400;
  const height = 280;
  const paddingX = 40;
  const paddingY = 60;

  const maxVal = globalMax || Math.max(...history.map(d => d.corpus));
  const minVal = 0;
  const maxYear = 5;

  const getX = (y) => paddingX + (y / maxYear) * (width - paddingX * 2);
  const getY = (v) => height - paddingY - ((v - minVal) / (maxVal - minVal)) * (height - paddingY * 2);

  const pointsStr = history.map(d => `${getX(d.year)},${getY(d.corpus)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {[0, 1, 2, 3, 4, 5].map(year => (
        <g key={year}>
          <line x1={getX(year)} y1={paddingY} x2={getX(year)} y2={height - paddingY} stroke="rgba(255,255,255,0.1)" />
          <text x={getX(year)} y={height - paddingY + 20} fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle">
            Year {year}
          </text>
        </g>
      ))}

      <polyline points={pointsStr} fill="none" stroke={color} strokeWidth="3" />
      
      {history.map((d, i) => {
        if (i === 0) return null;
        const isPositive = d.returnPct > 0;
        return (
          <g key={`pt-${i}`}>
            <circle cx={getX(d.year)} cy={getY(d.corpus)} r="5" fill={color} />
            <text x={getX(d.year)} y={getY(d.corpus) - 15} fill={color} fontSize="11" textAnchor="middle" fontWeight="bold">
              {isPositive ? '+' : ''}{d.returnPct}%
            </text>
          </g>
        );
      })}

      <text x={getX(5)} y={getY(history[5].corpus) + 32} fill={color} fontSize="12" textAnchor="end" fontWeight="bold">
        ₹{history[5].corpus.toFixed(0)}
      </text>
    </svg>
  );
}
