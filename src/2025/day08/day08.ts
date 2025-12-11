import {readFile} from '../../common/file';

interface JunctionBox {
  id: string;
  x: number;
  y: number;
  z: number;
}

interface Circuit {
  id: string;
  junctionBoxIds: Set<string>;
}

/**
 * Combines the junction boxes into circuits
 */
function combineJunctionBoxes(
    junctionBoxes: JunctionBox[],
    minConnections = Number.MAX_SAFE_INTEGER): number {
  // build up some helpful maps
  const junctionBoxMap = new Map<string, Circuit>();
  const circuitMap = new Map<string, Circuit>();
  const distanceMap = buildDistanceMap(junctionBoxes);

  // sort the distances between connections
  const sortedConnections =
      Array.from(distanceMap.entries()).sort((a, b) => a[1] - b[1]);

  // based on the number of connections we need to make, keep merging circuits
  // till we reach this number
  let processedConnections = 0;
  while (processedConnections < minConnections) {
    processedConnections++;

    // find two closest boxes
    const [closestConnection, _] = sortedConnections.shift()!;
    const [box1Id, box2Id] = closestConnection.split('_');

    // get the junctionBoxes of the circuits each is a part of
    const circuit1 =
        junctionBoxMap.get(box1Id) || newCircuit(new Set<string>([box1Id]));
    const circuit2 =
        junctionBoxMap.get(box2Id) || newCircuit(new Set<string>([box2Id]));
    circuitMap.set(circuit1.id, circuit1);
    circuitMap.set(circuit2.id, circuit2);

    // short circuit if the boxes are already in the same circuit
    if (circuit1.id === circuit2.id) continue;

    // merge the circuits into one circuit that has all of the junctionBoxes of
    // both (including these two new boxes) and update the junctionBoxMap to
    // reflect a pointer for each box
    const circuit = mergeCircuits(circuit1, circuit2, junctionBoxMap);
    circuitMap.set(circuit.id, circuit);
    circuitMap.delete(circuit1.id);
    circuitMap.delete(circuit2.id);

    // if all boxes are connected, short circuit and return the product of the X
    // coordinates of the last two juctions boxes that form a complete circuit
    if (circuit.junctionBoxIds.size === junctionBoxes.length) {
      const [x1] = box1Id.split(',').map(Number);
      const [x2] = box2Id.split(',').map(Number);
      return x1 * x2;
    }
  }

  // return the product of the sizes of the three largest circuits
  return Array.from(circuitMap.values())
      .sort((a, b) => b.junctionBoxIds.size - a.junctionBoxIds.size)
      .slice(0, 3)
      .reduce((product, circuit) => product * circuit.junctionBoxIds.size, 1);
}

/**
 * Builds a map of the distance between each pair of junction boxes
 */
function buildDistanceMap(junctionBoxes: JunctionBox[]): Map<string, number> {
  const distanceMap = new Map<string, number>();
  for (let i = 0; i < junctionBoxes.length; i++) {
    const junctionBox = junctionBoxes[i];
    for (let j = i + 1; j < junctionBoxes.length; j++) {
      const otherBox = junctionBoxes[j];

      if (i === j) continue;

      distanceMap.set(
          `${junctionBox.id}_${otherBox.id}`,
          calculateEuclideanDistance(junctionBox, otherBox),
      );
    }
  }
  return distanceMap;
}

/**
 * Calculates the Euclidean distance between two junction boxes
 */
function calculateEuclideanDistance(a: JunctionBox, b: JunctionBox): number {
  return Math.sqrt(
      Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
}

/**
 * Merges two circuits into one
 */
function mergeCircuits(
    circuit1: Circuit,
    circuit2: Circuit,
    junctionBoxMap: Map<string, Circuit>,
    ): Circuit {
  const mergedIds = [
    ...Array.from(circuit1.junctionBoxIds),
    ...Array.from(circuit2.junctionBoxIds)
  ];
  const merged = newCircuit(new Set<string>(mergedIds));
  for (const junctionBoxId of mergedIds) {
    junctionBoxMap.set(junctionBoxId, merged);
  }
  return merged;
}

/**
 * Creates a new circuit with the provided junction boxes
 */
function newCircuit(junctionBoxes: Set<string>): Circuit {
  return {
    id: Math.random().toString(36).substring(2, 15),
    junctionBoxIds: junctionBoxes
  };
}

/**
 * Part 1 needs the product of the length of the top 3 circuits after 1000 joins
 */
function partOne(junctionBoxes: JunctionBox[]): number {
  return combineJunctionBoxes(junctionBoxes, 1000);
}

/**
 * Part 2 wants all boxes connected, and the function returns the product of the
 * X coordinates of the junction boxes from the last connection that makes it so
 * that all of the junction boxes create a complete circuit
 */
function partTwo(junctionBoxes: JunctionBox[]): number {
  return combineJunctionBoxes(junctionBoxes);
}

/**
 * Parse the x,y,z coordiantes into junction boxes with ids
 */
function parseInput(): JunctionBox[] {
  const lines = readFile();
  const junctionBoxes = lines.map(line => {
    const [x, y, z] = line.split(',').map(Number);
    return {id: line, x, y, z};
  });
  return junctionBoxes;
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));