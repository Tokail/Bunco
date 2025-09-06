import { motion } from 'motion/react';
import { Button } from './ui/button';
import { GameState } from '../types/game';

interface GameOverProps {
  gameState: GameState;
  onRestart: () => void;
}

export function GameOver({ gameState, onRestart }: GameOverProps) {
  if (!gameState.isGameOver || !gameState.gameWinner) return null;
  
  const winningTeamColor = gameState.gameWinner === 'red' ? 'destructive' : 'chart-1';
  const winningTeamName = gameState.gameWinner === 'red' ? 'Red' : 'Blue';
  
  return (
    <motion.div
      className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-card border border-border rounded-lg p-8 text-center max-w-md mx-4"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.5 }}
        >
          <h1 className="mb-4 text-accent">Game Over!</h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-6"
        >
          <div className={`text-${winningTeamColor} mb-2`}>
            <h2>{winningTeamName} Team Wins!</h2>
          </div>
          <p className="text-muted-foreground">
            Final Score: Red {gameState.roundWins.red} - {gameState.roundWins.blue} Blue
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-4"
        >
          <div className="text-sm text-muted-foreground">
            <p>Thanks for playing Bunco!</p>
            <p>Ready for another round?</p>
          </div>
          
          <Button 
            onClick={onRestart}
            className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Play Again
          </Button>
        </motion.div>
        
        {/* Confetti effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 bg-${winningTeamColor} rounded`}
              initial={{
                x: Math.random() * 400,
                y: -10,
                rotate: 0,
                opacity: 1
              }}
              animate={{
                y: 500,
                rotate: 360,
                opacity: 0
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}