import {readFile} from '../../common/file';

function partOne(elves: number[]): number {
  return elves[0];
}

function partTwo(elves: number[]): number {
  return elves.slice(0, 3).reduce((sum, elf) => sum + elf, 0);
}

function parseInput(): number[] {
  const lines = readFile();
  let currentElf = 0;
  const elves: number[] = [];
  for (const line of lines) {
    if (line.length) {
      currentElf += Number(line);
    } else {
      elves.push(currentElf);
      currentElf = 0;
    }
  }

  return elves.sort((a, b) => b - a);
}

const elves = parseInput();
console.log(partOne(elves));
console.log(partTwo(elves));