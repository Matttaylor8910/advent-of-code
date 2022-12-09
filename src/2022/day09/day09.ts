import {readFile} from '../../common/file';

interface Segment {
  row: number;
  col: number;

  // the next segment of the rope that follows this segment
  next?: Segment;
}

enum Direction {
  UP = 'U',
  LEFT = 'L',
  DOWN = 'D',
  RIGHT = 'R',
}

/**
 * Return references to the head and tail segments of a length of rope where
 * each segment has a location in a grid (starting at 0,0) and a reference to
 * the next segment of the rope
 * @param length
 * @returns
 */
function getRope(length: number): {head: Segment, tail: Segment} {
  const head: Segment = {row: 0, col: 0};
  let tail = head;

  for (let i = 1; i < length; i++) {
    tail.next = {row: 0, col: 0};
    tail = tail.next;
  }

  return {head, tail};
}

/**
 * Move a given segment of rope in the given direction, then adjust each
 * following segment in the rope as needed
 * @param segment
 * @param direction
 */
function move(segment: Segment, direction: Direction) {
  if (direction === Direction.UP) segment.row--;
  if (direction === Direction.LEFT) segment.col--;
  if (direction === Direction.DOWN) segment.row++;
  if (direction === Direction.RIGHT) segment.col++;

  // iterate through the length of the rope, updating locations as necessary
  while (segment.next) {
    const head = segment;
    const tail = segment.next;

    // see if the next segment is too far away, move it as necessary
    if (Math.abs(head.col - tail.col) > 1 ||
        Math.abs(head.row - tail.row) > 1) {
      // they're not in the same col, move left or right to correct
      if (head.col !== tail.col) {
        tail.col += head.col > tail.col ? 1 : -1;
      }
      // they're not in the same row, move up or down to correct
      if (head.row !== tail.row) {
        tail.row += head.row > tail.row ? 1 : -1;
      }
    } else {
      // if we didn't move this one, we don't need to move any others
      break;
    }

    segment = tail;
  }
}

const lines = readFile();

const p1Visited = new Set<string>();
const p2Visited = new Set<string>();
const {head: p1Head, tail: p1Tail} = getRope(2);
const {head: p2Head, tail: p2Tail} = getRope(10);

for (const line of lines) {
  const [direction, count] = line.split(' ');
  for (let i = 0; i < Number(count); i++) {
    move(p1Head, direction as Direction);
    p1Visited.add(`${p1Tail.row},${p1Tail.col}`);

    move(p2Head, direction as Direction);
    p2Visited.add(`${p2Tail.row},${p2Tail.col}`);
  }
}

console.log(p1Visited.size);
console.log(p2Visited.size);