import { useState, useEffect, useRef, useCallback } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const directionRef = useRef(direction);
  
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (directionRef.current.y !== 1) {
            setDirection({ x: 0, y: -1 });
          }
          break;
        case 'ArrowDown':
        case 's':
          if (directionRef.current.y !== -1) {
            setDirection({ x: 0, y: 1 });
          }
          break;
        case 'ArrowLeft':
        case 'a':
          if (directionRef.current.x !== 1) {
            setDirection({ x: -1, y: 0 });
          }
          break;
        case 'ArrowRight':
        case 'd':
          if (directionRef.current.x !== -1) {
            setDirection({ x: 1, y: 0 });
          }
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check if food eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          // We don't pop, so snake grows
          // We will handle food generation and score update in a separate effect
          return newSnake;
        } else {
          newSnake.pop();
          return newSnake;
        }
      });
    };

    const interval = setInterval(moveSnake, 80);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, isPaused]);

  // Handle food eaten and score update
  useEffect(() => {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood(snake));
      onScoreUpdate(snake.length - INITIAL_SNAKE.length);
    }
  }, [snake, food, generateFood, onScoreUpdate]);

  return (
    <div className="relative w-full max-w-md aspect-square bg-black border-2 border-cyan shadow-[0_0_20px_rgba(0,255,255,0.3)] overflow-hidden">
      {/* Game Area */}
      <div className="absolute inset-0">
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute border border-black"
            style={{
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              backgroundColor: index === 0 ? '#fff' : 'var(--color-cyan)',
              boxShadow: index === 0 ? '0 0 15px #fff' : '0 0 10px var(--color-cyan)',
              zIndex: index === 0 ? 10 : 1,
              opacity: index === 0 ? 1 : Math.max(0.1, 1 - (index / snake.length)),
            }}
          />
        ))}
        <div
          className="absolute"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            backgroundColor: 'var(--color-magenta)',
            boxShadow: '0 0 15px var(--color-magenta)',
          }}
        />
      </div>

      {/* Overlays */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20">
          <h2 
            className="text-3xl font-pixel text-white mb-8 tracking-widest uppercase glitch"
            data-text="SYSTEM_FAILURE"
          >
            SYSTEM_FAILURE
          </h2>
          <button
            onClick={resetGame}
            className="px-6 py-3 border-2 border-magenta text-magenta font-terminal text-xl hover:bg-magenta hover:text-black transition-all uppercase tracking-widest"
          >
            REBOOT_SEQUENCE
          </button>
        </div>
      )}
      
      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <h2 
            className="text-3xl font-pixel text-white tracking-widest uppercase glitch"
            data-text="EXECUTION_HALTED"
          >
            EXECUTION_HALTED
          </h2>
        </div>
      )}
    </div>
  );
}
