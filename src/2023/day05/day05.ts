import {readFile} from '../../common/file';

type DestSourceMap = Rule[];

interface Rule {
  min: number;     // min number to consider, inclusive
  max: number;     // max number to consider, inclusive
  change: number;  // the change to apply to the source
}

function partOne({seeds, maps}: {
  seeds: number[],
  maps: DestSourceMap[],
}): number {
  const locations = seeds.map(seed => findLocationNumber(seed, maps));
  return locations.sort((a, b) => a - b)[0];
}

function partTwo({seeds, maps}: {
  seeds: number[],
  maps: DestSourceMap[],
}): number {
  let lowest = Number.MAX_SAFE_INTEGER;
  const seen = new Set<number>();

  // this is HELLA inefficient, but it eventually spits out an answer lol
  for (let i = 0; i < seeds.length; i += 2) {
    for (let seed = seeds[i]; seed < seeds[i] + seeds[i + 1]; seed++) {
      if (seen.has(seed)) continue;

      const location = findLocationNumber(seed, maps);
      if (location < lowest) lowest = location;
    }
  }

  return lowest;
}

function findLocationNumber(current: number, maps: DestSourceMap[]): number {
  for (const rules of maps) {
    // if we're in a range of a rule in this map, apply the change
    const rule = rules.find(rule => rule.min <= current && current <= rule.max);
    if (rule !== undefined) current += rule.change;
  }
  return current;
}

function parseInput(): {seeds: number[], maps: DestSourceMap[]} {
  const lines = readFile('example').join('\n');

  const [, p1] = lines.split('seeds: ');
  const groups = p1.split('\n\n');
  const seeds = groups.shift()!.split(' ').map(Number);

  const maps: DestSourceMap[] = groups.map(group => {
    const [, p2] = group.split(' map:\n');
    const rules = p2.split('\n');
    return rules.map(rule => {
      const [dest, source, count] = rule.split(' ').map(Number);
      return {
        min: source,
        max: source + count - 1,
        change: dest - source,
      };
    });
  });

  return {seeds, maps};
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));