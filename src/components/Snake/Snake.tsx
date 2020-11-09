import React, { useState, useEffect, useRef } from 'react';
import { useInterval } from 'hooks/index';
import {
  apple_start,
  directions,
  scale,
  snake_start,
  initial_speed,
  direction_start,
  ICell,
} from 'constants/index';

export const FIELD_LENGTH = 30;
export const cellSize = 20;

function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [direction, setDirection] = useState<ICell>(direction_start);
  const [snake, setSnake] = useState<Array<ICell>>(snake_start);
  const [apple, setApple] = useState<ICell>(apple_start);
  const [speed, setSpeed] = useState<number | null>(null);
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
  const renderSquare = (x: number, y: number, color: string): void => {
    const ctx = getCanvasContext();

    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  };
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

  const createRandomApple = () => {
    return {
      x: Math.floor((Math.random() * getCanvasSize()) / scale),
      y: Math.floor((Math.random() * getCanvasSize()) / scale),
    };
  };
  const startGame = () => {
    setSnake(snake_start);
    setApple(apple_start);
    setDirection(direction_start);
    setSpeed(initial_speed);
  };
  const endGame = () => {
    setSpeed(null);
  };

  const checkCollision = (piece: ICell, snoko: ICell[] = snake) => {
    for (const segment of snoko) {
      if (piece.x === segment.x && piece.y === segment.y) return true;
    }

    // Wall Collision Detection
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
  const checkAppleCollision = (newSnake: ICell[]) => {
    if (newSnake[0].x === apple.x && newSnake[0].y === apple.y) {
      let newApple = createRandomApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createRandomApple();
      }
      setApple(newApple);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = [...snake]; // Create shallow copy to avoid mutating array
    const newSnakeHead: ICell = {
      x: snakeCopy[0].x + direction.x,
      y: snakeCopy[0].y + direction.y,
    };
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  const renderGrid = (): void => {
    const context = getCanvasContext();
    if (!context) {
      throw new Error('Could not get context');
    }
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

  useEffect(() => {
    setCanvasSize();
  }, []);

  useEffect(() => {
    const context = getCanvasContext();
    if (!context) {
      throw new Error('Could not get context');
    }
    renderGrid();
    // Draw Snake
    snake.forEach(({ x, y }) => renderSquare(x, y, 'green'));
    // Draw Apple
    context.fillStyle = 'red';
    renderSquare(apple.x, apple.y, 'red');
  }, [snake, apple]);

  useInterval(() => gameLoop(), speed);

  return (
    <div className="">
      <div>Classic Snake Game</div>
      <div
        // className="controls"
        role="button"
        onKeyDown={(event: React.KeyboardEvent) => moveSnake(event)}
      >
        <canvas
          style={{ border: '1px solid black' }}
          ref={canvasRef}
          // width={canvas_size.x}
          // height={canvas_size.y}
        />
        <button onClick={startGame}>Start Game</button>
      </div>
    </div>
  );
}

export default Snake;
