import { Player, GameState } from '../types/game';

export class BotAIService {
  private static botPersonalities = new Map<number, { minDelay: number; maxDelay: number }>();
  
  static initializeBotPersonality(playerId: number): void {
    // Each bot gets a unique personality with different timing ranges
    const personalities = [
      { minDelay: 1000, maxDelay: 2500 }, // Quick bot
      { minDelay: 2000, maxDelay: 4000 }, // Medium bot
      { minDelay: 3000, maxDelay: 5000 }  // Thoughtful bot
    ];
    
    const personalityIndex = (playerId - 2) % personalities.length;
    this.botPersonalities.set(playerId, personalities[personalityIndex]);
  }
  
  static getBotDelay(playerId: number): number {
    const personality = this.botPersonalities.get(playerId) || { minDelay: 2000, maxDelay: 4000 };
    const { minDelay, maxDelay } = personality;
    return Math.random() * (maxDelay - minDelay) + minDelay;
  }
  
  static shouldBotContinueRolling(
    player: Player, 
    gameState: GameState, 
    consecutiveRolls: number
  ): boolean {
    // Bots always continue rolling when they score points (except after Bunco/Baby Bunco)
    // Add some randomness for more realistic behavior
    
    // If player is close to winning the round (18+ points), be more aggressive
    if (player.score >= 18) {
      return Math.random() > 0.1; // 90% chance to continue
    }
    
    // If opponent team is close to winning, be more aggressive
    const opponentTeam = player.team === 'red' ? 'blue' : 'red';
    const opponentCloseToWin = gameState.players
      .filter(p => p.team === opponentTeam)
      .some(p => p.score >= 18);
    
    if (opponentCloseToWin) {
      return Math.random() > 0.2; // 80% chance to continue
    }
    
    // Normal behavior - slight chance to stop even when scoring
    // This adds some unpredictability to bot behavior
    const stopChance = Math.min(consecutiveRolls * 0.05, 0.3); // Max 30% chance to stop
    return Math.random() > stopChance;
  }
  
  static getBotThinkingMessage(playerId: number): string {
    const messages = [
      "Thinking...",
      "Deciding...",
      "Considering options...",
      "Planning next move...",
      "Calculating odds..."
    ];
    
    // Use player ID to ensure consistent message patterns per bot
    const messageIndex = (playerId + Date.now()) % messages.length;
    return messages[messageIndex];
  }
  
  static initializeAllBots(): void {
    // Initialize personalities for bot players (IDs 2, 3, 4)
    for (let i = 2; i <= 4; i++) {
      this.initializeBotPersonality(i);
    }
  }
}