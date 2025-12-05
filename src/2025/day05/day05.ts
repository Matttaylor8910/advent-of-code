import {readFile} from '../../common/file';

interface Range {
  min: number;
  max: number;
}

/**
 * Count all ingredients that are "fresh" (within any range)
 * @param ranges
 * @param ingredients
 * @returns
 */
function partOne(ranges: Range[], ingredients: number[]): number {
  const freshIngredients = ingredients.filter(ingredient => {
    return ranges.some(range => {
      return ingredient >= range.min && ingredient <= range.max;
    });
  });
  return freshIngredients.length;
}

/**
 * Return the total number of "fresh" ids in all ranges, handling overlaps
 * @param ranges
 * @returns
 */
function partTwo(ranges: Range[]): number {
  // build a map of ingredient ids -> count where the count is representative of
  // ranges starting and ending at this id, positive numbers represent the
  // beginning of ranges, and negative the ends of ranges. keeping track of this
  // value as you iterate the map in order results in a sum of 0 being the
  // absolute end of an overlapping range
  const map = new Map<number, number>();
  for (const range of ranges) {
    const min = map.get(range.min) || 0;
    map.set(range.min, min + 1);
    const max = map.get(range.max) || 0;
    map.set(range.max, max - 1);
  }

  // sort the map by ingredient id so we can handle ranges in order
  const entries = Array.from(map.entries())
                      .map(([key, value]) => ({key, value}))
                      .sort((a, b) => a.key - b.key);

  let count = 0;
  let adding = 0;
  let start = -1;
  for (const entry of entries) {
    // if we haven't found a start yet, set it to the current key
    if (start === -1) start = entry.key;

    // add the value to the running total, when adding is positive, we're inside
    // 1+ ranges, when we hit 0 then we've reached the final end of a range
    adding += entry.value;

    // time to add the value from the start of this range (or group of ranges)
    if (adding === 0) {
      count += entry.key - start + 1;
      start = -1;
    }
  }

  return count;
}

/**
 * Parse the ranges of "fresh" ingredients and the ingredients list
 * @returns
 */
function parseInput(): {ranges: Range[], ingredients: number[]} {
  const lines = readFile();
  const ranges: Range[] = [];
  const ingredients: number[] = [];
  let settingRanges = true;

  for (const line of lines) {
    const [min, max] = line.split('-').map(Number);
    if (line === '') {
      settingRanges = false;
      continue;
    }
    if (settingRanges) {
      ranges.push({min, max});
    } else {
      ingredients.push(Number(line));
    }
  }
  return {ranges, ingredients};
}

const {ranges, ingredients} = parseInput();
console.log(partOne(ranges, ingredients));
console.log(partTwo(ranges));