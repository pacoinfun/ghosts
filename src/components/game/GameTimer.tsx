interface GameTimerProps {
  timeLeft: number;
}

export function GameTimer({ timeLeft }: GameTimerProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-left">
      <p className={`text-2xl font-mono font-bold
        ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
        {formatTime(timeLeft)}
      </p>
    </div>
  );
} 