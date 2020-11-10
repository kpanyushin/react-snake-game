// types and interfaces

export interface ICell {
  x: number,
  y: number,
}

export interface ISnakeProps {
  cellSize: number,
  fieldLength: number,
}

type directionsType = {
  [key: string]: ICell,
}

// initial states

export const INITIAL_SNAKE_SIZE: number = 5;
export const INITIAL_SNAKE_POS: Array<ICell> = [{ x: 8, y: 7 }, { x: 8, y: 8 }];
export const DIRECTION_START: ICell = { x: 0, y: -1 };
export const FOOD_START: ICell = { x: 8, y: 3 };
export const CANVAS_SCALE: number = 20;
export const INITIAL_SPEED: number = 270;
export const DIRECTIONS: directionsType = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

// colors

export const COLOR_RED = 'red';
export const COLOR_GREEN = 'green';
export const COLOR_GRAY = '#DDDDDD';
export const COLOR_WHITE = '#FFFFFF';
