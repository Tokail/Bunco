import { DiceRoll, ScoreResult, Player, GameState } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';

export class GameLogicService {
  static calculateScore(roll: DiceRoll, roundTarget: number): ScoreResult {
    const dice = [roll.dice1, roll.dice2, roll.dice3];
    const counts = this.countDice(dice);
    
    // Check for Bunco (3 of current round number)
    if (counts[roundTarget] === 3) {
      return {
        points: GAME_CONFIG.SCORING.BUNCO,
        type: 'bunco',
        endTurn: true,
        message: `BUNCO! ${GAME_CONFIG.SCORING.BUNCO} points!`
      };
    }
    
    // Check for Baby Bunco (3 of any other number)
    for (const [value, count] of Object.entries(counts)) {
      if (count === 3 && parseInt(value) !== roundTarget) {
        return {
          points: GAME_CONFIG.SCORING.BABY_BUNCO,
          type: 'baby-bunco',
          endTurn: true,
          message: `Baby Bunco! ${GAME_CONFIG.SCORING.BABY_BUNCO} points for three ${value}s!`
        };
      }
    }
    
    // Count matching dice
    const matchingDice = counts[roundTarget] || 0;
    if (matchingDice > 0) {
      return {
        points: matchingDice,
        type: 'match',
        endTurn: false,
        message: `${matchingDice} point${matchingDice > 1 ? 's' : ''}! Roll again!`
      };
    }
    
    // No matches
    return {
      points: 0,
      type: 'no-match',
      endTurn: true,
      message: 'No match. Turn over.'
    };
  }
  
  private static countDice(dice: number[]): Record<number, number> {
    const counts: Record<number, number> = {};
    dice.forEach(die => {
      counts[die] = (counts[die] || 0) + 1;
    });
    return counts;
  }
  
  static getMatchingDice(dice: number[], roundTarget: number): { matchingIndices: number[], scoreByDie: string[] } {
    const counts = this.countDice(dice);
    const matchingIndices: number[] = [];
    const scoreByDie: string[] = [];
    
    // Check for Bunco (3 of target number)
    if (counts[roundTarget] === 3) {
      dice.forEach((die, index) => {
        if (die === roundTarget) {
          matchingIndices.push(index);
          scoreByDie.push('+21'); // Show full Bunco score
        } else {
          scoreByDie.push('');
        }
      });
      return { matchingIndices, scoreByDie };
    }
    
    // Check for Baby Bunco (3 of any other number)
    for (const [value, count] of Object.entries(counts)) {
      if (count === 3 && parseInt(value) !== roundTarget) {
        dice.forEach((die, index) => {
          if (die === parseInt(value)) {
            matchingIndices.push(index);
            scoreByDie.push('+5'); // Show full Baby Bunco score
          } else {
            scoreByDie.push('');
          }
        });
        return { matchingIndices, scoreByDie };
      }
    }
    
    // Count matching dice for regular matches
    dice.forEach((die, index) => {
      if (die === roundTarget) {
        matchingIndices.push(index);
        scoreByDie.push('+1');
      } else {
        scoreByDie.push('');
      }
    });
    
    return { matchingIndices, scoreByDie };
  }
  
  static rollDice(probabilityOverride?: 'bunco' | 'baby-bunco'): DiceRoll {
    // This method is deprecated - use rollDiceWithTarget instead for proper probability control
    // Normal random roll
    return {
      dice1: Math.floor(Math.random() * GAME_CONFIG.DICE.MAX_VALUE) + GAME_CONFIG.DICE.MIN_VALUE,
      dice2: Math.floor(Math.random() * GAME_CONFIG.DICE.MAX_VALUE) + GAME_CONFIG.DICE.MIN_VALUE,
      dice3: Math.floor(Math.random() * GAME_CONFIG.DICE.MAX_VALUE) + GAME_CONFIG.DICE.MIN_VALUE
    };
  }
  
