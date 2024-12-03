import {readFile} from '../../common/file';

function isOnlyDigits(str: string): boolean {
  return /^\d+$/.test(str);
}

function extractMul(inputString: string): string[] {
  const regex = /(mul\(\d+,\d+\))/g;
  const matches = inputString.match(regex);
  return matches || [];
}

function extractCommands(inputString: string): string[] {
  const regex = /(mul\(\d+,\d+\)|do\(\)|don't\(\))/g;
  const matches = inputString.match(regex);
  return matches || [];
}

function performMul(mulStr: string): number {
  const [a, b] = mulStr.split('(')[1].split(')')[0].split(',');
  if (isOnlyDigits(a), isOnlyDigits(b)) {
    return Number(a) * Number(b);
  }
  return 0;
}

function partOne(lines: string): number {
  const commands = extractMul(lines);
  return commands.reduce((sum, command) => sum + performMul(command), 0);
}

function partTwo(lines: string): number {
  let sum = 0;
  let enabled = true;
  const commands = extractCommands(lines);
  commands.forEach(command => {
    if (command === 'do()') {
      enabled = true;
    } else if (command === 'don\'t()') {
      enabled = false;
    } else if (enabled) {
      sum += performMul(command);
    }
  });
  return sum;
}

function parseInput(): string {
  return readFile().join();
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));