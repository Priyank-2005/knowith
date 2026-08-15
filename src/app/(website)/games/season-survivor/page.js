'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/games/gameState';
import { seasons } from '@/lib/games/gameData';
import { formatCurrency } from '@/lib/games/mathUtils';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GameHeader from '@/components/GameHeader';

export default function SeasonSurvivor() {
  const router = useRouter();
  const { saveScore } = useGameState();

  const [gameState, setGameState] = useState('intro'); // intro, playing, animating, results
  const [journey, setJourney] = useState(null);
  const [currentYear, setCurrentYear] = useState(0); // 0 to 9
  
  const [inMarket, setInMarket] = useState(true);
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalInvested: 0,
    cashBalance: 0,
    benchUnits: 0,
    benchInvested: 0
  });
  
  const [history, setHistory] = useState([]); // To draw the chart

  const generateRandomJourney = () => {
    const baseNav = 100;
    let currentNav = baseNav;
    const years = [];
    
    for (let i = 0; i < 11; i++) { // 11 to have an endpoint for year 10
      let randomReturn;
      if (i === 0) randomReturn = 0; // year 0 is base
      else randomReturn = (Math.random() * 60 - 20) / 100; // -20% to +40%
      
      currentNav = i === 0 ? baseNav : currentNav * (1 + randomReturn);
      
      let season = 'spring';
      if (randomReturn < -0.1) season = 'winter';
      else if (randomReturn < 0) season = 'autumn';
      else if (randomReturn > 0.15) season = 'summer';

      years.push({
        year: i + 1,
        nav: currentNav,
        headline: i === 0 ? 'Market Opens Steady' : `Market shifts by ${(randomReturn * 100).toFixed(1)}%`,
        season: season
      });
    }
    return {
      name: 'Dynamic Market Cycle',
      years
    };
  };

  const startGame = () => {
    const randomJourney = generateRandomJourney();
    setJourney(randomJourney);
    
    const startNav = randomJourney.years[0].nav;
    setHistory([{
      month: 0,
      nav: startNav,
      totalUnits: 0,
      benchUnits: 0,
      season: randomJourney.years[0].season
    }]);
    
    setGameState('playing');
  };

  const handleAction = (action) => {
    setGameState('animating');
    
    let monthlySIP = 0;
    let willSell = false;
    let willComeBack = false;
    let newInMarket = inMarket;

    if (action === 'stay') monthlySIP = 10000;
    else if (action === 'topup') monthlySIP = 15000;
    else if (action === 'pause') monthlySIP = 0;
    else if (action === 'sell') {
      willSell = true;
      newInMarket = false;
    }
    else if (action === 'comeback') {
      willComeBack = true;
      newInMarket = true;
      monthlySIP = 10000;
    }
    else if (action === 'stayout') {
      newInMarket = false;
      monthlySIP = 0;
    }

    setInMarket(newInMarket);

    const startNav = journey.years[currentYear].nav;
    const endNav = journey.years[currentYear + 1].nav;
    const season = journey.years[currentYear].season;

    let currentUnits = stats.totalUnits;
    let currentInvested = stats.totalInvested;
    let currentCash = stats.cashBalance;
    let currentBenchUnits = stats.benchUnits;
    let currentBenchInvested = stats.benchInvested;

    if (willSell) {
      currentCash += currentUnits * startNav;
      currentUnits = 0;
    }
    
    if (willComeBack) {
      currentUnits += currentCash / startNav;
      currentCash = 0;
    }

    let newHistory = [];
    
    for (let m = 1; m <= 12; m++) {
      let nav = startNav + (endNav - startNav) * (m / 12);
      if (m < 12) nav += (Math.random() - 0.5) * (startNav * 0.05); // noise
      
      if (monthlySIP > 0) {
        currentUnits += monthlySIP / nav;
        currentInvested += monthlySIP;
      }
      
      // Benchmark is always 10k/mo
      currentBenchUnits += 10000 / nav;
      currentBenchInvested += 10000;
      
      newHistory.push({
        month: currentYear * 12 + m,
        nav,
        totalUnits: currentUnits,
        benchUnits: currentBenchUnits,
        season
      });
    }

    let step = 0;
    const interval = setInterval(() => {
      if (step < 12) {
        setHistory(prev => [...prev, newHistory[step]]);
      }
      
      if (step === 11) {
        setStats({
          totalUnits: currentUnits,
          totalInvested: currentInvested,
          cashBalance: currentCash,
          benchUnits: currentBenchUnits,
          benchInvested: currentBenchInvested
        });
      }
      
      step++;
      if (step >= 12) {
        clearInterval(interval);
        setTimeout(() => {
          if (currentYear === 9) {
            setGameState('results');
          } else {
            setCurrentYear(prev => prev + 1);
            setGameState('playing');
          }
        }, 300);
      }
    }, 50);
  };

  const finishGame = () => {
    const finalNav = history.filter(d => d?.nav).slice(-1)[0]?.nav || 0;
    const finalPortfolioValue = (stats.totalUnits * finalNav) + stats.cashBalance;
    const benchValue = stats.benchUnits * (finalNav || 1); // Avoid division by zero
    
    let score = Math.floor((finalPortfolioValue / benchValue) * 100);
    // Remove upper clamp so users can score > 100 if they beat the benchmark
    score = Math.max(0, score || 0); 
    saveScore('chapter1', score);
    router.push('/games');
  };

  return (
    <>
      {(gameState === 'intro' || gameState === 'results') ? <Navbar /> : <GameHeader />}
      <div className={styles.container}>
        <main className={styles.main}>
          {gameState === 'intro' && (
            <motion.div className={styles.introScreen} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={styles.chapterBadge}>Chapter 01</div>
              <h1>Season Survivor</h1>
              <p className={styles.introDesc}>
                Welcome to the ultimate test of investor discipline. You will live through a completely randomized 10-year market cycle, making one decision per year. 
              </p>
              <div className={styles.rules}>
                <h3>The Rules:</h3>
                <ul>
                  <li>You start with a ₹10,000 monthly SIP.</li>
                  <li>Each year brings a new randomized market 'season' (Spring, Summer, Autumn, Winter).</li>
                  <li>You can Stay the Course, Top Up (₹15K), Pause, or Sell Everything.</li>
                  <li>Your goal: Accumulate maximum units to beat the 'Never Flinched' benchmark.</li>
                </ul>
              </div>
              <button className={styles.primaryButton} onClick={startGame}>Begin Journey</button>
            </motion.div>
          )}

          {(gameState === 'playing' || gameState === 'animating') && journey && (
            <div className={styles.gameBoard}>
              <div className={styles.headerRow}>
                <div className={styles.yearIndicator}>
                  Year {currentYear + 1} of 10
                </div>
                <h2 className={styles.headline}>"{journey.years[currentYear].headline}"</h2>
                <div className={styles.seasonIndicator} style={{ color: seasons[journey.years[currentYear].season]?.color }}>
                  {seasons[journey.years[currentYear].season]?.name}
                </div>
              </div>

              <div className={styles.statsPanel}>
                <div className={styles.statBox}>
                  <label>Current NAV</label>
                  <div className={styles.statVal}>₹{history.filter(d => d?.nav).slice(-1)[0]?.nav.toFixed(2) || '0.00'}</div>
                </div>
                <div className={styles.statBox}>
                  <label>Portfolio Value</label>
                  <div className={styles.statVal} style={{color: 'var(--gold)'}}>
                    {formatCurrency((stats.totalUnits * (history.filter(d => d?.nav).slice(-1)[0]?.nav || 0)) + stats.cashBalance)}
                  </div>
                </div>
                <div className={styles.statBox}>
                  <label>Benchmark Value</label>
                  <div className={styles.statVal} style={{color: '#45D483'}}>
                    {formatCurrency(stats.benchUnits * (history.filter(d => d?.nav).slice(-1)[0]?.nav || 0))}
                  </div>
                </div>
                <div className={styles.statBox}>
                  <label>Cash Balance</label>
                  <div className={styles.statVal}>{formatCurrency(stats.cashBalance)}</div>
                </div>
              </div>

              <div className={styles.chartContainer}>
                <Chart history={history} />
              </div>

              <div className={styles.actionsPanel}>
                <h3 className={styles.actionTitle}>Your Move for Year {currentYear + 1}:</h3>
                <div className={styles.actionButtons}>
                  {inMarket ? (
                    <>
                      <button disabled={gameState === 'animating'} onClick={() => handleAction('stay')} className={`${styles.actionBtn} ${styles.btnStay}`}>Stay the course (₹10K/mo)</button>
                      <button disabled={gameState === 'animating'} onClick={() => handleAction('topup')} className={`${styles.actionBtn} ${styles.btnTopup}`}>Top up to ₹15K/mo</button>
                      <button disabled={gameState === 'animating'} onClick={() => handleAction('pause')} className={`${styles.actionBtn} ${styles.btnPause}`}>Pause SIP</button>
                      <button disabled={gameState === 'animating'} onClick={() => handleAction('sell')} className={`${styles.actionBtn} ${styles.btnSell}`}>Sell Everything</button>
                    </>
                  ) : (
                    <>
                      <button disabled={gameState === 'animating'} onClick={() => handleAction('comeback')} className={`${styles.actionBtn} ${styles.btnStay}`}>Come back in (₹10K/mo)</button>
                      <button disabled={gameState === 'animating'} onClick={() => handleAction('stayout')} className={`${styles.actionBtn} ${styles.btnPause}`}>Stay out one more year</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {gameState === 'results' && (
            <motion.div className={styles.resultsScreen} style={{ maxWidth: '900px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2>Journey Complete</h2>
              
              <div className={styles.comparisonBox}>
                <div className={styles.compSide}>
                  <h3>Your Portfolio</h3>
                  <div className={styles.compVal}>{formatCurrency((stats.totalUnits * (history.filter(d => d?.nav).slice(-1)[0]?.nav || 0)) + stats.cashBalance)}</div>
                  <div className={styles.compSub}>Invested: {formatCurrency(stats.totalInvested)}</div>
                </div>
                <div className={styles.compDivider}>VS</div>
                <div className={styles.compSide}>
                  <h3 style={{color: '#45D483'}}>'Never Flinched'</h3>
                  <div className={styles.compVal}>{formatCurrency(stats.benchUnits * (history.filter(d => d?.nav).slice(-1)[0]?.nav || 0))}</div>
                  <div className={styles.compSub}>Invested: {formatCurrency(stats.benchInvested)}</div>
                </div>
              </div>

              <div className={styles.chartContainer} style={{ marginBottom: '40px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <Chart history={history} />
              </div>

              <div className={styles.scoreBox}>
                <div className={styles.scoreLabel}>Final Performance Score</div>
                <div className={styles.scoreValue}>
                  {Math.max(0, Math.floor((((stats.totalUnits * (history.filter(d => d?.nav).slice(-1)[0]?.nav || 0)) + stats.cashBalance) / (stats.benchUnits * (history.filter(d => d?.nav).slice(-1)[0]?.nav || 1))) * 100))}
                </div>
                <p>A score of 100 means you exactly matched the 'Never Flinched' benchmark.</p>
              </div>

              <button className={styles.primaryButton} onClick={finishGame}>Back to Hub</button>
            </motion.div>
          )}
        </main>
      </div>
      {(gameState === 'intro' || gameState === 'results') && <Footer />}
    </>
  );
}

function Chart({ history }) {
  if (!history || history.length === 0) return null;

  const width = 800;
  const height = 250;
  const padding = 20;

  const validHistory = history.filter(d => d && typeof d.nav === 'number');
  
  const getPortValue = (d) => (d.totalUnits * d.nav) || 0;
  const getBenchValue = (d) => (d.benchUnits * d.nav) || 0;

  const maxVal = Math.max(1000, ...validHistory.map(d => Math.max(getPortValue(d), getBenchValue(d))));
  const minVal = 0;
  const maxMonth = 120; // 10 years * 12 months

  const getX = (m) => padding + (m / maxMonth) * (width - padding * 2);
  const getY = (v) => height - padding - ((v - minVal) / (maxVal - minVal)) * (height - padding * 2);

  const userPoints = validHistory.map(d => `${getX(d.month)},${getY(getPortValue(d))}`).join(' ');
  const benchPoints = validHistory.map(d => `${getX(d.month)},${getY(getBenchValue(d))}`).join(' ');
  
  const userAreaPoints = validHistory.length > 0 ? `${getX(validHistory[0].month)},${height - padding} ${userPoints} ${getX(validHistory[validHistory.length - 1].month)},${height - padding}` : '';

  const bands = [];
  if (validHistory.length > 0) {
    let currentSeason = validHistory[0].season;
    let startX = getX(validHistory[0].month);
    
    for (let i = 1; i < validHistory.length; i++) {
      if (validHistory[i].season !== currentSeason || i === validHistory.length - 1) {
        const endX = getX(validHistory[i].month);
        bands.push(
          <rect 
            key={i}
            x={startX}
            y={padding}
            width={endX - startX}
            height={height - padding * 2}
            fill={seasons[currentSeason]?.color || '#ffffff'}
            opacity={0.1}
          />
        );
        currentSeason = validHistory[i].season;
        startX = endX;
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgChart}>
      {/* Background bands */}
      {bands}
      
      {/* Grid lines */}
      <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="#333" strokeDasharray="4 4" />
      
      {/* User Area */}
      <polygon points={userAreaPoints} fill="url(#unitsGradient)" opacity={0.3} />
      
      {/* Benchmark Line (Green) */}
      <polyline points={benchPoints} fill="none" stroke="#45D483" strokeWidth="2" strokeDasharray="5 5" />
      
      {/* User Line (Gold) */}
      <polyline points={userPoints} fill="none" stroke="var(--gold)" strokeWidth="3" />
      
      {/* Legend */}
      <text x={padding + 10} y={padding + 15} fill="#45D483" fontSize="12" fontFamily="monospace">--- Benchmark Value</text>
      <text x={padding + 10} y={padding + 35} fill="var(--gold)" fontSize="12" fontFamily="monospace">― Your Portfolio</text>

      <defs>
        <linearGradient id="unitsGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0B1533" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
