import { memo, useMemo } from 'react';

interface GameTimerProps {
  timeLeft: number;
}

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const GameTimer = memo(function GameTimer({ timeLeft }: GameTimerProps) {
  const formattedTime = useMemo(() => formatTime(timeLeft), [timeLeft]);
  const isLowTime = timeLeft <= 10;

  return (
    <div className="text-left">
      <p 
        className={`text-2xl font-mono font-bold tracking-wider
          ${isLowTime ? 'text-red-500 animate-pulse' : 'text-white'}`}
      >
        {formattedTime}
      </p>
    </div>
  );
}); 