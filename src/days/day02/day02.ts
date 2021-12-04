import {readFile} from '../../common/file';

enum Direction {
  UP = 'up',
  DOWN = 'down',
  FORWARD = 'forward',
}

interface Instruction {
  direction: Direction;
  units: number;
}

interface Position {
  depth: number;
  horizontal: number;
}

function partOne(instructions: Instruction[]): number {
  const position = newPosition();

  instructions.forEach(instruction => updatePosition(position, instruction));

  return position.depth * position.horizontal;
}

function partTwo(instructions: Instruction[]): string|number {
  return 'todo';
}

function parseInput(): Instruction[] {
  return readFile().map(x => {
    const [direction, units] = x.split(' ');
    return {direction: direction as Direction, units: Number(units)};
  });
}

// Given an instruction, update the position in place
function updatePosition(position: Position, instruction: Instruction) {
  switch (instruction.direction) {
    case Direction.UP:
      position.depth -= instruction.units;
      return;
    case Direction.DOWN:
      position.depth += instruction.units;
      return;
    case Direction.FORWARD:
      position.horizontal += instruction.units;
      return;
    default:
      throw `Unknown direction "${instruction.direction}"`;
  }
}

function newPosition(): Position {
  return {depth: 0, horizontal: 0};
}

const instructions = parseInput();
console.log(partOne(instructions));
console.log(partTwo(instructions));