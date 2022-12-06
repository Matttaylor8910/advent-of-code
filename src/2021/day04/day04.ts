import {cloneDeep} from 'lodash';

import {readFile} from '../../common/file';

interface Tile {
  number: number;
  marked: boolean;
}

function winningBoard(boards: Tile[][]): Tile[]|null {
  return boards.find(boardHasWon) || null;
}

function boardHasWon(board: Tile[]): boolean {
  // winning cases
  // rows
  if (areMarked(board, 0, 1, 2, 3, 4)) return true;
  if (areMarked(board, 5, 6, 7, 8, 9)) return true;
  if (areMarked(board, 10, 11, 12, 13, 14)) return true;
  if (areMarked(board, 15, 16, 17, 18, 19)) return true;
  if (areMarked(board, 20, 21, 22, 23, 24)) return true;
  // cols
  if (areMarked(board, 0, 5, 10, 15, 20)) return true;
  if (areMarked(board, 1, 6, 11, 16, 21)) return true;
  if (areMarked(board, 2, 7, 12, 17, 22)) return true;
  if (areMarked(board, 3, 8, 13, 18, 23)) return true;
  if (areMarked(board, 4, 9, 14, 19, 24)) return true;
  // diagonals FFS this should have been bolded: (Diagonals don't count.)
  // if (areMarked(board, 0, 6, 12, 18, 24)) return true;
  // if (areMarked(board, 20, 16, 12, 8, 4)) return true;

  // default to false
  return false;
}

function areMarked(
    board: Tile[],
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    ): boolean {
  return board[a].marked && board[b].marked && board[c].marked &&
      board[d].marked && board[e].marked;
}

function markEveryBoard(boards: Tile[][], number: number) {
  boards.forEach(board => {
    board.forEach(tile => {
      if (tile.number === number) {
        tile.marked = true;
      }
    });
  });
}

const lines = readFile();
const order = lines.shift()!.split(',').map(Number);

const boards: Tile[][] = [];
let currentBoard: Tile[] = [];
for (const line of lines) {
  if (line.length === 0) {
    // space between boards, init a new empty board
    if (currentBoard.length) {
      boards.push(currentBoard);
    }
    currentBoard = [];
  } else {
    // save the items on each board
    currentBoard.push(...line.split(' ').filter(n => !!n).map(n => {
      return {number: Number(n), marked: false};
    }));
  }
}
if (currentBoard.length) {
  boards.push(currentBoard);
}

// part 1
const part1Boards = cloneDeep(boards);
let i = 0;
let winner: Tile[]|null = null;
while (i < order.length) {
  markEveryBoard(part1Boards, order[i]);

  winner = winningBoard(part1Boards);
  if (winner !== null) {
    break;
  }

  i++;
}
let unmarkedSum = winner!.reduce((a, b) => a + (b.marked ? 0 : b.number), 0);
console.log(unmarkedSum * order[i]);

// part 2
let part2Boards: Tile[][] = cloneDeep(boards);
let last: Tile[][] = [];
let j = 0;
while (j < order.length) {
  markEveryBoard(part2Boards, order[j]);
  last = part2Boards;
  part2Boards = part2Boards.filter(board => !boardHasWon(board));

  // all have finally won
  if (part2Boards.length === 0) {
    break;
  } else {
    j++;
  }
}
const [lastToWin] = last;
unmarkedSum = lastToWin!.reduce((a, b) => a + (b.marked ? 0 : b.number), 0);
console.log(unmarkedSum * order[j]);