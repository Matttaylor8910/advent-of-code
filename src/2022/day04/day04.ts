import {readFile} from '../../common/file';
import {hasOverlap} from '../../common/math';

const lines = readFile();
let part1 = 0;
let part2 = 0;

for (const line of lines) {
  const [elf1, elf2] = line.split(',');
  const [elf1Start, elf1End] = elf1.split('-').map(Number);
  const [elf2Start, elf2End] = elf2.split('-').map(Number);

  if ((elf1Start >= elf2Start && elf1End <= elf2End) ||
      (elf2Start >= elf1Start && elf2End <= elf1End)) {
    part1++;
  }

  if (hasOverlap(elf1Start, elf1End, elf2Start, elf2End)) {
    part2++;
  }
}

console.log(part1);
console.log(part2);