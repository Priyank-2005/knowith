'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useGameState } from '@/lib/games/gameState';
import { panicRoomRounds } from '@/lib/games/gameData';
import styles from './page.module.css';

export default function PanicRoom() {
  const router = useRouter();
  const { saveScore } = useGameState();
  const [started, setStarted] = useState(false);
  const [roundIdx, setRoundIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12);
  const [showReveal, setShowReveal] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const timerRef = useRef(null);

  useEffect(() => {
    if (started && !showReveal && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, showReveal, gameOver, roundIdx]);

  const startGame = () => {
    setStarted(true);
    setTimeLeft(12);
  };

  const handleTimeout = () => {
    setRoundScore(25);
    setTotalScore(prev => prev + 25);
    setShowReveal(true);
  };

  const handleAction = (pts) => {
    clearInterval(timerRef.current);
    setRoundScore(pts);
    setTotalScore(prev => prev + pts);
    setShowReveal(true);
  };

  const nextRound = () => {
    if (roundIdx < panicRoomRounds.length - 1) {
      setRoundIdx(prev => prev + 1);
      setShowReveal(false);
      setTimeLeft(12);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    const finalAvg = Math.round(totalScore / panicRoomRounds.length);
    const vaultUnits = finalAvg * 10;
    saveScore('chapter3', finalAvg, vaultUnits);
    setGameOver(true);
  };

  const proceed = () => {
    router.push('/games/rapid-fire');
  };

  if (!started) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.intro}>
            <h1 className={styles.title}>Chapter 3: The Panic Room</h1>
            <p>Markets are crashing. Headlines are screaming. Can you keep your cool? You have 12 seconds per crisis.</p>
            <button className={styles.nextBtn} onClick={startGame} style={{marginTop: '2rem'}}>Enter the Panic Room</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (gameOver) {
    const finalAvg = Math.round(totalScore / panicRoomRounds.length);
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.gameArea}>
            <div className={styles.finalScoreArea}>
              <h2>Simulation Complete</h2>
              <p>Your Discipline Score</p>
              <div className={styles.scoreValue}>{finalAvg}/100</div>
              <p style={{marginBottom: '2rem'}}>Units Earned: {finalAvg * 10}</p>
              <button className={styles.nextBtn} onClick={proceed}>Next Chapter</button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const currentRound = panicRoomRounds[roundIdx];
  const timerPct = (timeLeft / 12) * 100;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.gameArea}>
          {!showReveal ? (
            <>
              <div className={styles.roundInfo}>
                <span className={styles.yearBadge}>{currentRound.year}</span>
                <span className={styles.crisisTitle}>{currentRound.title}</span>
                <span>Round {roundIdx + 1}/6</span>
              </div>
              
              <h2 className={styles.headline}>"{currentRound.headline}"</h2>
              
              <div className={styles.timerBarContainer}>
                <div 
                  className={`${styles.timerBar} ${timeLeft <= 4 ? styles.danger : ''}`} 
                  style={{width: `${timerPct}%`}}
                ></div>
              </div>
              
              <div className={styles.options}>
                <button className={styles.optionBtn} onClick={() => handleAction(100)}>Keep the SIP running (Buy cheap units)</button>
                <button className={styles.optionBtn} onClick={() => handleAction(40)}>Pause until it settles</button>
                <button className={styles.optionBtn} onClick={() => handleAction(0)}>Redeem everything</button>
              </div>
            </>
          ) : (
            <div className={styles.revealCard}>
              <div className={styles.revealTitle}>What happened next:</div>
              <div className={styles.recoveryText}>{currentRound.recovery}</div>
              <div className={styles.points}>
                {roundScore === 100 ? '+100 pts: Ice in your veins!' : 
                 roundScore === 40 ? '+40 pts: You missed the bottom.' : 
                 roundScore === 25 ? '+25 pts: Frozen by fear.' : 
                 '+0 pts: Panic sold at the bottom.'}
              </div>
              <button className={styles.nextBtn} onClick={nextRound}>
                {roundIdx < panicRoomRounds.length - 1 ? 'Next Crisis' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
