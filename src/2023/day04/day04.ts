import {readFile} from '../../common/file';

interface Card {
  winners: Set<number>;  // winning numbers
  numbers: number[];     // numbers I have
}

function partOne(cards: Card[]): number {
  return cards.reduce((sum, card) => getPoints(card) + sum, 0);
}

function partTwo(cards: Card[]): number {
  const counts: number[] = [];

  cards.forEach((card, index) => {
    counts[index] = (counts[index] || 0) + 1;
    const count = getMatches(card);

    for (let next = 0; next < count; next++) {
      const multiple = counts[index];
      const nextIndex = index + next + 1;
      counts[nextIndex] = (counts[nextIndex] || 0) + multiple;
    }
  });

  return counts.reduce((sum, count) => sum + count, 0);
}

function getPoints(card: Card): number {
  const count = getMatches(card);
  return count < 3 ? count : Math.pow(2, count - 1)
}

function getMatches(card: Card): number {
  return card.numbers.filter(n => card.winners.has(n)).length;
}

function parseInput(): Card[] {
  return readFile().map(line => {
    const [winners, losers] = line.split(':')[1].split('|');

    const card: Card = {
      winners: new Set<number>(),
      numbers: [],
    };

    winners.split(' ').forEach(number => {
      if (number.length) card.winners.add(Number(number));
    });

    losers.split(' ').forEach(number => {
      if (number.length) card.numbers.push(Number(number));
    });

    return card;
  });
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));