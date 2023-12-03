import {readFile} from '../../common/file';
import {Direction, Grid} from '../../common/grid';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function partOne(grid: Grid): number {
  return getParts(grid).reduce((sum, part) => sum + part, 0);
}

function partTwo(grid: Grid): number {
  return getGearRatios(grid).reduce((sum, part) => sum + part, 0);
}

function getParts(grid: Grid): number[] {
  const parts: number[] = [];

  let currentNumber = '';
  let nearSymbol = false;

  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const symbol = grid.getCell(row, col)!;

      // keep track of a number as we continue to read digits
      if (DIGITS.includes(symbol)) {
        currentNumber += symbol;
        const neighbors = grid.getNeighbors(row, col);
        nearSymbol = nearSymbol || isNearSymbol(neighbors);
      }

      // reset for non-digit characters
      else {
        // we're not tracking a number, move on
        if (!currentNumber) continue;

        // the number we were tracking is not near a symbol, clear out the
        // current number and move on
        if (!nearSymbol) {
          currentNumber = '';
          continue;
        };

        // save this part, as it's near a symbol
        parts.push(Number(currentNumber));

        // reset then move on to the next character
        currentNumber = '';
        nearSymbol = false;
        continue;
      }
    }
  }

  return parts;
}

function getGearRatios(grid: Grid): number[] {
  let currentNumber = '';
  let nearbyGear = '';

  // key is row_col coordinate, value is nearby parts
  const gearMap = new Map<string, number[]>();

  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const symbol = grid.getCell(row, col)!;

      // keep track of a number as we continue to read digits
      if (DIGITS.includes(symbol)) {
        currentNumber += symbol;
        const neighbors = grid.getNeighbors(row, col);

        // if there is a neighboring gear, remember that for later
        const gear = neighbors.indexOf('*');
        if (gear >= 0) {
          const {y: rowOffset, x: colOffset} = Object.values(Direction)[gear];
          nearbyGear = `${row + rowOffset}_${col + colOffset}`;
        }
      }

      // reset for non-digit characters
      else {
        // we're not tracking a number, move on
        if (!currentNumber) continue;

        // the number we were tracking is not near a gear, clear out the
        // current number and move on
        if (!nearbyGear) {
          currentNumber = '';
          continue;
        };

        // save this part, as it's near a gear
        const existingParts = gearMap.get(nearbyGear) ?? [];
        gearMap.set(nearbyGear, [...existingParts, Number(currentNumber)]);

        // reset then move on to the next character
        currentNumber = '';
        nearbyGear = '';
        continue;
      }
    }
  }

  // now determine gear ratios from the gears with two parts nearby
  const gearRatios: number[] = []
  Array.from(gearMap.values()).forEach(parts => {
    if (parts.length === 2) {
      gearRatios.push(parts[0] * parts[1]);
    }
  });

  return gearRatios;
}

function isNearSymbol(neighbors: (string|null)[]) {
  return neighbors.some(neighbor => {
    // characters that are not periods or digits, are symbols
    return ![...DIGITS, '.', null].includes(neighbor);
  });
}

function parseInput(): Grid {
  const grid = readFile().map(line => line.split(''));
  return new Grid(grid);
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));