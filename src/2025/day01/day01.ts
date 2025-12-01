import {readFile} from '../../common/file';

interface Rotation {
  direction: 'L'|'R';
  amount: number;
}

function parseInput(): Rotation[] {
  return readFile().map(line => {
    const direction = line[0] as 'L' | 'R';
    const amount = Number(line.slice(1));
    return {direction, amount};
  }) as Rotation[];
}

const rotations = parseInput();

let dial = 50;
let hit0 = 0;
let endedAt0 = 0;

for (const rotation of rotations) {
  const amount = rotation.amount;

  if (rotation.direction === 'L') {
    const minRound = Math.ceil((dial - amount + 1) / 100);
    const maxRound = Math.floor(dial / 100);
    if (minRound <= maxRound) {
      hit0 += (maxRound - minRound) + 1;
    }

    dial = (dial - amount + 100) % 100;
  } else {
    const minRound = Math.ceil(dial / 100);
    const maxRound = Math.floor((dial + amount - 1) / 100);
    if (minRound <= maxRound) {
      hit0 += (maxRound - minRound) + 1;
    }

    dial = (dial + amount) % 100;
  }

  if (dial === 0) endedAt0++;
}

console.log(endedAt0);
console.log(hit0);