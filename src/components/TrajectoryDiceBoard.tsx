import { motion } from 'motion/react';
import { Dice } from './Dice';
import { GameState, ScoreResult } from '../types/game';
import { useState, useEffect } from 'react';

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

  // Dice display with traveling animation
  const currentPlayer = gameState.players[gameState.currentPlayer];
  const isBottomRightPlayer = currentPlayer?.position === 'bottom-right';
  
  const [animationPhase, setAnimationPhase] = useState<'spawn' | 'traveling' | 'center'>('spawn');
  
  // Handle animation phases when dice become visible
  useEffect(() => {
    if (gameState.diceVisible && isBottomRightPlayer) {
      // Start at spawn position
      setAnimationPhase('spawn');
      
      // After a brief moment, start traveling
      const travelTimeout = setTimeout(() => {
        setAnimationPhase('traveling');
        
        // After traveling, move to center
        const centerTimeout = setTimeout(() => {
          setAnimationPhase('center');
        }, 750); // Slightly shorter to reduce pause
        
        return () => clearTimeout(centerTimeout);
      }, 50); // Shorter delay before traveling
      
      return () => clearTimeout(travelTimeout);
    } else {
      setAnimationPhase('spawn');
    }
  }, [gameState.diceVisible, isBottomRightPlayer]);
  
  // Calculate positions for individual dice based on animation phase
  const getDicePositionStyle = (diceIndex: number) => {
    const baseSpawnX = 85; // 85% from left (15% from right)
    const baseSpawnY = 85; // 85% from top (15% from bottom)
    
    switch (animationPhase) {
      case 'spawn':
        return {
          // All dice start at the same point
          left: `${baseSpawnX}%`,
          top: `${baseSpawnY}%`,
          transform: 'translate(-50%, -150px)' // Above player position
        };
      case 'traveling':
        // Spread dice out as they travel to hit area edge (opposite side)
        // For bottom-right player, travel to top-left edge of hit area
        const spreadOffsets = [
          { x: -25, y: -25 }, // Die 0: top-left spread
          { x: 0, y: -30 },   // Die 1: center-top spread
          { x: 25, y: -25 }   // Die 2: top-right spread
        ];
        const offset = spreadOffsets[diceIndex] || { x: 0, y: 0 };
        
        return {
          // Travel to ~25% (hit area edge) with spreading
          left: `${25 + offset.x * 0.4}%`, // Reach actual hit area edge + spread
          top: `${25 + offset.y * 0.4}%`,
          transform: 'translate(-50%, -50%)'
        };
      case 'center':
        // Dice settle with wide separation to prevent overlap with score indicators
        const centerOffsets = [
          { x: -100, y: -30 }, // Die 0: far left and up
          { x: 0, y: 40 },     // Die 1: center and down
          { x: 100, y: -20 }   // Die 2: far right and up
        ];
        const centerOffset = centerOffsets[diceIndex] || { x: 0, y: 0 };
        
        return {
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${centerOffset.x}px), calc(-50% + ${centerOffset.y}px))`
        };
      default:
        return {};
    }
  };
  
  return (
    <div className="absolute inset-0 z-15 pointer-events-none">
      {/* Individual dice with spreading animation */}
      {gameState.diceVisible && isBottomRightPlayer && (
        <>
          {gameState.dice.map((value, index) => (
            <motion.div
              key={`traveling-dice-${index}`}
              className="absolute"
              style={getDicePositionStyle(index)}
              animate={getDicePositionStyle(index)}
              transition={{
                duration: animationPhase === 'traveling' ? 0.8 : 0.15,
                ease: animationPhase === 'traveling' ? "linear" : "easeOut",
                type: "tween"
              }}
            >
              <Dice
                value={value}
                isRolling={gameState.isRolling}
                size="lg"
                isMatching={matchingDice?.indices.includes(index) || false}
                scoreIndicator={matchingDice?.scores[index] || undefined}
              />
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}