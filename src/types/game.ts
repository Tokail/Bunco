export interface Player {
  id: number;
  name: string;
  team: 'red' | 'blue';
  score: number;
  isHuman: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  currentRound: number;
  roundTarget: number;
  roundWins: { red: number; blue: number };
  gameWinner: 'red' | 'blue' | null;
  isGameOver: boolean;
  dice: number[];
  lastRoll: number[];
  turnScore: number;
  isRolling: boolean;
  isTurnEnding: boolean;
  timer: number;
  isTimerActive: boolean;
}

export interface DiceRoll {
  dice1: number;
  dice2: number;
  dice3: number;
}

export interface ScoreResult {
  points: number;
  type: 'bunco' | 'baby-bunco' | 'match' | 'no-match';
  endTurn: boolean;
  message: string;
}

export interface SoundEvents {
  diceShake: () => void;
  diceRoll: () => void;
  bunco: () => void;
  babyBunco: () => void;
  roundWin: () => void;
  gameWin: () => void;
  tick: () => void;
  timeUp: () => void;
}