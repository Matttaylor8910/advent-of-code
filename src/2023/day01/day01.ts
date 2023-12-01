import {readFile} from '../../common/file';

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const STRING_DIGITS =
    ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const numberMap = new Map<string, string>();
numberMap.set('one', '1');
numberMap.set('two', '2');
numberMap.set('three', '3');
numberMap.set('four', '4');
numberMap.set('five', '5');
numberMap.set('six', '6');
numberMap.set('seven', '7');
numberMap.set('eight', '8');
numberMap.set('nine', '9');

function partOne(lines: string[]): number {
  return lines.reduce(
      (sum, line) => sum + getCalibrationValue(line, DIGITS), 0);
}

function partTwo(lines: string[]): number {
  const digits = DIGITS.concat(STRING_DIGITS);
  return lines.reduce(
      (sum, line) => sum + getCalibrationValue(line, digits), 0);
}

function getCalibrationValue(line: string, digits: string[]): number {
  const first = findFirstDigit(line, digits);
  const last = findLastDigit(line, digits);

  return Number(first + last);
}

function findFirstDigit(line: string, digits: string[]): string {
  for (let i = 0; i < line.length; i++) {
    for (const digit of digits) {
      if (line.slice(i, i + digit.length) === digit) {
        return numberMap.get(digit) ?? digit;
      }
    }
  }
  throw 'Could not find a digit';
}

function findLastDigit(line: string, digits: string[]): string {
  for (let i = line.length; i > 0; i--) {
    for (const digit of digits) {
      if (line.slice(i - digit.length, i) === digit) {
        return numberMap.get(digit) ?? digit;
      }
    }
  }
  throw 'Could not find a digit';
}

function parseInput(): string[] {
  return readFile();
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));