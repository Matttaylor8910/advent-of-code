import {readFile} from '../../common/file';

enum TheirChoice {
  ROCK = 'A',
  PAPER = 'B',
  SCISSORS = 'C',
}

enum MyChoice {
  ROCK = 'X',
  PAPER = 'Y',
  SCISSORS = 'Z',
}

enum Outcome {
  LOSS = 'X',
  DRAW = 'Y',
  WIN = 'Z',
}

const LOSS = 0;
const DRAW = 3;
const WIN = 6;

function getScore(them: TheirChoice, me: MyChoice): number {
  let score = 0;
  if (MyChoice.ROCK === me) score = 1;
  if (MyChoice.PAPER === me) score = 2;
  if (MyChoice.SCISSORS === me) score = 3;

  if (TheirChoice.ROCK === them) {
    if (MyChoice.ROCK === me) score += DRAW;
    if (MyChoice.PAPER === me) score += WIN;
    if (MyChoice.SCISSORS === me) score += LOSS;
  } else if (TheirChoice.PAPER === them) {
    if (MyChoice.ROCK === me) score += LOSS;
    if (MyChoice.PAPER === me) score += DRAW;
    if (MyChoice.SCISSORS === me) score += WIN;
  } else if (TheirChoice.SCISSORS === them) {
    if (MyChoice.ROCK === me) score += WIN;
    if (MyChoice.PAPER === me) score += LOSS;
    if (MyChoice.SCISSORS === me) score += DRAW;
  }

  return score;
}

function determineChoice(them: TheirChoice, outcome: Outcome): MyChoice {
  if (TheirChoice.ROCK === them) {
    if (Outcome.LOSS === outcome) return MyChoice.SCISSORS;
    if (Outcome.DRAW === outcome) return MyChoice.ROCK;
    if (Outcome.WIN === outcome) return MyChoice.PAPER;
  } else if (TheirChoice.PAPER === them) {
    if (Outcome.LOSS === outcome) return MyChoice.ROCK;
    if (Outcome.DRAW === outcome) return MyChoice.PAPER;
    if (Outcome.WIN === outcome) return MyChoice.SCISSORS;
  } else if (TheirChoice.SCISSORS === them) {
    if (Outcome.LOSS === outcome) return MyChoice.PAPER;
    if (Outcome.DRAW === outcome) return MyChoice.SCISSORS;
    if (Outcome.WIN === outcome) return MyChoice.ROCK;
  }

  // default, will never get here
  return MyChoice.ROCK;
}

const lines = readFile();

let part1 = 0;
for (const line of lines) {
  const [them, me] = line.split(' ');
  part1 += getScore(them as TheirChoice, me as MyChoice);
}

console.log(part1);

let part2 = 0;
for (const line of lines) {
  const [them, outcome] = line.split(' ');
  const myChoice = determineChoice(them as TheirChoice, outcome as Outcome);
  part2 += getScore(them as TheirChoice, myChoice);
}

console.log(part2);
