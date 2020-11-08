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
  direction: Direction,
  foodCoordinates: ICell,
  score: number,
}

export const FIELD_LENGTH = 30;
export const GRAY_COLOR = '#949494';
export const INITIAL_SNAKE_SIZE = 5;
export const WHITE_COLOR = '#ffffff';
