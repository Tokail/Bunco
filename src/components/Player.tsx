import React, { useState, useRef, useEffect } from 'react';
import { Player as PlayerType } from '../types/game';
import RedCup1 from '../imports/RedCup1';
import BlueCup1 from '../imports/BlueCup1';

interface PlayerProps {
  player: PlayerType;
  isCurrentPlayer: boolean;
  onRoll?: () => void;
  canRoll?: boolean;
  isRolling?: boolean;
  isTurnEnding?: boolean;
  soundService?: { diceShake: () => void };
  triggerShake?: boolean;
}

export function Player({ player, isCurrentPlayer, onRoll, canRoll, isRolling = false, isTurnEnding = false, soundService, triggerShake = false }: PlayerProps) {
  const [isShaking, setIsShaking] = useState(false);
  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
    };
  }, []);
  
  // Shared shake animation logic for both human clicks and bot triggers
  const startShakeAnimation = () => {
    // Start shake animation
    setIsShaking(true);
    
    // Play shake sound immediately
    soundService?.diceShake();
    
    // Clear any existing timeout
    if (shakeTimeoutRef.current) {
      clearTimeout(shakeTimeoutRef.current);
    }
    
    // Dynamically calculate total animation duration from CSS
    const calculateAnimationDuration = () => {
      // Create a temporary element to read CSS animation properties
      const tempElement = document.createElement('div');
      tempElement.className = 'cup-shaking';
      tempElement.style.position = 'absolute';
      tempElement.style.visibility = 'hidden';
      tempElement.style.pointerEvents = 'none';
      document.body.appendChild(tempElement);
      
      const computedStyle = window.getComputedStyle(tempElement);
      const duration = parseFloat(computedStyle.animationDuration) || 0.9; // fallback to 0.9s
      const iterationCount = parseFloat(computedStyle.animationIterationCount) || 1; // fallback to 1
      
      document.body.removeChild(tempElement);
      
      return duration * iterationCount * 1000; // convert to milliseconds
    };
    
    // End shake animation after full CSS animation duration
    const totalDuration = calculateAnimationDuration();
    shakeTimeoutRef.current = setTimeout(() => {
      setIsShaking(false);
    }, totalDuration);
  };
  
  // Handle external shake trigger for bots
  useEffect(() => {
    if (triggerShake && !player.isHuman && isCurrentPlayer) {
      startShakeAnimation();
    }
  }, [triggerShake, player.isHuman, isCurrentPlayer]);
  // Debug logging for human player (if needed)
  // if (player.isHuman) {
  //   console.log('Human player render:', {
  //     playerId: player.id,
  //     position: player.position,
  //     isCurrentPlayer,
  //     canRoll,
  //     hasOnRoll: !!onRoll
  //   });
  // }

  const getPlayerClasses = () => {
    const position = player.position;
    const teamColor = player.team;
    const active = isCurrentPlayer ? 'active' : '';
    
    return `player ${position} ${teamColor} ${active}`.trim();
  };

  // Only allow cup clicks for human players who are current player and can roll and not currently rolling and turn is not ending
  const isCupClickable = isCurrentPlayer && player.isHuman && canRoll && onRoll && !isRolling && !isTurnEnding;
  
  const handleCupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isCupClickable || !onRoll) return;
    
    // Start shake animation
    startShakeAnimation();
    
    // Trigger dice roll at 300ms (mid-shake) for human players
    setTimeout(() => {
      onRoll();
    }, 300);
  };
  
  const getCupStyles = (baseStyles: React.CSSProperties) => ({
    ...baseStyles,
    cursor: isCupClickable ? 'pointer' : 'default',
    pointerEvents: isCupClickable ? 'auto' : 'none',
    userSelect: 'none',
    // Ensure proper stacking above all game elements
    zIndex: 100,
    // Force new stacking context
    isolation: 'isolate',
    // Add transparency when rolling or turn ending
    opacity: (isRolling || isTurnEnding) && isCurrentPlayer && player.isHuman ? 0.5 : 1,
    // Add disabled class for CSS targeting
    ...((isRolling || isTurnEnding) && isCurrentPlayer && player.isHuman && {
      filter: 'grayscale(20%)'
    })
  });
  
  // Check if player is in top position (text should appear above avatar)
  const isTopPlayer = player.position === 'top-left' || player.position === 'top-right';
  
  // Avatar element
  const avatarElement = (
    <div className={`avatar ${player.team}-team`}>
    </div>
  );
  
  // Name element with skew transform for italic effect
  const nameElement = (
    <div className="player-name">
      {player.name}
    </div>
  );
  
  // Score element with skew transform for italic effect
  const scoreElement = (
    <div className="player-score">
      {player.score}
    </div>
  );
  


  return (
    <div 
      className={getPlayerClasses()}
      data-player-id={player.id}
    >
      {/* Red Cup for bottom-right player - only show when active */}
      {player.position === 'bottom-right' && isCurrentPlayer && (
        <div 
          className={isShaking ? 'cup-shaking' : ''}
          style={getCupStyles({
            position: 'absolute',
            top: '-40px',
            right: '70px',
            width: '100px',
            height: '100px',
            zIndex: 100,
            background: 'transparent'
          })}
          onClick={handleCupClick}
          role={isCupClickable ? 'button' : undefined}
          tabIndex={isCupClickable ? 0 : -1}
          onKeyDown={(e) => {
            if (isCupClickable && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleCupClick(e as any);
            }
          }}
          title={isCupClickable ? 'Click to roll dice!' : undefined}
        >
          <div style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>
            <RedCup1 />
          </div>
        </div>
      )}
      
      {/* Red Cup for top-left player - only show when active */}
      {player.position === 'top-left' && isCurrentPlayer && (
        <div 
          className={`cup-rotated-180 ${isShaking ? 'cup-shaking' : ''}`}
          style={getCupStyles({
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            width: '100px',
            height: '100px',
            zIndex: 100,
            transform: 'rotate(180deg)',
            background: 'transparent'
          })}
          onClick={handleCupClick}
          role={isCupClickable ? 'button' : undefined}
          tabIndex={isCupClickable ? 0 : -1}
          onKeyDown={(e) => {
            if (isCupClickable && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleCupClick(e as any);
            }
          }}
        >
          <div style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>
            <RedCup1 />
          </div>
        </div>
      )}
      
      {/* Blue Cup for top-right player - only show when active */}
      {player.position === 'top-right' && isCurrentPlayer && (
        <div 
          className={`cup-rotated-180-flipped-x ${isShaking ? 'cup-shaking' : ''}`}
          style={getCupStyles({
            position: 'absolute',
            left: '-40px',
            bottom: '-40px',
            width: '100px',
            height: '100px',
            zIndex: 100,
            transform: 'rotate(180deg) scaleX(-1)',
            background: 'transparent'
          })}
          onClick={handleCupClick}
          role={isCupClickable ? 'button' : undefined}
          tabIndex={isCupClickable ? 0 : -1}
          onKeyDown={(e) => {
            if (isCupClickable && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleCupClick(e as any);
            }
          }}
        >
          <div style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>
            <BlueCup1 />
          </div>
        </div>
      )}
      
      {/* Blue Cup for bottom-left player - only show when active */}
      {player.position === 'bottom-left' && isCurrentPlayer && (
        <div 
          className={`cup-flipped-x ${isShaking ? 'cup-shaking' : ''}`}
          style={getCupStyles({
            position: 'absolute',
            top: '-40px',
            left: '70px',
            width: '100px',
            height: '100px',
            zIndex: 100,
            transform: 'scaleX(-1)',
            background: 'transparent'
          })}
          onClick={handleCupClick}
          role={isCupClickable ? 'button' : undefined}
          tabIndex={isCupClickable ? 0 : -1}
          onKeyDown={(e) => {
            if (isCupClickable && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleCupClick(e as any);
            }
          }}
        >
          <div style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>
            <BlueCup1 />
          </div>
        </div>
      )}
      
      {isTopPlayer ? (
        // Top players: Score → Name → Avatar (text above avatar)
        <>
          {scoreElement}
          {nameElement}
          {avatarElement}
        </>
      ) : (
        // Bottom players: Avatar → Name → Score (text below avatar)
        <>
          {avatarElement}
          {nameElement}
          {scoreElement}
        </>
      )}
    </div>
  );
}