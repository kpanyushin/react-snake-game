import React, { useState, useEffect, useRef } from 'react';
import { useInterval } from 'hooks/index';
import {
  food_start,
  directions,
  scale,
  snake_start,
  initial_speed,
  direction_start,
  ICell,
} from 'constants/index';

import s from './SnakeGame.module.scss';

export const FIELD_LENGTH = 30;
export const cellSize = 20;

function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [direction, setDirection] = useState<ICell>(direction_start);
  const [snake, setSnake] = useState<Array<ICell>>(snake_start);
  const [food, setFood] = useState<ICell>(food_start);
  const [speed, setSpeed] = useState<number | null>(null);

  // Canvas helpers and basic functionality
  const getCanvasContext = (): CanvasRenderingContext2D | null => {
    if (canvasRef && canvasRef.current) {
      return canvasRef.current.getContext('2d');
    }

    return null;
  };

  const setCanvasSize = (): void => {
    if (canvasRef && canvasRef.current) {
      canvasRef.current.width = cellSize * FIELD_LENGTH;
      canvasRef.current.height = cellSize * FIELD_LENGTH;
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
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const canvasSize = getCanvasSize();
      context.clearRect(0, 0, canvasSize, canvasSize);
      if (context) {
        context.fillStyle = '#DDDDDD';
        context.strokeStyle = '#FFFFFF';
        context.fillRect(0, 0, canvasSize, canvasSize);
        context.lineWidth = 1 / scale;

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
    }
  };

  // Snake game general logic
  const moveSnake = (event: React.KeyboardEvent) => {
    const { key } = event;
    // Check if key is one of the arrows
    if (
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowRight' ||
      key === 'ArrowLeft'
    ) {
      if (
        direction.x + directions[key].x &&
        direction.y + directions[key].y
      ) {
        setDirection(directions[key]);
      }
    }
  };

  const createRandomFood = () => {
    return {
      x: Math.floor((Math.random() * getCanvasSize()) / scale),
      y: Math.floor((Math.random() * getCanvasSize()) / scale),
    };
  };

  const checkCollision = (piece: ICell, _snake: ICell[] = snake) => {
    // Check snake collisions
    for (const segment of _snake) {
      if (piece.x === segment.x && piece.y === segment.y) return true;
    }

    // Check walls collisions
    if (
      piece.x * scale >= getCanvasSize() ||
      piece.x < 0 ||
      piece.y * scale >= getCanvasSize() ||
      piece.y < 0
    ) {
      return true;
    }

    return false;
  };

  const checkFoodCollision = (newSnake: ICell[]) => {
    if (newSnake[0].x === food.x && newSnake[0].y === food.y) {
      let newFood = createRandomFood();
      while (checkCollision(newFood, newSnake)) {
        newFood = createRandomFood();
      }
      setFood(newFood);
      return true;
    }
    return false;
  };

  const startGame = () => {
    focusCanvas();
    setSnake(snake_start);
    setFood(food_start);
    setDirection(direction_start);
    setSpeed(initial_speed);
  };

  const endGame = () => {
    setSpeed(null);
  };

  const gameLoop = () => {
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
    moveSnake(e);
  };

  useEffect(() => {
    setCanvasSize();
  }, []);

  useEffect(() => {
    const context = getCanvasContext();
    if (context) {
      renderGrid();
      snake.forEach(({ x, y }) => renderSquare(x, y, 'green'));
      renderSquare(food.x, food.y, 'red');
    }
  }, [snake, food]);

  useInterval(() => gameLoop(), speed);

  return (
    <div className={s.wrapper}>
      <div>Snake</div>
      <canvas
        className={s.canvas}
        tabIndex={0}
        ref={canvasRef}
        onKeyDown={handleKeyDown}
      />
      <button onClick={startGame}>Start Game</button>
    </div>
  );
}

export default SnakeGame;
