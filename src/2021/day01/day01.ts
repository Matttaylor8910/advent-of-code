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

function partTwo(depths: number[]): number {
  let [a, b, c] = depths;

  let larger = 0
  let lastSum = a + b + c;

  for (let i = 3; i < depths.length; i++) {
    const newSum = lastSum + depths[i] - a;
    a = b;
    b = c;
    c = depths[i];
    if (newSum > lastSum) {
      larger++;
    }
    lastSum = newSum;
  }

  return larger;
}

function parseInput(): number[] {
  return readFile().map(Number);
}

const depths = parseInput();
console.log(partOne(depths));
console.log(partTwo(depths));