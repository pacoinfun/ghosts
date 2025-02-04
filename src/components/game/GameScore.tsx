import { memo } from 'react';

interface GameScoreProps {
  score: number;
  highScore: number;
}

export const GameScore = memo(function GameScore({ score, highScore }: GameScoreProps) {
  return (
    <div className="text-right space-y-1">
      <p className="text-2xl font-bold text-white tabular-nums">
        {score.toString().padStart(2, '0')}
      </p>
      {highScore > 0 && (
        <p className="text-sm font-medium text-yellow-400 tabular-nums">
          En Yüksek: {highScore.toString().padStart(2, '0')}
        </p>
      )}
    </div>
  );
}); 