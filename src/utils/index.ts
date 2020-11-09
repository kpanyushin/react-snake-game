import { ICell, FIELD_LENGTH, Direction } from 'constants/index';

/**
 * @function getRandomCoordinate
 * @param {number} cellSize
 * @returns ICell
 * @description Returns random coordinate.
 */

export const getRandomCoordinate = (cellSize: number): number =>
  Math.floor(Math.random() * FIELD_LENGTH) * cellSize;

/**
 * @function areSameCoordinates
 * @param {ICell} a
 * @param {ICell} b
 * @returns {boolean}
 * @description Compares two coordinates.
 */

export const areSameCoordinates = (a: ICell, b: ICell): boolean => a.x === b.x && a.y === b.y;

/**
 *
 * @param {ICell} headCoordinates
 * @param {Direction} direction
 * @param {number} canvasSize
 * @param {number} cellSize
 * @returns {ICell | null}
 * @description Computes snake's head next coordinate.
 */

export const getComputedNextHeadCoordinates = (
  headCoordinates: ICell,
  direction: string,
  canvasSize: number | null,
  cellSize: number
): ICell | null => {
  if (!canvasSize) return null;
  if (headCoordinates) {
    let { x, y } = headCoordinates;

    switch (direction) {
      case Direction.Right:
        x += cellSize;
        break;
      case Direction.Left:
        x -= cellSize;
        break;
      case Direction.Up:
        y -= cellSize;
        break;
      case Direction.Down:
        y += cellSize;
        break;
      default:
        return null;
    }

    if (x < 0) {
      x = canvasSize - cellSize;
    }

    if (y < 0) {
      y = canvasSize - cellSize;
    }

    if (x > canvasSize - cellSize) {
      x = 0;
    }

    if (y > canvasSize - cellSize) {
      y = 0;
    }

    return { x, y };
  }

  return null;
};
