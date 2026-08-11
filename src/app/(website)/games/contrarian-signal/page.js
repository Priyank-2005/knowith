'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/games/gameState';
import { contrarianSignalDispatches } from '@/lib/games/gameData';
import { Coins } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GameHeader from '@/components/GameHeader';

export default function ContrarianSignal() {
  const router = useRouter();
  const { saveScore } = useGameState();
  
  const [hasStarted, setHasStarted] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const dispatches = contrarianSignalDispatches;
  const currentDispatch = dispatches[roundIndex];

  const handleAction = (action) => {
    setSelectedAction(action);
    const roundScore = currentDispatch.outcomes[action].score;
    setTotalScore(prev => prev + roundScore);
    setShowOutcome(true);
  };

  const handleNext = () => {
    if (roundIndex < dispatches.length - 1) {
      setRoundIndex(prev => prev + 1);
      setSelectedAction(null);
      setShowOutcome(false);
    } else {
      setIsGameOver(true);
    }
  };

  const finishGame = () => {
    // 12 rounds * max 100 = 1200 max score. Let's make vault units 1:1 with score for this one.
    const vaultUnits = totalScore;
    saveScore('chapter5', totalScore, vaultUnits);
    router.push('/games/scorecard');
  };

  if (isGameOver) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <motion.div 
            className={styles.intro}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={styles.title}>Game Over</h1>
            <p className={styles.subtitle}>
              You scored {totalScore} out of {dispatches.length * 100} points!
            </p>
            <div className={styles.scoreReward}>
              <Coins className="w-5 h-5 text-amber-500" />
              <span>+{totalScore} Vault Units Earned</span>
            </div>
            <br/>
            <button onClick={finishGame} className={styles.startBtn}>
              View Final Scorecard
            </button>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  if (!hasStarted) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <motion.div 
            className={styles.intro}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={styles.title}>The Contrarian Signal</h1>
            <p className={styles.subtitle}>
              Can you stay rational when the world is panicking, or hold back when everyone else is euphoric? Read the actual headlines from 12 historical market extremes and make your call.
            </p>
            <button onClick={() => setHasStarted(true)} className={styles.startBtn}>
              Begin Dispatches
            </button>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <GameHeader />
      <div className={styles.container}>
        <div className={styles.gameArea}>
          <div className={styles.progress}>
            Dispatch {roundIndex + 1} of {dispatches.length}
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={roundIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={styles.newspaper}
            >
              <div className={styles.date}>{currentDispatch.date}</div>
              <h2 className={styles.headline}>{currentDispatch.headline}</h2>
              <p className={styles.context}>{currentDispatch.context}</p>
            </motion.div>
          </AnimatePresence>

          {!showOutcome ? (
            <motion.div 
              className={styles.actions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button onClick={() => handleAction('buy')} className={styles.actionBtn}>
                <span className={styles.actionLabel}>Invest Heavily</span>
                <span className={styles.actionDesc}>Buy the fear/momentum</span>
              </button>
              <button onClick={() => handleAction('hold')} className={styles.actionBtn}>
                <span className={styles.actionLabel}>Stay the Course</span>
                <span className={styles.actionDesc}>Do nothing, stick to plan</span>
              </button>
              <button onClick={() => handleAction('sell')} className={styles.actionBtn}>
                <span className={styles.actionLabel}>Liquidate</span>
                <span className={styles.actionDesc}>Sell everything</span>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              className={styles.outcome}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className={styles.outcomeTitle}>
                {selectedAction === 'buy' ? 'You Invested' : selectedAction === 'hold' ? 'You Held Firm' : 'You Liquidated'}
              </h3>
              <p className={styles.outcomeText}>
                {currentDispatch.outcomes[selectedAction].text}
              </p>
              
              <div className={styles.scoreReward}>
                <span>+{currentDispatch.outcomes[selectedAction].score} Points</span>
              </div>
              <br/>
              <button onClick={handleNext} className={styles.nextBtn}>
                {roundIndex < dispatches.length - 1 ? 'Next Dispatch' : 'Complete Game'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
