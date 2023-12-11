import {readFile} from '../../common/file';

interface Galaxy {
  row: number;
  col: number;
}

function partOne(lines: string[]): number {
  const {galaxies, galaxyRows, galaxyCols} = findGalaxies(lines);
  return sumGalaxyDistances(galaxies, galaxyRows, galaxyCols, 2);
}


function partTwo(lines: string[]): number {
  const {galaxies, galaxyRows, galaxyCols} = findGalaxies(lines);
  return sumGalaxyDistances(galaxies, galaxyRows, galaxyCols, 1000000);
}

function sumGalaxyDistances(
    galaxies: Galaxy[],
    galaxyRows: number[],
    galaxyCols: number[],
    galaxyExpansion: number,
    ): number {
  let sum = 0;
  while (galaxies.length > 0) {
    const galaxy = galaxies.shift()!;

    for (const other of galaxies) {
      sum += findDistance(
          galaxy,
          other,
          galaxyRows,
          galaxyCols,
          galaxyExpansion,
      );
    }
  }
  return sum;
}

function findGalaxies(lines: string[]): {
  galaxies: Galaxy[],
  galaxyRows: number[],
  galaxyCols: number[],
} {
  const galaxies = new Set<string>();

  // whenever we find a galaxy, mark that row to true
  const galaxyRows = new Array(lines.length).fill(false);
  const galaxyCols = new Array(lines[0].length).fill(false);

  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      if (lines[row][col] === '#') {
        galaxies.add(`${row}_${col}`);
        galaxyRows[row] = true;
        galaxyCols[col] = true;
      }
    }
  }
  const galaxyArray: Galaxy[] = Array.from(galaxies).map(galaxy => {
    const [row, col] = galaxy.split('_');
    return {row: Number(row), col: Number(col)};
  });

  return {galaxyRows, galaxyCols, galaxies: galaxyArray};
}

function findDistance(
    galaxy1: Galaxy,
    galaxy2: Galaxy,
    galaxyRows: number[],
    galaxyCols: number[],
    galaxyExpansion: number,
    ): number {
  const galRowMax = Math.max(galaxy1.row, galaxy2.row);
  const galRowMin = Math.min(galaxy1.row, galaxy2.row);
  const expandedRows = galaxyRows.slice(galRowMin + 1, galRowMax)
                           .filter(hasGalaxy => !hasGalaxy)
                           .length *
      (galaxyExpansion - 1);

  const galColMax = Math.max(galaxy1.col, galaxy2.col);
  const galColMin = Math.min(galaxy1.col, galaxy2.col);
  const expandedCols = galaxyCols.slice(galColMin + 1, galColMax)
                           .filter(hasGalaxy => !hasGalaxy)
                           .length *
      (galaxyExpansion - 1);

  return (galRowMax - galRowMin) + expandedRows + (galColMax - galColMin) +
      expandedCols;
}

function parseInput(): string[] {
  return readFile();
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));