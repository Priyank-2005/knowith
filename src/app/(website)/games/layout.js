'use client';
import { GameProvider } from '@/lib/games/gameState';

export default function GamesLayout({ children }) {
  return (
    <GameProvider>
      {children}
    </GameProvider>
  );
}
