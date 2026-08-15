'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/games/gameState';
import { contrarianSignalDispatches } from '@/lib/games/gameData';
import styles from './page.module.css';
import Link from 'next/link';

export default function ContrarianSignal() {
  const router = useRouter();
  const { saveScore } = useGameState();
  
  const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'results'
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedMultiplier, setSelectedMultiplier] = useState(1);
  const [showOutcome, setShowOutcome] = useState(false);

  // Randomize dispatches on start for replayability, or just keep chronological
  // The client design shows chronological historical events. We'll stick to chronological.
  const dispatches = contrarianSignalDispatches;
  const currentDispatch = dispatches[roundIndex];

  const handleStart = () => {
    setGameState('playing');
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
  };

  const handleMultiplierSelect = (multi) => {
    setSelectedMultiplier(multi);
  };

  const handleSubmit = () => {
    if (!selectedAction) return;
    setShowOutcome(true);
    const roundScore = currentDispatch.outcomes[selectedAction].score * selectedMultiplier;
    setScore(prev => prev + roundScore);
  };

  const handleNext = () => {
    if (roundIndex < dispatches.length - 1) {
      setRoundIndex(prev => prev + 1);
      setShowOutcome(false);
      setSelectedAction(null);
      setSelectedMultiplier(1);
    } else {
      setGameState('results');
    }
  };

  const finishGame = () => {
    // Save to global state (assume max possible score is ~3600 if they 3x every 100pt correct answer)
    // We will normalize unitsEarned
    const maxScore = dispatches.length * 300;
    saveScore('chapter5', score);
    router.push('/games');
  };

  if (gameState === 'intro') {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          {/* HEADER */}
          <header className={styles.topBar}>
            <div>Knowith Capital · Investor Education</div>
            <div>Abhinav Mehta · AMFI Registered MFD · ARN 46498</div>
          </header>

          <div className={styles.logoHeader}>
            <div className={styles.logoCircle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20L12 4z"/></svg>
            </div>
            <div className={styles.logoText}>The Contrarian Signal</div>
          </div>

          <div className={styles.introSubBar}>
            <span>The Reversion Edition · Twelve Dispatches From The Extremes</span>
            <span>Price: One Held Conviction</span>
          </div>

          <div className={styles.introTicker}>
            2008: "CAPITALISM IS DEAD" — THE ECONOMIST ♦ 2009: S&P +65% FROM MARCH LOWS ♦ 2020: "THE END OF GROWTH" — FINANCIAL TIMES ♦ 2021: NIFTY HITS RECORD 18,000 ♦ 1999: "VALUE INVESTING IS DEAD" — BARRON'S ♦ 2000: NASDAQ PLUMMETS 78% OVER NEXT 30 MONTHS ♦
          </div>

          <div className={styles.introActionBox}>
            <span className={styles.introActionText}>You have an unfinished edition on the desk — 1 of 12 dispatches filed.</span>
            <div className={styles.introActionBtns}>
              <button className={styles.sendBtn} style={{margin: 0, padding: '0.5rem 1.5rem'}} onClick={handleStart}>Resume</button>
              <button className={styles.sendBtn} style={{margin: 0, padding: '0.5rem 1.5rem', background: 'transparent', color: '#1a1a1a'}}>Start Over</button>
            </div>
          </div>

          <div className={styles.introMainGrid}>
            <div>
              <div className={styles.publication} style={{marginBottom: '1rem'}}>The Reversion Edition · For The Astute Investor</div>
              <h2 className={styles.introHeadline}>Every headline in this game is <span>real.</span><br/>Every one of them was <span>wrong.</span></h2>
              
              <div className={styles.introParagraph}>
                You are about to be handed twelve moments from the last fifty years of financial history. In each scenario, you will receive the authentic front page, real-time market indices, and actual quotations from the press. Nothing else. 
              </div>
              <div className={styles.introParagraph}>
                Your task is to make the call the way an investor actually has to make it — completely blind to what happens tomorrow.
              </div>
              <div className={styles.introParagraph}>
                The goal here isn't to mock financial journalism. The press accurately describes the present panic or euphoria. That is exactly why it serves as a terrible forecast for the next two years. Prices mean-revert. Financial headlines are printed precisely at the point of maximum deviation from that mean — often marking the reversal, rather than the trend.
              </div>

              <div style={{marginTop: '3rem'}}>
                <button onClick={handleStart} className={styles.introPrimaryBtn}>Open the First Dispatch</button>
                <a href="#" className={styles.introSecondaryLink} onClick={(e) => { e.preventDefault(); setGameState('dataroom'); }}>Go straight to the Data Room</a>
              </div>
            </div>

            <div>
              <img src="/images/vintage-panic.jpg" alt="Vintage Stock Exchange Trading Floor" className={styles.introImage} />
              <div className={styles.introImageCaption}>The floor at the moment the front page writes itself. Euphoria and terror look identical from the inside.</div>
              
              <div className={styles.scoringBox}>
                <div className={styles.scoringTitle}>How The Scoring Works</div>
                <ol className={styles.scoringList}>
                  <li>Read the dispatch and the press clippings. No hindsight or modern context is provided.</li>
                  <li>Make your allocation decision, then set your conviction level from 1x to 3x. Conviction acts as a multiplier on both your reward and your penalty.</li>
                  <li>The market's actual outcome is stamped over your decision, revealing the 12 to 24-month aftermath.</li>
                </ol>
                <div className={styles.scoringDivider}>♦</div>
                <div className={styles.scoringFooter}>
                  Twelve dispatches. Roughly twelve minutes. Your final score is a measure of emotional calibration, not raw intelligence.
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM FOOTER */}
          <div className={styles.bottomFooter}>
            <div className={styles.footerCol}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                <div className={styles.logoCircle} style={{width: '30px', height: '30px', borderWidth: '1px'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20L12 4z"/></svg>
                </div>
                <h4 style={{marginBottom: 0}}>Knowith Capital<br/><span style={{fontSize: '0.65rem', color: '#666'}}>Investor Education</span></h4>
              </div>
              <p>Abhinav Mehta - AMFI Registered Mutual Fund Distributor - ARN 46498. Compiled for the education of non-resident Indian investors on market cycles, investor behaviour and wealth creation.</p>
            </div>
            <div className={styles.footerCol}>
              <h4>Sources</h4>
              <p>Headlines and quotations are reproduced from BusinessWeek, The Economist, Financial Times, Bloomberg, Reuters, The Wall Street Journal, The New York Times, CNBC, Foreign Affairs, NDTV Profit, Rediff, India Today and Business Standard, each attributed on the page where it appears. Market data from Yahoo Finance, BSE India, NSE, RBI, Investing.com, MSCI and Macrotrends. Proprietary tables compiled by Knowith Capital.</p>
            </div>
            <div className={styles.footerCol}>
              <h4>Disclaimer</h4>
              <p>For education only. Not investment advice, not a recommendation of any product, and not a representation as a SEBI registered research analyst or investment adviser. Past performance does not guarantee future results. Mutual fund investments are subject to market risks; read all scheme related documents carefully.</p>
            </div>
          </div>
          
          <div className={styles.veryBottomBar}>
            <div>The Contrarian Signal - A Knowith Capital Investor-Education Edition</div>
            <div><Link href="/" style={{color: 'inherit', textDecoration: 'none'}}>Return to Main Site</Link></div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'dataroom') {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          {/* HEADER */}
          <header className={styles.topBar}>
            <div>Knowith Capital · Investor Education</div>
            <div>Abhinav Mehta · AMFI Registered MFD · ARN 46498</div>
          </header>

          <div className={styles.logoHeader}>
            <div className={styles.logoCircle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20L12 4z"/></svg>
            </div>
            <div className={styles.logoText}>The Contrarian Signal</div>
          </div>

          <div className={styles.introSubBar} style={{borderTop: '2px solid #1a1a1a', paddingTop: '0.25rem', marginTop: '2rem'}}>
            <span>The Supplement · Knowith Capital Research</span>
            <span>Price: One Held Conviction</span>
          </div>
          <div className={styles.dividerLines} style={{marginBottom: '3rem'}}></div>

          <h2 className={styles.introHeadline} style={{fontSize: '4rem', marginBottom: '1rem'}}>The data room</h2>
          <div className={styles.introParagraph} style={{maxWidth: '800px', marginBottom: '4rem'}}>
            Everything below is Knowith Capital's proprietary research and compilation. The game forced you to confront the headlines; this section reveals the arithmetic underlying them — seven major currency panics, the actual returns available to those who acted when fear peaked, and twenty-six years of India compared against the United States.
          </div>

          <div className={styles.dataroomTabs}>
            <span className={`${styles.dataroomTab} ${styles.active}`}>The Rupee Panic File</span>
            <span className={styles.dataroomTab}>Lumpsum vs SIP at the Trough</span>
            <span className={styles.dataroomTab}>India vs USA, 26 Years</span>
            <span className={styles.dataroomTab}>The Favourite Becomes The Laggard</span>
            <span className={styles.dataroomTab}>The GBP Investor</span>
          </div>

          <div className={styles.dataroomGrid}>
            <div>
              <h3 className={styles.introActionText} style={{fontWeight: 'bold', fontSize: '1.8rem', marginBottom: '1rem'}}>Seven times the currency broke an investor's nerve</h3>
              <p className={styles.introParagraph} style={{fontSize: '1.1rem'}}>
                Each row below represents an episode in which currency depreciation dominated the front pages and caused widespread panic. Read the final column first: in every single completed episode, the Sensex was substantially higher twelve months after the trough. In the two most severe crises — the Global Financial Crisis and COVID — the index surged by over 80%.
              </p>

              <table className={styles.dataroomTable}>
                <thead>
                  <tr>
                    <th>Episode</th>
                    <th>Window</th>
                    <th>USDINR</th>
                    <th>INR Fall</th>
                    <th>Sensex Fall</th>
                    <th>INR +12M</th>
                    <th>Sensex +12M</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Global Financial Crisis</strong></td>
                    <td className={styles.valNeutral}>Jan 2008 → Mar 2009</td>
                    <td className={styles.valNeutral}>~39.3 → ~52.0</td>
                    <td className={styles.valNegative}>-25%</td>
                    <td className={styles.valNegative}>-58%</td>
                    <td className={styles.valPositive}>+13%</td>
                    <td className={styles.valPositive}>+83%</td>
                  </tr>
                  <tr>
                    <td><strong>Eurozone crisis</strong></td>
                    <td className={styles.valNeutral}>Jul 2011 → Dec 2011</td>
                    <td className={styles.valNeutral}>~44.3 → ~54.0</td>
                    <td className={styles.valNegative}>-18.5%</td>
                    <td className={styles.valNegative}>-22%</td>
                    <td className={styles.valNegative}>-1.0%</td>
                    <td className={styles.valPositive}>+25%</td>
                  </tr>
                  <tr>
                    <td><strong>Taper tantrum</strong></td>
                    <td className={styles.valNeutral}>May 2013 → Aug 2013</td>
                    <td className={styles.valNeutral}>~54.3 → ~68.85</td>
                    <td className={styles.valNegative}>-21.5%</td>
                    <td className={styles.valNegative}>-11%</td>
                    <td className={styles.valPositive}>+12%</td>
                    <td className={styles.valPositive}>+38%</td>
                  </tr>
                  <tr>
                    <td><strong>Oil / EM stress</strong></td>
                    <td className={styles.valNeutral}>Jan 2018 → Oct 2018</td>
                    <td className={styles.valNeutral}>~63.3 → ~74.5</td>
                    <td className={styles.valNegative}>-15%</td>
                    <td className={styles.valNegative}>-12%</td>
                    <td className={styles.valPositive}>+5.0%</td>
                    <td className={styles.valPositive}>+15%</td>
                  </tr>
                  <tr>
                    <td><strong>COVID</strong></td>
                    <td className={styles.valNeutral}>Jan 2020 → Apr 2020</td>
                    <td className={styles.valNeutral}>~71.0 → ~77.0</td>
                    <td className={styles.valNegative}>-7.8%</td>
                    <td className={styles.valNegative}>-39%</td>
                    <td className={styles.valPositive}>+3.0%</td>
                    <td className={styles.valPositive}>+83%</td>
                  </tr>
                  <tr>
                    <td><strong>Fed tightening</strong></td>
                    <td className={styles.valNeutral}>Jan 2022 → Oct 2022</td>
                    <td className={styles.valNeutral}>~74.3 → ~83.2</td>
                    <td className={styles.valNegative}>-11%</td>
                    <td className={styles.valNegative}>-6.0%</td>
                    <td className={styles.valPositive}>+0.0%</td>
                    <td className={styles.valPositive}>+8.0%</td>
                  </tr>
                  <tr>
                    <td><strong>Current episode</strong></td>
                    <td className={styles.valNeutral}>mid-2024 → now</td>
                    <td className={styles.valNeutral}>~83 → ~86.3</td>
                    <td className={styles.valNegative}>-13.8%</td>
                    <td className={styles.valNeutral}>TBD</td>
                    <td className={styles.valNeutral}>n/a</td>
                    <td className={styles.valNeutral}>n/a</td>
                  </tr>
                </tbody>
              </table>
              <div style={{fontSize: '0.65rem', color: '#666', marginTop: '1rem'}}>
                Source: Bloomberg, RBI, MOSPI, Investing.com, Knowith Capital analysis. The final row is the episode we are currently navigating.
              </div>
            </div>

            <div>
              <div className={styles.chartBox}>
                <div className={styles.chartTitle}>The Deeper The Fall, The Larger The Rebound</div>
                {/* CSS representation of a scatter plot instead of Recharts to perfectly match vintage aesthetic */}
                <div style={{position: 'relative', height: '200px', borderLeft: '1px solid #ccc', borderBottom: '1px solid #ccc', marginBottom: '2rem'}}>
                  <div style={{position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Depth of Sensex fall during episode</div>
                  <div style={{position: 'absolute', top: '50%', left: '-30px', transform: 'translateY(-50%) rotate(-90deg)', fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Sensex +12M</div>
                  
                  {/* Grid lines */}
                  <div style={{position: 'absolute', top: '20%', width: '100%', borderTop: '1px solid #eee', zIndex: 1}}></div>
                  <div style={{position: 'absolute', top: '40%', width: '100%', borderTop: '1px solid #eee', zIndex: 1}}></div>
                  <div style={{position: 'absolute', top: '60%', width: '100%', borderTop: '1px solid #eee', zIndex: 1}}></div>
                  <div style={{position: 'absolute', top: '80%', width: '100%', borderTop: '1px solid #eee', zIndex: 1}}></div>

                  {/* Trendline */}
                  <svg style={{position: 'absolute', width: '100%', height: '100%', zIndex: 2}}>
                    <line x1="10%" y1="90%" x2="90%" y2="20%" stroke="#15803d" strokeWidth="1" strokeDasharray="4 4" />
                  </svg>
                  <div style={{position: 'absolute', top: '15%', left: '75%', fontSize: '0.6rem', color: '#15803d', fontWeight: 'bold'}}>REVERSION TO MEAN</div>

                  {/* Points */}
                  <div style={{position: 'absolute', left: '15%', bottom: '15%', width: '8px', height: '8px', background: '#0369a1', borderRadius: '50%', zIndex: 3}}></div>
                  <div style={{position: 'absolute', left: '15%', bottom: '15%', marginLeft: '12px', fontSize: '0.65rem', color: '#1a1a1a'}}>Fed tightening</div>

                  <div style={{position: 'absolute', left: '25%', bottom: '25%', width: '8px', height: '8px', background: '#0369a1', borderRadius: '50%', zIndex: 3}}></div>
                  <div style={{position: 'absolute', left: '25%', bottom: '25%', marginLeft: '12px', fontSize: '0.65rem', color: '#1a1a1a'}}>Oil / EM stress</div>

                  <div style={{position: 'absolute', left: '30%', bottom: '38%', width: '8px', height: '8px', background: '#0369a1', borderRadius: '50%', zIndex: 3}}></div>
                  <div style={{position: 'absolute', left: '30%', bottom: '38%', marginLeft: '12px', fontSize: '0.65rem', color: '#1a1a1a'}}>Taper tantrum</div>

                  <div style={{position: 'absolute', left: '45%', bottom: '35%', width: '8px', height: '8px', background: '#0369a1', borderRadius: '50%', zIndex: 3}}></div>
                  <div style={{position: 'absolute', left: '45%', bottom: '35%', marginLeft: '12px', fontSize: '0.65rem', color: '#1a1a1a'}}>Eurozone</div>

                  <div style={{position: 'absolute', left: '60%', bottom: '75%', width: '8px', height: '8px', background: '#0369a1', borderRadius: '50%', zIndex: 3}}></div>
                  <div style={{position: 'absolute', left: '60%', bottom: '75%', marginLeft: '-45px', fontSize: '0.65rem', color: '#1a1a1a'}}>COVID</div>

                  <div style={{position: 'absolute', left: '85%', bottom: '75%', width: '8px', height: '8px', background: '#0369a1', borderRadius: '50%', zIndex: 3}}></div>
                  <div style={{position: 'absolute', left: '85%', bottom: '75%', marginLeft: '12px', fontSize: '0.65rem', color: '#1a1a1a'}}>GFC</div>
                </div>
                
                <div style={{fontSize: '0.75rem', color: '#666', lineHeight: 1.5, marginTop: '2rem'}}>
                  Vertical axis: Sensex gain in the twelve months after the trough. Every episode in Knowith Capital's series recovered; the deepest falls produced the largest rebounds.
                </div>
              </div>

              <div className={styles.insightBox}>
                <div className={styles.insightTitle}>Read This to an NRI Client</div>
                <div className={styles.insightText}>
                  The rupee fell in all seven episodes. It also recovered, partially or fully, in five of the six that have completed. The currency loss you see on your statement is loud and immediate; the equity gain that follows it is quiet and arrives later. That asymmetry in how the two feel — not the arithmetic — is what causes the mistake.
                </div>
              </div>
            </div>
          </div>

          <div className={styles.argumentSection}>
            <div className={styles.argumentHeader}>The Whole Argument In One Paragraph</div>
            <div className={styles.argumentGrid}>
              <div className={styles.argumentText}>
                Financial assets revert toward their long-run mean. Headlines are written at the moment of maximum deviation from that mean, in the language of permanence. This is why the front page reads as a forecast when it is really a description — and why, at the extremes, the most useful thing an investor can do with the consensus is to check whether they are already positioned for it.
              </div>
              <div>
                <button onClick={() => { setRoundIndex(0); setScore(0); setGameState('playing'); }} className={styles.playAgainBtn}>Play The Game Again</button>
              </div>
            </div>
          </div>

          {/* BOTTOM FOOTER */}
          <div className={styles.bottomFooter}>
            <div className={styles.footerCol}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                <div className={styles.logoCircle} style={{width: '30px', height: '30px', borderWidth: '1px'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20L12 4z"/></svg>
                </div>
                <h4 style={{marginBottom: 0}}>Knowith Capital<br/><span style={{fontSize: '0.65rem', color: '#666'}}>Investor Education</span></h4>
              </div>
              <p>Abhinav Mehta - AMFI Registered Mutual Fund Distributor - ARN 46498. Compiled for the education of non-resident Indian investors on market cycles, investor behaviour and wealth creation.</p>
            </div>
            <div className={styles.footerCol}>
              <h4>Sources</h4>
              <p>Headlines and quotations are reproduced from BusinessWeek, The Economist, Financial Times, Bloomberg, Reuters, The Wall Street Journal, The New York Times, CNBC, Foreign Affairs, NDTV Profit, Rediff, India Today and Business Standard, each attributed on the page where it appears. Market data from Yahoo Finance, BSE India, NSE, RBI, Investing.com, MSCI and Macrotrends. Proprietary tables compiled by Knowith Capital.</p>
            </div>
            <div className={styles.footerCol}>
              <h4>Disclaimer</h4>
              <p>For education only. Not investment advice, not a recommendation of any product, and not a representation as a SEBI registered research analyst or investment adviser. Past performance does not guarantee future results. Mutual fund investments are subject to market risks; read all scheme related documents carefully.</p>
            </div>
          </div>
          
          <div className={styles.veryBottomBar}>
            <div>The Contrarian Signal - A Knowith Capital Investor-Education Edition</div>
            <div><Link href="/" style={{color: 'inherit', textDecoration: 'none'}}>Return to Main Site</Link></div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh'}}>
          <h1 className={styles.logoText} style={{marginBottom: '1rem'}}>Edition Complete</h1>
          <p style={{marginBottom: '2rem', fontSize: '1.5rem'}}>Final Score: {score}</p>
          <button onClick={finishGame} className={styles.sendBtn} style={{maxWidth: '300px'}}>Return to Curriculum</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* HEADER */}
        <header className={styles.topBar}>
          <div>Knowith Capital · Investor Education</div>
          <div>Abhinav Mehta · AMFI Registered MFD · ARN 46498</div>
        </header>

        <div className={styles.logoHeader}>
          <div className={styles.logoCircle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20L12 4z"/></svg>
          </div>
          <div className={styles.logoText}>The Contrarian Signal</div>
        </div>

        <div className={styles.dividerLines}></div>

        <div className={styles.subHeader}>
          <div>Dispatch 1 of 12 · New York</div>
          <div>Score {score}</div>
        </div>

        {/* PAGINATION */}
        <div className={styles.paginationRow}>
          <div className={styles.pageBoxes}>
            {dispatches.map((_, idx) => (
              <div key={idx} className={`${styles.pageBox} ${idx === roundIndex ? styles.active : ''}`}>
                {idx + 1}
              </div>
            ))}
          </div>
          <div className={styles.filedText}>{roundIndex} of 12 Filed</div>
        </div>

        {/* DISPATCH META */}
        <div className={styles.dispatchHeader}>
          <div className={styles.dispatchMeta}>
            Dispatch {(roundIndex + 1).toString().padStart(2, '0')} of 12 · New York · {currentDispatch.date}
          </div>
          <div className={styles.badge}>Peak Pessimism</div>
        </div>

        <AnimatePresence mode="wait">
          {!showOutcome ? (
            <motion.div 
              key={`game-${roundIndex}`}
              className={styles.mainGrid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* LEFT COLUMN: ARTICLE */}
              <div>
                <div className={styles.publication}>{currentDispatch.publication}</div>
                <h2 className={styles.headline}>{currentDispatch.headline}</h2>
                
                <div className={styles.statsBar}>
                  {currentDispatch.stats?.map((stat, idx) => (
                    <div key={idx} className={styles.statItem}>
                      <span className={styles.statLabel}>{stat.label}</span>
                      <span className={styles.statValue}>{stat.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.context}>
                  {currentDispatch.context}
                </div>

                {currentDispatch.quotes && currentDispatch.quotes.length > 0 && (
                  <>
                    <div className={styles.pressSectionTitle}>From the press that week</div>
                    {currentDispatch.quotes.map((quote, idx) => (
                      <div key={idx} className={styles.quoteBlock}>
                        <div className={styles.quoteText}>"{quote.text}"</div>
                        <div className={styles.quoteSource}>{quote.source}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* RIGHT COLUMN: THE DESK (FORM) */}
              <div>
                <div className={styles.deskCard}>
                  <div className={styles.deskTitle}>The Desk Asks</div>
                  <div className={styles.deskQuestion}>
                    The most respected financial voices have declared panic or euphoria. What do you do with your equity allocation?
                  </div>

                  <div className={styles.actionOptions}>
                    <button 
                      className={`${styles.actionBtn} ${selectedAction === 'buy' ? styles.selected : ''}`}
                      onClick={() => handleActionSelect('buy')}
                    >
                      <span>Invest heavily / add</span>
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${selectedAction === 'hold' ? styles.selected : ''}`}
                      onClick={() => handleActionSelect('hold')}
                    >
                      <span>Stay invested / hold</span>
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${selectedAction === 'sell' ? styles.selected : ''}`}
                      onClick={() => handleActionSelect('sell')}
                    >
                      <span>Cut exposure / go to cash</span>
                    </button>
                  </div>

                  <div className={styles.multiplierTitle}>How Strongly?</div>
                  <div className={styles.multiplierOptions}>
                    <button 
                      className={`${styles.multiBtn} ${selectedMultiplier === 1 ? styles.selected : ''}`}
                      onClick={() => handleMultiplierSelect(1)}
                    >
                      <span>A nagging doubt</span>
                      <span className={styles.xValue}>1x</span>
                    </button>
                    <button 
                      className={`${styles.multiBtn} ${selectedMultiplier === 2 ? styles.selected : ''}`}
                      onClick={() => handleMultiplierSelect(2)}
                    >
                      <span>A considered view</span>
                      <span className={styles.xValue}>2x</span>
                    </button>
                    <button 
                      className={`${styles.multiBtn} ${selectedMultiplier === 3 ? styles.selected : ''}`}
                      onClick={() => handleMultiplierSelect(3)}
                    >
                      <span>I would bet the allocation</span>
                      <span className={styles.xValue}>3x</span>
                    </button>
                  </div>

                  <button 
                    className={styles.sendBtn} 
                    onClick={handleSubmit}
                    disabled={!selectedAction}
                  >
                    Send to Press
                  </button>
                  
                  <div className={styles.deskDisclaimer}>
                    Every headline on this page was really printed. Nothing has been invented for effect.
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={`outcome-${roundIndex}`}
              className={styles.outcomeGrid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '3rem 0', borderTop: '2px solid #1a1a1a' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem' }}>
                {/* LEFT COLUMN: CHART & DATA */}
                <div>
                  <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.75rem', fontWeight: 'bold', color: '#b83b3b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                    What The Market Did Next
                  </div>
                  <h2 style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '2.5rem', color: '#1a1a1a', marginBottom: '3rem' }}>
                    The headline was a contrarian signal.
                  </h2>
                  
                  {/* CHART UI */}
                  <div style={{ position: 'relative', height: '250px', borderBottom: '1px solid rgba(0,0,0,0.2)', marginBottom: '3rem' }}>
                    {/* Dynamic Y-Axis Labels based on chartData */}
                    {[0, 1, 2, 3].map((stepIndex) => {
                      const { max, min } = currentDispatch.chartData.yAxis;
                      const range = max - min;
                      const val = max - (range / 3) * stepIndex;
                      const topPercent = (stepIndex * 33.33);
                      
                      return (
                        <div key={stepIndex}>
                          <div style={{ 
                            position: 'absolute', 
                            top: `${topPercent}%`, 
                            left: '-5%', 
                            width: '105%', 
                            borderTop: `1px solid ${val === 0 ? '#1a1a1a' : 'rgba(0,0,0,0.05)'}`, 
                            zIndex: 1 
                          }}></div>
                          <div style={{ 
                            position: 'absolute', 
                            top: `${topPercent}%`, 
                            left: '-8%', 
                            fontSize: '0.75rem', 
                            color: '#666',
                            transform: stepIndex > 0 ? 'translateY(-5px)' : 'translateY(-10px)'
                          }}>
                            {val > 0 ? `+${Math.round(val)}%` : `${Math.round(val)}%`}
                          </div>
                        </div>
                      );
                    })}

                    {/* X-Axis labels */}
                    <div style={{ position: 'absolute', bottom: '-25px', left: '0', fontSize: '0.7rem', color: '#666', fontFamily: 'var(--font-mono), monospace', textTransform: 'uppercase' }}>The Headline</div>
                    <div style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', color: '#666', fontFamily: 'var(--font-mono), monospace', textTransform: 'uppercase' }}>12 Months</div>
                    <div style={{ position: 'absolute', bottom: '-25px', right: '0', fontSize: '0.7rem', color: '#666', fontFamily: 'var(--font-mono), monospace', textTransform: 'uppercase' }}>24 Months</div>

                    {/* Lines based on outcome score logic to create dynamic looking charts */}
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, overflow: 'visible' }}>
                      {currentDispatch.chartData.lines.map((line, idx) => {
                        const { max, min } = currentDispatch.chartData.yAxis;
                        const range = max - min;
                        
                        // Map values to Y percentages
                        const y0 = (max - 0) / range * 100;
                        const y12 = (max - line.m12) / range * 100;
                        const y24 = (max - line.m24) / range * 100;

                        // Calculate dx for the right label to prevent overlapping if lines are close
                        const dyOffset = idx * 15;

                        return (
                          <g key={idx}>
                            <line x1="0%" y1={`${y0}%`} x2="50%" y2={`${y12}%`} stroke={line.color} strokeWidth="2" />
                            <line x1="50%" y1={`${y12}%`} x2="100%" y2={`${y24}%`} stroke={line.color} strokeWidth="2" />
                            
                            <circle cx="50%" cy={`${y12}%`} r="4" fill={line.color} />
                            <text x="50%" y={`${y12}%`} fill={line.color} fontSize="12" textAnchor="middle" dy="-10">
                              {line.m12 > 0 ? `+${line.m12}%` : `${line.m12}%`}
                            </text>
                            
                            <circle cx="100%" cy={`${y24}%`} r="4" fill={line.color} />
                            <text x="100%" y={`${y24}%`} fill={line.color} fontSize="12" textAnchor="start" dx="10" dy={4}>
                              {line.m24 > 0 ? `+${line.m24}%` : `${line.m24}%`} {line.name}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', borderBottom: '1px solid rgba(0,0,0,0.1)', padding: '1.5rem 0', display: 'flex', gap: '3rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.7rem', color: '#1a1a1a', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                        YOUR DECISION: {selectedAction === 'buy' ? 'INVESTED' : selectedAction === 'hold' ? 'HELD FIRM' : 'LIQUIDATED'} ({selectedMultiplier}X)
                      </div>
                      <div style={{ fontSize: '1.2rem', color: '#b83b3b', fontWeight: 'bold' }}>
                        SCORE: +{currentDispatch.outcomes[selectedAction].score * selectedMultiplier}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: TEXT */}
                <div style={{ paddingLeft: '2rem', borderLeft: '1px solid rgba(0,0,0,0.1)' }}>
                  <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.75rem', fontWeight: 'bold', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                    Editor's Note
                  </div>
                  <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '1.15rem', lineHeight: '1.6', color: '#1a1a1a', marginBottom: '3rem' }}>
                    {currentDispatch.outcomes[selectedAction].text} 
                    {currentDispatch.outcomes.buy.score === 100 
                      ? ' Markets eventually reverted to their mean, proving the headline was driven by maximum emotion rather than fundamental permanence.' 
                      : ' Euphoria eventually collapsed under its own weight, demonstrating that valuations decouple from reality before a crash.'}
                  </p>

                  <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.7rem', fontWeight: 'bold', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                    Sources
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.75rem', color: '#666', lineHeight: '1.6', marginBottom: '4rem' }}>
                    <li>{currentDispatch.publication}, {currentDispatch.date}</li>
                    <li>Historical market data from Macrotrends and BSE India</li>
                    <li>Knowith Capital Research</li>
                  </ul>

                  <button 
                    className={styles.sendBtn} 
                    style={{ width: '100%', padding: '1.25rem', fontSize: '0.85rem' }} 
                    onClick={handleNext}
                  >
                    {roundIndex < dispatches.length - 1 ? 'Next Dispatch' : 'Complete Game'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM FOOTER */}
        <div className={styles.bottomFooter}>
          <div className={styles.footerCol}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
              <div className={styles.logoCircle} style={{width: '30px', height: '30px', borderWidth: '1px'}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20L12 4z"/></svg>
              </div>
              <h4 style={{marginBottom: 0}}>Knowith Capital<br/><span style={{fontSize: '0.65rem', color: '#666'}}>Investor Education</span></h4>
            </div>
            <p>Abhinav Mehta - AMFI Registered Mutual Fund Distributor - ARN 46498. Compiled for the education of non-resident Indian investors on market cycles, investor behaviour and wealth creation.</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Sources</h4>
            <p>Headlines and quotations are reproduced from BusinessWeek, The Economist, Financial Times, Bloomberg, Reuters, The Wall Street Journal, The New York Times, CNBC, Foreign Affairs, NDTV Profit, Rediff, India Today and Business Standard, each attributed on the page where it appears. Market data from Yahoo Finance, BSE India, NSE, RBI, Investing.com, MSCI and Macrotrends. Proprietary tables compiled by Knowith Capital.</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Disclaimer</h4>
            <p>For education only. Not investment advice, not a recommendation of any product, and not a representation as a SEBI registered research analyst or investment adviser. Past performance does not guarantee future results. Mutual fund investments are subject to market risks; read all scheme related documents carefully.</p>
          </div>
        </div>

        <div className={styles.veryBottomBar}>
          <div>The Contrarian Signal - A Knowith Capital Investor-Education Edition</div>
          <div><Link href="/" style={{color: 'inherit', textDecoration: 'none'}}>Return to Main Site</Link></div>
        </div>

      </div>
    </div>
  );
}
