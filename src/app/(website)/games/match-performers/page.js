'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { WINDOW_1_FUNDS, WINDOW_2_FUNDS, TRUE_MAPPINGS } from '@/lib/games/matchPerformersData';
import { useGameState } from '@/lib/games/gameState';

export default function MatchPerformers() {
  const router = useRouter();
  const { saveScore } = useGameState();
  
  const [gameState, setGameState] = useState('playing'); // 'playing', 'revealed'
  const [selectedTile, setSelectedTile] = useState(null); // The rank of the selected forecast tile
  const [placedMatches, setPlacedMatches] = useState({}); // Record<FundID, ForecastRank>

  const highlightedFunds = WINDOW_1_FUNDS.filter(f => f.isHighlighted);
  const forecastTiles = WINDOW_2_FUNDS.filter(f => f.isHighlighted);
  const placedCount = Object.keys(placedMatches).length;

  const handleTileSelect = (rank) => {
    if (gameState !== 'playing') return;
    if (selectedTile === rank) {
      setSelectedTile(null);
    } else {
      setSelectedTile(rank);
    }
  };

  const handleSlotClick = (fundId) => {
    if (gameState !== 'playing') return;
    
    // If slot is occupied, return it to the stack
    if (placedMatches[fundId]) {
      const updatedMatches = { ...placedMatches };
      delete updatedMatches[fundId];
      setPlacedMatches(updatedMatches);
      return;
    }

    // If slot is empty and a tile is selected, place it
    if (selectedTile) {
      setPlacedMatches({ ...placedMatches, [fundId]: selectedTile });
      setSelectedTile(null);
    }
  };

  const clearBoard = () => {
    if (gameState !== 'playing') return;
    setPlacedMatches({});
    setSelectedTile(null);
  };

  const revealEvidence = () => {
    setGameState('revealed');
    // Calculate a score (maybe 100 points per correct match?)
    let correctCount = 0;
    highlightedFunds.forEach(fund => {
      if (placedMatches[fund.id] === TRUE_MAPPINGS[fund.id]) correctCount++;
    });
    // Just give a flat 1000 completion score, plus bonus for right guesses
    saveScore('chapter8', 1000 + (correctCount * 200));
  };

  const isTilePlaced = (rank) => Object.values(placedMatches).includes(rank);

  return (
    <>
      <Navbar />
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          
          {/* Hero Section */}
          <section className={styles.heroSection}>
            <div className={styles.headerTop}>
              <div className={styles.gameLogo}>
                <img src="/images/match-performers-mark.png" alt="Match The Performers" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                <span>Match<br/><span style={{fontSize: '10px', color: 'var(--slate)'}}>The Performers</span></span>
              </div>
              <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#2e7d32', fontWeight: 600}}>
                <div style={{width: '6px', height: '6px', borderRadius: '50%', background: '#2e7d32'}}></div>
                FIVE-YEAR PERFORMANCE REPLAY
              </div>
            </div>

            <div className={styles.heroContent}>
              <div className={styles.heroLeft}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.eyebrow}>
                  An investor learning game
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={styles.title}>
                  Does a leader<br/>stay a leader?
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={styles.subtitle}>
                  The past is on the left. Place your forecast on the right. Nine funds, nine returns, and one revealing lesson about repeatability.
                </motion.p>
                <motion.a 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.3 }}
                  href="#game" 
                  className={styles.scrollLink}
                >
                  Make your matches
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                </motion.a>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className={styles.heroGraphic}>
                <img 
                  src="/images/match-performers-hero.png" 
                  alt="Performance Routes Diagram" 
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                />
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={styles.premiseBox}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{minWidth: '24px', marginTop: '2px'}}>
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
              <div>
                <strong>Challenge premise.</strong> First, read the complete historical rank list. Then match the next-window CAGR returns to only the nine highlighted funds. The later-period fund names stay concealed until you submit.
              </div>
            </motion.div>
          </section>

          {/* Reference Spread */}
          <section className={styles.referenceSection}>
            <div className={styles.eyebrow}>The Reference Spread</div>
            <h2 className={styles.referenceTitle}>Twenty funds. Two non-overlapping windows.</h2>
            <p className={styles.referenceSubtitle}>Each side is ordered by rank within its own five-year window.</p>

            <div className={styles.windowsGrid}>
              <div className={styles.windowDivider}>
                <div className={styles.dividerText}>FIVE YEARS LATER</div>
              </div>

              {/* Past Window */}
              <div className={styles.windowCard}>
                <div className={styles.windowHeader}>
                  <div className={styles.windowHeaderRight}>CAGR</div>
                  <h3>July 2016 to July 2021</h3>
                  <p>Ranked on first 5 years</p>
                </div>
                <motion.ul 
                  className={styles.fundList}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {WINDOW_1_FUNDS.map((fund, index) => (
                    <motion.li 
                      key={fund.id} 
                      className={`${styles.fundRow} ${fund.isHighlighted ? styles.highlighted : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <span className={styles.fundRank}>{fund.rank}</span>
                      <span className={styles.fundName}>{fund.name}</span>
                      <span className={styles.fundCagr}>{fund.cagr.toFixed(1)}%</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              {/* Future Window */}
              <div className={`${styles.windowCard} ${styles.windowCardDark}`}>
                <div className={styles.windowHeader}>
                  <div className={styles.windowHeaderRight}>CAGR</div>
                  <h3>July 2021 to July 2026</h3>
                  <p>Ranked on next 5 years</p>
                </div>
                <motion.ul 
                  className={styles.fundList}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {WINDOW_2_FUNDS.map((fund, index) => (
                    <motion.li 
                      key={fund.rank} 
                      className={`${styles.fundRow} ${fund.isHighlighted ? styles.highlighted : ''}`}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <span className={styles.fundRank}>{fund.rank} {fund.isHighlighted && <span style={{display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#a5d6a7', marginLeft: '4px'}}></span>}</span>
                      <span className={styles.fundName}>{gameState === 'revealed' ? (fund.isHighlighted ? WINDOW_1_FUNDS.find(f => TRUE_MAPPINGS[f.id] === fund.rank)?.name : '...') : ''}</span>
                      <span className={styles.fundCagr}>{fund.cagr.toFixed(1)}%</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </section>

          {/* Interaction Area */}
          <section className={styles.interactionSection} id="game">
            <div className={styles.interactionHeader}>
              <div>
                <div className={styles.eyebrow}>Your Turn</div>
                <h2>Match the next-window returns.</h2>
                <p>Select a next-window return, then place it against the first-window fund you believe earned it.</p>
              </div>
              <div className={styles.progressCounter}>
                <div className={styles.progressLabel}>Matches Placed</div>
                <div className={styles.progressValue}>
                  {placedCount}<span>/9</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${(placedCount / 9) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {gameState === 'revealed' ? (
              <div className={styles.resultsContainer}>
                <div className={styles.resultsHeader} style={{textAlign: 'center', marginBottom: '60px'}}>
                  <h3 style={{fontSize: '3.5rem', fontFamily: 'var(--font-display)', color: 'var(--ink)', marginBottom: '16px'}}>The rankings had other plans.</h3>
                  <p style={{fontSize: '1.1rem', color: 'var(--slate)'}}>
                    You matched <strong>{highlightedFunds.filter(f => placedMatches[f.id] === TRUE_MAPPINGS[f.id]).length} of 9</strong> next-window CAGR returns correctly.
                  </p>
                </div>

                <table className={styles.resultsTable}>
                  <thead>
                    <tr>
                      <th>FUND / FIRST RANK</th>
                      <th>YOUR MATCH</th>
                      <th>CORRECT NEXT-WINDOW RESULT</th>
                      <th>RANK MOVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {highlightedFunds.map((fund) => {
                      const placedRank = placedMatches[fund.id];
                      const placedTileData = forecastTiles.find(t => t.rank === placedRank);
                      const trueRank = TRUE_MAPPINGS[fund.id];
                      const trueTileData = forecastTiles.find(t => t.rank === trueRank);
                      const isCorrect = placedRank === trueRank;
                      const rankDiff = fund.rank - trueRank; // Positive means moved up in rank (e.g., 19 -> 1 is +18)

                      return (
                        <tr key={fund.id}>
                          <td>
                            <div className={styles.fundMainInfo}>{fund.name}</div>
                            <div className={styles.fundSubInfo}>First-window rank {fund.rank} · {fund.cagr.toFixed(1)}%</div>
                          </td>
                          <td>
                            <div className={`${styles.matchBadge} ${isCorrect ? styles.correct : styles.wrong}`}>
                              {isCorrect ? '✓' : '✕'} {placedTileData?.cagr.toFixed(1)}% · #{placedRank}
                            </div>
                          </td>
                          <td>
                            <div className={styles.fundMainInfo}>{trueTileData?.cagr.toFixed(1)}%</div>
                            <div className={styles.fundSubInfo}>Rank {trueRank} in the next window</div>
                          </td>
                          <td>
                            <div className={`${styles.rankMoveBadge} ${rankDiff > 0 ? styles.up : styles.down}`}>
                              {rankDiff > 0 ? '↗' : '↘'} {rankDiff > 0 ? `+${rankDiff}` : rankDiff} places
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className={styles.replaySummary}>
                  <div className={styles.replayImageCard}>
                    <div className={styles.eyebrow} style={{color: '#2e7d32'}}>THE COMPLETED RANK MAP</div>
                    <img 
                      src="/images/performance-rank-routes.png" 
                      alt="Completed Rank Map" 
                      style={{ width: '100%', height: 'auto', display: 'block' }} 
                    />
                    <div className={styles.replayImageCaption}>
                      Performance paths crossed sharply across the two windows, making the change in leadership visible at a glance.
                    </div>
                  </div>
                  
                  <div>
                    <div className={styles.eyebrow} style={{color: '#2e7d32'}}>WHAT THE REPLAY REVEALS</div>
                    <h2 style={{fontFamily: 'var(--font-display)', fontSize: '3rem', lineHeight: 1.1, color: 'var(--ink)', marginBottom: '40px'}}>
                      A rank is not a durable forecast.
                    </h2>

                    <div className={styles.insightList}>
                      <div className={styles.insightRow}>
                        <div className={`${styles.insightValue} ${styles.red}`}>14.6%</div>
                        <div className={styles.insightText}>
                          <strong>The first-window top three cooled off.</strong> PGIM India Midcap, Axis Midcap and Quant Midcap averaged 14.6% in the next window, with ranks shifting to 20, 16 and 10.
                        </div>
                      </div>
                      <div className={styles.insightRow}>
                        <div className={`${styles.insightValue} ${styles.green}`}>19.0%</div>
                        <div className={styles.insightText}>
                          <strong>The bottom three climbed.</strong> The bottom-three cohort averaged 19.0% in the following window; Motilal Midcap moved from 19 to 1 and Sundaram Mid Cap from 20 to 7.
                        </div>
                      </div>
                      <div className={styles.insightRow}>
                        <div className={`${styles.insightValue} ${styles.red}`}>-0.13</div>
                        <div className={styles.insightText}>
                          <strong>The rank correlation was weak.</strong> Across all twenty funds, the two five-year rankings were slightly negative and close to random, underscoring how little the first ranking foretold the next.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'center', marginTop: '60px'}}>
                  <button className={styles.revealBtn} onClick={() => router.push('/games')}>Back to Games Hub</button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.playArea}>
                  {/* Left side: Funds with Drop Slots */}
                  <div>
                    <div className={styles.playColumnTitle}>Past: First-Window Fund <span style={{float: 'right', fontWeight: 400, opacity: 0.7}}>Place a return tile before the fund you choose</span></div>
                    <div className={styles.slotList}>
                      {highlightedFunds.map((fund, index) => {
                        const placedRank = placedMatches[fund.id];
                        const placedTileData = forecastTiles.find(t => t.rank === placedRank);

                        return (
                          <motion.div 
                            key={fund.id} 
                            className={styles.slotRow}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className={styles.slotRank}>{fund.rank}</div>
                            
                            <div 
                              className={`${styles.slotBox} ${selectedTile && !placedRank ? styles.active : ''}`}
                              onClick={() => handleSlotClick(fund.id)}
                            >
                              {!placedRank ? (
                                <>
                                  <div className={styles.slotBoxText}>Place tile</div>
                                  <div className={styles.slotBoxSub}>open slot</div>
                                </>
                              ) : (
                                <motion.div 
                                  className={styles.placedTile}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                  <div className={styles.placedTileValue}>{placedTileData?.cagr.toFixed(1)}%</div>
                                  <div className={styles.placedTileRank}>Rank {placedRank}</div>
                                </motion.div>
                              )}
                            </div>

                            <div className={styles.slotFundInfo}>
                              <div className={styles.slotFundName}>{fund.name}</div>
                              <div className={styles.slotFundMeta}>{fund.cagr.toFixed(1)}% in the first window</div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right side: Return Tiles Stack */}
                  <div>
                    <div className={styles.playColumnTitle}>Forecast: Return Tile Stack</div>
                    <div className={styles.tileGrid}>
                      {forecastTiles.map((tile) => {
                        const isPlaced = isTilePlaced(tile.rank);
                        const isSelected = selectedTile === tile.rank;
                        return (
                          <div 
                            key={tile.rank} 
                            className={`${styles.tile} ${isSelected ? styles.selected : ''} ${isPlaced ? styles.placed : ''}`}
                            onClick={() => !isPlaced && handleTileSelect(tile.rank)}
                          >
                            <div className={styles.tileRank}>Rank {tile.rank}</div>
                            <div className={styles.tileValue}>{tile.cagr.toFixed(1)}%</div>
                          </div>
                        );
                      })}
                      <div style={{gridColumn: '1 / -1', fontSize: '11px', color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px'}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4" />
                          <path d="M12 8h.01" />
                        </svg>
                        Pick a tile and click a row to place it. Click a placed tile to return it to the stack.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className={styles.actionFooter}>
                  <div className={styles.actionFooterText}>Each return receives one proof mark. Place all nine to reveal the evidence.</div>
                  <div className={styles.buttonGroup}>
                    <button className={styles.clearBtn} onClick={clearBoard}>Clear board</button>
                    <button 
                      className={styles.revealBtn} 
                      disabled={placedCount < 9}
                      onClick={revealEvidence}
                    >
                      Reveal the evidence ✨
                    </button>
                  </div>
                </div>
              </>
            )}

          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
