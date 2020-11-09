export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right'
}

export interface ICell {
  x: number,
  y: number,
}

export interface ISnakeProps {
  cellSize: number,
}

export interface ISnakeState {
  snakeSize: number,
  snakeCoordinates: Array<ICell>,
}

export type directionType = {
  x: number,
  y: number,
}

export type directionsType = {
  [key: string]: directionType,
}

export const canvasScale = 40;
export const FIELD_LENGTH = 30;
export const GRAY_COLOR = '#949494';
export const INITIAL_SNAKE_SIZE = 5;
export const WHITE_COLOR = '#ffffff';

export const snake_start = [{ x: 8, y: 7 }, { x: 8, y: 8 }];
export const direction_start = { x: 0, y: -1 };
export const apple_start = { x: 8, y: 3 };
export const scale = 15;
export const initial_speed = 200;
export const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};
