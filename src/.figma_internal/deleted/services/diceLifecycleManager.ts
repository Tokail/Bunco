import { DiceInstance, DiceLifecyclePhase, DiceLifecycleState, Player } from '../types/game';
import { TrajectoryService } from './trajectoryService';

export class DiceLifecycleManager {
  private static readonly PHASE_DURATIONS = {
    birth: 0,            // Instantaneous - dice absent from DOM
    materialization: 200, // 0.2s fade-in at player position
    flight: 1200,        // 1.2s trajectory to center
    impact: 300,         // 0.3s table bounce
    rolling: 800,        // 0.8s rolling animation
    reveal: 500,         // 0.5s final value reveal
    death: 0             // Instantaneous - dice removed from DOM
  };

  private static readonly PLAYER_POSITIONS = {
    'top-left': { x: -180, y: -180 },
    'top-right': { x: 180, y: -180 },
    'bottom-left': { x: -180, y: 180 },
    'bottom-right': { x: 180, y: 180 }
  };

  /**
   * Create dice instances in birth state (absent from DOM)
   */
  static createDiceInstances(): DiceInstance[] {
    return [];
  }

  /**
   * Materialize dice at current player's position
   */
  static materializeDice(currentPlayer: Player, diceValues: number[]): DiceInstance[] {
    const playerPosition = this.PLAYER_POSITIONS[currentPlayer.position];
    const now = Date.now();

    return diceValues.map((value, index) => ({
      id: `dice-${now}-${index}`,
      value,
      position: { 
        x: playerPosition.x + (index - 1) * 25, // Spread dice slightly
        y: playerPosition.y 
      },
      lifecycle: {
        phase: 'materialization',
        startTime: now,
        duration: this.PHASE_DURATIONS.materialization,
        isActive: true
      },
      isMatching: false,
      scoreIndicator: undefined
    }));
  }

  /**
   * Transition dice to the next lifecycle phase
   */
  static transitionToPhase(
    diceInstances: DiceInstance[], 
    newPhase: DiceLifecyclePhase
  ): DiceInstance[] {
    const now = Date.now();
    
    return diceInstances.map(dice => ({
      ...dice,
      lifecycle: {
        phase: newPhase,
        startTime: now,
        duration: this.PHASE_DURATIONS[newPhase],
        isActive: true
      }
    }));
  }

  /**
   * Update dice positions during flight phase
   * Creates a realistic Bezier curve arc from player position to table EDGE
   * Synchronized with 720° rotation and 0.8x to 1.0x scale in CSS animation
   */
  static updateFlightPositions(
    diceInstances: DiceInstance[],
    progress: number,
    currentPlayer?: { position: string }
  ): DiceInstance[] {
    return diceInstances.map((dice, index) => {
      if (dice.lifecycle.phase !== 'flight') return dice;

      // Calculate bezier curve trajectory to opposite edge of table
      const startX = dice.position.x;
      const startY = dice.position.y;
      
      // Calculate target edge point (opposite from player position)
      const tableDimensions = TrajectoryService.getTableDimensions();
      const tableRadius = tableDimensions.radius;
      const angle = Math.atan2(-startY, -startX); // Opposite direction from start
      const edgeDistance = tableRadius * 0.85; // 85% of radius for edge hit
      const endX = Math.cos(angle) * edgeDistance + (index - 1) * 15; // Small spread at edge
      const endY = Math.sin(angle) * edgeDistance + (index - 1) * 10;

      // Control points for realistic arc trajectory to edge
      const controlX = startX * 0.4;
      const controlY = startY * 0.4 - 120; // Higher arc for dramatic effect

      // Cubic bezier calculation (matches 1.2s duration with 720° rotation)
      const t = progress;
      const invT = 1 - t;
      const x = invT * invT * invT * startX + 
                3 * invT * invT * t * controlX +
                3 * invT * t * t * endX +
                t * t * t * endX;
      const y = invT * invT * invT * startY + 
                3 * invT * invT * t * controlY +
                3 * invT * t * t * endY +
                t * t * t * endY;

      // Debug logging for edge targeting
      if (progress > 0.95 && index === 0) { // Log only for first die at end of flight
        console.log(`🛫 Flight progress ${(progress*100).toFixed(1)}%:`, {
          startPosition: { x: Math.round(startX), y: Math.round(startY) },
          targetEdge: { x: Math.round(endX), y: Math.round(endY) },
          currentPosition: { x: Math.round(x), y: Math.round(y) },
          tableRadius: Math.round(tableRadius),
          edgeDistance: Math.round(edgeDistance)
        });
      }

      return {
        ...dice,
        position: { x, y }
      };
    });
  }

