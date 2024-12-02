import {readFile} from '../../common/file';

function partOne(): number {
  const first: number[] = [];
  const second: number[] = [];
  readFile().map(line => {
    const [a, b] = line.split('   ');
    first.push(Number(a));
    second.push(Number(b));
  });

  // sort columns and calculate distances between values
  first.sort();
  second.sort();
  return first.reduce((sum, val, i) => sum + Math.abs(val - second[i]), 0);
}


function partTwo(): number {
  const numbers: number[] = [];
  const counts = new Map<number, number>();
  readFile().map(line => {
    const [a, b] = line.split('   ');
    numbers.push(Number(a));

    // count occurrences in col 2
    const key = Number(b);
    const count = counts.get(key) || 0;
    counts.set(key, count + 1);
  });

  // sum similarity scores, # occurrences of current val (from col 1) in col 2
  return numbers.reduce((sum, val) => sum + (val * (counts.get(val) || 0)), 0);
}

console.log(partOne());
console.log(partTwo());