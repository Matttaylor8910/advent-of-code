import {readFile} from '../../common/file';

const alpha = Array.from(Array(26)).map((_e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));
alphabet.unshift(...alphabet.map(l => l.toLowerCase()));

const lines = readFile();

let part1 = 0;
for (const line of lines) {
  const set = new Set<string>();
  const half = line.length / 2;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (i < half) {
      set.add(char);
    } else {
      if (set.has(char)) {
        part1 += alphabet.indexOf(char) + 1;
        break;
      }
    }
  }
}

console.log(part1);

let part2 = 0;
for (let i = 0; i < lines.length; i += 3) {
  part2 += alphabet.findIndex(letter => {
    return lines[i].includes(letter) && lines[i + 1].includes(letter) &&
        lines[i + 2].includes(letter);
  }) + 1;
}

console.log(part2);