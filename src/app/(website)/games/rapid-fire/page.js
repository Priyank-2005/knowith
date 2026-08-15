'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useGameState } from '@/lib/games/gameState';
import { rapidFireQuestions } from '@/lib/games/gameData';
import styles from './page.module.css';
import GameHeader from '@/components/GameHeader';

export default function RapidFire() {
  const router = useRouter();
  const { saveScore } = useGameState();
  const [started, setStarted] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answersState, setAnswersState] = useState(Array(10).fill('pending')); // pending, correct, wrong
  const [times, setTimes] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (started && !answered && !gameOver) {
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
  }, [started, answered, gameOver, qIdx]);

  const startGame = () => {
    setStarted(true);
    setTimeLeft(30);
  };

  const handleTimeout = () => {
    setAnswered(true);
    setSelectedOption('TIMEOUT');
    updateAnswersState(false);
    setTimes(prev => [...prev, 0]);
  };

  const handleAnswer = (option) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setAnswered(true);
    setSelectedOption(option);
    
    const isCorrect = option === rapidFireQuestions[qIdx].options[rapidFireQuestions[qIdx].correct];
    updateAnswersState(isCorrect);
    setTimes(prev => [...prev, timeLeft]);
  };

  const updateAnswersState = (isCorrect) => {
    const newStates = [...answersState];
    newStates[qIdx] = isCorrect ? 'correct' : 'wrong';
    setAnswersState(newStates);
  };

  const nextQuestion = () => {
    if (qIdx < rapidFireQuestions.length - 1) {
      setQIdx(prev => prev + 1);
      setAnswered(false);
      setSelectedOption(null);
      setTimeLeft(30);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    const correctCount = answersState.filter(s => s === 'correct').length;
    const avgTimeRemaining = times.reduce((a, b) => a + b, 0) / times.length;
    
    const accuracyScore = (correctCount / 10) * 80;
    const speedScore = (avgTimeRemaining / 30) * 20;
    const finalScore = Math.round(accuracyScore + speedScore);
    saveScore('chapter4', finalScore);
    setGameOver(true);
  };

  const proceed = () => {
    router.push('/games/scorecard');
  };

  if (!started) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.intro}>
            <h1 className={styles.title}>Chapter 4: Unit Rapid Fire</h1>
            <p>10 Questions. 30 Seconds each. Test your knowledge. Speed matters.</p>
            <button className={styles.nextBtn} onClick={startGame} style={{marginTop: '2rem'}}>Start Quiz</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (gameOver) {
    const correctCount = answersState.filter(s => s === 'correct').length;
    const avgTimeRemaining = times.reduce((a, b) => a + b, 0) / times.length;
    const accuracyScore = (correctCount / 10) * 80;
    const speedScore = (avgTimeRemaining / 30) * 20;
    const finalScore = Math.round(accuracyScore + speedScore);

    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.gameArea} style={{textAlign: 'center'}}>
            <h2 className={styles.title}>Quiz Complete</h2>
            <div className={styles.scoreGrid}>
              <div className={styles.scoreItem}>
                <span className={styles.scoreLabel}>Accuracy</span>
                <span className={styles.scoreValue}>{correctCount}/10</span>
              </div>
              <div className={styles.scoreItem}>
                <span className={styles.scoreLabel}>Avg Time Left</span>
                <span className={styles.scoreValue}>{avgTimeRemaining.toFixed(1)}s</span>
              </div>
              <div className={styles.scoreItem}>
                <span className={styles.scoreLabel}>Final Score</span>
                <span className={styles.scoreValue}>{finalScore}/100</span>
              </div>
            </div>

            <button className={styles.nextBtn} onClick={proceed}>View Final Scorecard</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const currentQ = rapidFireQuestions[qIdx];
  const isCorrectAnswer = selectedOption === currentQ.options[currentQ.correct];

  return (
    <>
      <GameHeader />
      <div className={styles.container}>
        <div className={styles.gameArea}>
          <div className={styles.header}>
            <div className={styles.progress}>
              {answersState.map((state, i) => (
                <div key={i} className={`${styles.dot} ${state === 'pending' && i === qIdx ? styles.active : ''} ${state === 'correct' ? styles.correct : ''} ${state === 'wrong' ? styles.wrong : ''}`}></div>
              ))}
            </div>
            <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
              <div className={`${styles.timerRing} ${timeLeft <= 10 ? styles.danger : ''}`}>
                {timeLeft}
              </div>
              <button 
                className={styles.nextBtn} 
                style={{padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: 'transparent', border: '1px solid #45D483', color: '#45D483'}} 
                onClick={() => router.push('/games')}
              >
                Exit Game
              </button>
            </div>
          </div>

          <div className={styles.question}>
            {currentQ.q}
          </div>

          <div className={styles.optionsGrid}>
            {currentQ.options.map((opt, i) => {
              let btnClass = styles.optionBtn;
              if (answered) {
                if (opt === currentQ.options[currentQ.correct]) btnClass += ` ${styles.correct}`;
                else if (opt === selectedOption) btnClass += ` ${styles.wrong}`;
              }
              
              return (
                <button 
                  key={i} 
                  className={btnClass}
                  onClick={() => handleAnswer(opt)}
                  disabled={answered}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`${styles.feedbackCard} ${isCorrectAnswer ? styles.correctCard : styles.wrongCard}`}>
              <div className={styles.explanation}>
                <strong>{isCorrectAnswer ? 'Correct!' : selectedOption === 'TIMEOUT' ? 'Time is up!' : 'Incorrect.'}</strong> {currentQ.explanation}
              </div>
              <button className={styles.nextBtn} onClick={nextQuestion}>
                {qIdx < 9 ? 'Next Question' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
