import {readFile} from '../../common/file';
import {Direction, DirectionOffset, Grid} from '../../common/grid';

function findXmases(grid: Grid, row: number, col: number): number {
  let count = 0;

  if (hasXmas(grid, row, col, Direction.N)) count++;
  if (hasXmas(grid, row, col, Direction.NE)) count++;
  if (hasXmas(grid, row, col, Direction.E)) count++;
  if (hasXmas(grid, row, col, Direction.SE)) count++;
  if (hasXmas(grid, row, col, Direction.S)) count++;
  if (hasXmas(grid, row, col, Direction.SW)) count++;
  if (hasXmas(grid, row, col, Direction.W)) count++;
  if (hasXmas(grid, row, col, Direction.NW)) count++;

  return count;
}

function hasXmas(
    grid: Grid,
    row: number,
    col: number,
    direction: DirectionOffset,
    ): boolean {
  const phrase = 'XMAS';

  for (let i = 0; i < phrase.length; i++) {
    const nextRow = row + (direction.y * i);
    const nextCol = col + (direction.x * i);
    if (grid.getCell(nextRow, nextCol) !== phrase[i]) {
      return false;
    }
  }

  return true;
}

function isXmasCross(grid: Grid, row: number, col: number): boolean {
  const [, ne, , se, , sw, , nw] = grid.getNeighbors(row, col);
  const opposites = [[ne, sw], [nw, se]];

  return opposites.every(set => set.includes('M') && set.includes('S'));
}

function partOne(grid: Grid): number {
  let count = 0;

  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      if (grid.getCell(row, col) === 'X') {
        count += findXmases(grid, row, col);
      }
    }
  }

  return count;
}

function partTwo(grid: Grid): number {
  let count = 0;

  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      if (grid.getCell(row, col) === 'A') {
        if (isXmasCross(grid, row, col)) count++;
      }
    }
  }

  return count;
}

function parseInput(): Grid {
  return new Grid(readFile());
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));