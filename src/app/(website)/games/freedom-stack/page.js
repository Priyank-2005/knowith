'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/games/gameState';
import { BINS, SITUATIONS, shuffleSituations, getPlayerTitle } from '@/lib/games/freedomStackData';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GameHeader from '@/components/GameHeader';

const BIN_ORDER = ['plan', 'protect', 'stabilise', 'grow', 'avoid'];
const BIN_ICONS = { plan: 'PL', protect: 'PR', stabilise: 'ST', grow: 'GR', avoid: 'AV' };
const GAME_DURATION = 120;
const WRONG_PENALTY_SECONDS = 3;
const TILES_PER_GAME = 30; // Use 30 of the 60 situations per playthrough

export default function FreedomStack() {
  const router = useRouter();
  const { saveScore } = useGameState();

  const [gameState, setGameState] = useState('intro'); // intro | playing | results
  const [tiles, setTiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [freedomFloors, setFreedomFloors] = useState(0);
  const [currentFloor, setCurrentFloor] = useState({ plan: false, protect: false, stabilise: false, grow: false, avoid: false });
  const [pillarStats, setPillarStats] = useState({ plan: { correct: 0, total: 0 }, protect: { correct: 0, total: 0 }, stabilise: { correct: 0, total: 0 }, grow: { correct: 0, total: 0 }, avoid: { correct: 0, total: 0 } });
  const [mistakes, setMistakes] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [binFlash, setBinFlash] = useState(null);
  const [hazardFlash, setHazardFlash] = useState(false);
  const [tileKey, setTileKey] = useState(0);

  const timerRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  // Start game
  const startGame = useCallback(() => {
    const shuffled = shuffleSituations().slice(0, TILES_PER_GAME);
    setTiles(shuffled);
    setCurrentIndex(0);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrect(0);
    setWrong(0);
    setFreedomFloors(0);
    setCurrentFloor({ plan: false, protect: false, stabilise: false, grow: false, avoid: false });
    setPillarStats({ plan: { correct: 0, total: 0 }, protect: { correct: 0, total: 0 }, stabilise: { correct: 0, total: 0 }, grow: { correct: 0, total: 0 }, avoid: { correct: 0, total: 0 } });
    setMistakes([]);
    setFeedback(null);
    setBinFlash(null);
    setHazardFlash(false);
    setTileKey(0);
    setGameState('playing');
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameState('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // Check if we ran out of tiles
  useEffect(() => {
    if (gameState === 'playing' && currentIndex >= tiles.length && tiles.length > 0) {
      clearInterval(timerRef.current);
      setGameState('results');
    }
  }, [currentIndex, tiles.length, gameState]);

  const currentTile = tiles[currentIndex] || null;

  // Speed factor for animations (faster near the end)
  const speedFactor = timeLeft <= 30 ? 1.5 : timeLeft <= 60 ? 1.2 : 1;

  // Handle bin selection
  const handleBinClick = useCallback((binId) => {
    if (gameState !== 'playing' || !currentTile || feedback) return;

    const isCorrect = currentTile.correctBin === binId;
    const tile = currentTile;

    // Update pillar stats
    setPillarStats(prev => ({
      ...prev,
      [tile.correctBin]: {
        correct: prev[tile.correctBin].correct + (isCorrect ? 1 : 0),
        total: prev[tile.correctBin].total + 1,
      }
    }));

    if (isCorrect) {
      // Correct answer
      setCorrect(prev => prev + 1);
      setScore(prev => prev + 10 + (streak * 2)); // Bonus for streak
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(best => Math.max(best, newStreak));
        return newStreak;
      });

      // Update freedom floor progress
      setCurrentFloor(prev => {
        const updated = { ...prev, [binId]: true };
        const allFilled = Object.values(updated).every(v => v);
        if (allFilled) {
          setFreedomFloors(f => f + 1);
          return { plan: false, protect: false, stabilise: false, grow: false, avoid: false };
        }
        return updated;
      });

      // Flash bin green
      setBinFlash({ id: binId, type: 'correct' });
      setTimeout(() => setBinFlash(null), 400);

      // Advance to next tile
      setCurrentIndex(prev => prev + 1);
      setTileKey(prev => prev + 1);
    } else {
      // Wrong answer
      setWrong(prev => prev + 1);
      setStreak(0);
      setTimeLeft(prev => Math.max(0, prev - WRONG_PENALTY_SECONDS));
      setMistakes(prev => [...prev, { tile, chosenBin: binId }]);

      // Flash bin red + hazard
      setBinFlash({ id: binId, type: 'wrong' });
      setHazardFlash(true);
      setTimeout(() => {
        setBinFlash(null);
        setHazardFlash(false);
      }, 500);

      // Show feedback overlay
      setFeedback({
        tile,
        chosenBin: binId,
        correctBin: tile.correctBin,
        explanation: tile.explanation,
      });

      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
        setCurrentIndex(prev => prev + 1);
        setTileKey(prev => prev + 1);
      }, 2200);
    }
  }, [gameState, currentTile, feedback, streak]);

  // Dismiss feedback early on tap
  const dismissFeedback = useCallback(() => {
    if (feedback) {
      clearTimeout(feedbackTimeoutRef.current);
      setFeedback(null);
      setCurrentIndex(prev => prev + 1);
      setTileKey(prev => prev + 1);
    }
  }, [feedback]);

  // Calculate final score (0-100)
  const totalAnswered = correct + wrong;
  const accuracy = totalAnswered > 0 ? Math.round((correct / totalAnswered) * 100) : 0;
  const finalScore = accuracy;
  const playerTitle = getPlayerTitle(finalScore);

  // Generate lessons from mistakes
  const generateLessons = () => {
    const weakBins = {};
    mistakes.forEach(m => {
      const bin = m.tile.correctBin;
      if (!weakBins[bin]) weakBins[bin] = [];
      weakBins[bin].push(m);
    });

    const lessons = [];
    const binKeys = Object.keys(weakBins).sort((a, b) => weakBins[b].length - weakBins[a].length);

    for (let i = 0; i < Math.min(3, binKeys.length); i++) {
      const binId = binKeys[i];
      const bin = BINS[binId];
      const example = weakBins[binId][0];
      lessons.push({
        pillar: bin.label,
        emoji: bin.emoji,
        color: bin.color,
        count: weakBins[binId].length,
        explanation: example.tile.explanation,
        situation: example.tile.text,
      });
    }

    // If fewer than 3 mistake-based lessons, add generic ones
    while (lessons.length < 3) {
      const fillers = [
        { pillar: 'Plan', emoji: '🧭', color: BINS.plan.color, count: 0, explanation: 'Financial planning begins with setting inflation-adjusted goals and mapping out a clear execution strategy.', situation: 'Always plan before picking products.' },
        { pillar: 'Grow', emoji: '🌱', color: BINS.grow.color, count: 0, explanation: 'Staying invested through full market cycles is the only reliable path to building long-term wealth.', situation: 'Patience is the most underrated investment skill.' },
        { pillar: 'Avoid', emoji: '⚠️', color: BINS.avoid.color, count: 0, explanation: 'The biggest wealth destroyers are behavioral — panic, FOMO, leverage, and performance chasing.', situation: 'What you avoid matters as much as what you invest in.' },
      ];
      const filler = fillers[lessons.length];
      if (filler && !lessons.find(l => l.pillar === filler.pillar)) {
        lessons.push(filler);
      } else break;
    }

    return lessons;
  };

  // Finish & save score
  const finishGame = () => {
    saveScore('chapter6', finalScore);
    router.push('/games');
  };

  // Generate share card using Canvas
  const shareResult = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, 1080, 1080);

    // Gradient accent
    const gradient = ctx.createLinearGradient(0, 0, 1080, 0);
    gradient.addColorStop(0, '#F59E0B');
    gradient.addColorStop(1, '#EF4444');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 6);

    // Title
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FREEDOM STACK', 540, 120);

    ctx.fillStyle = '#a0aec0';
    ctx.font = '20px sans-serif';
    ctx.fillText('by Knowith Capital', 540, 160);

    // Score circle
    ctx.beginPath();
    ctx.arc(540, 380, 140, 0, Math.PI * 2);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 12;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(540, 380, 140, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * finalScore / 100));
    ctx.strokeStyle = finalScore >= 90 ? '#10B981' : finalScore >= 75 ? '#3B82F6' : finalScore >= 55 ? '#F59E0B' : '#EF4444';
    ctx.lineWidth = 12;
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 72px sans-serif';
    ctx.fillText(finalScore.toString(), 540, 400);

    ctx.fillStyle = '#a0aec0';
    ctx.font = '22px sans-serif';
    ctx.fillText('FINANCIAL FREEDOM SCORE', 540, 450);

    // Title
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(playerTitle.title, 540, 560);

    ctx.fillStyle = '#a0aec0';
    ctx.font = '18px sans-serif';
    ctx.fillText(playerTitle.desc, 540, 600);

    // Stats
    const statsY = 680;
    const statsData = [
      { label: 'Correct', value: correct.toString() },
      { label: 'Hazards', value: wrong.toString() },
      { label: 'Best Streak', value: bestStreak.toString() },
      { label: 'Floors', value: freedomFloors.toString() },
    ];

    statsData.forEach((s, i) => {
      const x = 180 + i * 240;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 40px sans-serif';
      ctx.fillText(s.value, x, statsY);
      ctx.fillStyle = '#64748b';
      ctx.font = '16px sans-serif';
      ctx.fillText(s.label, x, statsY + 30);
    });

    // Pillar accuracy bars
    const barY = 780;
    BIN_ORDER.forEach((binId, i) => {
      const bin = BINS[binId];
      const stat = pillarStats[binId];
      const acc = stat.total > 0 ? stat.correct / stat.total : 0;
      const barWidth = 700;
      const x = 190;
      const y = barY + i * 40;

      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(bin.label, x - 120, y + 15);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x, y, barWidth, 22);

      ctx.fillStyle = bin.color;
      ctx.fillRect(x, y, barWidth * acc, 22);

      ctx.fillStyle = '#fff';
      ctx.textAlign = 'right';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`${Math.round(acc * 100)}%`, x + barWidth + 50, y + 16);
    });

    ctx.textAlign = 'center';

    // Footer
    ctx.fillStyle = '#64748b';
    ctx.font = '16px sans-serif';
    ctx.fillText('Can you build a better Freedom Stack? Play at knowithcapital.com/games', 540, 1040);

    // Convert to blob and share/download
    canvas.toBlob(async (blob) => {
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        try {
          const file = new File([blob], 'freedom-stack-score.png', { type: 'image/png' });
          await navigator.share({
            title: 'Freedom Stack Score',
            text: `I scored ${finalScore}/100 on Freedom Stack by Knowith Capital! I'm a ${playerTitle.title}. Can you beat my score? 🏗️💰`,
            files: [file],
          });
          return;
        } catch (e) {
          // Fallback to download
        }
      }

      // Desktop: download + copy text
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'freedom-stack-score.png';
      a.click();
      URL.revokeObjectURL(url);

      try {
        await navigator.clipboard.writeText(
          `I scored ${finalScore}/100 on Freedom Stack by Knowith Capital! I'm a ${playerTitle.title}. Can you beat my score? Play at knowithcapital.com/games`
        );
      } catch (e) { /* clipboard may not be available */ }
    }, 'image/png');
  };

  // Timer bar color
  const timerColor = timeLeft > 60 ? '#10B981' : timeLeft > 30 ? '#F59E0B' : '#EF4444';

  return (
    <>
      {gameState !== 'playing' ? <Navbar /> : <GameHeader />}
      <div className={styles.container}>
        <main className={styles.main}>
          {/* ── INTRO SCREEN ── */}
          {gameState === 'intro' && (
            <motion.div className={styles.introScreen} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className={styles.chapterBadge}>Chapter 06</div>
              <h1 className={styles.introTitle}>Freedom Stack</h1>
              <p className={styles.introDesc}>
                You have 120 seconds. Financial situations will appear one by one.
                Sort each into the correct pillar to build your Freedom Floor.
                Wrong choices create hazards, break your streak, and cost you 3 seconds.
              </p>

              <div className={styles.pillarsGrid}>
                {BIN_ORDER.map(binId => {
                  const bin = BINS[binId];
                  return (
                    <div key={binId} className={styles.pillarCard} style={{ borderTopColor: bin.color }}>
                      <span className={styles.pillarLabel} style={{ color: bin.color }}>{bin.label}</span>
                      <span className={styles.pillarDesc}>{bin.desc}</span>
                    </div>
                  );
                })}
              </div>

              <div className={styles.rules}>
                <h3>How it works:</h3>
                <ul>
                  <li>A financial situation tile appears — tap the correct pillar bin</li>
                  <li>Build a <strong>Freedom Floor</strong> by hitting all 5 pillars</li>
                  <li>Wrong answers show why, remove 3 seconds, and create a hazard</li>
                  <li>Speed increases in the final 30 seconds</li>
                  <li>Your score = your accuracy across all 5 pillars</li>
                </ul>
              </div>

              <button className={styles.primaryButton} onClick={startGame}>
                Begin Challenge
              </button>
            </motion.div>
          )}

          {/* ── PLAYING SCREEN ── */}
          {gameState === 'playing' && (
            <div className={styles.gameBoard}>
              {/* Hazard flash overlay */}
              {hazardFlash && <div className={styles.hazardFlash} />}

              {/* Top bar */}
              <div className={styles.topBar}>
                <div className={styles.timerSection}>
                  <div className={styles.timerBar}>
                    <div
                      className={styles.timerFill}
                      style={{
                        width: `${(timeLeft / GAME_DURATION) * 100}%`,
                        backgroundColor: timerColor,
                      }}
                    />
                  </div>
                  <div className={styles.timerText}>{timeLeft}s</div>
                </div>

                <div className={styles.statsRow}>
                  <div className={styles.scoreDisplay}>
                    <span className={styles.statLabel}>Score</span>
                    <span className={styles.statValue}>{score}</span>
                  </div>
                  <div className={styles.streakDisplay}>
                    <span className={styles.statLabel}>Streak</span>
                    <span className={styles.statValue}>{streak}</span>
                  </div>
                  <div className={styles.floorCount}>
                    <span className={styles.statLabel}>Floors</span>
                    <span className={styles.statValue}>{freedomFloors}</span>
                  </div>
                </div>

                {/* Freedom Floor progress & Exit */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
                  <div className={styles.floorProgress}>
                    {BIN_ORDER.map(binId => (
                      <div
                        key={binId}
                        className={`${styles.floorDot} ${currentFloor[binId] ? styles.floorDotFilled : ''}`}
                        style={{ backgroundColor: currentFloor[binId] ? BINS[binId].color : undefined, borderColor: BINS[binId].color }}
                        title={BINS[binId].label}
                      >
                        {BINS[binId].label.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <button className={styles.exitButton} onClick={() => router.push('/games')} title="Exit Game">
                    ✕
                  </button>
                </div>
              </div>

              {/* Tile area */}
              <div className={styles.tileArea}>
                <AnimatePresence mode="wait">
                  {currentTile && (
                    <motion.div
                      key={tileKey}
                      className={styles.tile}
                      initial={{ opacity: 0, y: -60, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 40, scale: 0.8 }}
                      transition={{ duration: 0.35 / speedFactor, ease: 'easeOut' }}
                    >
                      <p className={styles.tileText}>{currentTile.text}</p>
                      <span className={styles.tileCounter}>{currentIndex + 1} / {tiles.length}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bins row */}
              <div className={styles.binsRow}>
                {BIN_ORDER.map(binId => {
                  const bin = BINS[binId];
                  const flashClass = binFlash?.id === binId
                    ? binFlash.type === 'correct' ? styles.binCorrect : styles.binWrong
                    : '';
                  return (
                    <button
                      key={binId}
                      className={`${styles.bin} ${flashClass}`}
                      style={{ borderColor: bin.color }}
                      onClick={() => handleBinClick(binId)}
                      disabled={!!feedback}
                    >
                      <span className={styles.binLabel} style={{ color: bin.color }}>{bin.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback overlay */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    className={styles.feedbackOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={dismissFeedback}
                  >
                    <div className={styles.feedbackCard}>
                      <div className={styles.feedbackIcon}>HAZARD</div>
                      <p className={styles.feedbackWrong}>
                        Not <strong>{BINS[feedback.chosenBin].label}</strong> — this belongs in{' '}
                        <strong style={{ color: BINS[feedback.correctBin].color }}>
                          {BINS[feedback.correctBin].label}
                        </strong>
                      </p>
                      <p className={styles.feedbackExplanation}>{feedback.explanation}</p>
                      <span className={styles.feedbackPenalty}>-3 seconds · Streak lost</span>
                      <span className={styles.feedbackTap}>Tap to continue</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── RESULTS SCREEN ── */}
          {gameState === 'results' && (
            <motion.div className={styles.resultsScreen} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className={styles.chapterBadge}>Game Over</div>

              {/* Score circle */}
              <div className={styles.scoreCircle}>
                <svg viewBox="0 0 120 120" className={styles.scoreSvg}>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#1e293b" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke={finalScore >= 90 ? '#10B981' : finalScore >= 75 ? '#3B82F6' : finalScore >= 55 ? '#F59E0B' : '#EF4444'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.PI * 104 * finalScore / 100} ${Math.PI * 104}`}
                    transform="rotate(-90 60 60)"
                    className={styles.scoreRing}
                  />
                </svg>
                <div className={styles.scoreNumber}>{finalScore}</div>
                <div className={styles.scoreUnit}>/ 100</div>
              </div>

              <h2 className={styles.playerTitle}>{playerTitle.title}</h2>
              <p className={styles.playerTitleDesc}>{playerTitle.desc}</p>

              {/* Stats grid */}
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <div className={styles.statBoxValue}>{correct}</div>
                  <div className={styles.statBoxLabel}>Correct</div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statBoxValue} style={{ color: '#dc3232' }}>{wrong}</div>
                  <div className={styles.statBoxLabel}>Hazards</div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statBoxValue}>{bestStreak}</div>
                  <div className={styles.statBoxLabel}>Best Streak</div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statBoxValue}>{freedomFloors}</div>
                  <div className={styles.statBoxLabel}>Freedom Floors</div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statBoxValue}>{totalAnswered}</div>
                  <div className={styles.statBoxLabel}>Tiles Sorted</div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statBoxValue}>{accuracy}%</div>
                  <div className={styles.statBoxLabel}>Accuracy</div>
                </div>
              </div>

              {/* Pillar accuracy */}
              <div className={styles.pillarAccuracySection}>
                <h3 className={styles.sectionTitle}>Pillar Accuracy</h3>
                {BIN_ORDER.map(binId => {
                  const bin = BINS[binId];
                  const stat = pillarStats[binId];
                  const acc = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                  return (
                    <div key={binId} className={styles.pillarAccuracy}>
                      <span className={styles.pillarAccLabel}>{bin.label}</span>
                      <div className={styles.pillarAccBar}>
                        <div className={styles.pillarAccFill} style={{ width: `${acc}%`, backgroundColor: bin.color }} />
                      </div>
                      <span className={styles.pillarAccPct} style={{ color: bin.color }}>{acc}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Lessons */}
              <div className={styles.lessonsSection}>
                <h3 className={styles.sectionTitle}>Your Takeaways</h3>
                {generateLessons().map((lesson, i) => (
                  <div key={i} className={styles.lessonCard} style={{ borderLeftColor: lesson.color }}>
                    <div className={styles.lessonHeader}>
                      <strong>{lesson.pillar}</strong>
                      {lesson.count > 0 && <span className={styles.lessonMistakes}>{lesson.count} mistake{lesson.count > 1 ? 's' : ''}</span>}
                    </div>
                    <p className={styles.lessonText}>{lesson.explanation}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className={styles.resultActions}>
                <button className={styles.shareButton} onClick={shareResult}>
                  Share Result
                </button>
                <button className={styles.primaryButton} onClick={finishGame}>
                  Back to Hub
                </button>
                <button className={styles.backButton} onClick={startGame}>
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
      {gameState !== 'playing' && <Footer />}
    </>
  );
}
