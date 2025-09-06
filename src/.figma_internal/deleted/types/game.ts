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
  // Dice Lifecycle Management
  diceInstances: DiceInstance[];
  diceLifecyclePhase: DiceLifecyclePhase;
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

// Dice Lifecycle Management
export type DiceLifecyclePhase = 
  | 'birth'          // Dice absent from DOM
  | 'materialization' // Dice fade in at player position
  | 'flight'         // Dice travel to center via trajectory
  | 'impact'         // Dice bounce on table
  | 'rolling'        // Dice rolling animation
  | 'reveal'         // Dice show final values
  | 'death';         // Dice removed from DOM

export interface DiceLifecycleState {
  phase: DiceLifecyclePhase;
  startTime: number;
  duration: number;
  isActive: boolean;
}

export interface DiceInstance {
  id: string;
  value: number;
  position: { x: number; y: number };
  lifecycle: DiceLifecycleState;
  isMatching?: boolean;
  scoreIndicator?: string;
}