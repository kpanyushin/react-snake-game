import React, { useState, useEffect, useRef } from 'react';
import { useInterval } from 'hooks/useInterval';
import {
  ICell,
  COLOR_RED,
  FOOD_START,
  DIRECTIONS,
  COLOR_GRAY,
  ISnakeProps,
  COLOR_GREEN,
  COLOR_WHITE,
  CANVAS_SCALE,
  INITIAL_SPEED,
  DIRECTION_START,
  INITIAL_SNAKE_POS,
} from 'constants/index';

import s from './SnakeGame.module.scss';

const SnakeGame = ({ cellSize, fieldLength }: ISnakeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [direction, setDirection] = useState<ICell>(DIRECTION_START);
  const [snake, setSnake] = useState<Array<ICell>>(INITIAL_SNAKE_POS);
  const [food, setFood] = useState<ICell>(FOOD_START);
  const [speed, setSpeed] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(1);
  const [isOver, setIsOver] = useState<boolean>(false);

  // Canvas helpers and basic functionality
  const getCanvasContext = (): CanvasRenderingContext2D | null => {
    if (canvasRef && canvasRef.current) {
      return canvasRef.current.getContext('2d');
    }

    return null;
  };

  const setCanvasSize = (): void => {
    if (canvasRef && canvasRef.current) {
      canvasRef.current.width = cellSize * fieldLength;
      canvasRef.current.height = cellSize * fieldLength;
    }
  };

  const getCanvasSize = (): number => {
    if (canvasRef && canvasRef.current) {
      const { width: canvasSize } = canvasRef.current.getBoundingClientRect();

      return canvasSize;
    }

    return 0;
  };

  const focusCanvas = (): void => {
    if (canvasRef && canvasRef.current) {
      canvasRef.current.focus();
    }
  };

  const renderSquare = (x: number, y: number, color: string): void => {
    const ctx = getCanvasContext();

    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  };

  const renderGrid = (): void => {
    const context = getCanvasContext();
    if (context) {
      context.setTransform(CANVAS_SCALE, 0, 0, CANVAS_SCALE, 0, 0);
      const canvasSize = getCanvasSize();
      context.clearRect(0, 0, canvasSize, canvasSize);
      context.fillStyle = COLOR_GRAY;
      context.strokeStyle = COLOR_WHITE;
      context.fillRect(0, 0, canvasSize, canvasSize);
      context.lineWidth = 1 / CANVAS_SCALE;

      for (let x = 1; x < canvasSize; x += 1) {
        context.moveTo(x, 0);
        context.lineTo(x, canvasSize);
      }

      for (let y = 0; y < canvasSize; y += 1) {
        context.moveTo(0, y);
        context.lineTo(canvasSize, y);
      }

      context.stroke();
    }
  };

  // Snake game general logic
  const moveSnake = (_direction: string) => {
    if (
      direction.x + DIRECTIONS[_direction].x &&
      direction.y + DIRECTIONS[_direction].y
    ) {
      setDirection(DIRECTIONS[_direction]);
    }
  };

  const createRandomFood = (): ICell => ({
    x: Math.floor((Math.random() * getCanvasSize()) / CANVAS_SCALE),
    y: Math.floor((Math.random() * getCanvasSize()) / CANVAS_SCALE),
  });

  const checkCollision = (part: ICell, _snake: ICell[] = snake): boolean => {
    // Check snake collisions
    for (const segment of _snake) {
      if (part.x === segment.x && part.y === segment.y) {
        return true;
      }
    }

    // Check walls collisions
    if (
      part.x * CANVAS_SCALE >= getCanvasSize() ||
      part.x < 0 ||
      part.y * CANVAS_SCALE >= getCanvasSize() ||
      part.y < 0
    ) {
      return true;
    }

    return false;
  };

  const checkFoodCollision = (newSnake: ICell[]): boolean => {
    if (newSnake[0].x === food.x && newSnake[0].y === food.y) {
      let newFood = createRandomFood();
      while (checkCollision(newFood, newSnake)) {
        newFood = createRandomFood();
      }
      setFood(newFood);
      setScore(prevScore => prevScore + 1);
      if (speed && speed > 10) {
        setLevel(prevLevel => prevLevel + 1);
        setSpeed(prevSpeed => prevSpeed && prevSpeed - 10);
      }

      return true;
    }

    return false;
  };

  const startGame = (): void => {
    focusCanvas();
    setStarted(true);
    setIsOver(false);
    setSnake(INITIAL_SNAKE_POS);
    setFood(FOOD_START);
    setDirection(DIRECTION_START);
    setSpeed(INITIAL_SPEED);
  };

  const endGame = (): void => {
    setSpeed(null);
    setIsOver(true);
  };

  const gameLoop = (): void => {
    const newSnake = [...snake];
    const newSnakeHead: ICell = {
      x: newSnake[0].x + direction.x,
      y: newSnake[0].y + direction.y,
    };
    newSnake.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkFoodCollision(newSnake)) newSnake.pop();
    setSnake(newSnake);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    const { key } = e;
    // Check if key is one of the arrows
    if (
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowRight' ||
      key === 'ArrowLeft'
    ) {
      moveSnake(key);
    }
  };

  useEffect(() => {
    setCanvasSize();
  }, []);

  useEffect(() => {
    const context = getCanvasContext();
    if (context) {
      renderGrid();
      snake.forEach(({ x, y }) => renderSquare(x, y, COLOR_GREEN));
      renderSquare(food.x, food.y, COLOR_RED);
    }
  }, [snake, food]);

  useInterval(() => gameLoop(), speed);

  return (
    <div className={s.root}>
      <div className={s.canvasWrapper}>
        <canvas
          className={s.canvas}
          tabIndex={0}
          ref={canvasRef}
          onKeyDown={handleKeyDown}
        />
        {(!started || isOver) && (
          <button className={s.startBtn} onClick={startGame}>
            {isOver ? 'Try again' : 'Start Game'}
          </button>
        )}
        {isOver && (
          <p className={s.gameOverMsg}>You have failed this snake</p>
        )}
      </div>
      <p>Your score: {score}</p>
      <p>Current level: {level}</p>
    </div>
  );
}

export default SnakeGame;
