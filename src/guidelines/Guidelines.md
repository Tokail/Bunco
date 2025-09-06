
## Project Overview

### Game Description
Build a multiplayer Bunco dice game with:
- **4 players total**: 1 human player + 3 bot players
- **2 teams**: Red vs Blue (2 players each)
- **6 rounds** of dice rolling with specific scoring rules
- **Human player**: Always positioned bottom-right, manual input with 10-second timer
- **Bot players**: Automated with 1-5 second randomized delays for natural feel
- **Technology**: React/TypeScript rewrite of existing JavaScript implementation

### Core Game Rules (IMMUTABLE)
- **Bunco**: 3 dice matching current round number = 21 points (instant round win)
- **Baby Bunco**: 3 of any other number = 5 points + lose turn
- **Matching Dice**: 1 point per die matching round number
- **No Match**: 0 points, turn ends
- **Round Win**: First team to 21 points wins the round
- **Game Win**: First team to win 4 rounds wins the game

---

## Scope Control Guidelines

### ❌ FORBIDDEN ADDITIONS
**Never add these without explicit approval:**

1. **Additional Players**: Game is fixed at 4 players (1 human + 3 bots)
2. **New Game Modes**: No variations, tournaments, or alternative rules
3. **Social Features**: No chat, friends lists, or multiplayer networking
4. **Monetization**: No in-app purchases, ads, or premium features
5. **External Integrations**: No social media sharing, analytics, or third-party services
6. **Additional Screens**: Stick to defined screens (Preloading, Start, Gameplay, Game Over)
7. **Custom Player Names**: Use predefined bot names from [`NameService`](src/services/NameService.js)
8. **Difficulty Levels**: Bots use randomized timing, no difficulty settings
9. **Statistics Tracking**: No persistent stats, leaderboards, or achievements
10. **Theme Customization**: Use fixed Red vs Blue team colors

### ✅ ALLOWED MODIFICATIONS
**These are within scope:**

1. **Bug Fixes**: Fix existing functionality without changing behavior
2. **Performance Optimizations**: Improve speed/memory without changing features
3. **Accessibility Improvements**: ARIA labels, keyboard navigation, screen reader support
4. **Responsive Design**: Ensure compatibility across screen sizes
5. **Animation Refinements**: Improve existing animations without adding new ones
6. **Audio Timing**: Adjust audio synchronization and volume levels
7. **Debug Features**: Probability controls and testing tools (development only)
8. **Code Refactoring**: Improve code structure while maintaining functionality

### Scope Validation Process
Before implementing any feature, ask:
1. Is this explicitly mentioned in the planning documents?
2. Does this change the core game rules or player count?
3. Does this add complexity beyond the defined scope?
4. Is this necessary for the current development phase?

**If any answer is uncertain, STOP and ask for clarification.**

### File Organization Rules
1. **Components**: Group by feature, not by type
2. **Services**: Business logic only, no UI manipulation
3. **Types**: Shared interfaces in dedicated files
4. **Constants**: Configuration values in separate files
5. **Utils**: Pure functions only, no side effects

### Naming Conventions
- **Classes**: PascalCase (`GameEngine`, `TurnManager`)
- **Methods**: camelCase (`startNewRound`, `calculateScore`)
- **Constants**: UPPER_SNAKE_CASE (`GAME_CONFIG`, `AUDIO_ASSETS`)
- **Interfaces**: PascalCase with descriptive names (`GameState`, `DiceRoll`)
- **Files**: PascalCase for classes, camelCase for utilities