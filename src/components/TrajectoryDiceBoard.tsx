import { motion } from 'motion/react';
import { Dice } from './Dice';
import { GameState, ScoreResult } from '../types/game';

interface TrajectoryDiceBoardProps {
  gameState: GameState;
  lastScoreResult: ScoreResult | null;
  matchingDice?: { indices: number[], scores: string[] };
  onTrajectoryComplete?: () => void;
  showTrajectoryAnimation?: boolean;
}

export function TrajectoryDiceBoard({ 
  gameState, 
  lastScoreResult, 
  matchingDice,
  onTrajectoryComplete,
  showTrajectoryAnimation = false
}: TrajectoryDiceBoardProps) {

  // Simple dice display in center
  return (
    <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
      <div className="relative">
        {/* Center dice area - always visible */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="flex gap-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "backOut" }}
          >
            {gameState.dice.map((value, index) => (
              <Dice
                key={`center-dice-${index}`}
                value={value}
                isRolling={gameState.isRolling}
                size="lg"
                isMatching={matchingDice?.indices.includes(index) || false}
                scoreIndicator={matchingDice?.scores[index] || undefined}
                showTrajectory={false}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}