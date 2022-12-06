import {readFile} from '../../common/file';
import {isAllUniqueChars} from '../../common/string';

const line = readFile()[0];

function determineFirstMarker(str: string, uniqueSequence: number): number {
  for (let i = 0; i < str.length; i++) {
    if (isAllUniqueChars(str.slice(i, i + uniqueSequence))) {
      return i + uniqueSequence;
    }
  }
  return -1;  // not found
}

console.log(determineFirstMarker(line, 4));
console.log(determineFirstMarker(line, 14));