  static rollDiceWithTarget(roundTarget: number, probabilityOverride?: 'bunco' | 'baby-bunco'): DiceRoll {
    // Check for probability overrides
    const random = Math.random();
    
    // Bunco probability override
    if (!probabilityOverride && random < GAME_CONFIG.PROBABILITIES.BUNCO_OVERRIDE) {
      probabilityOverride = 'bunco';
    }
    // Baby Bunco probability override
    else if (!probabilityOverride && random < (GAME_CONFIG.PROBABILITIES.BUNCO_OVERRIDE + GAME_CONFIG.PROBABILITIES.BABY_BUNCO_OVERRIDE)) {
      probabilityOverride = 'baby-bunco';
    }
    
    if (probabilityOverride === 'bunco') {
      // Force a Bunco result with the current round target
      return {
        dice1: roundTarget,
        dice2: roundTarget,
        dice3: roundTarget
      };
    }
    
    if (probabilityOverride === 'baby-bunco') {
      // Force a Baby Bunco (3 of any number except target)
      let babyBuncoValue = Math.floor(Math.random() * 6) + 1;
      // Ensure it's not the target number
      while (babyBuncoValue === roundTarget) {
        babyBuncoValue = Math.floor(Math.random() * 6) + 1;
      }
      return {
        dice1: babyBuncoValue,
        dice2: babyBuncoValue,
        dice3: babyBuncoValue
      };
    }
    
    // Normal random roll
    return {
      dice1: Math.floor(Math.random() * 6) + 1,
      dice2: Math.floor(Math.random() * 6) + 1,
      dice3: Math.floor(Math.random() * 6) + 1
    };
  }
  
  static checkRoundWin(player: Player, gameState: GameState): boolean {
    return player.score >= 21;
  }
  
  static checkGameWin(roundWins: { red: number; blue: number }): 'red' | 'blue' | null {
    if (roundWins.red >= 4) return 'red';
    if (roundWins.blue >= 4) return 'blue';
    return null;
  }
  
  static getNextPlayer(currentPlayer: number, players: Player[]): number {
    // Now that players are arranged clockwise in the array, simple increment works
    // Array order: Player 1 (bottom-right) → Player 4 (bottom-left) → Player 2 (top-left) → Player 3 (top-right)
    return (currentPlayer + 1) % players.length;
  }
  
  static resetPlayerScores(players: Player[]): Player[] {
    return players.map(player => ({ ...player, score: 0 }));
  }
  
  static createInitialPlayers(): Player[] {
    // Order players clockwise around the table for intuitive turn progression
    return [
      {
        id: 1,
        name: 'Player 1',
        team: 'red',
        score: 0,
        isHuman: true,
        position: 'bottom-right'
      },
      {
        id: 4,
        name: 'Bertha S.',
        team: 'blue',
        score: 0,
        isHuman: false,
        position: 'bottom-left'
      },
      {
        id: 2,
        name: 'Minnie X.',
        team: 'red',
        score: 0,
        isHuman: false,
        position: 'top-left'
      },
      {
        id: 3,
        name: 'Grace E.',
        team: 'blue',
        score: 0,
        isHuman: false,
        position: 'top-right'
      }
    ];
  }
  
  // ===== DEVELOPMENT/TESTING PROBABILITY HELPERS =====
  // These methods allow for easy probability manipulation during development
  
  static rollDiceWithCustomProbabilities(
    roundTarget: number, 
    buncoProbability: number = GAME_CONFIG.PROBABILITIES.BUNCO_OVERRIDE,
    babyBuncoProbability: number = GAME_CONFIG.PROBABILITIES.BABY_BUNCO_OVERRIDE
  ): DiceRoll {
    const random = Math.random();
    
    // Apply custom Bunco probability
    if (random < buncoProbability) {
      return {
        dice1: roundTarget,
        dice2: roundTarget,
        dice3: roundTarget
      };
    }
    
    // Apply custom Baby Bunco probability
    if (random < (buncoProbability + babyBuncoProbability)) {
      let babyBuncoValue = Math.floor(Math.random() * 6) + 1;
      while (babyBuncoValue === roundTarget) {
        babyBuncoValue = Math.floor(Math.random() * 6) + 1;
      }
      return {
        dice1: babyBuncoValue,
        dice2: babyBuncoValue,
        dice3: babyBuncoValue
      };
    }
    
    // Normal random roll
    return {
      dice1: Math.floor(Math.random() * 6) + 1,
      dice2: Math.floor(Math.random() * 6) + 1,
      dice3: Math.floor(Math.random() * 6) + 1
    };
  }
  
  static forceBunco(roundTarget: number): DiceRoll {
    return {
      dice1: roundTarget,
      dice2: roundTarget,
      dice3: roundTarget
    };
  }
  
  static forceBabyBunco(roundTarget: number): DiceRoll {
    let babyBuncoValue = Math.floor(Math.random() * 6) + 1;
    while (babyBuncoValue === roundTarget) {
      babyBuncoValue = Math.floor(Math.random() * 6) + 1;
    }
    return {
      dice1: babyBuncoValue,
      dice2: babyBuncoValue,
      dice3: babyBuncoValue
    };
  }
}