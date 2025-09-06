import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Player, DiceRoll, ScoreResult } from '../types/game';
import { GameLogicService } from '../services/gameLogic';
import { BotAIService } from '../services/botAI';
import { SoundService } from '../services/soundService';

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    players: GameLogicService.createInitialPlayers(),
    currentPlayer: 0,
    currentRound: 1,
    roundTarget: 1,
    roundWins: { red: 0, blue: 0 },
    gameWinner: null,
    isGameOver: false,
    dice: [1, 1, 1],
    lastRoll: [1, 1, 1],
    turnScore: 0,
    isRolling: false,
    isTurnEnding: false,
    timer: 10,
    isTimerActive: false,
    diceVisible: false,
    isDisplayingScore: false
  }));
  
  const soundService = useRef(new SoundService());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const botTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const consecutiveRollsRef = useRef(0);
  const [lastScoreResult, setLastScoreResult] = useState<ScoreResult | null>(null);
  const [matchingDice, setMatchingDice] = useState<{ indices: number[], scores: string[] }>({ indices: [], scores: [] });
  const [isBotShaking, setIsBotShaking] = useState(false);
  
  // Initialize bot personalities on mount
  useEffect(() => {
    BotAIService.initializeAllBots();
  }, []);
  
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setGameState(prev => ({ ...prev, isTimerActive: false }));
  }, []);

  // Create a ref to hold the latest rollDice function
  const rollDiceRef = useRef<() => void>();
  
  // Bot shake helper function
  const triggerBotShake = useCallback(() => {
    setIsBotShaking(true);
    
    // Reset shake state after a short delay
    setTimeout(() => {
      setIsBotShaking(false);
    }, 100);
  }, []);

  // Function to show dice when cup is clicked
  const showDice = useCallback(() => {
    setGameState(prev => ({ ...prev, diceVisible: true }));
  }, []);

  // Function to hide dice after turn ends
  const hideDice = useCallback(() => {
    setGameState(prev => ({ ...prev, diceVisible: false }));
  }, []);
  
  const startTimer = useCallback(() => {
    setGameState(currentGameState => {
      if (currentGameState.players[currentGameState.currentPlayer]?.isHuman) {
        const newState = { ...currentGameState, timer: 10, isTimerActive: true };
        
        const countdown = () => {
          setGameState(prev => {
            if (prev.timer <= 1) {
              soundService.current.timeUp();
              // Auto-roll when time expires
              setTimeout(() => rollDiceRef.current?.(), 100);
              return { ...prev, timer: 0, isTimerActive: false };
            } else {
              if (prev.timer <= 3) {
                soundService.current.tick();
              }
              return { ...prev, timer: prev.timer - 1 };
            }
          });
          
          setGameState(timerState => {
            if (timerState.timer > 1) {
              timerRef.current = setTimeout(countdown, 1000);
            }
            return timerState;
          });
        };
        
        timerRef.current = setTimeout(countdown, 1000);
        return newState;
      }
      return currentGameState;
    });
  }, []);
  
  const endRound = useCallback((winningTeam: 'red' | 'blue') => {
    setGameState(prev => {
      const newRoundWins = {
        ...prev.roundWins,
        [winningTeam]: prev.roundWins[winningTeam] + 1
      };
      
      const gameWinner = GameLogicService.checkGameWin(newRoundWins);
      
      if (gameWinner) {
        soundService.current.gameWin();
        return {
          ...prev,
          roundWins: newRoundWins,
          gameWinner,
          isGameOver: true,
          isTurnEnding: false
        };
      }
      
      // Start next round
      const nextRound = prev.currentRound + 1;
      // Advance to next player in clockwise order after round win
      const nextPlayerIndex = GameLogicService.getNextPlayer(prev.currentPlayer, prev.players);
      
      return {
        ...prev,
        roundWins: newRoundWins,
        currentRound: nextRound <= 6 ? nextRound : 1, // Wrap back to round 1 after round 6
        roundTarget: nextRound <= 6 ? nextRound : 1,
        players: GameLogicService.resetPlayerScores(prev.players),
        currentPlayer: nextPlayerIndex, // Use next player instead of always resetting to 0
        turnScore: 0,
        isTurnEnding: false
      };
    });
    
    setLastScoreResult(null);
    setMatchingDice({ indices: [], scores: [] });
    consecutiveRollsRef.current = 0;
    
    // Start next round after delay
    setTimeout(() => {
      setGameState(currentState => {
        if (!currentState.gameWinner) {
          // Get the next player in clockwise order after the round win
          const nextPlayerIndex = GameLogicService.getNextPlayer(currentState.currentPlayer, currentState.players);
          const nextPlayer = currentState.players[nextPlayerIndex];
          
          if (nextPlayer?.isHuman) {
            setTimeout(() => startTimer(), 500);
          } else {
            // Bot turn
            const delay = BotAIService.getBotDelay(nextPlayer.id);
            botTimeoutRef.current = setTimeout(() => {
              triggerBotShake();
              // Small delay to let shake start before rolling
              setTimeout(() => {
                rollDiceRef.current?.();
              }, 50);
            }, delay);
          }
        }
        return currentState;
      });
    }, 500);
  }, [startTimer]);

  const nextTurn = useCallback(() => {
    setGameState(prev => {
      const nextPlayerIndex = GameLogicService.getNextPlayer(prev.currentPlayer, prev.players);
      const nextPlayer = prev.players[nextPlayerIndex];
      
      return {
        ...prev,
        currentPlayer: nextPlayerIndex,
        turnScore: 0,
        isTurnEnding: false,
        diceVisible: false, // Hide dice when turn ends
        isDisplayingScore: false // Reset score display state
      };
    });
    
    setLastScoreResult(null);
    setMatchingDice({ indices: [], scores: [] });
    
    // Start next player's turn after delay
    setTimeout(() => {
      setGameState(currentState => {
        const currentPlayer = currentState.players[currentState.currentPlayer];
        
        if (currentPlayer?.isHuman) {
          setTimeout(() => startTimer(), 500);
        } else {
          // Bot turn
          const delay = BotAIService.getBotDelay(currentPlayer.id);
          botTimeoutRef.current = setTimeout(() => {
            triggerBotShake();
            // Small delay to let shake start before rolling
            setTimeout(() => {
              rollDiceRef.current?.();
            }, 50);
          }, delay);
        }
        return currentState;
      });
    }, 500);
  }, [startTimer]);

  const rollDice = useCallback(() => {
    setGameState(prevState => {
      if (prevState.isRolling || prevState.isGameOver) return prevState;
      
      stopTimer();
      
      // Hide dice before starting new roll to ensure animation triggers
      // Play shake sound
      soundService.current.diceShake();
      
      return { ...prevState, diceVisible: false, isRolling: true, isDisplayingScore: false };
    });
    
    // Brief delay to ensure dice are hidden before showing them again
    setTimeout(() => {
      // Get the current round target from the latest state
      setGameState(currentState => {
        // Use the current state's roundTarget for the dice roll
        const roll = GameLogicService.rollDiceWithTarget(currentState.roundTarget);
        const newDice = [roll.dice1, roll.dice2, roll.dice3];
        
        // Play roll sound
        soundService.current.diceRoll();
        
        // Calculate matching dice for visual feedback
        const { matchingIndices, scoreByDie } = GameLogicService.getMatchingDice(newDice, currentState.roundTarget);
        setMatchingDice({ indices: matchingIndices, scores: scoreByDie });
        
        const scoreResult = GameLogicService.calculateScore(roll, currentState.roundTarget);
        setLastScoreResult(scoreResult);
        
        // Play appropriate sound based on result
        switch (scoreResult.type) {
          case 'bunco':
            soundService.current.bunco();
            break;
          case 'baby-bunco':
            soundService.current.babyBunco();
            break;
        }
        
        const currentPlayer = currentState.players[currentState.currentPlayer];
        const newScore = currentPlayer.score + scoreResult.points;
        
        const updatedPlayers = [...currentState.players];
        updatedPlayers[currentState.currentPlayer] = {
          ...updatedPlayers[currentState.currentPlayer],
          score: newScore
        };
        
        consecutiveRollsRef.current++;
        
        // Determine if turn will end based on game rules and bot decisions
        let shouldEndTurn = newScore >= 21 || scoreResult.endTurn;
        
        // For bots, also check their decision if the turn could continue
        if (!shouldEndTurn && !currentPlayer.isHuman) {
          const shouldContinue = BotAIService.shouldBotContinueRolling(
            currentPlayer,
            currentState,
            consecutiveRollsRef.current
          );
          shouldEndTurn = !shouldContinue;
        }
        
        // Calculate dynamic display duration based on score type
        const getDiceDisplayDuration = (scoreType: string) => {
          switch (scoreType) {
            case 'bunco':
              return 4000; // 4 seconds for bunco animation
            case 'baby-bunco':
              return 3000; // 3 seconds for baby bunco animation
            default:
              return 2000; // 2 seconds minimum for regular scores
          }
        };
        
        const displayDuration = getDiceDisplayDuration(scoreResult.type);
        
        // Always hide dice after display duration for continuing turns
        if (!scoreResult.endTurn && newScore < 21) {
          setTimeout(() => {
            setGameState(prev => ({ ...prev, diceVisible: false, isDisplayingScore: false }));
          }, displayDuration);
        }
        
        // Check for round win
        if (newScore >= 21) {
          soundService.current.roundWin();
          setTimeout(() => endRound(currentPlayer.team), displayDuration);
        } else {
          // Handle turn continuation or end
          if (scoreResult.endTurn) {
            consecutiveRollsRef.current = 0;
            setTimeout(() => nextTurn(), displayDuration);
          } else {
            // Continue turn - either human decides or bot decides
            if (currentPlayer.isHuman) {
              setTimeout(() => startTimer(), displayDuration - 1000); // Start timer 1s before dice disappear
            } else {
              // Bot decision making (we already calculated shouldContinue above)
              const shouldContinue = BotAIService.shouldBotContinueRolling(
                currentPlayer,
                currentState,
                consecutiveRollsRef.current
              );
              
              if (shouldContinue) {
                const delay = BotAIService.getBotDelay(currentPlayer.id);
                botTimeoutRef.current = setTimeout(() => {
                  // Dice should already be visible for continuing rolls
                  triggerBotShake();
                  // Small delay to let shake start before rolling
                  setTimeout(() => {
                    rollDiceRef.current?.();
                  }, 50);
                }, delay);
              } else {
                consecutiveRollsRef.current = 0;
                setTimeout(() => nextTurn(), displayDuration);
              }
            }
          }
        }
        
        return {
          ...currentState,
          dice: newDice,
          lastRoll: newDice,
          turnScore: currentState.turnScore + scoreResult.points,
          players: updatedPlayers,
          isRolling: false,
          isTurnEnding: shouldEndTurn,
          diceVisible: true,
          isDisplayingScore: true
        };
      });
    }, 750); // Dice trajectory animation duration (0.75 seconds total: 50ms delay + 600ms travel + 150ms settle)
  }, [stopTimer, startTimer, endRound, nextTurn]);

  // Update the ref when rollDice changes
  useEffect(() => {
    rollDiceRef.current = rollDice;
  }, [rollDice]);
  
  const resetGame = useCallback(() => {
    stopTimer();
    if (botTimeoutRef.current) {
      clearTimeout(botTimeoutRef.current);
      botTimeoutRef.current = null;
    }
    
    setGameState({
      players: GameLogicService.createInitialPlayers(),
      currentPlayer: 0,
      currentRound: 1,
      roundTarget: 1,
      roundWins: { red: 0, blue: 0 },
      gameWinner: null,
      isGameOver: false,
      dice: [1, 1, 1],
      lastRoll: [1, 1, 1],
      turnScore: 0,
      isRolling: false,
      isTurnEnding: false,
      timer: 10,
      isTimerActive: false,
      diceVisible: false,
      isDisplayingScore: false
    });
    
    setLastScoreResult(null);
    setMatchingDice({ indices: [], scores: [] });
    consecutiveRollsRef.current = 0;
    
    // Start the game
    setTimeout(() => startTimer(), 500);
  }, [stopTimer, startTimer]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (botTimeoutRef.current) {
        clearTimeout(botTimeoutRef.current);
      }
    };
  }, [stopTimer]);
  
  // Start the game on mount
  useEffect(() => {
    setTimeout(() => startTimer(), 1000);
  }, [startTimer]);
  
  return {
    gameState,
    rollDice,
    resetGame,
    lastScoreResult,
    matchingDice,
    soundService: soundService.current,
    isBotShaking,
    showDice,
    hideDice
  };
}