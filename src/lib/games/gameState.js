'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext({});

export function GameProvider({ children }) {
  const [vaultUnits, setVaultUnits] = useState(0);
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
    const savedUnits = sessionStorage.getItem('knowith_vault_units');
    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedUnits) setVaultUnits(parseInt(savedUnits, 10));
    setIsLoaded(true);
  }, []);

  const saveScore = (chapter, score, unitsEarned) => {
    setScores(prev => {
      const newScores = { ...prev, [chapter]: score };
      sessionStorage.setItem('knowith_game_scores', JSON.stringify(newScores));
      return newScores;
    });
    setVaultUnits(prev => {
      const newUnits = prev + unitsEarned;
      sessionStorage.setItem('knowith_vault_units', newUnits.toString());
      return newUnits;
    });
  };

  const resetGame = () => {
    setScores({ chapter1: null, chapter2: null, chapter3: null, chapter4: null, chapter5: null });
    setVaultUnits(0);
    sessionStorage.removeItem('knowith_game_scores');
    sessionStorage.removeItem('knowith_vault_units');
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <GameContext.Provider value={{ vaultUnits, scores, saveScore, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameState = () => useContext(GameContext);
