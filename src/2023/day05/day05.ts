import {readFile} from '../../common/file';

interface DestSourceMap {
  source: string;
  dest: string;
  rules: Rule[];
}

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

function findLocationNumber(location: number, maps: DestSourceMap[]): number {
  for (const map of maps) {
    const rule = map.rules.find(rule => {
      return rule.min <= location && location <= rule.max;
    });

    // if we're in a range of a rule in this map, apply the change
    if (rule !== undefined) location += rule.change;
  }
  return location;
}

function parseInput(): {seeds: number[], maps: DestSourceMap[]} {
  const lines = readFile().join('\n');

  const [, p1] = lines.split('seeds: ');
  const groups = p1.split('\n\n');
  const seeds = groups.shift()!.split(' ').map(Number);

  const maps: DestSourceMap[] = groups.map(group => {
    const [p1, p2] = group.split(' map:\n');
    const [source, , dest] = p1.split('-');
    const rules = p2.split('\n');
    return {
      source, dest, rules: rules.map(rule => {
        const [destStart, sourceStart, count] = rule.split(' ').map(Number);
        return {
          min: sourceStart,
          max: sourceStart + count - 1,
          change: destStart - sourceStart,
        };
      })
    }
  });

  return {seeds, maps};
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));