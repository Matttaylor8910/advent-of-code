import {readFile} from '../../common/file';


function partOne(): string {
  return 'TODO part 1';
}

function partTwo(): string {
  return 'TODO part 2';
}

function parseInput(): number[] {
  return readFile().map(Number);
}

const nums = parseInput();
console.log(partOne());
console.log(partTwo());