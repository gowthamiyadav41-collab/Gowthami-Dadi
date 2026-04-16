/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan font-terminal overflow-hidden flex flex-col relative">
      {/* Overlays */}
      <div className="static-noise" />
      <div className="scanlines" />

      {/* Header */}
      <header className="w-full border-b-4 border-magenta flex items-center justify-between px-10 h-24 shrink-0 z-10 bg-black relative">
        <div className="absolute inset-0 bg-magenta opacity-10 pointer-events-none" />
        
        <div>
          <h1 
            className="font-pixel text-2xl tracking-widest uppercase text-white glitch" 
            data-text="SYSTEM.OVERRIDE"
          >
            SYSTEM.OVERRIDE
          </h1>
          <div className="text-magenta mt-1 text-lg tracking-widest">
            // SNAKE_PROTOCOL_INIT
          </div>
        </div>
        
        <div className="flex gap-12">
          <div className="text-right">
            <div className="text-sm uppercase text-magenta tracking-widest mb-1">DATA_FRAGMENTS</div>
            <div className="font-pixel text-xl text-cyan">{score.toString().padStart(4, '0')}</div>
          </div>
          <div className="text-right">
            <div className="text-sm uppercase text-magenta tracking-widest mb-1">MAX_CORRUPTION</div>
            <div className="font-pixel text-xl text-cyan">{highScore.toString().padStart(4, '0')}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 p-8 relative z-10">
        
        {/* Left Column: Game */}
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          {/* Game Container */}
          <div className="relative p-2 border-2 border-cyan bg-black shadow-[0_0_20px_rgba(0,255,255,0.2)]">
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-magenta" />
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-magenta" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-magenta" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-magenta" />
            
            <SnakeGame onScoreUpdate={handleScoreUpdate} />
          </div>
          
          <div className="text-magenta font-terminal text-lg uppercase tracking-widest text-center mt-4 border border-magenta px-4 py-2 bg-magenta/10">
            [INPUT]: W,A,S,D // [HALT]: SPACE
          </div>
        </div>

        {/* Right Column: Music Player */}
        <div className="w-full max-w-md flex flex-col justify-center">
          <MusicPlayer />
        </div>

      </main>
    </div>
  );
}
