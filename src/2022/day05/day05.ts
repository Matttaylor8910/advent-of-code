import {cloneDeep} from 'lodash';

import {readFile} from '../../common/file';

interface Move {
  count: number;  // number of crates to move
  start: number;  // start column
  end: number;    // end column
}

const lines = readFile();
const stacks = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
};
const moves: Move[] = [];

for (const line of lines) {
  if (line.includes('move')) {
    // save move
    const [_move, count, _from, start, _to, end] = line.split(' ');
    moves.push({
      count: Number(count),
      start: Number(start),
      end: Number(end),
    });
  } else if (line.includes('[')) {
    // build structure
    // iterate over every 4 chars in the line, as that encompases each column if
    // there is a letter present in that stack
    for (let i = 0; i < line.length; i += 4) {
      const [_, letter] = line.slice(i, i + 4).split('');
      if (letter != ' ') {
        const column = (i / 4) + 1;
        stacks[column].push(letter);
      }
    }
  }
}

// part 1
const p1Stacks = cloneDeep(stacks);
for (const move of moves) {
  const {count, start, end} = move;
  for (let i = 0; i < count; i++) {
    // move the crate from one stack to the other
    p1Stacks[end].unshift(p1Stacks[start].shift());
  }
}
const p1Tops =
    Object.values(p1Stacks).map(stack => (stack as Array<string>)[0]).join('');
console.log(p1Tops);

// part 2
const p2Stacks = cloneDeep(stacks);
for (const move of moves) {
  const {count, start, end} = move;

  // move the crates from one stack to the other
  p2Stacks[end].unshift(...p2Stacks[start].splice(0, count));
}
const p2Tops =
    Object.values(p2Stacks).map(stack => (stack as Array<string>)[0]).join('');
console.log(p2Tops);