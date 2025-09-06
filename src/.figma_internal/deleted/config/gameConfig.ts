export const GAME_CONFIG = {
  SCORING: {
    BUNCO: 21,        // 3 of target number
    BABY_BUNCO: 5,    // 3 of any other number
    MATCHING_DIE: 1,  // 1 point per die matching round number
    NO_MATCH: 0       // No points for no matches
  },
  
  PROBABILITIES: {
    // ===== PROBABILITY MANIPULATION CONTROLS =====
    // These values control how often special rolls occur
    // Values should be between 0.0 (0%) and 1.0 (100%)
    
    BUNCO_OVERRIDE: 0.0,      // 10% chance for Bunco (3 of target number = 21 points)
    BABY_BUNCO_OVERRIDE: 0.0, // 10% chance for Baby Bunco (3 of any other number = 5 points)
    
    // === HOW TO ADJUST PROBABILITIES ===
    // For testing/demonstration purposes, you can increase these values:
    // 0.0 = Never occurs (0%)
    // 0.05 = Rare (5% chance)
    // 0.1 = Default (10% chance) 
    // 0.2 = Common (20% chance)
    // 0.3 = Very common (30% chance)
    // 0.5 = Half the time (50% chance)
    // 1.0 = Always occurs (100% chance)
    
    // === EXAMPLE CONFIGURATIONS ===
    // High Action Game: BUNCO_OVERRIDE: 0.2, BABY_BUNCO_OVERRIDE: 0.2
    // Demo Mode: BUNCO_OVERRIDE: 0.5, BABY_BUNCO_OVERRIDE: 0.3  
    // Realistic Game: BUNCO_OVERRIDE: 0.05, BABY_BUNCO_OVERRIDE: 0.05
    // Testing Buncos: BUNCO_OVERRIDE: 1.0, BABY_BUNCO_OVERRIDE: 0.0
  },
  
  // ===== PREDEFINED PROBABILITY PRESETS =====
  // Copy these values to PROBABILITIES section above to quickly change game behavior
  PROBABILITY_PRESETS: {
    REALISTIC: {
      BUNCO_OVERRIDE: 0.046,      // ~4.6% (closer to actual Bunco odds)
      BABY_BUNCO_OVERRIDE: 0.028, // ~2.8% (closer to actual Baby Bunco odds)
    },
    DEFAULT: {
      BUNCO_OVERRIDE: 0.1,        // 10% (current default)
      BABY_BUNCO_OVERRIDE: 0.1,   // 10% (current default)
    },
    HIGH_ACTION: {
      BUNCO_OVERRIDE: 0.2,        // 20% (lots of Buncos)
      BABY_BUNCO_OVERRIDE: 0.2,   // 20% (lots of Baby Buncos)
    },
    DEMO_MODE: {
      BUNCO_OVERRIDE: 0.4,        // 40% (great for demonstrations)
      BABY_BUNCO_OVERRIDE: 0.3,   // 30% (frequent special rolls)
    },
    BUNCO_TESTING: {
      BUNCO_OVERRIDE: 1.0,        // 100% (every roll is a Bunco)
      BABY_BUNCO_OVERRIDE: 0.0,   // 0% (no Baby Buncos)
    },
    BABY_BUNCO_TESTING: {
      BUNCO_OVERRIDE: 0.0,        // 0% (no Buncos)
      BABY_BUNCO_OVERRIDE: 1.0,   // 100% (every roll is a Baby Bunco)
    },
    NO_SPECIALS: {
      BUNCO_OVERRIDE: 0.0,        // 0% (no special rolls)
      BABY_BUNCO_OVERRIDE: 0.0,   // 0% (pure natural probability)
    }
  },
  
  GAME_RULES: {
    ROUNDS: 6,              // Total rounds in game
    WIN_SCORE: 21,          // Score needed to win a round
    ROUNDS_TO_WIN_GAME: 4,  // Rounds needed to win the game
    HUMAN_TIMER: 10,        // Seconds for human player turns
    BOT_MIN_DELAY: 1,       // Minimum bot delay in seconds
    BOT_MAX_DELAY: 5        // Maximum bot delay in seconds
  },
  
  DICE: {
    COUNT: 3,           // Number of dice
    MIN_VALUE: 1,       // Minimum die value
    MAX_VALUE: 6,       // Maximum die value
    SIZE_PX: 80         // Dice size in pixels
  },
  
  TEAMS: {
    RED: 'red',
    BLUE: 'blue'
  }
} as const;

export type GameConfig = typeof GAME_CONFIG;