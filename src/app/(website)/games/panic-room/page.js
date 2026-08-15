'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useGameState } from '@/lib/games/gameState';
import { panicRoomRounds } from '@/lib/games/gameData';
import styles from './page.module.css';
import GameHeader from '@/components/GameHeader';

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
  
  const [revealMsg, setRevealMsg] = useState('');
  const timerRef = useRef(null);
  const optionsRef = useRef([]);

  const currentRound = panicRoomRounds[roundIdx];

  useEffect(() => {
    if (currentRound && currentRound.options) {
      const shuffled = [...currentRound.options];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      optionsRef.current = shuffled;
    }
  }, [currentRound]);

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

  const handleAction = (pts, msg) => {
    clearInterval(timerRef.current);
    setRoundScore(pts);
    setTotalScore(prev => prev + pts);
    setRevealMsg(msg || '');
    setShowReveal(true);
  };

  const handleTimeout = () => {
    setRoundScore(25);
    setTotalScore(prev => prev + 25);
    setRevealMsg('Frozen by fear. You couldn\'t decide and the opportunity passed.');
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
    saveScore('chapter3', finalAvg);
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

              <button className={styles.nextBtn} onClick={proceed}>Next Chapter</button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const timerPct = (timeLeft / 12) * 100;
  
  return (
    <>
      <GameHeader />
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
                {optionsRef.current.map((opt, i) => (
                  <button key={i} className={styles.optionBtn} onClick={() => handleAction(opt.points, opt.msg)}>
                    {opt.text}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.revealCard}>
              <div className={styles.revealTitle}>What happened next:</div>
              <div className={styles.recoveryText}>{currentRound.recovery}</div>
              <div className={styles.points}>
                {revealMsg ? `+${roundScore} pts: ${revealMsg}` : 
                 roundScore === 100 ? '+100 pts: Ice in your veins!' : 
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
    </>
  );
}
