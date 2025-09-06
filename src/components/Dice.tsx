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
}

export function Dice({
  value,
  isRolling,
  size = 'md',
  className = '',
  isMatching = false,
  scoreIndicator
}: DiceProps) {
  const [rollFrame, setRollFrame] = useState(0);
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'  // Updated to 80px (20 * 4px = 80px)
  };


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


  return (
    <div className="relative">
      <div
        className={`
          dice-container dice
          ${sizeClasses[size]}
          ${isMatching ?
            'matching bg-transparent border-transparent' :
            'bg-transparent border-transparent'
          }
          rounded-md flex items-center justify-center overflow-visible
          ${size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-lg'}
          font-bold text-foreground
          ${className}
        `}
      >
        {/* Show rolling animation when rolling */}
        {isRolling && (
          <div className="w-full h-full">
            {(rollFrame % 2) === 0 ? <Roll11 /> : <Roll21 />}
          </div>
        )}
        
        {/* Show final dice value when not rolling */}
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
      </div>
      
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