import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Player, DiceRoll, ScoreResult } from '../types/game';
import { GameLogicService } from '../services/gameLogic';
import { BotAIService } from '../services/botAI';
import { SoundService } from '../services/soundService';
import { DiceLifecycleManager } from '../services/diceLifecycleManager';

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
    // Dice Lifecycle Management
    diceInstances: DiceLifecycleManager.createDiceInstances(),
    diceLifecyclePhase: 'birth'
  }));
  
  const soundService = useRef(new SoundService());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const botTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const consecutiveRollsRef = useRef(0);
  const [lastScoreResult, setLastScoreResult] = useState<ScoreResult | null>(null);
  const [matchingDice, setMatchingDice] = useState<{ indices: number[], scores: string[] }>({ indices: [], scores: [] });
  const [isBotShaking, setIsBotShaking] = useState(false);
  const [hasRolledOnce, setHasRolledOnce] = useState(false);
  
  // Dice lifecycle animation frame reference
  const lifecycleAnimationRef = useRef<number | null>(null);
  
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
    setHasRolledOnce(false);
    consecutiveRollsRef.current = 0;
    
    // Start next round after delay
    setTimeout(() => {
      setGameState(currentState => {
        if (!currentState.gameWinner) {
          // Get the next player in clockwise order after the round win
          const nextPlayer = currentState.players[currentState.currentPlayer];
          
          if (nextPlayer.isHuman) {
            startTimer();
          } else {
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
    }, 2000);
  }, [startTimer]);

  const nextTurn = useCallback(() => {
    setGameState(prev => {
      const nextPlayerIndex = GameLogicService.getNextPlayer(prev.currentPlayer, prev.players);
      
      return {
        ...prev,
        currentPlayer: nextPlayerIndex,
        turnScore: 0,
        isTurnEnding: false
      };
    });
    
    setLastScoreResult(null);
    setMatchingDice({ indices: [], scores: [] });
    
    // Reset dice to birth state for next turn
    setGameState(prev => ({
      ...prev,
      diceInstances: DiceLifecycleManager.createDiceInstances(),
      diceLifecyclePhase: 'birth'
    }));
    
    // Start bot turn or human timer
    setTimeout(() => {
      setGameState(currentState => {
        const nextPlayer = currentState.players[currentState.currentPlayer];
        if (nextPlayer.isHuman) {
          startTimer();
        } else {
          const delay = BotAIService.getBotDelay(nextPlayer.id);
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
      
      // Play shake sound
      soundService.current.diceShake();
      
      // Start dice lifecycle immediately
      setGameState(currentState => {
        const currentPlayer = currentState.players[currentState.currentPlayer];
        
        // Generate dice values
        const roll = GameLogicService.rollDiceWithTarget(currentState.roundTarget);
        const newDice = [roll.dice1, roll.dice2, roll.dice3];
        
        // Start materialization phase - dice appear at player position
        const diceInstances = DiceLifecycleManager.materializeDice(currentPlayer, newDice);
        
        // Debug logging (enable if needed)
        if (currentPlayer.isHuman) {
          console.log('🎲 Starting dice materialization:', {
            player: currentPlayer.position,
            diceValues: newDice,
            diceInstances: diceInstances.length,
            phase: 'materialization'
          });
        }
        
        return {
          ...currentState,
          diceInstances,
          diceLifecyclePhase: 'materialization',
          dice: newDice,
          lastRoll: newDice
        };
      });

      // Begin dice lifecycle animation sequence
      const startLifecycleAnimation = () => {
        const animateLifecycle = () => {
          setGameState(currentState => {
            if (currentState.diceInstances.length === 0) return currentState;
            
            const firstDice = currentState.diceInstances[0];
            if (!firstDice) return currentState;
            
            const isPhaseComplete = DiceLifecycleManager.isPhaseComplete(firstDice);
            
            if (isPhaseComplete) {
              const nextPhase = DiceLifecycleManager.getNextPhase(currentState.diceLifecyclePhase);
              
              if (nextPhase === null || nextPhase === 'death') {
                // Lifecycle complete, clean up
                return currentState;
              }
              
              // Transition to next phase
              let updatedInstances = DiceLifecycleManager.transitionToPhase(
                currentState.diceInstances, 
                nextPhase
              );
              
              if (nextPhase === 'reveal') {
                // Set up final reveal with matching dice
                const { matchingIndices, scoreByDie } = GameLogicService.getMatchingDice(
                  currentState.dice, 
                  currentState.roundTarget
                );
                setMatchingDice({ indices: matchingIndices, scores: scoreByDie });
                
                const scoreResult = GameLogicService.calculateScore(
                  { dice1: currentState.dice[0], dice2: currentState.dice[1], dice3: currentState.dice[2] },
                  currentState.roundTarget
                );
                setLastScoreResult(scoreResult);
                
                // Update dice instances with matching states
                updatedInstances = DiceLifecycleManager.updateMatchingStates(
                  updatedInstances,
                  matchingIndices,
                  scoreByDie
                );
                
                // Play appropriate sound based on result
                switch (scoreResult.type) {
                  case 'bunco':
                    soundService.current.bunco();
                    break;
                  case 'baby-bunco':
                    soundService.current.babyBunco();
                    break;
                }
              }
              
              // Apply phase-specific updates
              if (nextPhase === 'impact') {
                updatedInstances = DiceLifecycleManager.applyImpactScatter(updatedInstances);
              }
              
              return {
                ...currentState,
                diceInstances: updatedInstances,
                diceLifecyclePhase: nextPhase
              };
            }
            
            // Update positions during flight phase
            if (currentState.diceLifecyclePhase === 'flight') {
              const progress = DiceLifecycleManager.getPhaseProgress(firstDice);
              const updatedInstances = DiceLifecycleManager.updateFlightPositions(
                currentState.diceInstances,
                progress
              );
              
              return {
                ...currentState,
                diceInstances: updatedInstances
              };
            }
            
            return currentState;
          });
          
          lifecycleAnimationRef.current = requestAnimationFrame(animateLifecycle);
        };
        
        // Start the animation loop
        lifecycleAnimationRef.current = requestAnimationFrame(animateLifecycle);
      };

      // Start lifecycle after materialization begins
      setTimeout(() => {
        // Play roll sound
        soundService.current.diceRoll();
        startLifecycleAnimation();
      }, 100);

      // Complete the game logic after full lifecycle
      const totalDuration = DiceLifecycleManager.getTotalLifecycleDuration();
      setTimeout(() => {
        // Stop animation loop
        if (lifecycleAnimationRef.current) {
          cancelAnimationFrame(lifecycleAnimationRef.current);
          lifecycleAnimationRef.current = null;
        }
        
        setGameState(currentState => {
          // Kill dice instances - remove from DOM
          const killedInstances = DiceLifecycleManager.killDice();
          
          const currentPlayer = currentState.players[currentState.currentPlayer];
          
          // Get final score result
          const scoreResult = GameLogicService.calculateScore(
            { dice1: currentState.dice[0], dice2: currentState.dice[1], dice3: currentState.dice[2] },
            currentState.roundTarget
          );
          
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
          
          // Check for round win
          if (newScore >= 21) {
            soundService.current.roundWin();
            setTimeout(() => endRound(currentPlayer.team), 1500);
          } else {
            // Handle turn continuation or end
            if (scoreResult.endTurn) {
              consecutiveRollsRef.current = 0;
              setTimeout(() => nextTurn(), 1500);
            } else {
              // Continue turn - either human decides or bot decides
              if (currentPlayer.isHuman) {
                setTimeout(() => startTimer(), 1000);
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
                    triggerBotShake();
                    // Small delay to let shake start before rolling
                    setTimeout(() => {
                      rollDiceRef.current?.();
                    }, 50);
                  }, delay);
                } else {
                  consecutiveRollsRef.current = 0;
                  setTimeout(() => nextTurn(), 1500);
                }
              }
            }
          }
          
          return {
            ...currentState,
            diceInstances: killedInstances,
            diceLifecyclePhase: 'death',
            turnScore: currentState.turnScore + scoreResult.points,
            players: updatedPlayers,
            isRolling: false,
            isTurnEnding: shouldEndTurn
          };
        });
      }, totalDuration);
      
      return { ...prevState, isRolling: true };
    });
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
    
    // Stop any running lifecycle animation
    if (lifecycleAnimationRef.current) {
      cancelAnimationFrame(lifecycleAnimationRef.current);
      lifecycleAnimationRef.current = null;
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
      // Reset dice lifecycle
      diceInstances: DiceLifecycleManager.createDiceInstances(),
      diceLifecyclePhase: 'birth'
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
      if (lifecycleAnimationRef.current) {
        cancelAnimationFrame(lifecycleAnimationRef.current);
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
    isBotShaking
  };
}