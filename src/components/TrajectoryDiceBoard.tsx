import { motion } from 'motion/react';
import { Dice } from './Dice';
import { GameState, ScoreResult } from '../types/game';
import { useState, useEffect } from 'react';
import Roll11 from '../imports/Roll11';
import Roll21 from '../imports/Roll21';

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
  
  const [animationPhase, setAnimationPhase] = useState<'spawn' | 'traveling' | 'center'>('spawn');
  const [rollingFrame, setRollingFrame] = useState<1 | 2>(1);
  const [randomPositions, setRandomPositions] = useState<Array<{x: number, y: number, rotation: number}>>([]);
  
  // Handle animation phases when dice become visible
  useEffect(() => {
    if (gameState.diceVisible && currentPlayer) {
      // Generate new random positions for this roll
      const newRandomPositions = gameState.dice.map(() => ({
        x: Math.random() * 80 - 40, // -40px to +40px variation
        y: Math.random() * 80 - 40, // -40px to +40px variation
        rotation: Math.random() * 90 - 45 // -45° to +45° rotation
      }));
      setRandomPositions(newRandomPositions);
      
      // Start at spawn position
      setAnimationPhase('spawn');
      
      // After a brief moment, start traveling
      const travelTimeout = setTimeout(() => {
        setAnimationPhase('traveling');
        
        // After traveling, move to center
        const centerTimeout = setTimeout(() => {
          setAnimationPhase('center');
        }, 500); // Faster travel time for more natural motion
        
        return () => clearTimeout(centerTimeout);
      }, 10); // Shorter delay before traveling
      
      return () => clearTimeout(travelTimeout);
    } else {
      setAnimationPhase('spawn');
    }
  }, [gameState.diceVisible, currentPlayer?.position, gameState.dice]);
  
  // Handle rolling animation during traveling phase
  useEffect(() => {
    let rollingInterval: NodeJS.Timeout;
    
    if (animationPhase === 'traveling') {
      // Alternate between roll frames every 60ms for faster, smoother rolling effect
      rollingInterval = setInterval(() => {
        setRollingFrame(prev => prev === 1 ? 2 : 1);
      }, 60);
    }
    
    return () => {
      if (rollingInterval) {
        clearInterval(rollingInterval);
      }
    };
  }, [animationPhase]);
  
  // Calculate positions for individual dice based on animation phase and player position
  const getDicePositionStyle = (diceIndex: number) => {
    if (!currentPlayer) return {};
    
    // Define spawn positions for each player position
    const getSpawnPosition = () => {
      switch (currentPlayer.position) {
        case 'bottom-right':
          return { x: 85, y: 85, offsetY: -150 }; // 85% from left, 85% from top, above player (toward center)
        case 'bottom-left':
          return { x: 15, y: 85, offsetY: -150 }; // 15% from left, 85% from top, above player (toward center)
        case 'top-left':
          return { x: 15, y: 15, offsetY: 60 };   // 15% from left, 15% from top, closer to player (higher up)
        case 'top-right':
          return { x: 85, y: 15, offsetY: 60 };   // 85% from left, 15% from top, closer to player (higher up)
        default:
          return { x: 50, y: 50, offsetY: 0 };
      }
    };
    
    // Define travel destinations (opposite side of table from player)
    const getTravelDestination = () => {
      switch (currentPlayer.position) {
        case 'bottom-right':
          return { x: 25, y: 25 }; // Travel to top-left area
        case 'bottom-left':
          return { x: 75, y: 25 }; // Travel to top-right area
        case 'top-left':
          return { x: 75, y: 75 }; // Travel to bottom-right area
        case 'top-right':
          return { x: 25, y: 75 }; // Travel to bottom-left area
        default:
          return { x: 50, y: 50 };
      }
    };
    
    const spawnPos = getSpawnPosition();
    const travelDest = getTravelDestination();
    
    switch (animationPhase) {
      case 'spawn':
        return {
          // All dice start at the same point near their player
          left: `${spawnPos.x}%`,
          top: `${spawnPos.y}%`,
          transform: `translate(-50%, ${spawnPos.offsetY}px)` // Above or below player position
        };
      case 'traveling':
        // Spread dice out as they travel to opposite side of table
        const spreadOffsets = [
          { x: -25, y: -25 }, // Die 0: spread pattern
          { x: 0, y: -30 },   // Die 1: center spread
          { x: 25, y: -25 }   // Die 2: spread pattern
        ];
        const offset = spreadOffsets[diceIndex] || { x: 0, y: 0 };
        
        return {
          // Travel to opposite side with spreading
          left: `${travelDest.x + offset.x * 0.4}%`,
          top: `${travelDest.y + offset.y * 0.4}%`,
          transform: 'translate(-50%, -50%)'
        };
      case 'center':
        // Dice settle with randomized positions and rotations for natural scatter
        const baseOffsets = [
          { x: -100, y: -30 }, // Die 0: far left and up
          { x: 0, y: 40 },     // Die 1: center and down
          { x: 100, y: -20 }   // Die 2: far right and up
        ];
        const baseOffset = baseOffsets[diceIndex] || { x: 0, y: 0 };
        
        // Use stored random values for this roll
        const randomPos = randomPositions[diceIndex] || { x: 0, y: 0, rotation: 0 };
        const finalX = baseOffset.x + randomPos.x;
        const finalY = baseOffset.y + randomPos.y;
        
        return {
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px)) rotate(${randomPos.rotation}deg)`
        };
      default:
        return {};
    }
  };
  
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Individual dice with spreading animation */}
      {gameState.diceVisible && currentPlayer && (
        <>
          {gameState.dice.map((value, index) => (
            <motion.div
              key={`traveling-dice-${index}`}
              className="absolute"
              style={getDicePositionStyle(index)}
              animate={getDicePositionStyle(index)}
              transition={{
                duration: animationPhase === 'traveling' ? 0.6 : 0.45,
                ease: animationPhase === 'traveling' ? [0.25, 0.46, 0.45, 0.94] : "easeOut",
                type: "tween",
                delay: index * 0.05 // Stagger animations by 50ms per die
              }}
            >
              {animationPhase === 'traveling' ? (
                // Show alternating rolling SVGs during traveling phase
                <div className="w-20 h-20">
                  {rollingFrame === 1 ? <Roll11 /> : <Roll21 />}
                </div>
              ) : (
                // Show normal dice during spawn and center phases
                <Dice
                  value={value}
                  isRolling={gameState.isRolling}
                  size="lg"
                  isMatching={matchingDice?.indices.includes(index) || false}
                  scoreIndicator={matchingDice?.scores[index] || undefined}
                />
              )}
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}
