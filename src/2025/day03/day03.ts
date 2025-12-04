import {readFile} from '../../common/file';

/**
 * Sum the highest joltages for each bank by combining 2 values
 *
 * @param banks - the banks to search for the highest joltage
 * @returns the sum of the highest joltages in each bank
 */
function partOne(banks: string[]): number {
  return sumHighestJoltages(banks, 2);
}

/**
 * Sum the highest joltages for each bank by combining 12 values
 *
 * @param banks - the banks to search for the highest joltage
 * @returns the sum of the highest joltages in each bank
 */
function partTwo(banks: string[]): number {
  return sumHighestJoltages(banks, 12);
}

/**
 * Sum the highest joltages for each bank
 *
 * @param banks - the banks to search for the highest joltage
 * @param digits - the number of digits to combine
 * @returns the sum of the highest joltages in each bank
 */
function sumHighestJoltages(banks: string[], digits: number): number {
  let sum = 0;

  // iterate through the banks
  for (const bank of banks) {
    sum += findHighestJoltage(bank, digits);
  }

  return sum;
}

/**
 * Since we're looking for the highest {digits} number by joining single
 * digits together from left to right, we need the highest digit in the
 * string that is {digits} spaces or more from the end (leaving at
 * least {digits - 1} digits following). once we have that highest digit,
 * the string following it is the next string to search for the highest
 * digit with at least {digits - 1} digits following, etc till we have all
 * digits
 *
 * @param bank - the bank to search for the highest joltage
 * @param digits - the number of digits to combine
 * @returns the highest joltage
 **/
function findHighestJoltage(bank: string, digits: number): number {
  let max = '';

  for (let i = 0; i < digits; i++) {
    const toSearch = bank.slice(0, bank.length - (digits - i - 1));
    const digit = findHighestDigitInString(toSearch).toString();
    const index = toSearch.indexOf(digit);
    bank = bank.slice(index + 1);
    max += digit;
  }
  return Number(max);
}

/**
 * @param str - the string to search for the highest digit
 * @returns the highest digit
 */
function findHighestDigitInString(str: string): number {
  let max = 0;
  for (const char of str) {
    if (Number(char) > max) {
      max = Number(char);
    }
  }
  return max;
}

console.log(partOne(readFile()));
console.log(partTwo(readFile()));