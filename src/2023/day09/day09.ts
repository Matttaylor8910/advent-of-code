import {readFile} from '../../common/file';

type History = number[];

function partOne(histories: History[]): number {
  return histories.map(history => predictNext(history))
      .reduce((sum, next) => sum + next, 0);
}

function partTwo(histories: History[]): number {
  return histories.map(history => predictPrevious(history))
      .reduce((sum, next) => sum + next, 0);
}

function predictNext(current: History): number {
  let prediction = 0;

  while (!current.every(num => num === 0)) {
    prediction += current[current.length - 1];
    const next: number[] = [];
    for (let i = 1; i < current.length; i++) {
      next.push(current[i] - current[i - 1]);
    }
    current = next;
  }

  return prediction;
}

function predictPrevious(current: History): number {
  let prediction = current[0];
  let odd = false;

  while (!current.every(num => num === 0)) {
    const next: number[] = [];
    for (let i = 1; i < current.length; i++) {
      next.push(current[i] - current[i - 1]);
    }
    prediction = odd ? prediction + next[0] : prediction - next[0];
    current = next;
    odd = !odd;
  }

  return prediction;
}

function parseInput(): History[] {
  return readFile().map(line => line.split(' ').map(Number));
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));