import {readFile} from '../../common/file';

// define some globals to use
const grid = readFile().map((row: string) => {
  return row.split('').map(Number);
});
const width = grid[0].length;
const height = grid.length;

/**
 * Return true if a given location is not blocked on all 4 sides
 * @param row
 * @param col
 * @returns
 */
function isVisible(row: number, col: number): boolean {
  const thisTree = grid[row][col];
  let blockedSides = 0;
  // see if blocked on left
  for (let left = col - 1; left >= 0; left--) {
    if (thisTree <= grid[row][left]) {
      blockedSides++;
      break;
    }
  }
  // see if blocked on right
  for (let right = col + 1; right < width; right++) {
    if (thisTree <= grid[row][right]) {
      blockedSides++;
      break;
    }
  }
  // see if blocked on top
  for (let top = row - 1; top >= 0; top--) {
    if (thisTree <= grid[top][col]) {
      blockedSides++;
      break;
    }
  }
  // see if blocked on bottom
  for (let bottom = row + 1; bottom < height; bottom++) {
    if (thisTree <= grid[bottom][col]) {
      blockedSides++;
      break;
    }
  }

  // we are visible if not blocked on all 4 sides
  return blockedSides < 4;
}

/**
 * Return the scenic score for a given location, which is the product of the
 * trees it can see in each of the 4 directions
 * @param row
 * @param col
 * @returns
 */
function getScenicScore(row: number, col: number): number {
  const thisTree = grid[row][col];

  // see if blocked on left
  let leftSeen = 0;
  for (let left = col - 1; left >= 0; left--) {
    leftSeen++;
    if (thisTree <= grid[row][left]) break;
  }
  // see if blocked on right
  let rightSeen = 0;
  for (let right = col + 1; right < width; right++) {
    rightSeen++;
    if (thisTree <= grid[row][right]) break;
  }
  // see if blocked on top
  let topSeen = 0;
  for (let top = row - 1; top >= 0; top--) {
    topSeen++;
    if (thisTree <= grid[top][col]) break;
  }
  // see if blocked on bottom
  let bottomSeen = 0;
  for (let bottom = row + 1; bottom < height; bottom++) {
    bottomSeen++;
    if (thisTree <= grid[bottom][col]) break;
  }

  // we are visible if not blocked on all 4 sides
  return leftSeen * rightSeen * topSeen * bottomSeen;
}

// all edge trees are visible, so start with that
// the 4 corners are shared, so subtract that
let count = (width * 2) + (height * 2) - 4;

let topScenicScore = 0;

// now count the ones inside
for (let row = 1; row < width - 1; row++) {
  for (let col = 1; col < height - 1; col++) {
    // determine if this tree is visible
    if (isVisible(row, col)) count++;

    // determine highest score
    const score = getScenicScore(row, col);
    if (score > topScenicScore) topScenicScore = score;
  }
}

console.log(count);           // part 1
console.log(topScenicScore);  // part 2