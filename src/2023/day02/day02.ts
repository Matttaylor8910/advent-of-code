import {readFile} from '../../common/file';

enum Cube {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
}

interface Game {
  id: number;
  max: {
    [Cube.RED]: number,
    [Cube.BLUE]: number,
    [Cube.GREEN]: number,
  };
  rounds: Round[];
}

interface Round {
  [Cube.RED]: number;
  [Cube.BLUE]: number;
  [Cube.GREEN]: number;
}

function partOne(games: Game[]): number {
  return games.filter(game => isPossible(game, 12, 13, 14))
      .reduce((sum, game) => sum + game.id, 0);
}

function partTwo(games: Game[]): number {
  return games.reduce((sum, game) => sum + getPower(game), 0);
}

function isPossible(
    game: Game,
    maxRed: number,
    maxGreen: number,
    maxBlue: number,
    ): boolean {
  if (game.max[Cube.RED] > maxRed) return false;
  if (game.max[Cube.BLUE] > maxBlue) return false;
  if (game.max[Cube.GREEN] > maxGreen) return false;

  return true;
}

function getPower(game: Game): number {
  return Object.values(game.max).reduce((product, max) => product * max, 1);
}

function parseInput(): Game[] {
  const lines = readFile();
  return lines.map(line => {
    const [, p1] = line.split('Game ');
    const [id, p2] = p1.split(': ');

    const max = {[Cube.RED]: 0, [Cube.BLUE]: 0, [Cube.GREEN]: 0};

    const rounds = p2.split('; ').map(roundString => {
      const round = {[Cube.RED]: 0, [Cube.BLUE]: 0, [Cube.GREEN]: 0};

      roundString.split(', ').forEach(subset => {
        const [count, cube] = subset.split(' ');
        round[cube] = Number(count);

        // store the max values required
        if (round[cube] > max[cube]) max[cube] = round[cube];
      });

      return round;
    });

    return {id: Number(id), max, rounds};
  });
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));