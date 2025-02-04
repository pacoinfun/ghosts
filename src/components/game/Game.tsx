"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { GameScore } from "./GameScore";
import { GameTimer } from "./GameTimer";
import { GameLogic, GameObject } from "./GameLogic";
import Image from "next/image";

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

  const startGame = useCallback(() => {
    if (!gameAreaRef.current) return;
    
    const { width, height } = gameAreaRef.current.getBoundingClientRect();
    gameLogicRef.current = new GameLogic(width, height);
    
    setIsGameActive(true);
    setScore(0);
    setTimeLeft(30);
    lastTimeRef.current = performance.now();
  }, []);

  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!gameLogicRef.current || !gameAreaRef.current || !isGameActive) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling on mobile
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
  }, [isGameActive]);

  const startTimer = useCallback(() => {
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
  }, []);

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
  }, [isGameActive, isFrozen, startTimer]);

  const renderItem = useCallback((item: GameObject) => {
    const transform = `translate3d(${item.x}px, ${item.y}px, 0) ${
      item.isClicked ? 'scale(1.5)' : 'scale(1)'
    }`;
    
    const getImageSrc = (type: string) => {
      switch (type) {
        case 'ghost':
          return `/ghost (${Math.floor(Math.random() * 4) + 1}).png`;
        case 'bomb':
          return '/bomb.png';
        case 'net':
          return '/freeze.png';
        default:
          return '';
      }
    };

    return (
      <div
        key={item.id}
        className={`absolute will-change-transform transition-opacity duration-200 ${
          item.isClicked ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          transform,
          width: `${item.size}px`,
          height: `${item.size}px`,
          opacity: isFrozen ? 0.8 : 1,
        }}
      >
        <Image
          src={getImageSrc(item.type)}
          alt={item.type}
          width={item.size}
          height={item.size}
          className={`w-full h-full object-contain ${
            item.type === 'ghost' ? 'drop-shadow-[0_0_8px_#4ade80]' :
            item.type === 'bomb' ? 'drop-shadow-[0_0_8px_#ef4444]' : 
            'drop-shadow-[0_0_8px_#60a5fa]'
          }`}
        />
      </div>
    );
  }, [isFrozen]);

  const gameOverlay = useMemo(() => (
    !isGameActive && (
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
    )
  ), [isGameActive, timeLeft, highScore, startGame]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,128,255,0.15)_0%,rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 bg-[url('/grid.png')] bg-cover opacity-20" />
      </div>

      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-10">
        <GameTimer timeLeft={timeLeft} />
        <GameScore score={score} highScore={highScore} />
      </div>
      
      <div 
        ref={gameAreaRef}
        className="w-full h-full relative touch-none select-none"
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
      >
        {items.map(renderItem)}

        {gameOverlay}

        {isFrozen && (
          <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[1px] pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
} 