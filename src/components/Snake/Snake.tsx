/* eslint-disable */
import useDidUpdate from "@rooks/use-did-update";
import React, { useRef, useState, useEffect } from 'react';

import { Direction, INITIAL_SNAKE_SIZE, ISnakeState, ISnakeProps, FIELD_LENGTH, ICell, WHITE_COLOR, GRAY_COLOR } from 'constants/index';
import {
  isSameCoordinates,
  getRandomCoordinate,
  getComputedNextHeadCoordinates,
} from 'utils/index';
import { useInterval } from 'hooks/index';

import s from './Snake.module.scss';

const initialState: ISnakeState = {
  direction: Direction.Right,
  snakeSize: INITIAL_SNAKE_SIZE,
  snakeCoordinates: [],
  foodCoordinates: {
    x: -100,
    y: -100,
  },
  score: 0,
};
const initalSpeed: number = 200;
const initialFoodCoords = {
  x: -100,
  y: -100,
};
const initialDireaction: Direction = Direction.Right;

function Snake(props: ISnakeProps) {
  const { cellSize } = props;
  const canvas = useRef<HTMLCanvasElement>(null);
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
  const getCanvasSize = (): number | null => {
    if (canvas && canvas.current) {
      const { width: canvasSize } = canvas.current.getBoundingClientRect();

      return canvasSize;
    }

    return null;
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

  const startGame = (): void => {
    renderGrid();
  }

  const handleStartGameClick = (): void => {
    renderGrid();
  }

  useEffect(() => {
    focusCanvas();
    setCanvasSize();
    startGame();
  }, []);

  return (
    <div className={s.wrapper}>
      <canvas className={s.canvas} ref={canvas} tabIndex={0} />
      <div className="scoreboard">
        <button onClick={handleStartGameClick}>Start game</button>
        {/* <span>Score: {snake.score}</span> */}
      </div>
    </div>
  );
}

export default Snake;
