import {readFile} from '../../common/file';

enum Operator {
  MULT = '*',
  ADD = '+',
}

interface Monkey {
  items: number[];
  operator: Operator;
  operationValue: number|string;
  divideBy: number;
  trueMonkey: number;
  falseMonkey: number;
  itemsInspected: number;
  maxMod: number;
}

function newMonkey(): Monkey {
  return {
    items: [],
    operator: Operator.ADD,
    operationValue: 0,
    divideBy: 0,
    trueMonkey: 0,
    falseMonkey: 0,
    itemsInspected: 0,
    maxMod: 0,
  };
}

function parseMonkeys(lines: string[]): Monkey[] {
  const monkeys: Monkey[] = [];
  let monkey = newMonkey();

  let maxMod = 1;

  for (const line of lines) {
    // init again
    if (line === '') {
      monkeys.push(monkey);
      monkey = newMonkey();
    }

    // parse
    else {
      if (line.includes('Monkey')) continue;

      // parse items
      else if (line.includes('Starting')) {
        const [_, items] = line.split('Starting items: ');
        monkey.items = items.split(', ').map(Number);
      }

      // parse operation
      else if (line.includes('Operation')) {
        const [_, operation] = line.split('  Operation: new = old ');
        const [operator, value] = operation.split(' ');
        monkey.operator = operator as Operator;
        monkey.operationValue = value === 'old' ? value : Number(value);
      }

      // parse divide by
      else if (line.includes('Test')) {
        const [_, value] = line.split('  Test: divisible by ');
        monkey.divideBy = Number(value);
        maxMod *= monkey.divideBy;
      }

      // parse true case
      else if (line.includes('true')) {
        const [_, value] = line.split('    If true: throw to monkey ');
        monkey.trueMonkey = Number(value);
      }

      // parse false case
      else if (line.includes('false')) {
        const [_, value] = line.split('    If false: throw to monkey ');
        monkey.falseMonkey = Number(value);
      }
    }
  }
  monkeys.push(monkey);

  monkeys.forEach(monkey => monkey.maxMod = maxMod);

  return monkeys;
}

function executeRound(monkeys: Monkey[], divide: boolean) {
  for (let m = 0; m < monkeys.length; m++) {
    const monkey = monkeys[m];
    while (monkey.items.length > 0) {
      const {operationValue, operator, divideBy} = monkey;

      let item = monkey.items.shift();
      monkey.itemsInspected++;

      const value =
          (operationValue === 'old' ? item : operationValue) as number;
      if (operator === Operator.ADD) {
        item += value;
      } else {
        item *= value;
      }
      if (divide) {
        item = Math.floor(item / 3);
      } else {
        item %= monkey.maxMod;
      }

      if (item % divideBy === 0) {
        monkeys[monkey.trueMonkey].items.push(item);
      } else {
        monkeys[monkey.falseMonkey].items.push(item);
      }
    }
  }
}

function getMonkeyBusiness(monkeys: Monkey[]): number {
  return monkeys.sort((a, b) => b.itemsInspected - a.itemsInspected)
      .slice(0, 2)
      .reduce((total, b) => total * b.itemsInspected, 1);
}

function printMonkeys(monkeys: Monkey[]) {
  monkeys.forEach((monkey, i) => {
    console.log(
        `Monkey ${i}: ${monkey.items.map(i => i.toString()).join(', ')}`);
  });
}

function printMonkeyInspections(monkeys: Monkey[]) {
  monkeys.forEach((monkey, i) => {
    console.log(`Monkey ${i} inspected items ${monkey.itemsInspected} times`);
  });
}

const lines = readFile();

// part 1
let monkeys = parseMonkeys(lines);
for (let i = 0; i < 20; i++) {
  executeRound(monkeys, true);
}
printMonkeys(monkeys);
printMonkeyInspections(monkeys);
console.log(getMonkeyBusiness(monkeys));

// part 2
monkeys = parseMonkeys(lines);
for (let i = 0; i < 10000; i++) {
  executeRound(monkeys, false);
}
console.log(getMonkeyBusiness(monkeys));
