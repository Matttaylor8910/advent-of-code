import {readFile} from '../../common/file';

function traverseManifold(manifold: string[]):
    {splitCount: number, timelines: number} {
  const streams = new Map<number, number>();
  let splitCount = 0;

  for (const row of manifold) {
    for (let col = 0; col < row.length; col++) {
      const char = row[col];

      // start of a stream
      if (char === 'S') {
        streams.set(col, 1);
      }

      // a stream split
      if (char === '^') {
        const existing = streams.get(col);
        if (existing) {
          // add to the split count
          splitCount++;

          // reset this column's split count to 0
          streams.set(col, 0);

          // add the stream to the left and right
          const left = streams.get(col - 1) || 0;
          streams.set(col - 1, left + existing);
          const right = streams.get(col + 1) || 0;
          streams.set(col + 1, right + existing);
        }
      }
    }
  }

  // sum the remaining streams to get the total timelines
  const timelines = Array.from(streams.values()).reduce((a, b) => a + b, 0);

  return {splitCount, timelines};
}

const {splitCount, timelines} = traverseManifold(readFile());
console.log(splitCount);
console.log(timelines);