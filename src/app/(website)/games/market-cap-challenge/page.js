'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/games/gameState';
import { MARKET_DATA } from '@/lib/games/marketCapData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const INVESTMENT_PER_YEAR = 100000;

export default function MarketCapChallenge() {
  const router = useRouter();
  const { saveScore } = useGameState();
  
  const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'result'
  const [currentYearIndex, setCurrentIndex] = useState(1); // Start at 1 (2005) so we can show 2004 as previous
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [benchmarkValue, setBenchmarkValue] = useState(0);
  const [guessHistory, setGuessHistory] = useState([]);

  const startGame = () => {
    setGameState('playing');
    setCurrentIndex(1);
    setPortfolioValue(0);
    setBenchmarkValue(0);
    setGuessHistory([]);
  };

  const handleGuess = (capType) => {
    const yearData = MARKET_DATA[currentYearIndex];
    const isCorrect = yearData.winner === capType;
    
    // Calculate new portfolio value
    const returnPct = yearData[capType];
    const newPortfolio = (portfolioValue + INVESTMENT_PER_YEAR) * (1 + returnPct / 100);
    setPortfolioValue(newPortfolio);

    // Calculate benchmark (perfect hindsight)
    const bestReturn = Math.max(yearData.large, yearData.mid, yearData.small);
    const newBenchmark = (benchmarkValue + INVESTMENT_PER_YEAR) * (1 + bestReturn / 100);
    setBenchmarkValue(newBenchmark);

    // Add to history
    setGuessHistory(prev => [...prev, {
      year: yearData.year,
      large: yearData.large,
      mid: yearData.mid,
      small: yearData.small,
      winner: yearData.winner,
      userCall: capType,
      isCorrect
    }]);

    // Advance round
    if (currentYearIndex < MARKET_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameState('result');
      // Save score: portfolio value rounded to nearest integer
      saveScore('chapter7', Math.round(newPortfolio));
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
    <Navbar />
    <div className={styles.pageWrapper}>
      {gameState === 'playing' && guessHistory.length > 0 && (
        <div className={styles.tickerTape}>
          <div className={styles.tickerContent}>
            {guessHistory.map((h, i) => (
              <span key={i} style={{ marginRight: '2rem' }}>
                ♦ {h.year} {h.winner.toUpperCase()} CAP +{h.winner === 'large' ? h.large : h.winner === 'mid' ? h.mid : h.small}%
              </span>
            ))}
            {/* Duplicate for seamless scrolling */}
            {guessHistory.map((h, i) => (
              <span key={`dup-${i}`} style={{ marginRight: '2rem' }}>
                ♦ {h.year} {h.winner.toUpperCase()} CAP +{h.winner === 'large' ? h.large : h.winner === 'mid' ? h.mid : h.small}%
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.container} style={gameState === 'playing' ? { marginTop: '20px' } : {}}>
        
        {/* Header */}
        <div className={styles.topHeader}>
          <div className={styles.logoArea}>
            <div className={styles.barsIcon}>
              <div className={`${styles.bar} ${styles.barBlue}`}></div>
              <div className={`${styles.bar} ${styles.barYellow}`}></div>
              <div className={`${styles.bar} ${styles.barBlueShort}`}></div>
            </div>
            <div className={styles.logoTextContainer}>
              <div className={styles.logoTitle}>The Market Cap Challenge</div>
              <div className={styles.logoSubtitle}>KNOWITH CAPITAL · ARN 46498</div>
            </div>
          </div>
          <div className={styles.headerRight}>
            EST. 2004 — STILL UNPREDICTABLE
          </div>
        </div>

        <div className={styles.subHeader}>
          <span>AN INVESTOR-EDUCATION GAME · 2004-2023</span>
          <span>VOL. XX</span>
        </div>

        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
            >
              <div className={styles.introLayout}>
                <div className={styles.introLeft}>
                  <h1 className={styles.hugeHeading}>
                    Think you can spot <span className={styles.headingHighlight}>next year's</span> winning cap?
                  </h1>
                  <p className={styles.introDesc}>
                    We'll show you what Large, Mid and Small Cap actually returned each year, starting with 2004. You call the next year's winner and put ₹1,00,000 on it — every year, for twenty years. At the end, we open the ledger and see what your foresight was really worth.
                  </p>

                  <div className={styles.rulesBox}>
                    <div className={styles.rulesHeader}>
                      <span>Rules of the house</span>
                      <span>Three entries</span>
                    </div>
                    
                    <div className={styles.ruleItem}>
                      <div className={styles.ruleNum}>01</div>
                      <div className={styles.ruleContent}>
                        <h4>See the tape</h4>
                        <p>Last year's real index returns, laid bare before you commit a rupee.</p>
                      </div>
                    </div>
                    
                    <div className={styles.ruleItem}>
                      <div className={styles.ruleNum}>02</div>
                      <div className={styles.ruleContent}>
                        <h4>Stake ₹1 lakh</h4>
                        <p>One call per year, ₹1,00,000 on the line. Winnings and wounds compound.</p>
                      </div>
                    </div>

                    <div className={styles.ruleItem}>
                      <div className={styles.ruleNum}>03</div>
                      <div className={styles.ruleContent}>
                        <h4>Read the verdict</h4>
                        <p>Twenty calls later, the ledger tells you what your foresight was worth.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.introRight}>
                  <img src="/images/ledger_book.jpg" alt="Ledger Book" className={styles.ledgerImage} />
                  <div className={styles.imageCaption}>FIG. 1 — TWENTY YEARS, THREE DESKS, ONE WINNER EACH</div>
                  
                  <div className={styles.exhibitBox}>
                    <div className={styles.exhibitHeader}>
                      <span>Exhibit A - The 2004 Closing Tape</span>
                      <span>FY 2004</span>
                    </div>
                    <div className={styles.exhibitCols}>
                      <div className={styles.exhibitCol}>
                        <div className={styles.exColTitle}>Large Cap</div>
                        <div className={styles.exColValue}>+10%</div>
                      </div>
                      <div className={styles.exhibitCol}>
                        <div className={styles.exColTitle}>Mid Cap</div>
                        <div className={styles.exColValue}>+15%</div>
                      </div>
                      <div className={styles.exhibitCol}>
                        <div className={styles.exColTitle}>Small Cap</div>
                        <div className={styles.exColValue}>+25%</div>
                      </div>
                    </div>
                    <div className={styles.exhibitFooter}>
                      Small Cap dominated in 2004. Tempted to back it for 2005? <i>That's exactly the instinct this game tests.</i>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.footerBar}>
                <button className={styles.openLedgerBtn} onClick={startGame}>
                  OPEN THE LEDGER <span style={{ marginLeft: '1rem' }}>→</span>
                </button>
                <div className={styles.footerStats}>
                  20 CALLS · ~5 MINUTES · NO REAL MONEY
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.playLayout}
            >
              {/* Sidebar */}
              <div className={styles.playSidebar}>
                <div className={styles.ledgerCard}>
                  <div className={styles.ledgerTitle}>Ledger of your bets</div>
                  <div className={styles.ledgerSub}>Portfolio Value</div>
                  <div className={styles.portfolioValue}>{formatCurrency(portfolioValue)}</div>
                  <div className={styles.ledgerDivider}></div>
                  
                  <div className={styles.ledgerStats}>
                    <div className={styles.statCol}>
                      <span className={styles.ledgerSub}>Invested</span>
                      <span className={styles.statColValue}>{formatCurrency(guessHistory.length * INVESTMENT_PER_YEAR)}</span>
                    </div>
                    <div className={styles.statCol}>
                      <span className={styles.ledgerSub} style={{ textAlign: 'right' }}>Score</span>
                      <span className={styles.statColValue} style={{ textAlign: 'right' }}>
                        {guessHistory.filter(h => h.isCorrect).length}/{guessHistory.length}
                      </span>
                    </div>
                  </div>

                  <div className={styles.roundInfo}>
                    <span>Round {currentYearIndex} of {MARKET_DATA.length - 1}</span>
                    <span>{Math.round((currentYearIndex / (MARKET_DATA.length - 1)) * 100)}%</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: `${(currentYearIndex / (MARKET_DATA.length - 1)) * 100}%` }}></div>
                  </div>
                </div>

                <div className={styles.houseRulesCard}>
                  <div className={styles.ledgerTitle} style={{ marginBottom: '1rem' }}>House Rules</div>
                  <ul className={styles.rulesList}>
                    <li>You see last year's returns. You call the next year's winner.</li>
                    <li>₹1,00,000 rides on every call, compounding yearly.</li>
                    <li>No changing your mind once the ink dries.</li>
                  </ul>
                </div>
              </div>

              {/* Main Area */}
              <div className={styles.playMain}>
                <div className={styles.gameCard}>
                  <div className={styles.gameCardHeader}>
                    <span>Desk Note - {MARKET_DATA[currentYearIndex-1].year} Closing Tape</span>
                    <span>Guessing {MARKET_DATA[currentYearIndex].year}</span>
                  </div>
                  
                  <div className={styles.gameCardBody}>
                    <h2 className={styles.gameCardTitle}>
                      {MARKET_DATA[currentYearIndex-1].year} is settled. <span>Who takes {MARKET_DATA[currentYearIndex].year}?</span>
                    </h2>
                    
                    <div className={styles.prevYearStats}>
                      {['large', 'mid', 'small'].map(cap => (
                        <div key={cap} className={styles.prevStatBox}>
                          <div className={styles.prevStatTitle}>{cap} Cap {MARKET_DATA[currentYearIndex-1].year}</div>
                          <div className={`${styles.prevStatValue} ${MARKET_DATA[currentYearIndex-1][cap] < 0 ? styles.negative : ''}`}>
                            {MARKET_DATA[currentYearIndex-1][cap] > 0 ? '+' : ''}{MARKET_DATA[currentYearIndex-1][cap]}%
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.guessInstruction}>Place ₹1,00,000 on {MARKET_DATA[currentYearIndex].year}'s winner:</div>
                    
                    <div className={styles.guessButtons}>
                      {['large', 'mid', 'small'].map(cap => {
                        const iconPath = cap === 'large' ? 'M7 17L17 7M17 7H9M17 7V15' : cap === 'mid' ? 'M4 14l6-6 4 4 6-6' : 'M17 7L7 17M17 7H9M17 7V15'; 
                        const dotClass = cap === 'large' ? styles.dotLarge : cap === 'mid' ? styles.dotMid : styles.dotSmall;
                        return (
                          <button key={cap} className={`${styles.guessBtn} ${styles[`guessBtn${cap.charAt(0).toUpperCase() + cap.slice(1)}`]}`} onClick={() => handleGuess(cap)}>
                            <div className={`${styles.btnDot} ${dotClass}`}></div>
                            <div className={styles.btnIcon}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d={iconPath} />
                              </svg>
                            </div>
                            <div className={styles.btnTitle}>{cap.charAt(0).toUpperCase() + cap.slice(1)} Cap</div>
                            <div className={styles.btnSub}>Back this desk</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* History Table */}
                {guessHistory.length > 0 && (
                  <div className={styles.recordSection}>
                    <div className={styles.recordHeader}>
                      <div className={styles.recordTitle}>The record so far</div>
                      <div className={styles.recordSubtitle}>{guessHistory.length} years on file</div>
                    </div>
                    <table className={styles.historyTable}>
                      <thead>
                        <tr>
                          <th>Year</th>
                          <th>Large Cap</th>
                          <th>Mid Cap</th>
                          <th>Small Cap</th>
                          <th>Your Call</th>
                        </tr>
                      </thead>
                      <tbody>
                        {guessHistory.map((h) => (
                          <tr key={h.year}>
                            <td>{h.year}</td>
                            <td className={h.winner === 'large' ? styles.historyWinner : ''}>{h.large > 0 ? '+' : ''}{h.large}%</td>
                            <td className={h.winner === 'mid' ? styles.historyWinner : ''}>{h.mid > 0 ? '+' : ''}{h.mid}%</td>
                            <td className={h.winner === 'small' ? styles.historyWinner : ''}>{h.small > 0 ? '+' : ''}{h.small}%</td>
                            <td>
                              <span className={h.isCorrect ? styles.historyCallCorrect : styles.historyCallWrong}>
                                {h.userCall} cap {h.isCorrect ? '✓' : '✗'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.resultsScreen}
            >
              <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Challenge Complete</h2>
              
              <div className={styles.finalScoreBox}>
                <div className={styles.statLabel}>Total Principal Invested</div>
                <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{formatCurrency(2000000)}</div>

                <div className={styles.scoreComparison}>
                  <div>
                    <div className={styles.statLabel}>Your Final Portfolio</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                      {formatCurrency(portfolioValue)}
                    </div>
                  </div>
                  
                  <div>
                    <div className={styles.statLabel}>Perfect Hindsight (Benchmark)</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
                      {formatCurrency(benchmarkValue)}
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ maxWidth: '600px', margin: '0 auto 2rem', fontStyle: 'italic' }}>
                Navigating the market cycle is extremely difficult. While hindsight shows the perfect path, true wealth is built by staying disciplined, diversified, and rebalancing regularly—which is exactly what Knowith Capital helps you achieve.
              </p>

              <button className={styles.primaryButton} onClick={() => router.push('/games')}>
                Return to Games Hub
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
    <Footer />
    </>
  );
}
