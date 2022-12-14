import {readFile} from '../../common/file';

enum Mark {
  START_POINT = 'S',
  BEST_SIGNAL = 'E',
}

enum Direction {
  U = 'U',
  D = 'D',
  L = 'L',
  R = 'R',
}

interface State {
  path: string[];  // list of coordinates ['0,0', '0,1', '1,1']
  row: number;
  col: number;
}

const DIRECTION_MODIFIERS = {
  [Direction.U]: {row: -1, col: 0},
  [Direction.D]: {row: 1, col: 0},
  [Direction.L]: {row: 0, col: -1},
  [Direction.R]: {row: 0, col: 1},
};

const ALPHABET =
    Array.from(Array(26)).map((_, i) => String.fromCharCode(i + 97));

function newState(
    visited: Map<string, number>,
    row: number,
    col: number,
    path: string[] = [],
    ): State {
  const position = `${row},${col}`;
  visited.set(position, path.length);
  return {path: [...path, position], row, col};
}

function isShorter(
    row: number,
    col: number,
    path: string[],
    visited: Map<string, number>,
    ): boolean {
  const existing = visited.get(`${row},${col}`);
  return path.length < (existing ?? Number.MAX_SAFE_INTEGER);
}

function getElevation(grid: string[], row: number, col: number): number {
  const line = grid[row];
  if (line) {
    let char = line[col];
    if (char === Mark.START_POINT) char = 'a';  // start has elevation a
    if (char === Mark.BEST_SIGNAL) char = 'z';  // best signal has elevation z

    return ALPHABET.indexOf(char);
  }

  return -1;
}

function determineShortestPath(grid: string[], r: number, c: number): number {
  // if there is a number for a string representing coordinates, the number
  // represents the minimum number of moves it took to get to that space. We can
  // drop all states that would be longer that the shortest route we already
  // have
  const visited = new Map<string, number>();

  const queue = [newState(visited, r, c)];

  while (queue.length) {
    const {row, col, path} = queue.shift()!;

    // we've found a path (also the shortest since BFS)
    if (grid[row][col] === Mark.BEST_SIGNAL) {
      return path.length - 1;
    }

    addState(grid, row, col, path, Direction.U, visited, queue);
    addState(grid, row, col, path, Direction.D, visited, queue);
    addState(grid, row, col, path, Direction.L, visited, queue);
    addState(grid, row, col, path, Direction.R, visited, queue);
  }

  return -1;  // no path found
}

function addState(
    grid: string[],
    row: number,
    col: number,
    path: string[],
    direction: Direction,
    visited: Map<string, number>,
    queue: State[],
) {
  // save the from elevation
  const from = getElevation(grid, row, col);

  // modify the row/col based on direction to get the to elevation
  row += DIRECTION_MODIFIERS[direction].row;
  col += DIRECTION_MODIFIERS[direction].col;
  const to = getElevation(grid, row, col);

  // push on the new state if:
  // 1) the starting elevation can reach the new elevation
  // 2) the new elevation is in bounds
  // 3) we have not already reached this part of the grid by a shorter path
  if (from + 1 >= to && to >= 0 && isShorter(row, col, path, visited)) {
    queue.push(newState(visited, row, col, path));
  }
}

const grid = readFile();
const height = grid[0].length;
const width = grid.length;

let best = Number.MAX_SAFE_INTEGER;

// determine start and end
for (let row = 0; row < width; row++) {
  for (let col = 0; col < height; col++) {
    if (grid[row][col] === Mark.START_POINT) {
      // part 1, look for best path from starting point
      console.log(determineShortestPath(grid, row, col));
    }
    if (getElevation(grid, row, col) === 0) {
      // part 2, look for best path from any low point
      const current = determineShortestPath(grid, row, col)
      if (current > 0 && current < best) best = current;
    }
  }
}

console.log(best);