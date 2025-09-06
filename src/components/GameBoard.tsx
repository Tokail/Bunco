import React from 'react';
import { motion } from 'motion/react';
import { Dice } from './Dice';
import { Button } from './ui/button';
import { Player } from './Player';
import { TrajectoryDiceBoard } from './TrajectoryDiceBoard';
// import { HitAreaDebug } from './HitAreaDebug';
import { GameState, ScoreResult } from '../types/game';
import Tables from '../imports/Tables';

interface GameBoardProps {
  gameState: GameState;
  onRoll: () => void;
  lastScoreResult: ScoreResult | null;
  canRoll: boolean;
  matchingDice?: { indices: number[], scores: string[] };
  soundService?: { diceShake: () => void };
  isBotShaking?: boolean;
  onShowDice?: () => void;
}

export function GameBoard({ gameState, onRoll, lastScoreResult, canRoll, matchingDice, soundService, isBotShaking = false, onShowDice }: GameBoardProps) {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  
  const handleRollClick = () => {
    if (canRoll && currentPlayer?.isHuman && !gameState.isRolling) {
      onRoll();
    }
  };
  
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.code === 'Space' && canRoll && currentPlayer?.isHuman && !gameState.isRolling) {
      event.preventDefault();
      onRoll();
    }
  };

  const handleTrajectoryComplete = () => {
    // Trajectory animation has completed, dice are now in center
    // console.log('Trajectory animation completed');
  };
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="game-board">
        {/* Table background container */}
        <div className="table-background">
          <Tables />
        </div>
        
        {/* Players positioned around the table */}
        {gameState.players.map((player) => (
          <Player
            key={player.id}
            player={player}
            isCurrentPlayer={player.id === currentPlayer?.id}
            onRoll={onRoll}
            canRoll={canRoll}
            isRolling={gameState.isRolling}
            isTurnEnding={gameState.isTurnEnding}
            soundService={soundService}
            triggerShake={isBotShaking && !player.isHuman && player.id === currentPlayer?.id}
            onShowDice={onShowDice}
          />
        ))}
        
        {/* Hit Area Debug - Shows the target area for dice trajectories */}
        {/* <HitAreaDebug enabled={true} showDimensions={true} /> */}
        
        {/* Trajectory Dice Board - Full access to game board for proper centering */}
        <TrajectoryDiceBoard
          gameState={gameState}
          lastScoreResult={lastScoreResult}
          matchingDice={matchingDice}
          onTrajectoryComplete={handleTrajectoryComplete}
          showTrajectoryAnimation={gameState.diceVisible && gameState.isRolling}
        />

        {/* Game content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20" style={{
          paddingTop: 'clamp(1rem, 3vh, 2rem)',
          paddingBottom: 'clamp(2rem, 5vh, 3rem)',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          pointerEvents: 'none'
        }}>
          {/* Spacer for trajectory mode to maintain layout consistency */}
          <div className="mb-8 h-20"></div>
          
          {/* Roll button for human player */}
          {currentPlayer?.isHuman && !gameState.isGameOver && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: 'auto' }}
            >
              <Button
                onClick={handleRollClick}
                onKeyDown={handleKeyPress}
                disabled={!canRoll || gameState.isRolling}
                className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                tabIndex={0}
              >
                {gameState.isRolling ? 'Rolling...' : 'Roll Dice'}
              </Button>
            </motion.div>
          )}
          
          {/* Score result message */}
          {lastScoreResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center"
            >
              <div className={`px-3 py-1 rounded text-sm ${
                lastScoreResult.type === 'bunco' ? 'bg-accent text-accent-foreground' :
                lastScoreResult.type === 'baby-bunco' ? 'bg-secondary text-secondary-foreground' :
                lastScoreResult.type === 'match' ? 'bg-primary text-primary-foreground' :
                'bg-muted text-muted-foreground'
              }`}>
                {lastScoreResult.message}
              </div>
            </motion.div>
          )}
          
          {/* Timer for human player */}
          {currentPlayer?.isHuman && gameState.isTimerActive && !gameState.isGameOver && (
            <motion.div
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-center">
                <motion.div
                  className={`text-2xl font-semibold ${
                    gameState.timer <= 3 ? 'text-destructive' : 'text-foreground'
                  }`}
                  animate={gameState.timer <= 3 ? {
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: gameState.timer <= 3 ? Infinity : 0
                  }}
                >
                  {gameState.timer}
                </motion.div>
                <p className="text-xs text-muted-foreground">seconds left</p>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Current turn score */}
        {gameState.turnScore > 0 && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm">
              Turn Score: {gameState.turnScore}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}