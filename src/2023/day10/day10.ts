import {readFile} from '../../common/file';
import {Direction, DirectionOffset, Grid} from '../../common/grid';

enum Pipe {
  VERTICAL = '|',
  HORIZONTAL = '-',
  NE_BEND = 'L',
  NW_BEND = 'J',
  SE_BEND = 'F',
  SW_BEND = '7',
  START = 'S',
}

interface Node {
  row: number;
  col: number;
  pipe: Pipe;
  length: number;
  direction: DirectionOffset;
  segments: Set<string>;
}

const NORTH_PIPES = [Pipe.VERTICAL, Pipe.SE_BEND, Pipe.SW_BEND];
const EAST_PIPES = [Pipe.HORIZONTAL, Pipe.NW_BEND, Pipe.SW_BEND];
const SOUTH_PIPES = [Pipe.VERTICAL, Pipe.NE_BEND, Pipe.NW_BEND];
const WEST_PIPES = [Pipe.HORIZONTAL, Pipe.NE_BEND, Pipe.SE_BEND];

function partOne(loop: Set<string>): number {
  return loop.size / 2;
}

function partTwo(loop: Set<string>, grid: Grid): number {
  // replace 'S' with the appropriate section in place
  replaceStart(start, grid);

  return countInsideLoop(loop, grid);
}

function replaceStart(start: Node, grid: Grid): void {
  const n = grid.getCell(start.row - 1, start.col) as Pipe;
  const e = grid.getCell(start.row, start.col + 1) as Pipe;
  const s = grid.getCell(start.row + 1, start.col) as Pipe;
  const w = grid.getCell(start.row, start.col - 1) as Pipe;

  if (NORTH_PIPES.includes(n)) {
    if (EAST_PIPES.includes(e)) {
      return grid.setCell(start.row, start.col, Pipe.NE_BEND);
    }
    if (SOUTH_PIPES.includes(s)) {
      return grid.setCell(start.row, start.col, Pipe.VERTICAL);
    }
    if (WEST_PIPES.includes(w)) {
      return grid.setCell(start.row, start.col, Pipe.NW_BEND);
    }
  }
  if (EAST_PIPES.includes(e) && WEST_PIPES.includes(w)) {
    return grid.setCell(start.row, start.col, Pipe.HORIZONTAL);
  }
  if (SOUTH_PIPES.includes(s)) {
    if (EAST_PIPES.includes(e)) {
      return grid.setCell(start.row, start.col, Pipe.SE_BEND);
    }
    if (WEST_PIPES.includes(w)) {
      return grid.setCell(start.row, start.col, Pipe.SW_BEND);
    }
  }
}

function countInsideLoop(loop: Set<string>, grid: Grid) {
  let count = 0;

  for (let row = 0; row < grid.rows; row++) {
    let inside = false;
    let up = 0;
    let down = 0;

    for (let col = 0; col < grid.cols; col++) {
      if (loop.has(`${row}_${col}`)) {
        const pipe = grid.getCell(row, col) as Pipe;

        // keep track of segments of pipe heading up and down
        if (SOUTH_PIPES.includes(pipe)) up++;
        if (NORTH_PIPES.includes(pipe)) down++;

        if (up + down === 2) {
          // if we have segments of pipe in this section heading both up and
          // down, toggle whether we're inside
          if (up === down) inside = !inside;

          // reset
          up = 0;
          down = 0;
        }
      } else if (inside) {
        count++;
      }
    }
  }

  return count;
}

function getLoop(start: Node, grid: Grid): Set<string> {
  const stack: Node[] = [
    {...start, direction: Direction.N},
    {...start, direction: Direction.E},
    {...start, direction: Direction.S},
    {...start, direction: Direction.W},
  ];

  // DFS find the loop
  while (stack.length > 0) {
    const current = stack.pop() as Node;

    const segments = new Set(current.segments);
    segments.add(`${current.row}_${current.col}`)

    const next: Node = {
      ...current,
      row: current.row + current.direction.y,
      col: current.col + current.direction.x,
      length: current.length + 1,
      segments,
    };

    // determine the next segment of pipe, no-op if we cannot continue
    next.pipe = grid.getCell(next.row, next.col) as Pipe;
    if (next.pipe === null) continue;

    // if we've found the starting pipe, we have all the segments!
    if (next.pipe === Pipe.START) return segments;

    // north
    if (current.direction.y < 0) {
      if (NORTH_PIPES.includes(next.pipe)) {
        if (next.pipe === Pipe.SE_BEND) next.direction = Direction.E;
        if (next.pipe === Pipe.SW_BEND) next.direction = Direction.W;
        stack.push(next);
      }
    }
    // east
    else if (current.direction.x > 0) {
      if (EAST_PIPES.includes(next.pipe)) {
        if (next.pipe === Pipe.NW_BEND) next.direction = Direction.N;
        if (next.pipe === Pipe.SW_BEND) next.direction = Direction.S;
        stack.push(next);
      }
    }
    // south
    else if (current.direction.y > 0) {
      if (SOUTH_PIPES.includes(next.pipe)) {
        if (next.pipe === Pipe.NE_BEND) next.direction = Direction.E;
        if (next.pipe === Pipe.NW_BEND) next.direction = Direction.W;
        stack.push(next);
      }
    }
    // west
    else if (current.direction.x < 0) {
      if (WEST_PIPES.includes(next.pipe)) {
        if (next.pipe === Pipe.NE_BEND) next.direction = Direction.N;
        if (next.pipe === Pipe.SE_BEND) next.direction = Direction.S;
        stack.push(next);
      }
    }
  }

  // if something went wrong, return an empty set
  return new Set();
}

function parseInput(): Grid {
  return new Grid(readFile().map(line => line.split('')));
}

const grid = parseInput();

const start = grid.find(Pipe.START) as Node;
start.pipe = Pipe.START;
start.length = 0;
start.segments = new Set<string>();

const loop = getLoop(start, grid);
replaceStart(start, grid);

console.log(partOne(loop));
console.log(partTwo(loop, grid));