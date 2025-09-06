import { useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameBoard } from './GameBoard';
import { RoundIndicator } from './RoundIndicator';
import { GameOver } from './GameOver';
import { Button } from './ui/button';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

export function BuncoGame() {
  const { 
    gameState, 
    rollDice, 
    resetGame, 
    lastScoreResult, 
    matchingDice,
    soundService,
    isBotShaking
  } = useGame();
  

  
  const currentPlayer = gameState.players[gameState.currentPlayer];
  const canRoll = currentPlayer?.isHuman && !gameState.isRolling && !gameState.isGameOver;
  
  // Debug logging
  // console.log('BuncoGame render:', {
  //   currentPlayerId: currentPlayer?.id,
  //   currentPlayerIsHuman: currentPlayer?.isHuman,
  //   currentPlayerPosition: currentPlayer?.position,
  //   isRolling: gameState.isRolling,
  //   isGameOver: gameState.isGameOver,
  //   canRoll
  // });
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && canRoll) {
        event.preventDefault();
        rollDice();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [canRoll, rollDice]);
  
  const toggleSound = () => {
    soundService.setEnabled(!soundService.isEnabled());
  };


  
  return (
    <div className="game-container">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          onClick={toggleSound}
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0"
        >
          {soundService.isEnabled() ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </Button>
        
        <Button
          onClick={resetGame}
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Round indicator */}
      <RoundIndicator gameState={gameState} />
      

      
      {/* Game board with players */}
      <GameBoard
        gameState={gameState}
        onRoll={rollDice}
        lastScoreResult={lastScoreResult}
        canRoll={canRoll}
        matchingDice={matchingDice}
        soundService={soundService}
        isBotShaking={isBotShaking}
      />
      

      
      {/* Game over overlay */}
      <GameOver gameState={gameState} onRestart={resetGame} />
      

      

    </div>
  );
}