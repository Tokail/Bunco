import { Player } from '../types/game';

export interface TrajectoryPoint {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface HitAreaConfig {
  center: { x: string; y: string };
  radius: number;
  bounceHeight: number;
  scatterRange: number;
}

export interface TrajectoryConfig {
  duration: number;
  easing: string;
  bounceCount: number;
  rotationSpeed: number;
  arcHeight: number;
  approach: string;
}

export type AnimationState = 'idle' | 'flying' | 'bouncing' | 'rolling' | 'complete';

export interface PlayerPositionConfig {
  x: string;
  y: string;
  angle: number;
  arcHeight: number;
  rotationDirection: number;
  flightDuration: number;
  approach: string;
}

export class TrajectoryService {
  private static readonly PHASE_DURATIONS = {
    SETUP: 0.2,        // 0.2s setup at player position
    FLIGHT: 1.2,       // 1.2s flight to edge
    BOUNCE: 0.3,       // 0.3s bounce from edge toward center
    ROLLING: 1.0,      // 1.0s rolling to final position
    REVEAL: 0.5        // 0.5s final reveal
  };

  /**
   * Calculate table radius dynamically based on actual rendered size
   */
  private static getTableRadius(): number {
    try {
      const tableBg = document.querySelector('.table-background');
      if (!tableBg) {
        return 120; // Fallback for SSR or before DOM is ready
      }
      
      const tableRect = tableBg.getBoundingClientRect();
      const tableRadius = Math.min(tableRect.width, tableRect.height) / 2;
      
      // Hit area should be ~90% of table radius for proper edge hitting
      return tableRadius * 0.90;
    } catch (error) {
      console.warn('Error calculating table radius:', error);
      return 120; // Fallback value
    }
  }

  private static readonly TABLE_HIT_AREA: HitAreaConfig = {
    center: { x: '50%', y: '50%' }, // Center of game board
    radius: 120, // Will be updated dynamically
    bounceHeight: 20, // Bounce effect height
    scatterRange: 40 // Random scatter within hit area
  };

  private static readonly PLAYER_POSITIONS: Record<string, PlayerPositionConfig> = {
    'bottom-right': { x: '85%', y: '85%', angle: 225, arcHeight: 120, rotationDirection: -1, flightDuration: 1200, approach: 'diagonal-up-left' },
    'bottom-left': { x: '15%', y: '85%', angle: 315, arcHeight: 120, rotationDirection: 1, flightDuration: 1200, approach: 'diagonal-up-right' },
    'top-left': { x: '15%', y: '15%', angle: 45, arcHeight: 100, rotationDirection: 1, flightDuration: 1000, approach: 'diagonal-down-right' },
    'top-right': { x: '85%', y: '15%', angle: 135, arcHeight: 100, rotationDirection: -1, flightDuration: 1000, approach: 'diagonal-down-left' }
  };

  private static readonly TRAJECTORY_CONFIGS: Record<string, TrajectoryConfig> = {
    'bottom-right': {
      duration: 2.5,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounceCount: 3,
      rotationSpeed: 720,
      arcHeight: 120,
      approach: 'diagonal-up-left'
    },
    'bottom-left': {
      duration: 2.5,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounceCount: 3,
      rotationSpeed: 720,
      arcHeight: 120,
      approach: 'diagonal-up-right'
    },
    'top-left': {
      duration: 2.2,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounceCount: 3,
      rotationSpeed: 720,
      arcHeight: 100,
      approach: 'diagonal-down-right'
    },
    'top-right': {
      duration: 2.2,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounceCount: 3,
      rotationSpeed: 720,
      arcHeight: 100,
      approach: 'diagonal-down-left'
    }
  };

  /**
   * Update table hit area dimensions dynamically
   */
  static updateTableHitArea(): void {
    const radius = this.getTableRadius();
    this.TABLE_HIT_AREA.radius = radius;
    this.TABLE_HIT_AREA.scatterRange = radius * 0.33; // 33% of radius for scatter
  }

