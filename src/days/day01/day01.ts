import {readFile} from '../../common/file';


function partOne(depths: number[]): number {
  let larger = 0
  for (let i = 1; i < depths.length; i++) {
    if (depths[i] > depths[i - 1]) {
      larger++;
    }
  }
  return larger;
}

function partTwo(depths: number[]): string|number {
  return 'todo';
}

function parseInput(): number[] {
  return readFile().map(Number);
}

const depths = parseInput();
console.log(partOne(depths));
console.log(partTwo(depths));