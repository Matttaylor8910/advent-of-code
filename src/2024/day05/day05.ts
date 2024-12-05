import {readFile} from '../../common/file';

function isUpdateInCorrectOrder(
    update: number[],
    rules: Map<number, number[]>,
    ): boolean {
  const seen = new Set<number>();
  for (const page of update) {
    const mustBeAfter = rules.get(page) || [];
    if (mustBeAfter.some(after => seen.has(after))) {
      return false;
    }
    seen.add(page);
  }
  return true;
}

function partOne(rules: Map<number, number[]>, updates: number[][]): number {
  let sum = 0;

  // iterate through each update
  for (const update of updates) {
    if (isUpdateInCorrectOrder(update, rules)) {
      // for any updates in order, add the middle page to the sum
      sum += update[Math.floor(update.length / 2)];
    }
  }

  return sum;
}

function partTwo(rules: Map<number, number[]>, updates: number[][]): number {
  let sum = 0;

  // iterate through each update
  for (const update of updates) {
    if (!isUpdateInCorrectOrder(update, rules)) {
      // for any updates NOT in order, first order them, then add the middle
      // page to the sum
      update.sort((a, b) => {
        const aAfter = rules.get(a) || [];
        return aAfter.includes(b) ? -1 : 1;
      });
      sum += update[Math.floor(update.length / 2)];
    }
  }

  return sum;
}

function parseInput(): {rules: Map<number, number[]>, updates: number[][]} {
  // page number is the key, the rules AFTER this page is the value
  const rules = new Map<number, number[]>();
  const updates: number[][] = [];

  let settingRules = true;
  for (const line of readFile()) {
    // once we reach an empty line, we switch over to parsing the updates
    if (line === '') {
      settingRules = false;
      continue;
    }

    // when setting rules, update the map
    if (settingRules) {
      const [before, after] = line.split('|').map(Number);
      const afterList = rules.get(before) || [];
      afterList.push(after);
      rules.set(before, afterList);
    }
    // when parsing pages, just keep the numbers in an array
    else {
      updates.push(line.split(',').map(Number));
    }
  }
  return {rules, updates};
}

const {rules, updates} = parseInput();
console.log(partOne(rules, updates));
console.log(partTwo(rules, updates));