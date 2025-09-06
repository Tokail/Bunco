import { motion } from 'motion/react';
import { GameState } from '../types/game';

interface RoundIndicatorProps {
  gameState: GameState;
}

export function RoundIndicator({ gameState }: RoundIndicatorProps) {
  const rounds = [1, 2, 3, 4, 5, 6];
  
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="flex flex-col items-center gap-3">
        {/* Current round indicator */}
        <div className="flex items-center gap-2">
          <span className="text-accent text-lg">Round {gameState.currentRound}</span>
          <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
            <span>{gameState.roundTarget}</span>
          </div>
        </div>
        
        {/* Round progress dots */}
        <div className="flex gap-2">
          {rounds.map((round) => (
            <motion.div
              key={round}
              className={`w-3 h-3 rounded-full border-2 ${
                round === gameState.currentRound
                  ? 'bg-accent border-accent'
                  : round < gameState.currentRound
                  ? 'bg-muted border-muted'
                  : 'bg-transparent border-muted'
              }`}
              animate={round === gameState.currentRound ? {
                scale: [1, 1.2, 1]
              } : {}}
              transition={{
                duration: 1,
                repeat: round === gameState.currentRound ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Team wins score */}
        <div className="flex gap-6 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-destructive rounded"></div>
            <span className="text-destructive-foreground">Red: {gameState.roundWins.red}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-chart-1 rounded"></div>
            <span className="text-primary-foreground">Blue: {gameState.roundWins.blue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}