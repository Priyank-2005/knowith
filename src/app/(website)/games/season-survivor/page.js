'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/games/gameState';
import { seasonSurvivorJourneys, seasons } from '@/lib/games/gameData';
import { calculateXIRR, formatCurrency } from '@/lib/games/mathUtils';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
  });
  
  const [history, setHistory] = useState([]); // To draw the chart

  const startGame = () => {
    const randomJourney = seasonSurvivorJourneys[Math.floor(Math.random() * seasonSurvivorJourneys.length)];
    setJourney(randomJourney);
    
    // Start with Year 1 data
    const startNav = randomJourney.years[0].nav;
    setHistory([{
      month: 0,
      nav: startNav,
      totalUnits: 0,
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

    // Simulate 12 months
    const startNav = journey.years[currentYear].nav;
    const endNav = currentYear < 9 ? journey.years[currentYear + 1].nav : journey.years[9].nav * 1.1; // Extrapolate last year
    const season = journey.years[currentYear].season;

    let currentUnits = stats.totalUnits;
    let currentInvested = stats.totalInvested;
    let currentCash = stats.cashBalance;

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
      // Linear interpolation with slight randomness
      let nav = startNav + (endNav - startNav) * (m / 12);
      if (m < 12) nav += (Math.random() - 0.5) * (startNav * 0.05); // 5% noise
      
      if (monthlySIP > 0) {
        currentUnits += monthlySIP / nav;
        currentInvested += monthlySIP;
      }
      
      newHistory.push({
        month: currentYear * 12 + m,
        nav,
        totalUnits: currentUnits,
        season
      });
    }

    // Animate the chart step by step
    let step = 0;
    const interval = setInterval(() => {
      if (step < 12) {
        setHistory(prev => [...prev, newHistory[step]]);
      }
      
      // Update stats live during animation
      if (step === 11) {
        setStats({
          totalUnits: currentUnits,
          totalInvested: currentInvested,
          cashBalance: currentCash
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
        }, 500);
      }
    }, 100);
  };

  const calculateBenchmark = () => {
    // Benchmark: 10K SIP every month, never selling
    let benchUnits = 0;
    let benchInvested = 0;
    
    for (let y = 0; y < 10; y++) {
      const startNav = journey.years[y].nav;
      const endNav = y < 9 ? journey.years[y + 1].nav : journey.years[9].nav * 1.1;
      
      for (let m = 1; m <= 12; m++) {
        let nav = startNav + (endNav - startNav) * (m / 12);
        benchUnits += 10000 / nav;
        benchInvested += 10000;
      }
    }
    
    const finalNav = journey.years[9].nav * 1.1; // approximate final point
    return {
      value: benchUnits * finalNav,
      invested: benchInvested
    };
  };

  const finishGame = () => {
    const finalNav = history.filter(d => d?.nav).slice(-1)[0]?.nav || 0;
    const finalPortfolioValue = (stats.totalUnits * finalNav) + stats.cashBalance;
    const benchmark = calculateBenchmark();
    
    // Score based on performance vs benchmark (0-100)
    let score = Math.floor((finalPortfolioValue / benchmark.value) * 100);
    score = Math.min(100, Math.max(0, score)); // Clamp 0-100
    
    const unitsEarned = score * 12;
    
    saveScore('chapter1', score, unitsEarned);
    router.push('/games');
  };

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        {gameState === 'intro' && (
          <motion.div className={styles.introScreen} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.chapterBadge}>Chapter 01</div>
            <h1>Season Survivor</h1>
            <p className={styles.introDesc}>
              Welcome to the ultimate test of investor discipline. You will live through a 10-year market cycle, making one decision per year. 
            </p>
            <div className={styles.rules}>
              <h3>The Rules:</h3>
              <ul>
                <li>You start with a ₹10,000 monthly SIP.</li>
                <li>Each year brings a new market 'season' (Spring, Summer, Autumn, Winter).</li>
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
              <div className={styles.seasonIndicator} style={{ color: seasons[journey.years[currentYear].season].color }}>
                {seasons[journey.years[currentYear].season].name}
              </div>
            </div>

            <div className={styles.statsPanel}>
              <div className={styles.statBox}>
                <label>Current NAV</label>
                <div className={styles.statVal}>₹{history.filter(d => d?.nav).slice(-1)[0]?.nav.toFixed(2) || '0.00'}</div>
              </div>
              <div className={styles.statBox}>
                <label>Total Units</label>
                <div className={styles.statVal}>{stats.totalUnits.toFixed(2)}</div>
              </div>
              <div className={styles.statBox}>
                <label>Portfolio Value</label>
                <div className={styles.statVal}>{formatCurrency(stats.totalUnits * (history.filter(d => d?.nav).slice(-1)[0]?.nav || 0))}</div>
              </div>
              <div className={styles.statBox}>
                <label>Total Invested</label>
                <div className={styles.statVal}>{formatCurrency(stats.totalInvested)}</div>
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
          <motion.div className={styles.resultsScreen} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>Journey Complete</h2>
            <div className={styles.journeyName}>Scenario: {journey.name}</div>
            
            <div className={styles.comparisonBox}>
              <div className={styles.compSide}>
                <h3>Your Portfolio</h3>
                <div className={styles.compVal}>{formatCurrency((stats.totalUnits * (history.filter(d => d?.nav).slice(-1)[0]?.nav || 0)) + stats.cashBalance)}</div>
                <div className={styles.compSub}>Invested: {formatCurrency(stats.totalInvested)}</div>
              </div>
              <div className={styles.compDivider}>VS</div>
              <div className={styles.compSide}>
                <h3>'Never Flinched'</h3>
                <div className={styles.compVal}>{formatCurrency(calculateBenchmark().value)}</div>
                <div className={styles.compSub}>Invested: {formatCurrency(calculateBenchmark().invested)}</div>
              </div>
            </div>

            <div className={styles.scoreBox}>
              <div className={styles.scoreLabel}>Final Score</div>
              <div className={styles.scoreValue}>
                {Math.min(100, Math.max(0, Math.floor((((stats.totalUnits * (history.filter(d => d?.nav).slice(-1)[0]?.nav || 0)) + stats.cashBalance) / calculateBenchmark().value) * 100)))} / 100
              </div>
              <p>You earned {Math.min(100, Math.max(0, Math.floor((((stats.totalUnits * (history.filter(d => d?.nav).slice(-1)[0]?.nav || 0)) + stats.cashBalance) / calculateBenchmark().value) * 100))) * 12} Vault Units.</p>
            </div>

            <button className={styles.primaryButton} onClick={finishGame}>Back to Hub</button>
          </motion.div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

function Chart({ history }) {
  if (!history || history.length === 0) return null;

  const width = 800;
  const height = 300;
  const padding = 20;

  const validHistory = history.filter(d => d && typeof d.nav === 'number');
  const maxNav = Math.max(200, ...validHistory.map(d => d.nav));
  const minNav = Math.min(50, ...validHistory.map(d => d.nav)) * 0.8;
  const maxMonth = 120; // 10 years * 12 months

  const getX = (m) => padding + (m / maxMonth) * (width - padding * 2);
  const getY = (v) => height - padding - ((v - minNav) / (maxNav - minNav)) * (height - padding * 2);

  const points = validHistory.map(d => `${getX(d.month)},${getY(d.nav)}`).join(' ');
  const areaPoints = validHistory.length > 0 ? `${getX(validHistory[0].month)},${height - padding} ${points} ${getX(validHistory[validHistory.length - 1].month)},${height - padding}` : '';

  // Season bands
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
      
      {/* Units Area */}
      <polygon points={areaPoints} fill="url(#unitsGradient)" opacity={0.5} />
      
      {/* NAV Line */}
      <polyline points={points} fill="none" stroke="var(--gold)" strokeWidth="3" />
      
      <defs>
        <linearGradient id="unitsGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#45D483" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0B1533" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
