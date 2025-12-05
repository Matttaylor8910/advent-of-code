import {readFile} from '../../common/file';
import {Grid} from '../../common/grid';

const MAX_PAPER_NEIGHBORS = 3;

/**
 * Find rolls of paper that can be accessed and removed
 * @param grid - The grid to remove rolls of paper from.
 * @returns the number of rolls that can be removed
 */
function partOne(grid: Grid): number {
  const {count} = removeRollsOfPaper(grid);
  return count;
}

/**
 * Recursibely remove rolls of paper that can be accessed until there's no more
 * that can be accessed
 * @param grid - The grid to remove rolls of paper from.
 * @returns the total number of rolls that can be recursively removed
 */
function partTwo(grid: Grid): number {
  let totalRemoved = 0;

  let paperToRemove = true;
  while (paperToRemove) {
    const {clone, count} = removeRollsOfPaper(grid);
    totalRemoved += count;
    if (count === 0) {
      paperToRemove = false;
    } else {
      grid = clone;
    }
  }

  return totalRemoved;
}

/**
 * Remove rolls in a cloned grid and return a count of removed rolls and the
 * cloned grid
 * @param grid - The grid to remove rolls of paper from.
 * @returns the count of rolls removed and a cloned grid with them removed
 */
function removeRollsOfPaper(grid: Grid): {clone: Grid, count: number} {
  const clone = grid.clone();
  let count = 0;

  // iterate over the grid and remove rolls of paper
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      // skip if not a roll of paper
      if (grid.getCell(row, col) !== '@') continue;

      if (canRemoveRollOfPaper(grid, row, col)) {
        removeRollOfPaper(clone, row, col);
        count++;
      }
    }
  }

  return {clone, count};
}

/**
 * Check if a roll of paper can be removed
 * @param grid
 * @param row
 * @param col
 * @returns
 */
function canRemoveRollOfPaper(grid: Grid, row: number, col: number): boolean {
  const neighbors = grid.getNeighbors(row, col);
  const rollsOfPaperNeighborsCount =
      neighbors.filter(neighbor => neighbor === '@').length;
  return rollsOfPaperNeighborsCount <= MAX_PAPER_NEIGHBORS;
}

/**
 * Remove a roll of paper from a grid
 * @param grid
 * @param row
 * @param col
 */
function removeRollOfPaper(grid: Grid, row: number, col: number) {
  grid.setCell(row, col, 'x');
}

/**
 * Parse the input into a grid
 * @returns
 */
function parseInput(): string[][] {
  return readFile().map(line => line.split(''));
}

const grid = new Grid(parseInput());
console.log(partOne(grid));
console.log(partTwo(grid));