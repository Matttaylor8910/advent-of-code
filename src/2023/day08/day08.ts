import {readFile} from '../../common/file';
import {findlcm} from '../../common/math';

interface Node {
  id: string;
  left: string;
  right: string;
}

function partOne(instructions: string[], nodeMap: Map<string, Node>): number {
  return getMinimumMoves(instructions, nodeMap.get('AAA')!, /^ZZZ$/);
}

function partTwo(instructions: string[], nodeMap: Map<string, Node>): number {
  const allAs = Array.from(nodeMap.values())
                    .filter(({id}) => id[2] === 'A')
                    .map(a => getMinimumMoves(instructions, a, /Z$/));

  return findlcm(allAs);
}

function getMinimumMoves(
    instructions: string[],
    current: Node,
    target: RegExp,
    ): number {
  let count = 0;

  while (!target.test(current?.id)) {
    const instruction = instructions[count++ % instructions.length];
    current = nodeMap.get(current[instruction === 'L' ? 'left' : 'right'])!
  }

  return count;
}

function parseInput(): {instructions: string[], nodeMap: Map<string, Node>} {
  const lines = readFile();

  const instructions = lines[0].split('');
  const nodeMap = new Map<string, Node>();
  lines.slice(2).forEach(line => {
    const [id, p1] = line.split(' = (');
    const [left, p2] = p1.split(', ');
    const [right] = p2.split(')');
    nodeMap.set(id, {id, left, right});
  });

  return {instructions, nodeMap};
}

const {instructions, nodeMap} = parseInput();

console.log(partOne(instructions, nodeMap));
console.log(partTwo(instructions, nodeMap));