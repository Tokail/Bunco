import { motion } from 'motion/react';
import { Dice } from './Dice';
import { GameState, ScoreResult } from '../types/game';
import { DiceLifecycleManager } from '../services/diceLifecycleManager';

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

  // Determine if dice should be visible based on lifecycle phase
  const shouldShowDice = gameState.diceInstances.length > 0 && 
    ['reveal'].includes(gameState.diceLifecyclePhase);
  
  // Debug: Log current dice state (enable if needed)
  if (gameState.diceInstances.length > 0) {
    console.log('📋 TrajectoryDiceBoard state:', {
      diceInstancesLength: gameState.diceInstances.length,
      lifecyclePhase: gameState.diceLifecyclePhase,
      shouldShowDice,
      hasInstances: gameState.diceInstances.length > 0
    });
  }

  // Get lifecycle-specific CSS classes
  const phaseClasses = DiceLifecycleManager.getPhaseClasses(gameState.diceLifecyclePhase);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
      <div className="relative">
        {/* Trajectory dice - shown during all active lifecycle phases */}
        {gameState.diceInstances.map((diceInstance, index) => (
          <motion.div
            key={diceInstance.id}
            className={`${phaseClasses} absolute`}
            style={{
              left: `${diceInstance.position.x}px`,
              top: `${diceInstance.position.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dice
              value={diceInstance.value}
              isRolling={gameState.diceLifecyclePhase === 'rolling'}
              size="lg"
              isMatching={diceInstance.isMatching || false}
              scoreIndicator={diceInstance.scoreIndicator || undefined}
              showTrajectory={['flight', 'impact'].includes(gameState.diceLifecyclePhase)}
            />
          </motion.div>
        ))}

        {/* Final dice display in center - only during reveal phase */}
        {shouldShowDice && (
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
                  isRolling={false}
                  size="lg"
                  isMatching={matchingDice?.indices.includes(index) || false}
                  scoreIndicator={matchingDice?.scores[index] || undefined}
                  showTrajectory={false}
                />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}