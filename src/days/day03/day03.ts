import {readFile} from '../../common/file';
import {binaryToNumber} from '../../common/math';

function partOne(binaryNumbers: string[]): number {
  let gamma = '';
  let epsilon = '';

  // iterate over each bit, assuming all numbers have the same number of bits
  for (let i = 0; i < binaryNumbers[0].length; i++) {
    let zeros = 0;
    let ones = 0;

    // iterate over numbers to count
    for (let j = 0; j < binaryNumbers.length; j++) {
      binaryNumbers[j][i] === '0' ? zeros++ : ones++;
    }

    // rate calculaions
    if (zeros > ones) {
      gamma += '0';
      epsilon += '1';
    } else {
      gamma += '1';
      epsilon += '0';
    }
  }

  // multipy to get power consumption
  return binaryToNumber(gamma) * binaryToNumber(epsilon);
}

function partTwo(binaryNumbers: string[]): string|number {
  return 'todo';
}

function parseInput(): string[] {
  return readFile();
}

const binaryNumbers = parseInput();
console.log(partOne(binaryNumbers));
console.log(partTwo(binaryNumbers));