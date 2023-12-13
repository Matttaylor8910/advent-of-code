import {readFile} from '../../common/file';

type Grid = string[];

function partOne(grids: Grid[]): number {
  let totalLeft = 0;
  let totalAbove = 0;

  for (const grid of grids) {
    const {left, above} = summarizeNotes(grid, false);
    totalLeft += left;
    totalAbove += above;
  }

  return totalLeft + (100 * totalAbove);
}

function partTwo(grids: Grid[]): number {
  let totalLeft = 0;
  let totalAbove = 0;

  for (const grid of grids) {
    const {left, above} = summarizeNotes(grid, true);
    totalLeft += left;
    totalAbove += above;
  }

  return totalLeft + (100 * totalAbove);
}

function summarizeNotes(
    grid: Grid,
    allowSmudge: boolean,
    ): {left: number, above: number} {
  // look for a horizontal line
  for (let row = 0; row < grid.length - 1; row++) {
    let left = row;
    let right = row + 1;
    let matches = true;
    let usedSmudge = false;

    while (matches && left >= 0 && right < grid.length) {
      const lr = grid[left];
      const rr = grid[right];
      if (lr !== rr) {
        let useSmudge = false;
        if (allowSmudge && !usedSmudge) {
          useSmudge = countDifferences(lr, rr) === 1;
        }
        if (useSmudge) {
          usedSmudge = true;
        } else {
          matches = false;
        }
      }
      left--;
      right++;
    }

    if (matches && (usedSmudge || !allowSmudge)) {
      return {left: 0, above: row + 1};
    }
  }
  // look for a vertical line
  for (let col = 0; col < grid[0].length - 1; col++) {
    let top = col;
    let bottom = col + 1;
    let matches = true;
    let usedSmudge = false;

    while (matches && top >= 0 && bottom < grid[0].length) {
      const tc = getCol(grid, top);
      const bc = getCol(grid, bottom);
      if (tc !== bc) {
        let useSmudge = false;
        if (allowSmudge && !usedSmudge) {
          useSmudge = countDifferences(tc, bc) === 1;
        }
        if (useSmudge) {
          usedSmudge = true;
        } else {
          matches = false;
        }
      }
      top--;
      bottom++;
    }

    if (matches && (usedSmudge || !allowSmudge)) {
      return {left: col + 1, above: 0};
    }
  }

  throw 'No mirror found';
}

function countDifferences(str1: string, str2: string) {
  let count = 0;
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] !== str2[i]) count++;
  }
  return count;
}

function getCol(grid: Grid, index: number): string {
  let string = '';
  for (let i = 0; i < grid.length; i++) {
    string += grid[i][index];
  }
  return string;
}

function parseInput(): Grid[] {
  let allGrids: Grid[] = [];
  let currentGrid: Grid = [];

  for (const line of readFile()) {
    if (line.length === 0) {
      allGrids.push(currentGrid);
      currentGrid = [];
    } else {
      currentGrid.push(line);
    }
  }

  if (currentGrid.length > 0) {
    allGrids.push(currentGrid);
  }

  return allGrids;
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));