import {readFile} from '../../common/file';

enum Operation {
  MULTIPLY = '*',
  ADD = '+',
  NONE = '',
}

interface Column {
  numbers: number[];
  operation: Operation;
}

const OPERATIONS = [Operation.MULTIPLY, Operation.ADD];

/**
 * Provided a list of columns with operations and numbers, perform the
 * operations on the numbers per column, then sum the results
 * @param columns - the columns to perform the operations on
 * @returns sum of the results of each column
 */
function performOperations(columns: Column[]): number {
  let total = 0;

  for (const column of columns) {
    if (column.operation === Operation.MULTIPLY) {
      const product =
          column.numbers.reduce((product, number) => product * number, 1);
      total += product;
    } else if (column.operation === Operation.ADD) {
      const sum = column.numbers.reduce((sum, number) => sum + number, 0);
      total += sum;
    }
  }

  return total;
}

/**
 * Parse the operations as normal number read left to right
 * @returns columns with operations and numbers
 */
function parseInput(): Column[] {
  const lines = readFile();
  const columns: Column[] = [];

  // the operations are the last line
  const operations = lines.pop() as string;
  let currentOperationIndex = 0;
  for (let i = 1; i < operations.length; i++) {
    const thisOperation = operations[i] as Operation;
    const isTheEnd = i === operations.length - 1;

    // if we hit an operation, build up the column for the
    if (OPERATIONS.includes(thisOperation)) {
      const numbers =
          lines.map(line => Number(line.slice(currentOperationIndex, i)));
      columns.push({
        numbers,
        operation: operations[currentOperationIndex] as Operation,
      });
      currentOperationIndex = i;
    }

    // add the last column too
    if (isTheEnd) {
      const numbers = lines.map(
          line => Number(line.slice(currentOperationIndex, line.length)));
      columns.push({
        numbers,
        operation: operations[currentOperationIndex] as Operation,
      });
    }
  }

  return columns;
}

/**
 * Parse the operations with numbers read vertically top to bottom
 * @returns columns with operations and numbers
 */
function parseInputVertically(): Column[] {
  const lines = readFile();
  const columns: Column[] = [];
  const operations = lines.pop() as string;

  let adding = true;
  let currentColumn: Column = {
    numbers: [],
    operation: Operation.NONE,
  };
  let col = 0;
  while (adding) {
    // get the operation for this column
    const operation = operations[col] as Operation;
    if (OPERATIONS.includes(operation)) {
      currentColumn.operation = operation;
    }

    // build up the number string, and count spaces
    // if it's a completely empty row, that's the end
    let numberString: string = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const char = line[col];
      if (char && char !== ' ') {
        numberString += char;
      }
    }

    if (numberString) {
      // save the number for this "col" if there was one
      currentColumn.numbers.push(Number(numberString));
    } else {
      // there was no number from top to bottom, we're done here
      columns.push(currentColumn);
      currentColumn = {
        numbers: [],
        operation: Operation.NONE,
      };

      // if we've hit the end of the operations, exit the loop
      if (col > operations.length) {
        adding = false;
      }
    }
    col++;
  }

  return columns;
}

console.log(performOperations(parseInput()));
console.log(performOperations(parseInputVertically()));