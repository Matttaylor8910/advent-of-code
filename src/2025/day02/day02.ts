import {readFile} from '../../common/file';

interface Range {
  min: number;
  max: number;
}

/**
 * Sum invalid ranges, those made up of exactly 2 repeating parts
 * @param ranges
 * @returns
 */
function partOne(ranges: Range[]): number {
  let invalidIdSum = 0;
  const parts = 2;

  for (const range of ranges) {
    for (let i = range.min; i <= range.max; i++) {
      if (isRepeatingPattern(String(i), String(i).length / parts)) {
        invalidIdSum += i;
      }
    }
  }

  return invalidIdSum;
}

/**
 * Sum invalid ranges, those completely made up of repeating parts
 * @param ranges
 * @returns
 */
function partTwo(ranges: Range[]): number {
  let invalidIdSum = 0;

  for (const range of ranges) {
    for (let i = range.min; i <= range.max; i++) {
      // if the id is a single digit, skip
      if (String(i).length > 1 && isRepeatingId(i)) {
        invalidIdSum += i;
      }
    }
  }

  return invalidIdSum;
}

/**
 * A repeating ID is that where it has a repeating pattern for any of its
 * multiples.
 * @param id
 * @returns
 */
function isRepeatingId(id: number): boolean {
  const idStr = id.toString();

  // divide the string into multiple divisible parts
  for (let length = 1; length < idStr.length / 2 + 1; length++) {
    if (isRepeatingPattern(idStr, length)) {
      return true;
    }
  }

  // by default the id part is not invalid
  return false;
}

/**
 * Check if a string is made up of repeating patterns of the given length
 * @param idStr
 * @param length
 * @returns
 */
function isRepeatingPattern(idStr: string, length: number): boolean {
  // get the number of parts
  const parts = idStr.length / length;
  // check if the number of parts is a whole number
  const isRound = idStr.length % length === 0;

  // if the number of parts is not a whole number, skip
  if (!isRound) {
    return false;
  }

  // get the first part
  const match = idStr.substring(0, length);
  // check if the rest of the string is made up of the same part
  for (let j = 0; j < parts; j++) {
    const start = j * length;
    const end = (j * length) + length;
    const compare = idStr.substring(start, end);
    if (compare !== match) {
      return false;
    }
  }

  // if the rest of the string is made up of the same part, the id is invalid
  return true;
}

function parseInput(): Range[] {
  const [line1] = readFile();
  const ranges = line1.split(',').map(range => {
    const [min, max] = range.split('-').map(Number);
    return {min, max};
  });
  return ranges;
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));