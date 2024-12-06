import {readFile} from '../../common/file';
import {Grid} from '../../common/grid';

function findStart(grid: Grid): {row: number, col: number} {
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      if (['<', '^', '>', 'v'].includes(grid.getCell(row, col)!)) {
        return {row, col};
      }
    }
  }
  return {row: -1, col: -1};
}

function countUniquePoints(grid: Grid, maxOperations?: number): number {
  let {row, col} = findStart(grid);
  const seen = new Set<string>();

  let cell = grid.getCell(row, col);
  let dir = cell;
  let operations = 0;
  while (cell !== null) {
    seen.add(`${row},${col}`);

    // proabably a loop, return -1 to represent infinity
    if (maxOperations && operations > maxOperations) {
      return -1;
    }

    if (dir === '<') {
      if (grid.getCell(row, col - 1) === '#') {
        dir = '^';
      } else {
        col--;
      }
    } else if (dir === '^') {
      if (grid.getCell(row - 1, col) === '#') {
        dir = '>';
      } else {
        row--;
      }
    } else if (dir === '>') {
      if (grid.getCell(row, col + 1) === '#') {
        dir = 'v';
      } else {
        col++;
      }
    } else if (dir === 'v') {
      if (grid.getCell(row + 1, col) === '#') {
        dir = '<';
      } else {
        row++;
      }
    }
    cell = grid.getCell(row, col);
    operations++;
  }

  return seen.size;
}

function partOne(grid: Grid): number {
  return countUniquePoints(grid);
}

function partTwo(grid: Grid): number {
  let count = 0;

  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      // skip existing spots
      if (['<', '^', '>', 'v', '#'].includes(grid.getCell(row, col)!)) continue;

      // close the grid and add an obstacle, short circuit after 10000
      // operations, probably safe to assume a loop at that point
      const clone = grid.clone();
      clone.setCell(row, col, '#');
      const result = countUniquePoints(clone, 10000);
      if (result === -1) {
        count++;
      }
    }
  }

  return count;
}

function parseInput(): Grid {
  return new Grid(readFile().map(line => line.split('')));
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));