  /**
   * Apply impact scatter to dice positions after edge hit
   */
  static applyImpactScatter(diceInstances: DiceInstance[]): DiceInstance[] {
    return diceInstances.map((dice, index) => {
      if (dice.lifecycle.phase !== 'impact') return dice;

      // After hitting the edge, bounce toward center with random scatter
      const currentX = dice.position.x;
      const currentY = dice.position.y;
      
      // Calculate bounce vector toward center (60% strength)
      const bounceStrength = 0.6;
      const scatterAmount = 25; // Random scatter radius
      
      const scatterAngle = Math.random() * Math.PI * 2;
      const scatterX = Math.cos(scatterAngle) * Math.random() * scatterAmount;
      const scatterY = Math.sin(scatterAngle) * Math.random() * scatterAmount;
      
      return {
        ...dice,
        position: {
          x: -currentX * bounceStrength + scatterX,
          y: -currentY * bounceStrength + scatterY
        }
      };
    });
  }

  /**
   * Update dice matching states and score indicators
   */
  static updateMatchingStates(
    diceInstances: DiceInstance[],
    matchingIndices: number[],
    scoreIndicators: string[]
  ): DiceInstance[] {
    return diceInstances.map((dice, index) => ({
      ...dice,
      isMatching: matchingIndices.includes(index),
      scoreIndicator: scoreIndicators[index]
    }));
  }

  /**
   * Check if current phase has completed
   */
  static isPhaseComplete(dice: DiceInstance): boolean {
    if (!dice.lifecycle.isActive) return true;
    
    const elapsed = Date.now() - dice.lifecycle.startTime;
    return elapsed >= dice.lifecycle.duration;
  }

  /**
   * Get the current lifecycle phase progress (0-1)
   */
  static getPhaseProgress(dice: DiceInstance): number {
    if (!dice.lifecycle.isActive) return 1;
    
    const elapsed = Date.now() - dice.lifecycle.startTime;
    return Math.min(elapsed / dice.lifecycle.duration, 1);
  }

  /**
   * Kill dice instances (remove from DOM)
   */
  static killDice(): DiceInstance[] {
    return [];
  }

  /**
   * Get the next phase in the lifecycle sequence
   */
  static getNextPhase(currentPhase: DiceLifecyclePhase): DiceLifecyclePhase | null {
    const sequence: DiceLifecyclePhase[] = [
      'birth', 'materialization', 'flight', 'impact', 'rolling', 'reveal', 'death'
    ];
    
    const currentIndex = sequence.indexOf(currentPhase);
    if (currentIndex === -1 || currentIndex === sequence.length - 1) {
      return null;
    }
    
    return sequence[currentIndex + 1];
  }

  /**
   * Calculate total lifecycle duration
   */
  static getTotalLifecycleDuration(): number {
    return Object.values(this.PHASE_DURATIONS).reduce((sum, duration) => sum + duration, 0);
  }

  /**
   * Get phase-specific CSS classes for styling
   */
  static getPhaseClasses(phase: DiceLifecyclePhase): string {
    const baseClasses = 'trajectory-dice-container';
    
    switch (phase) {
      case 'birth':
        return `${baseClasses} phase-birth`;
      case 'materialization':
        return `${baseClasses} phase-materialization`;
      case 'flight':
        return `${baseClasses} phase-flight`;
      case 'impact':
        return `${baseClasses} phase-impact`;
      case 'rolling':
        return `${baseClasses} phase-rolling`;
      case 'reveal':
        return `${baseClasses} phase-reveal`;
      case 'death':
        return `${baseClasses} phase-death`;
      default:
        return baseClasses;
    }
  }
}