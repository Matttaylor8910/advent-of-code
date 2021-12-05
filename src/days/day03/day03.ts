import {readFile} from '../../common/file';
import {binaryToNumber} from '../../common/math';

interface Counts {
  zeros: number;
  ones: number;
}

function partOne(binaryNumbers: string[]): number {
  let gamma = '';
  let epsilon = '';

  // iterate over each bit, assuming all numbers have the same number of bits
  for (let i = 0; i < binaryNumbers[0].length; i++) {
    const {zeros, ones} = countBits(binaryNumbers, i);

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

function partTwo(binaryNumbers: string[]): number {
  let oxygen = [...binaryNumbers];
  let co2 = [...binaryNumbers];

  let bit = 0;
  while (oxygen.length > 1) {
    const {zeros, ones} = countBits(oxygen, bit);
    const bitToKeep = ones >= zeros ? '1' : '0';
    oxygen = oxygen.filter(binary => binary[bit] === bitToKeep);
    bit++;
  }

  bit = 0;
  while (co2.length > 1) {
    const {zeros, ones} = countBits(co2, bit);
    const bitToKeep = ones >= zeros ? '0' : '1';
    co2 = co2.filter(binary => binary[bit] === bitToKeep);
    bit++;
  }

  // multipy to get power consumption
  return binaryToNumber(oxygen[0]) * binaryToNumber(co2[0]);
}

function countBits(binaryNumbers: string[], bit: number): Counts {
  let zeros = 0;
  let ones = 0;

  // iterate over numbers to count
  for (let i = 0; i < binaryNumbers.length; i++) {
    binaryNumbers[i][bit] === '0' ? zeros++ : ones++;
  }

  return {zeros, ones};
}

function parseInput(): string[] {
  return readFile();
}

const binaryNumbers = parseInput();
console.log(partOne(binaryNumbers));
console.log(partTwo(binaryNumbers));