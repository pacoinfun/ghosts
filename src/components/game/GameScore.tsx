interface GameScoreProps {
  score: number;
  highScore: number;
}

export function GameScore({ score, highScore }: GameScoreProps) {
  return (
    <div className="text-right">
      <p className="text-2xl font-bold text-white">
        {score}
      </p>
      {highScore > 0 && (
        <p className="text-sm text-yellow-400">
          En Yüksek: {highScore}
        </p>
      )}
    </div>
  );
} 