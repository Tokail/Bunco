import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import Dice11 from '../imports/Dice11';
import Dice21 from '../imports/Dice21';
import Dice31 from '../imports/Dice31';
import Dice41 from '../imports/Dice41';
import Dice51 from '../imports/Dice51';
import Dice61 from '../imports/Dice61';
import Roll11 from '../imports/Roll11';
import Roll21 from '../imports/Roll21';
import { DicePlaceholder } from './DicePlaceholder';
import { TrajectoryService, TrajectoryPoint } from '../services/trajectoryService';
import { Player } from '../types/game';

interface DiceProps {
  value: number;
  isRolling: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isMatching?: boolean;
  scoreIndicator?: string;
  // New trajectory animation props
  showTrajectory?: boolean;
  currentPlayer?: Player;
  diceIndex?: number;
  animationType?: 'normal' | 'bunco' | 'baby-bunco';
  onTrajectoryComplete?: () => void;
}

export function Dice({ 
  value, 
  isRolling, 
  size = 'md', 
  className = '', 
  isMatching = false, 
  scoreIndicator,
  showTrajectory = false,
  currentPlayer,
  diceIndex = 0,
  animationType = 'normal',
  onTrajectoryComplete
}: DiceProps) {
  const [rollFrame, setRollFrame] = useState(0);
  const [trajectoryComplete, setTrajectoryComplete] = useState(false);
  const [motionVariants, setMotionVariants] = useState<any>(null);
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'  // Updated to 80px (20 * 4px = 80px)
  };

  // Calculate trajectory animation when showTrajectory is enabled
  useEffect(() => {
    if (showTrajectory && currentPlayer && !trajectoryComplete) {
      const config = TrajectoryService.getAnimationConfig(animationType);
      const trajectory = TrajectoryService.calculateTrajectory(currentPlayer, diceIndex, config, currentPlayer.id === 1);
      const variants = TrajectoryService.generateMotionVariants(trajectory, config.duration);
      
      setMotionVariants(variants);
      
      // Debug logging for Player 1
      if (currentPlayer.id === 1) {
        console.log('🎯 Player 1 Dice Animation Config:', {
          diceIndex,
          animationType,
          configDuration: config.duration,
          trajectoryPoints: trajectory.length,
          variants: variants
        });
      }
      
      // Mark trajectory as complete after animation duration
      const completeTimeout = setTimeout(() => {
        setTrajectoryComplete(true);
        onTrajectoryComplete?.();
        
        if (currentPlayer.id === 1) {
          console.log('🎯 Player 1 Trajectory Complete for dice', diceIndex);
        }
      }, config.duration * 1000);
      
      return () => clearTimeout(completeTimeout);
    }
  }, [showTrajectory, currentPlayer, diceIndex, animationType, trajectoryComplete, onTrajectoryComplete]);

  // Roll animation effect - alternate between roll images every 100ms
  useEffect(() => {
    if (isRolling) {
      setRollFrame(0);
      const rollInterval = setInterval(() => {
        setRollFrame(prev => prev + 1);
      }, 100); // Switch every 100ms for realistic tumbling effect

      // Stop after 1 second (10 frames)
      const stopTimeout = setTimeout(() => {
        clearInterval(rollInterval);
      }, 1000);

      return () => {
        clearInterval(rollInterval);
        clearTimeout(stopTimeout);
      };
    }
  }, [isRolling]);

  // Reset trajectory state when rolling starts
  useEffect(() => {
    if (isRolling) {
      setTrajectoryComplete(false);
      setMotionVariants(null);
    }
  }, [isRolling]);
  

  
  // Determine animation state
  const shouldShowTrajectory = showTrajectory && !trajectoryComplete;
  const shouldShowRolling = isRolling && trajectoryComplete;
  const shouldShowStatic = !isRolling && trajectoryComplete;

  return (
    <div className="relative">
      <motion.div
        className={`
          dice-container dice
          ${sizeClasses[size]} 
          ${isMatching ? 
            'matching bg-transparent border-transparent' : 
            'bg-transparent border-transparent'
          } 
          rounded-md relative flex items-center justify-center overflow-visible
          ${size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-lg'}
          font-bold text-foreground
          ${className}
        `}
        // Use trajectory animation variants if available, otherwise use default
        variants={motionVariants}
        initial={shouldShowTrajectory ? "initial" : undefined}
        animate={shouldShowTrajectory ? "animate" : {}}
        exit={motionVariants ? "exit" : undefined}
        transition={shouldShowTrajectory ? undefined : {
          duration: 0.6,
          ease: "easeOut"
        }}
        // Add stagger delay for multiple dice
        style={{
          ...(showTrajectory && diceIndex > 0 ? {
            animationDelay: `${TrajectoryService.calculateDiceStagger(3)[diceIndex]}s`
          } : {})
        }}
      >
        {/* Trajectory phase - show rolling animation during flight */}
        {shouldShowTrajectory && (
          <div className="w-full h-full">
            {(rollFrame % 2) === 0 ? <Roll11 /> : <Roll21 />}
          </div>
        )}
        
        {/* Rolling phase - show rolling animation at center */}
        {shouldShowRolling && (
          <div className="w-full h-full">
            {(rollFrame % 2) === 0 ? <Roll11 /> : <Roll21 />}
          </div>
        )}
        
        {/* Static phase - show final dice value */}
        {shouldShowStatic && (
          value === 1 ? (
            <div className="w-full h-full">
              <Dice11 />
            </div>
          ) : value === 2 ? (
            <div className="w-full h-full">
              <Dice21 />
            </div>
          ) : value === 3 ? (
            <div className="w-full h-full">
              <Dice31 />
            </div>
          ) : value === 4 ? (
            <div className="w-full h-full">
              <Dice41 />
            </div>
          ) : value === 5 ? (
            <div className="w-full h-full">
              <Dice51 />
            </div>
          ) : value === 6 ? (
            <div className="w-full h-full">
              <Dice61 />
            </div>
          ) : (
            <DicePlaceholder value={value} isMatching={isMatching} />
          )
        )}
        
        {/* Legacy rendering for non-trajectory mode */}
        {!showTrajectory && (
          <>
            {isRolling && (
              <div className="w-full h-full">
                {(rollFrame % 2) === 0 ? <Roll11 /> : <Roll21 />}
              </div>
            )}
            {!isRolling && (
              value === 1 ? (
                <div className="w-full h-full">
                  <Dice11 />
                </div>
              ) : value === 2 ? (
                <div className="w-full h-full">
                  <Dice21 />
                </div>
              ) : value === 3 ? (
                <div className="w-full h-full">
                  <Dice31 />
                </div>
              ) : value === 4 ? (
                <div className="w-full h-full">
                  <Dice41 />
                </div>
              ) : value === 5 ? (
                <div className="w-full h-full">
                  <Dice51 />
                </div>
              ) : value === 6 ? (
                <div className="w-full h-full">
                  <Dice61 />
                </div>
              ) : (
                <DicePlaceholder value={value} isMatching={isMatching} />
              )
            )}
          </>
        )}
      </motion.div>
      
      {/* Score indicator */}
      {scoreIndicator && !isRolling && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 0 }}
          animate={{ scale: 1, opacity: 1, y: -10 }}
          exit={{ scale: 0, opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-2 py-1 rounded text-sm font-bold whitespace-nowrap z-10"
        >
          {scoreIndicator}
        </motion.div>
      )}
    </div>
  );
}