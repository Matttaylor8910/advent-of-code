import {readFile} from '../../common/file';

function partOne(elves: number[]): number {
  return 0;
}

function partTwo(elves: number[]): number {
  return 0;
}

function parseInput(): number[] {
  const lines = readFile();
  return lines.map(Number);
}

const elves = parseInput();
console.log(partOne(elves));
console.log(partTwo(elves));