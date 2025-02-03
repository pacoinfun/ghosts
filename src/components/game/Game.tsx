"use client";

import { useEffect, useState, useRef } from "react";
import { GameScore } from "./GameScore";
import { GameTimer } from "./GameTimer";
import { GameLogic, GameObject } from "./GameLogic";

export default function Game() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [items, setItems] = useState<GameObject[]>([]);
  const [highScore, setHighScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameLogicRef = useRef<GameLogic | null>(null);
  const lastTimeRef = useRef<number>(0);
  const frameIdRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    if (!gameAreaRef.current) return;
    
    const { width, height } = gameAreaRef.current.getBoundingClientRect();
    gameLogicRef.current = new GameLogic(width, height);
    
    setIsGameActive(true);
    setScore(0);
    setTimeLeft(30);
    lastTimeRef.current = performance.now();
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!gameLogicRef.current || !gameAreaRef.current || !isGameActive) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    const clickedItem = gameLogicRef.current.handleClick(x, y);
    if (clickedItem) {
      switch (clickedItem.type) {
        case 'ghost':
          setScore(prev => {
            const newScore = prev + 1;
            setHighScore(current => Math.max(current, newScore));
            return newScore;
          });
          break;
        case 'bomb':
          setScore(prev => Math.max(0, prev - 10));
          break;
        case 'net':
          setIsFrozen(true);
          gameLogicRef.current.freezeAllItems();
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setTimeout(() => {
            setIsFrozen(false);
            if (gameLogicRef.current) {
              gameLogicRef.current.unfreezeAllItems();
              startTimer();
            }
          }, 5000);
          break;
      }
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsGameActive(false);
          gameLogicRef.current?.clear();
          setItems([]);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        if (prev % 10 === 0 && gameLogicRef.current) {
          gameLogicRef.current.increaseSpeed();
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!isGameActive || !gameLogicRef.current) return;

    const gameLoop = (currentTime: number) => {
      if (!gameLogicRef.current || !isGameActive) return;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      if (!isFrozen) {
        const newItem = gameLogicRef.current.spawnItem();
        if (newItem) {
          setItems(prev => [...prev, newItem]);
        }
      }

      gameLogicRef.current.updatePositions(deltaTime);
      setItems([...gameLogicRef.current.getItems()]);

      frameIdRef.current = requestAnimationFrame(gameLoop);
    };

    startTimer();
    frameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [isGameActive, isFrozen]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,128,255,0.15)_0%,rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 bg-[url('/grid.png')] bg-cover opacity-20" />
      </div>

      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-10">
        <div>
          <GameTimer timeLeft={timeLeft} />
        </div>
        <div>
          <GameScore score={score} highScore={highScore} />
        </div>
      </div>
      
      <div 
        ref={gameAreaRef}
        className="w-full h-full relative touch-none select-none"
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
      >
        {items.map(item => (
          <div
            key={item.id}
            className={`absolute transition-opacity duration-200 ${
              item.isClicked ? 'opacity-0 scale-150' : 'scale-100'
            } ${
              item.type === 'ghost' ? 'text-green-400' :
              item.type === 'bomb' ? 'text-red-500' : 'text-blue-400'
            }`}
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              fontSize: `${Math.min(item.size, Math.min(window.innerWidth, window.innerHeight) / 10)}px`,
              opacity: isFrozen ? 0.8 : 1,
              filter: `drop-shadow(0 0 8px ${
                item.type === 'ghost' ? '#4ade80' :
                item.type === 'bomb' ? '#ef4444' : '#60a5fa'
              })`
            }}
          >
            {item.type === 'ghost' ? '👻' : 
             item.type === 'bomb' ? '💣' : '❄️'}
          </div>
        ))}

        {!isGameActive && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 text-center">
              Ghost Catcher
            </h1>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button
                onClick={startGame}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl
                         text-xl font-bold transition-all duration-300 transform hover:scale-105
                         shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
              >
                {timeLeft === 30 ? 'Başla' : 'Tekrar Oyna'}
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="bg-transparent border-2 border-gray-600 hover:border-gray-400
                         text-gray-400 hover:text-gray-200 px-8 py-3 rounded-xl
                         text-lg font-medium transition-colors"
              >
                Ana Menü
              </button>
            </div>
            
            {highScore > 0 && (
              <div className="mt-12 text-center animate-pulse">
                <p className="text-yellow-400 text-xl font-bold mb-2">
                  En Yüksek Skor
                </p>
                <p className="text-yellow-500 text-5xl font-bold">
                  {highScore}
                </p>
              </div>
            )}
          </div>
        )}

        {isFrozen && (
          <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[1px] pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
} 