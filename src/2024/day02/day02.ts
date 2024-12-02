import {readFile} from '../../common/file';

interface Report {
  levels: number[];
}

function partOne(reports: Report[]): number {
  return reports.filter(report => isSafe(report)).length;
}

function isSafe(report: Report): boolean {
  const [a, b] = report.levels;
  if (a === b) return false;  // not increasing or decreasing, not safe
  if (a > b) {
    return allDiffsSafe(report.levels, false);
  } else {
    return allDiffsSafe(report.levels, true);
  }
}

function allDiffsSafe(levels: number[], increasing: boolean): boolean {
  const min = 1;
  const max = 3;
  for (let i = 1; i < levels.length; i++) {
    const diff =
        increasing ? levels[i] - levels[i - 1] : levels[i - 1] - levels[i];
    if (diff < min || diff > max) return false;
  }
  return true;
}

function partTwo(reports: Report[]): number {
  return reports
      .filter(report => {
        for (let i = 0; i < report.levels.length; i++) {
          // if any array of levels with just one level removed is safe, it's
          // within tolerance and thus safe
          const levels = [...report.levels];
          levels.splice(i, 1);
          if (isSafe({levels})) return true;
        }
        return false;
      })
      .length;
}

function parseInput(): Report[] {
  return readFile().map(line => {
    return {levels: line.split(' ').map(Number)};
  });
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));