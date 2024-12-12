import {readFile} from '../../common/file';

interface Equation {
  testValue: number;
  values: number[];
}

function canProduceTestValue(equation: Equation, operators: string[]): boolean {
  let results: number[] = [equation.values[0]];
  // work our way left to right through the values
  for (const value of equation.values.slice(1)) {
    const newResults: number[] = [];
    for (const operator of operators) {
      for (const result of results) {
        let newResult = value;
        if (operator === '+') {
          newResult += result;  // add
        } else if (operator === '*') {
          newResult *= result;  // multipy
        } else if (operator === '||') {
          newResult = Number(`${result}${value}`);  // concatenate
        }
        newResults.push(newResult);
      }
    }
    results = newResults;
  }
  return results.includes(equation.testValue);
}

function partOne(equations: Equation[]): number {
  let sum = 0;

  for (const equation of equations) {
    if (canProduceTestValue(equation, ['+', '*'])) {
      sum += equation.testValue;
    }
  }

  return sum;
}

function partTwo(equations: Equation[]): number {
  let sum = 0;

  for (const equation of equations) {
    if (canProduceTestValue(equation, ['+', '*', '||'])) {
      sum += equation.testValue;
    }
  }

  return sum;
}

function parseInput(): Equation[] {
  return readFile().map(line => {
    const [testValue, values] = line.split(': ');
    return {
      testValue: Number(testValue),
      values: values.split(' ').map(Number),
    };
  });
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));