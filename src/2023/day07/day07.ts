import {readFile} from '../../common/file';

interface Hand {
  cards: string[];
  bid: number;
}

interface HandPriority {
  hand: Hand;
  priority: number;
}

function partOne(hands: Hand[]): number {
  const sorted = getPrioritizedHands(hands, false);
  return calculateEarnings(sorted);
}

function partTwo(hands: Hand[]): number {
  const sorted = getPrioritizedHands(hands, true);
  return calculateEarnings(sorted);
}

function calculateEarnings(sortedHands: HandPriority[]): number {
  return sortedHands.reduce((sum, {hand}, index) => {
    const rank = index + 1;
    return rank * hand.bid + sum;
  }, 0);
}

function getPrioritizedHands(hands: Hand[], wild: boolean): HandPriority[] {
  const cardOrder = wild ?
      ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'] :
      ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

  const withPriority = hands.map(hand => {
    return {hand, priority: getPriority(hand, wild)};
  });

  return withPriority.sort((a, b) => {
    if (b.priority === a.priority) {
      let i = 0;
      while (b.hand.cards[i] === a.hand.cards[i]) i++;

      // sort by best card from left to right, asc
      return cardOrder.indexOf(b.hand.cards[i]) -
          cardOrder.indexOf(a.hand.cards[i]);
    } else {
      // sort by priority, desc
      return b.priority - a.priority;
    }
  });
}

// return a priority number for the hand, lower is better
function getPriority(hand: Hand, wild: boolean): number {
  const cardMap = new Map<string, number>();
  hand.cards.forEach(card => {
    cardMap.set(card, (cardMap.get(card) ?? 0) + 1);
  });

  // if jokers are wild, we need to know how many we have, then remove them from
  // the rest of the counts
  let jokers = 0;
  if (wild) {
    jokers = cardMap.get('J') ?? 0;
    cardMap.delete('J');
  }

  const counts = Array.from(cardMap.values());

  let priority = 0;

  // 5 of a kind
  if (jokers >= 5 || counts.find(count => count >= 5 - jokers)) return priority;
  priority++;

  // 4 of a kind
  if (counts.find(count => count >= 4 - jokers)) return priority;
  priority++;

  // full house
  if (jokers === 0) {
    if (counts.find(count => count === 3) &&
        counts.find(count => count === 2)) {
      return priority;
    }
  } else if (jokers === 1) {
    if (counts.filter(count => count === 2).length === 2) {
      return priority;
    }
  }
  priority++;

  // 3 of a kind
  if (counts.find(count => count >= 3 - jokers)) return priority;
  priority++;

  // 2 pair
  if (counts.filter(count => count === 2).length === 2) return priority;
  priority++;

  // 1 pair
  if (counts.find(count => count >= 2 - jokers)) return priority;
  priority++;

  // high card
  return priority;
}

function parseInput(): Hand[] {
  return readFile().map(line => {
    const [hand, bid] = line.split(' ');
    return {cards: hand.split(''), bid: Number(bid)};
  });
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));