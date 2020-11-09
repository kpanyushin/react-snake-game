/* eslint-disable */
import useDidUpdate from "@rooks/use-did-update";
import React, { useRef, useState, useEffect } from 'react';

import {
  INITIAL_SNAKE_SIZE,
  ISnakeState,
  ISnakeProps,
  FIELD_LENGTH,
  ICell,
  WHITE_COLOR,
  GRAY_COLOR,
  directions,
  directionType,
  canvasScale,
  Direction,
} from 'constants/index';
import {
  // getKeyValue,
  areSameCoordinates,
  getRandomCoordinate,
  getComputedNextHeadCoordinates,
} from 'utils/index';
import { useInterval } from 'hooks/index';

import s from './Snake.module.scss';

const initialSnakeState: ISnakeState = {
  snakeSize: INITIAL_SNAKE_SIZE,
  snakeCoordinates: [],
  // score: 0,
};
// const scale = 40;
// const canvas_size = { x: 800, y: 800 };
const initialSpeed: number = 200;
const initialScore: number = 0;
const initialFoodPos = {
  x: -100,
  y: -100,
};
const initialDirection = Direction.Right;
// const initialSnakePos: Array<directionType> = [{ x: 0, y: 0 }, { x: 20, y: 0 }];

function Snake(props: ISnakeProps) {
  const { cellSize } = props;
  const canvas = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<ISnakeState>(initialSnakeState);
  const [direction, setDirection] = useState<Direction>(initialDirection);
  const [food, setFood] = useState<ICell>(initialFoodPos);
  const [speed, setSpeed] = useState<number | null>(null);
  const [score, setScore] = useState<number>(initialScore);
  const focusCanvas = () => {
    if (canvas && canvas.current) {
      canvas.current.focus();
    }
  }
  const getCanvasContext = (): CanvasRenderingContext2D | null => {
    if (canvas && canvas.current) {
      return canvas.current.getContext('2d');
    }

    return null;
  };
  const setCanvasSize = (): void => {
    if (canvas && canvas.current) {
      canvas.current.width = cellSize * FIELD_LENGTH;
      canvas.current.height = cellSize * FIELD_LENGTH;
    }
  };
  const getCanvasSize = (): number => {
    if (canvas && canvas.current) {
      const { width: canvasSize } = canvas.current.getBoundingClientRect();

      return canvasSize;
    }

    return 0;
  };
  const renderSquare = (x: number, y: number, color: string): void => {
    const ctx = getCanvasContext();

    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  };
  const renderGrid = (): void => {
    const ctx: CanvasRenderingContext2D | null = getCanvasContext();
    const canvasSize: number | null = getCanvasSize();

    if (ctx && canvasSize) {
      ctx.fillStyle = GRAY_COLOR;
      ctx.strokeStyle = WHITE_COLOR;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      for (let x = cellSize; x < canvasSize; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize);
      }

      for (let y = 0; y < canvasSize; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize, y);
      }

      ctx.stroke();
    }
  };

  const setInitialSnake = (): void => {
    const snakeSize = INITIAL_SNAKE_SIZE;
    const snakeCoordinates: Array<ICell> = [];

    for (let i = snakeSize; i > 0; i--) {
      const part = (i - 1) * cellSize;

      snakeCoordinates.push({ x: part, y: 0 })
    }

    setSnake(prevSnake => ({ ...prevSnake, snakeCoordinates }));
  };

  const handleStartGameClick = (): void => {
    setInitialSnake();
    setFood(initialFoodPos);
    setDirection(initialDirection);
    setSpeed(initialSpeed);
  };

  useEffect(() => {
    setCanvasSize();
    focusCanvas();
    renderGrid();
  }, []);

  useEffect(() => {
    snake.snakeCoordinates.forEach((coordinate: ICell) => {
      renderSquare(coordinate.x, coordinate.y, WHITE_COLOR);
    });
  }, [snake]);

  console.log(direction, snake, speed, food);

  return (
    <div className={s.wrapper}>
      <canvas
        className={s.canvas}
        ref={canvas}
        tabIndex={0}
      />
      <div className={s.scoreboard}>
        <button onClick={handleStartGameClick}>Start game</button>
        {/* <span>Score: {snake.score}</span> */}
      </div>
    </div>
  );
}

export default Snake;