  /**
   * Calculate edge hit point for realistic table bounce
   */
  static calculateEdgeHitPoint(playerPosition: string): { x: number; y: number } {
    this.updateTableHitArea();
    
    // Calculate opposite edge based on player position
    const playerConfig = this.getPlayerPosition(playerPosition);
    const startPixel = this.convertPercentageToPixels(playerConfig.x, playerConfig.y);
    
    // Target opposite edge of table (85-95% of radius for realistic edge hits)
    const angle = Math.atan2(-startPixel.y, -startPixel.x); // Opposite direction
    const minDistance = this.TABLE_HIT_AREA.radius * 0.85; // 85% of radius
    const maxDistance = this.TABLE_HIT_AREA.radius * 0.95; // 95% of radius
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    
    const edgePoint = {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
    
    // Debug logging
    console.log(`🎯 Edge hit calculated for ${playerPosition}:`, {
      tableRadius: this.TABLE_HIT_AREA.radius,
      distance: Math.round(distance),
      percentage: Math.round((distance/this.TABLE_HIT_AREA.radius)*100),
      startPixel,
      edgePoint: { x: Math.round(edgePoint.x), y: Math.round(edgePoint.y) }
    });
    
    return edgePoint;
  }

  /**
   * Calculate final settling position near center for dice rest
   */
  static calculateFinalPosition(): { x: number; y: number } {
    this.updateTableHitArea();
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * this.TABLE_HIT_AREA.scatterRange;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
  }

  /**
   * Get player position configuration
   */
  static getPlayerPosition(playerPosition: string): PlayerPositionConfig {
    return this.PLAYER_POSITIONS[playerPosition] || this.PLAYER_POSITIONS['bottom-right'];
  }

  /**
   * Convert percentage position to pixel coordinates relative to game board center
   */
  static convertPercentageToPixels(percentageX: string, percentageY: string): { x: number; y: number } {
    // Convert percentage to pixel offset from center
    // Game board is centered, so we calculate relative to center
    const xPercent = parseFloat(percentageX.replace('%', '')) / 100;
    const yPercent = parseFloat(percentageY.replace('%', '')) / 100;
    
    // Assume game board dimensions (these should match your actual game board size)
    const gameBoardSize = 400; // Adjust based on your actual game board size
    
    // Convert to coordinates relative to center (0,0 is center)
    const x = (xPercent - 0.5) * gameBoardSize;
    const y = (yPercent - 0.5) * gameBoardSize;
    
    return { x, y };
  }

  /**
   * Get current table dimensions for debugging
   */
  static getTableDimensions(): { width: number; height: number; radius: number; hitRadius: number; scatterRange: number } {
    const tableBg = document.querySelector('.table-background');
    
    if (!tableBg) {
      return { width: 240, height: 240, radius: 120, hitRadius: 108, scatterRange: 40 };
    }
    
    const rect = tableBg.getBoundingClientRect();
    const radius = Math.min(rect.width, rect.height) / 2;
    const hitRadius = radius * 0.9;
    const scatterRange = hitRadius * 0.33;
    
    return {
      width: rect.width,
      height: rect.height,
      radius,
      hitRadius,
      scatterRange
    };
  }

  /**
   * Complete 5-phase natural dice animation system
   */
  static async animateDiceTrajectory(
    playerPosition: string, 
    diceValues: number[], 
    diceElements: HTMLElement[]
  ): Promise<number[]> {
    const startPos = this.getPlayerPosition(playerPosition);
    const edgeHitPoint = this.calculateEdgeHitPoint(playerPosition); // Hit table edge
    const finalPosition = this.calculateFinalPosition(); // Final center position
    
    // Phase 1: Pre-Roll Setup (0.2s) - Show dice at player position with glow
    await this.animateSetupPhase(diceElements, startPos, this.PHASE_DURATIONS.SETUP * 1000);
    
    // Phase 2: Launch & Flight (1.2s) - Realistic arc to table EDGE
    await this.animateFlightPhase(diceElements, startPos, edgeHitPoint, this.PHASE_DURATIONS.FLIGHT * 1000);
    
    // Phase 3: Table Impact & Bounce (0.3s) - Bounce from edge toward center
    await this.animateBouncePhase(diceElements, edgeHitPoint, this.PHASE_DURATIONS.BOUNCE * 1000);
    
    // Phase 4: Rolling Animation (1.0s) - Move to final center position while rolling
    await this.animateRollingPhase(diceElements, finalPosition, this.PHASE_DURATIONS.ROLLING * 1000);
    
    // Phase 5: Final Reveal (0.5s) - Fade to final dice values
    await this.animateRevealPhase(diceElements, diceValues, this.PHASE_DURATIONS.REVEAL * 1000);
    
    return diceValues;
  }

  /**
   * Animate flight path from player position to hit area
   */
  static animateFlightPath(
    diceElements: HTMLElement[], 
    startPos: PlayerPositionConfig, 
    endPos: { x: number; y: number }, 
    duration: number
  ): Promise<void> {
    return new Promise(resolve => {
      const startTime = performance.now();
      const startPixelPos = this.convertPercentageToPixels(startPos.x, startPos.y);
      
      diceElements.forEach((dice, index) => {
        // Stagger dice slightly
        const delay = index * 50;
        
        setTimeout(() => {
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime - delay;
            const progress = Math.min(elapsed / duration, 1);
            
            // Bezier curve for arc trajectory
            const arcHeight = startPos.arcHeight;
            const t = progress;
            
            // Calculate position along arc
            const x = startPixelPos.x + (endPos.x - startPixelPos.x) * t;
            const y = startPixelPos.y + (endPos.y - startPixelPos.y) * t - 
                     (arcHeight * Math.sin(Math.PI * t));
            
            // Apply position
            dice.style.left = `calc(50% + ${x}px)`;
            dice.style.top = `calc(50% + ${y}px)`;
            
            // Add rotation during flight
            const rotationAmount = t * 720 * startPos.rotationDirection;
            const scale = 0.8 + t * 0.2;
            dice.style.transform = `translate(-50%, -50%) rotate(${rotationAmount}deg) scale(${scale})`;
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              resolve();
            }
          };
          
          requestAnimationFrame(animate);
        }, delay);
      });
    });
  }

