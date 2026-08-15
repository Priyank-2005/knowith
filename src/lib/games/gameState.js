'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext({});

export function GameProvider({ children }) {
  const [playerName, setPlayerName] = useState('');
  const [scores, setScores] = useState({
    chapter1: null,
    chapter2: null,
    chapter3: null,
    chapter4: null,
    chapter5: null
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedScores = sessionStorage.getItem('knowith_game_scores');
    const savedName = sessionStorage.getItem('knowith_player_name');
    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedName) setPlayerName(savedName);
    setIsLoaded(true);
  }, []);

  const saveScore = (chapter, score) => {
    setScores(prev => {
      const newScores = { ...prev, [chapter]: score };
      sessionStorage.setItem('knowith_game_scores', JSON.stringify(newScores));
      return newScores;
    });
  };

  const setAndSavePlayerName = (name) => {
    setPlayerName(name);
    sessionStorage.setItem('knowith_player_name', name);
  };
  
  const getTotalScore = () => {
    return Object.values(scores).reduce((acc, val) => acc + (val || 0), 0);
  };

  const submitLeaderboardScore = async (finalScoreValue) => {
    if (!playerName) return;
    const scoreToSubmit = finalScoreValue || getTotalScore();
    try {
      await fetch('/api/v1/games/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, totalScore: scoreToSubmit })
      });
    } catch (e) {
      console.error('Failed to submit score to leaderboard', e);
    }
  };

  const resetGame = () => {
    setScores({ chapter1: null, chapter2: null, chapter3: null, chapter4: null, chapter5: null });
    sessionStorage.removeItem('knowith_game_scores');
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <GameContext.Provider value={{ scores, playerName, getTotalScore, setPlayerName: setAndSavePlayerName, saveScore, resetGame, submitLeaderboardScore }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameState = () => useContext(GameContext);
