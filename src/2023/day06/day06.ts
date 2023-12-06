import {readFile} from '../../common/file';

interface Race {
  time: number;
  record: number;
}

function partOne(races: Race[]): number {
  return races.reduce((product, race) => product * countWins(race), 1);
}

function partTwo(races: Race[]): number {
  return countWins({
    time: Number(races.map(race => `${race.time}`).join('')),
    record: Number(races.map(race => `${race.record}`).join('')),
  });
}

// return an array of milliseconds to hold the button
function countWins(race: Race): number {
  let wins = 0;

  for (let time = 0; time <= race.time; time++) {
    const speed = time;
    const distance = (race.time - time) * speed;
    if (distance > race.record) wins++;
  }

  return wins;
}

function parseInput(): Race[] {
  const [p1, p2] = readFile();
  const times = p1.split(':')[1].split(' ').filter(t => t.length).map(Number);
  const dists = p2.split(':')[1].split(' ').filter(t => t.length).map(Number);

  return times.map((time, index) => ({time, record: dists[index]}));
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));