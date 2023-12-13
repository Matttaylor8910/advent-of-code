import {readFile} from '../../common/file';

type Grid = string[];

function partOne(grids: Grid[]): number {
  let totalLeft = 0;
  let totalAbove = 0;

  for (const grid of grids) {
    const {left, above} = summarizeNotes(grid);
    // console.log(left, above);
    totalLeft += left;
    totalAbove += above;
  }

  return totalLeft + (100 * totalAbove);
}

function partTwo(lines: string[]): number {
  return 0;
}

function summarizeNotes(grid: Grid): {left: number, above: number} {
  for (let row = 0; row < grid.length - 1; row++) {
    let left = row;
    let right = row + 1;
    let matches = true;

    while (matches && left >= 0 && right < grid.length) {
      if (grid[left] !== grid[right]) {
        matches = false;
      }
      left--;
      right++;
    }

    if (matches) {
      // console.log(`found mirror at row ${row}\n`);
      return {left: 0, above: row + 1};
    }
  }
  for (let col = 0; col < grid[0].length - 1; col++) {
    let top = col;
    let bottom = col + 1;
    let matches = true;

    while (matches && top >= 0 && bottom < grid[0].length) {
      // console.log(
      //     `comparing col: ${getCol(grid, top)} to ${getCol(grid, bottom)}`);
      if (getCol(grid, top) !== getCol(grid, bottom)) {
        matches = false;
      }
      top--;
      bottom++;
    }

    if (matches) {
      // console.log(`found mirror at col ${col}\n`);
      return {left: col + 1, above: 0};
    }
  }

  // console.log(grid.join('\n'));
  throw 'No mirror found';
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

  for (const line of readFile('example')) {
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

// 16082 is too low

console.log(partOne(parseInput()));
// console.log(partTwo(parseInput()));