  /**
   * Animate bounce effect at hit point
   */
  static animateBounce(diceElements: HTMLElement[], hitPoint: { x: number; y: number }, duration: number): Promise<void> {
    return new Promise(resolve => {
      const startTime = performance.now();
      
      diceElements.forEach((dice, index) => {
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Bounce effect
          const bounceHeight = 20 * Math.sin(Math.PI * progress);
          const y = hitPoint.y - bounceHeight;
          
          dice.style.left = `calc(50% + ${hitPoint.x}px)`;
          dice.style.top = `calc(50% + ${y}px)`;
          
          // Add bouncing rotation
          const rotationAmount = progress * 360;
          const scale = 1 + bounceHeight / 20 * 0.1;
          dice.style.transform = `translate(-50%, -50%) rotate(${rotationAmount}deg) scale(${scale})`;
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };
        
        requestAnimationFrame(animate);
      });
    });
  }

  /**
   * Animate rolling to center position
   */
  static animateRolling(diceElements: HTMLElement[], diceValues: number[], duration: number): Promise<void> {
    return new Promise(resolve => {
      const startTime = performance.now();
      
      diceElements.forEach((dice, index) => {
        const finalPos = this.calculateFinalPosition(); // Small scatter around center
        
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Move toward center with easing
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const x = finalPos.x * (1 - easeOut);
          const y = finalPos.y * (1 - easeOut);
          
          dice.style.left = `calc(50% + ${x}px)`;
          dice.style.top = `calc(50% + ${y}px)`;
          
          // Final rotation settle
          const rotationAmount = progress * 180;
          dice.style.transform = `translate(-50%, -50%) rotate(${rotationAmount}deg) scale(1)`;
          
          if (progress >= 1) {
            // Update dice display to final value
            dice.setAttribute('data-value', diceValues[index].toString());
            resolve();
          } else {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      });
    });
  }

  /**
   * Create trajectory dice elements for animation
   */
  static createTrajectoryDice(): HTMLElement[] {
    const diceElements: HTMLElement[] = [];
    
    for (let i = 0; i < 3; i++) {
      const dice = document.createElement('div');
      dice.className = 'trajectory-dice';
      dice.style.cssText = `
        position: absolute;
        width: 60px;
        height: 60px;
        background-size: contain;
        z-index: 100;
        pointer-events: none;
        transition: none;
        opacity: 0;
      `;
      
      // Add to game board container
      const gameBoard = document.querySelector('.game-board');
      if (gameBoard) {
        gameBoard.appendChild(dice);
      }
      
      diceElements.push(dice);
    }
    
    return diceElements;
  }

  /**
   * Clean up trajectory dice elements
   */
  static cleanupTrajectoryDice(diceElements: HTMLElement[]): void {
    diceElements.forEach(dice => {
      dice.style.willChange = 'auto';
      if (dice.parentNode) {
        dice.parentNode.removeChild(dice);
      }
    });
  }

  /**
   * Optimize animation performance
   */
  static optimizeAnimation(diceElement: HTMLElement): void {
    diceElement.style.willChange = 'transform, opacity';
    diceElement.style.backfaceVisibility = 'hidden';
    diceElement.style.perspective = '1000px';
  }

  /**
   * Phase 1: Pre-Roll Setup - Show dice at player position with glow
   */
  static animateSetupPhase(diceElements: HTMLElement[], startPos: PlayerPositionConfig, duration: number): Promise<void> {
    return new Promise(resolve => {
      diceElements.forEach((dice, index) => {
        const stagger = index * 50; // 50ms stagger
        const startPixelPos = this.convertPercentageToPixels(startPos.x, startPos.y);
        
        // Position dice at player location
        dice.style.left = `calc(50% + ${startPixelPos.x + (index * 10)}px)`;
        dice.style.top = `calc(50% + ${startPixelPos.y + (index * 8)}px)`;
        dice.style.opacity = '1';
        dice.style.transform = 'translate(-50%, -50%) scale(1.1)'; // 10% bigger
        dice.className += ' dice-setup-glow'; // Add glow class
      });
      
      setTimeout(resolve, duration);
    });
  }

  /**
   * Phase 2: Launch & Flight - Realistic arc trajectory to table center
   */
  static animateFlightPhase(
    diceElements: HTMLElement[], 
    startPos: PlayerPositionConfig, 
    endPos: { x: number; y: number }, 
    duration: number
  ): Promise<void> {
    return new Promise(resolve => {
      const startTime = performance.now();
      const startPixelPos = this.convertPercentageToPixels(startPos.x, startPos.y);
      
      diceElements.forEach((dice, index) => {
        const stagger = index * 50;
        dice.className = dice.className.replace(' dice-setup-glow', ' dice-in-flight');
        
        setTimeout(() => {
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime - stagger;
            const progress = Math.min(elapsed / duration, 1);
            
            // Realistic arc trajectory (parabolic)
            const t = progress;
            const arcHeight = startPos.arcHeight;
            
            // Smooth easing for natural movement
            const easeProgress = 1 - Math.pow(1 - t, 2); // Ease out quad
            
            // Calculate position along arc
            const x = startPixelPos.x + (endPos.x - startPixelPos.x) * easeProgress + (index * 8);
            const y = startPixelPos.y + (endPos.y - startPixelPos.y) * easeProgress - 
                     (arcHeight * Math.sin(Math.PI * t)) + (index * 6);
            
            // Apply position
            dice.style.left = `calc(50% + ${x}px)`;
            dice.style.top = `calc(50% + ${y}px)`;
            
            // 2 full rotations during flight (720 degrees)
            const rotationAmount = t * 720 * startPos.rotationDirection;
            // Start small, grow larger as approaching table
            const scale = 0.8 + (t * 0.4); // 0.8 to 1.2
            dice.style.transform = `translate(-50%, -50%) rotate(${rotationAmount}deg) scale(${scale})`;
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              resolve();
            }
          };
          
          requestAnimationFrame(animate);
        }, stagger);
      });
    });
  }

  /**
   * Phase 3: Table Impact & Bounce - Bounce from edge toward center
   */
  static animateBouncePhase(diceElements: HTMLElement[], edgeHitPoint: { x: number; y: number }, duration: number): Promise<void> {
    return new Promise(resolve => {
      const startTime = performance.now();
      
      diceElements.forEach((dice, index) => {
        dice.className = dice.className.replace(' dice-in-flight', ' dice-bouncing');
        
        // Start at edge hit point, bounce toward center
        const startX = edgeHitPoint.x + (index - 1) * 8; // Small spread at edge
        const startY = edgeHitPoint.y + (index - 1) * 6;
        
        // Bounce 60% of the way toward center
        const bounceStrength = 0.6;
        const endX = -startX * bounceStrength;
        const endY = -startY * bounceStrength;
        
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Bounce trajectory from edge toward center
          const t = progress;
          const x = startX + (endX - startX) * t;
          const y = startY + (endY - startY) * t;
          
          // Add bounce height effect
          const bounceHeight = 30 * Math.sin(Math.PI * progress);
          const finalY = y - bounceHeight;
          
          dice.style.left = `calc(50% + ${x}px)`;
          dice.style.top = `calc(50% + ${finalY}px)`;
          
          // Compression and rotation during bounce
          const compressionEffect = progress < 0.3 ? (1 - progress * 0.2) : 1;
          const rotationAmount = progress * 360; // Full rotation during bounce
          const scaleEffect = compressionEffect * (0.9 + bounceHeight / 30 * 0.2);
          dice.style.transform = `translate(-50%, -50%) rotate(${rotationAmount}deg) scale(${scaleEffect})`;
          
          if (progress >= 1) {
            resolve();
          } else {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      });
    });
  }

  /**
   * Phase 4: Rolling Animation - Move to final position while rolling
   */
  static animateRollingPhase(diceElements: HTMLElement[], finalPosition: { x: number; y: number }, duration: number): Promise<void> {
    return new Promise(resolve => {
      const startTime = performance.now();
      const switchInterval = 100; // 100ms = 10 times per second (metronome timing)
      const switches = Math.floor(duration / switchInterval);
      let currentSwitch = 0;
      
      // Get current positions for each dice
      const startPositions = diceElements.map(dice => {
        const currentLeft = dice.style.left;
        const currentTop = dice.style.top;
        const xMatch = currentLeft.match(/calc\(50% \+ (-?\d+\.?\d*)px\)/);
        const yMatch = currentTop.match(/calc\(50% \+ (-?\d+\.?\d*)px\)/);
        return {
          x: xMatch ? parseFloat(xMatch[1]) : 0,
          y: yMatch ? parseFloat(yMatch[1]) : 0
        };
      });
      
      diceElements.forEach((dice, index) => {
        dice.className = dice.className.replace(' dice-bouncing', ' dice-rolling');
        
        const startPos = startPositions[index];
        const targetX = finalPosition.x + (index - 1) * 12; // Small spread at final position
        const targetY = finalPosition.y + (index - 1) * 8;
        
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Move toward final position with easing
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const x = startPos.x + (targetX - startPos.x) * easeOut;
          const y = startPos.y + (targetY - startPos.y) * easeOut;
          
          // Add rolling wiggle
          const wiggleX = (Math.random() - 0.5) * 3;
          const wiggleY = (Math.random() - 0.5) * 2;
          
          dice.style.left = `calc(50% + ${x + wiggleX}px)`;
          dice.style.top = `calc(50% + ${y + wiggleY}px)`;
          
          // Rolling rotation
          const rotationAmount = progress * 360;
          dice.style.transform = `translate(-50%, -50%) rotate(${rotationAmount}deg) scale(1)`;
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      });
      
      // Rhythmic switching between roll images
      const rollInterval = setInterval(() => {
        diceElements.forEach(dice => {
          dice.setAttribute('data-roll-frame', (currentSwitch % 2).toString());
        });
        
        currentSwitch++;
        
        // Gradually slow down toward the end (last 20% of duration)
        if (currentSwitch > switches * 0.8) {
          clearInterval(rollInterval);
          // Slow down interval for suspense
          const slowInterval = setInterval(() => {
            diceElements.forEach(dice => {
              dice.setAttribute('data-roll-frame', (currentSwitch % 2).toString());
            });
            currentSwitch++;
            
            if (currentSwitch >= switches) {
              clearInterval(slowInterval);
              resolve();
            }
          }, switchInterval * 1.5); // 1.5x slower
        }
      }, switchInterval);
      
      // Fallback timeout
      setTimeout(() => {
        clearInterval(rollInterval);
        resolve();
      }, duration + 100);
    });
  }

  /**
   * Phase 5: Final Reveal - Fade out rolls, fade in final dice values
   */
  static animateRevealPhase(diceElements: HTMLElement[], diceValues: number[], duration: number): Promise<void> {
    return new Promise(resolve => {
      const fadeOutDuration = 200; // Roll images fade out
      const fadeInDuration = 300;  // Dice faces fade in
      
      diceElements.forEach((dice, index) => {
        dice.className = dice.className.replace(' dice-rolling', ' dice-revealing');
        
        // Phase 5a: Fade out roll images (200ms)
        dice.style.transition = `opacity ${fadeOutDuration}ms ease-out`;
        dice.style.opacity = '0.3';
        
        setTimeout(() => {
          // Phase 5b: Show final dice value and fade in (300ms)
          dice.setAttribute('data-value', diceValues[index].toString());
          dice.setAttribute('data-reveal', 'true');
          dice.style.transition = `opacity ${fadeInDuration}ms ease-in`;
          dice.style.opacity = '1';
          
          // Add matching glow if needed (will be handled by component)
          dice.setAttribute('data-final', 'true');
        }, fadeOutDuration);
      });
      
      setTimeout(resolve, duration);
    });
  }

  /**
   * Main trajectory animation coordinator with audio sync
   */
  static async rollDiceWithTrajectory(playerPosition: string, diceValues: number[]): Promise<void> {
    // Create trajectory dice
    const diceElements = this.createTrajectoryDice();
    
    // Optimize each dice element
    diceElements.forEach(dice => this.optimizeAnimation(dice));
    
    try {
      // Execute complete 5-phase animation
      await this.animateDiceTrajectory(playerPosition, diceValues, diceElements);
      
      // Cleanup after animation
      setTimeout(() => {
        this.cleanupTrajectoryDice(diceElements);
      }, 300);
      
    } catch (error) {
      console.error('Trajectory animation error:', error);
      this.cleanupTrajectoryDice(diceElements);
    }
  }

  /**
   * Calculate ricochet frames for dice bouncing off edge
   */
  private static calculateRicochetFrames(
    edgePoint: { x: number; y: number },
    landingPoint: { x: number; y: number },
    frameCount: number,
    baseRotation: number
  ): TrajectoryPoint[] {
    const ricochetFrames: TrajectoryPoint[] = [];
    
    for (let i = 0; i < frameCount; i++) {
      const progress = i / frameCount;
      
      // Smooth transition from edge to center with slight overshoot
      const overshootFactor = 1.1 - (0.1 * progress); // Slight overshoot that corrects
      const x = this.interpolateBezier(edgePoint.x, landingPoint.x * overshootFactor, progress);
      const y = this.interpolateBezier(edgePoint.y, landingPoint.y * overshootFactor, progress);
      
      // Smaller arc for ricochet
      const arcHeight = Math.sin(progress * Math.PI) * 40;
      const adjustedY = y - arcHeight;
      
      // Fast tumbling during ricochet
      const rotation = baseRotation * 1.5 + (progress * 540); // Extra rotation
      const scale = 0.9 + (0.1 * Math.sin(progress * Math.PI * 2)); // Quick scale pulses
      
      ricochetFrames.push({
        x,
        y: adjustedY,
        rotation,
        scale
      });
    }
    
    return ricochetFrames;
  }

  /**
   * Calculate landing frames with bounce effect
   */
  private static calculateLandingFrames(
    landingPoint: { x: number; y: number },
    frameCount: number,
    baseRotation: number,
    bounceCount: number
  ): TrajectoryPoint[] {
    const landingFrames: TrajectoryPoint[] = [];
    const bounceHeight = this.TABLE_HIT_AREA.bounceHeight;
    
    for (let i = 0; i < frameCount; i++) {
      const progress = i / frameCount;
      
      // Settle to final position
      const x = landingPoint.x * (1 - 0.1 * Math.exp(-progress * 5)); // Quick settle
      const y = landingPoint.y * (1 - 0.1 * Math.exp(-progress * 5));
      
      // Diminishing bounce effect
      const bounceEffect = Math.exp(-progress * 3) * Math.sin(progress * Math.PI * bounceCount * 2);
      const adjustedY = y - (bounceHeight * bounceEffect);
      
      // Slow down rotation
      const rotation = baseRotation * 2 + (progress * 180); // Final rotation settle
      const scale = 1 + (0.05 * bounceEffect); // Slight scale bounce
      
      landingFrames.push({
        x,
        y: adjustedY,
        rotation,
        scale
      });
    }
    
    return landingFrames;
  }

  /**
   * Calculate bounce frames for dice landing effect
   */
  private static calculateBounceFrames(
    landingPoint: { x: number; y: number },
    bounceCount: number,
    totalRotation: number
  ): TrajectoryPoint[] {
    const bounceFrames: TrajectoryPoint[] = [];
    const bounceHeight = this.TABLE_HIT_AREA.bounceHeight;
    
    for (let bounce = 1; bounce <= bounceCount; bounce++) {
      const bounceProgress = bounce / bounceCount;
      const currentBounceHeight = bounceHeight * (1 - bounceProgress);
      
      // Up phase
      bounceFrames.push({
        x: landingPoint.x,
        y: landingPoint.y - currentBounceHeight,
        rotation: totalRotation + (bounce * 180),
        scale: 1 + (currentBounceHeight / bounceHeight) * 0.1
      });
      
      // Down phase
      bounceFrames.push({
        x: landingPoint.x,
        y: landingPoint.y,
        rotation: totalRotation + (bounce * 360),
        scale: 1
      });
    }
    
    return bounceFrames;
  }

  /**
   * Bezier interpolation for smooth curves
   */
  private static interpolateBezier(start: number, end: number, t: number): number {
    // Using quadratic bezier with control point for natural arc
    const controlOffset = (end - start) * 0.3;
    const control = start + controlOffset;
    
    const oneMinusT = 1 - t;
    return (oneMinusT * oneMinusT * start) + 
           (2 * oneMinusT * t * control) + 
           (t * t * end);
  }

  /**
   * Generate Motion.js compatible animation variants
   */
  static generateMotionVariants(trajectory: TrajectoryPoint[], duration: number) {
    const times = trajectory.map((_, index) => index / (trajectory.length - 1));
    
    return {
      initial: {
        x: trajectory[0].x,
        y: trajectory[0].y,
        rotate: trajectory[0].rotation,
        scale: trajectory[0].scale
      },
      animate: {
        x: trajectory.map(point => point.x),
        y: trajectory.map(point => point.y),
        rotate: trajectory.map(point => point.rotation),
        scale: trajectory.map(point => point.scale),
        transition: {
          duration,
          times,
          ease: "easeOut"
        }
      },
      exit: {
        scale: 0,
        opacity: 0,
        transition: { duration: 0.3 }
      }
    };
  }

  /**
   * Calculate if dice hit the target area
   */
  static isHitInTargetArea(hitPoint: { x: number; y: number }): boolean {
    const distance = Math.sqrt(hitPoint.x * hitPoint.x + hitPoint.y * hitPoint.y);
    return distance <= this.TABLE_HIT_AREA.radius;
  }

  private static readonly DEFAULT_TRAJECTORY_CONFIG: TrajectoryConfig = {
    duration: 3.2, // Total duration for all 5 phases
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    bounceCount: 1, // Single realistic bounce
    rotationSpeed: 720, // 2 full rotations (720 degrees) during flight
    arcHeight: 100, // Realistic arc height
    approach: 'default'
  };

  // Phase timing breakdown (total 3.2 seconds)
  private static readonly PHASE_DURATIONS = {
    SETUP: 0.2,     // Pre-roll setup
    FLIGHT: 1.2,    // Launch & flight
    BOUNCE: 0.3,    // Table impact & bounce
    ROLLING: 1.0,   // Rolling animation
    REVEAL: 0.5     // Final reveal
  };

  /**
   * Get configuration for different animation types
   */
  static getAnimationConfig(type: 'normal' | 'bunco' | 'baby-bunco'): TrajectoryConfig {
    switch (type) {
      case 'bunco':
        return {
          ...this.DEFAULT_TRAJECTORY_CONFIG,
          duration: 3.0, // Longer, more dramatic animation
          bounceCount: 4,
          rotationSpeed: 1080, // More dramatic rotation for Bunco
          arcHeight: 150
        };
      case 'baby-bunco':
        return {
          ...this.DEFAULT_TRAJECTORY_CONFIG,
          duration: 2.7, // Slightly longer
          bounceCount: 3,
          rotationSpeed: 900,
          arcHeight: 130
        };
      default:
        return this.DEFAULT_TRAJECTORY_CONFIG;
    }
  }

  /**
   * Calculate staggered timing for multiple dice
   */
  static calculateDiceStagger(diceCount: number = 3): number[] {
    const baseDelay = 0.1; // 100ms between each die
    return Array.from({ length: diceCount }, (_, index) => index * baseDelay);
  }

  /**
   * Legacy method for backward compatibility with Dice component
   * Calculate complete trajectory with three phases: fly to edge, ricochet, settle in center
   */
  static calculateTrajectory(
    player: Player,
    diceIndex: number = 0,
    config: Partial<TrajectoryConfig> = {},
    debugMode: boolean = false
  ): TrajectoryPoint[] {
    const finalConfig = { ...this.DEFAULT_TRAJECTORY_CONFIG, ...config };
    const startPos = this.getPlayerStartPosition(player);
    const edgeHitPoint = this.calculateEdgeHitPoint(player, debugMode);
    const landingPoint = this.calculateCenterLandingPoint(debugMode);
    
    // Debug logging specifically for Player 1
    if (debugMode && player.id === 1) {
      console.log('🎯 Player 1 Complete Trajectory Calculation:', {
        playerId: player.id,
        playerPosition: player.position,
        startPos,
        edgeHitPoint,
        landingPoint,
        diceIndex,
        tableRadius: this.TABLE_HIT_AREA.radius,
        scatterRange: this.TABLE_HIT_AREA.scatterRange
      });
    }
    
    // Add slight offset for multiple dice to avoid overlap
    const offsetScale = this.TABLE_HIT_AREA.radius / 120;
    const diceOffset = (diceIndex - 1) * (6 * offsetScale);
    
    const finalEdgePoint = {
      x: edgeHitPoint.x + (diceIndex * 4 * offsetScale),
      y: edgeHitPoint.y + (diceIndex * 3 * offsetScale)
    };
    
    const finalLandingPoint = {
      x: landingPoint.x + diceOffset,
      y: landingPoint.y + (diceIndex * 2 * offsetScale)
    };

    const keyframes: TrajectoryPoint[] = [];
    
    // PHASE 1: Flight from player to opposite edge (60% of total duration)
    const phase1FrameCount = Math.floor(20 * 0.6);
    for (let i = 0; i <= phase1FrameCount; i++) {
      const progress = i / phase1FrameCount;
      
      const x = this.interpolateBezier(startPos.x, finalEdgePoint.x, progress);
      const y = this.interpolateBezier(startPos.y, finalEdgePoint.y, progress);
      
      // High arc for dramatic flight to edge
      const arcHeight = Math.sin(progress * Math.PI) * finalConfig.arcHeight;
      const adjustedY = y - arcHeight;
      
      // Fast rotation during flight
      const rotation = finalConfig.rotationSpeed * progress * 1.2;
      const scale = 0.85 + (0.15 * Math.sin(progress * Math.PI));
      
      keyframes.push({
        x,
        y: adjustedY,
        rotation,
        scale
      });
    }
    
    // PHASE 2: Ricochet from edge back toward center (25% of total duration)
    const phase2FrameCount = Math.floor(20 * 0.25);
    const ricochetFrames = this.calculateRicochetFrames(
      finalEdgePoint,
      finalLandingPoint,
      phase2FrameCount,
      finalConfig.rotationSpeed
    );
    keyframes.push(...ricochetFrames);
    
    // PHASE 3: Landing and settling (15% of total duration)
    const phase3FrameCount = Math.floor(20 * 0.15);
    const landingFrames = this.calculateLandingFrames(
      finalLandingPoint,
      phase3FrameCount,
      finalConfig.rotationSpeed,
      finalConfig.bounceCount
    );
    keyframes.push(...landingFrames);

    return keyframes;
  }

  /**
   * Get player starting position for legacy compatibility
   */
  static getPlayerStartPosition(player: Player): { x: number; y: number } {
    // These positions are relative to the game board center
    // Negative values mean left/up, positive means right/down
    switch (player.position) {
      case 'top-left':
        return { x: -180, y: -180 };
      case 'top-right':
        return { x: 180, y: -180 };
      case 'bottom-left':
        return { x: -180, y: 180 };
      case 'bottom-right':
        return { x: 180, y: 180 };
      default:
        return { x: 0, y: 0 };
    }
  }

  /**
   * Calculate hit point on opposite edge of the table for ricochet effect
   */
  static calculateEdgeHitPoint(player: Player, debugMode: boolean = false): { x: number; y: number } {
    this.updateTableHitArea();
    const hitRadius = this.TABLE_HIT_AREA.radius;
    
    // Calculate opposite edge point based on player position
    let edgeAngle: number;
    switch (player.position) {
      case 'top-left':
        edgeAngle = Math.PI / 4 + Math.PI; // Opposite diagonal (bottom-right edge)
        break;
      case 'top-right':
        edgeAngle = (3 * Math.PI) / 4 + Math.PI; // Opposite diagonal (bottom-left edge)
        break;
      case 'bottom-left':
        edgeAngle = (7 * Math.PI) / 4; // Opposite diagonal (top-right edge)
        break;
      case 'bottom-right':
        edgeAngle = Math.PI / 4; // Opposite diagonal (top-left edge)
        break;
      default:
        edgeAngle = Math.random() * Math.PI * 2;
    }
    
    // Add slight randomization to the edge hit point (±15 degrees)
    const randomOffset = (Math.random() - 0.5) * (Math.PI / 6);
    const finalAngle = edgeAngle + randomOffset;
    
    // Position on the edge (85% of radius to hit the yellow area)
    const edgeDistance = hitRadius * 0.85;
    const offsetX = Math.cos(finalAngle) * edgeDistance;
    const offsetY = Math.sin(finalAngle) * edgeDistance;
    
    if (debugMode) {
      console.log('🎯 Edge Hit Point Calculation:', {
        playerPosition: player.position,
        hitRadius: hitRadius.toFixed(1),
        edgeAngle: (edgeAngle * 180 / Math.PI).toFixed(1) + '°',
        randomOffset: (randomOffset * 180 / Math.PI).toFixed(1) + '°',
        finalAngle: (finalAngle * 180 / Math.PI).toFixed(1) + '°',
        edgeDistance: edgeDistance.toFixed(1),
        offsetX: offsetX.toFixed(1),
        offsetY: offsetY.toFixed(1)
      });
    }
    
    return {
      x: offsetX,
      y: offsetY
    };
  }

  /**
   * Calculate final landing point in center area with scatter
   */
  static calculateCenterLandingPoint(debugMode: boolean = false): { x: number; y: number } {
    const scatterRange = this.TABLE_HIT_AREA.scatterRange;
    
    // Tight grouping in center area for final landing
    const reducedScatterRange = scatterRange * 0.2; // Very tight grouping
    
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * reducedScatterRange;
    
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;
    
    if (debugMode) {
      console.log('🎯 Landing Point Calculation:', {
        scatterRange: scatterRange.toFixed(1),
        reducedScatterRange: reducedScatterRange.toFixed(1),
        angle: (angle * 180 / Math.PI).toFixed(1) + '°',
        distance: distance.toFixed(1),
        offsetX: offsetX.toFixed(1),
        offsetY: offsetY.toFixed(1)
      });
    }
    
    return {
      x: offsetX,
      y: offsetY
    };
  }

  /**
   * Calculate ricochet frames for dice bouncing off edge
   */
  private static calculateRicochetFrames(
    edgePoint: { x: number; y: number },
    landingPoint: { x: number; y: number },
    frameCount: number,
    baseRotation: number
  ): TrajectoryPoint[] {
    const ricochetFrames: TrajectoryPoint[] = [];
    
    for (let i = 0; i < frameCount; i++) {
      const progress = i / frameCount;
      
      // Smooth transition from edge to center with slight overshoot
      const overshootFactor = 1.1 - (0.1 * progress); // Slight overshoot that corrects
      const x = this.interpolateBezier(edgePoint.x, landingPoint.x * overshootFactor, progress);
      const y = this.interpolateBezier(edgePoint.y, landingPoint.y * overshootFactor, progress);
      
      // Smaller arc for ricochet
      const arcHeight = Math.sin(progress * Math.PI) * 40;
      const adjustedY = y - arcHeight;
      
      // Fast tumbling during ricochet
      const rotation = baseRotation * 1.5 + (progress * 540); // Extra rotation
      const scale = 0.9 + (0.1 * Math.sin(progress * Math.PI * 2)); // Quick scale pulses
      
      ricochetFrames.push({
        x,
        y: adjustedY,
        rotation,
        scale
      });
    }
    
    return ricochetFrames;
  }

  /**
   * Calculate landing frames with bounce effect
   */
  private static calculateLandingFrames(
    landingPoint: { x: number; y: number },
    frameCount: number,
    baseRotation: number,
    bounceCount: number
  ): TrajectoryPoint[] {
    const landingFrames: TrajectoryPoint[] = [];
    const bounceHeight = this.TABLE_HIT_AREA.bounceHeight;
    
    for (let i = 0; i < frameCount; i++) {
      const progress = i / frameCount;
      
      // Settle to final position
      const x = landingPoint.x * (1 - 0.1 * Math.exp(-progress * 5)); // Quick settle
      const y = landingPoint.y * (1 - 0.1 * Math.exp(-progress * 5));
      
      // Diminishing bounce effect
      const bounceEffect = Math.exp(-progress * 3) * Math.sin(progress * Math.PI * bounceCount * 2);
      const adjustedY = y - (bounceHeight * bounceEffect);
      
      // Slow down rotation
      const rotation = baseRotation * 2 + (progress * 180); // Final rotation settle
      const scale = 1 + (0.05 * bounceEffect); // Slight scale bounce
      
      landingFrames.push({
        x,
        y: adjustedY,
        rotation,
        scale
      });
    }
    
    return landingFrames;
  }

  /**
   * Bezier interpolation for smooth curves
   */
  private static interpolateBezier(start: number, end: number, t: number): number {
    // Using quadratic bezier with control point for natural arc
    const controlOffset = (end - start) * 0.3;
    const control = start + controlOffset;
    
    const oneMinusT = 1 - t;
    return (oneMinusT * oneMinusT * start) + 
           (2 * oneMinusT * t * control) + 
           (t * t * end);
  }

  /**
   * Generate Motion.js compatible animation variants
   */
  static generateMotionVariants(trajectory: TrajectoryPoint[], duration: number) {
    const times = trajectory.map((_, index) => index / (trajectory.length - 1));
    
    return {
      initial: {
        x: trajectory[0].x,
        y: trajectory[0].y,
        rotate: trajectory[0].rotation,
        scale: trajectory[0].scale
      },
      animate: {
        x: trajectory.map(point => point.x),
        y: trajectory.map(point => point.y),
        rotate: trajectory.map(point => point.rotation),
        scale: trajectory.map(point => point.scale),
        transition: {
          duration,
          times,
          ease: "easeOut"
        }
      },
      exit: {
        scale: 0,
        opacity: 0,
        transition: { duration: 0.3 }
      }
    };
  }
}