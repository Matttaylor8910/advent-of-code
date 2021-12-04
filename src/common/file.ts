import * as fs from 'fs';

/**
 * Assuming the second argument when calling this from the commandline is the
 * filename like: /path/dayXX.js, return the lines of the file as a string[]
 *
 * @param filename an optional filename to load from this path instead
 */
export function readFile(filename?: string): string[] {
  if (filename) {
    const split = process.argv[1].split('/');
    split.pop();  // remove the filename
    const extension = filename.split('.')[1] || 'txt';
    filename = `${split.join('/')}/${filename}.${extension}`;
  } else {
    filename = process.argv[1].replace('.js', '.txt');
  }
  const lines = fs.readFileSync(filename, 'utf8').split('\n');

  // remove the final newline
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines;
}