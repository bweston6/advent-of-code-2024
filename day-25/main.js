const PIN_POSITIONS = 6;
const keysAndLocks = (await Deno.readTextFile("input.txt")).trim().split(
  "\n\n",
);
const { keys, locks } = keysAndLocks.reduce((acc, keyOrLock) => {
  if (keyOrLock.split("\n")[0] === "#####") {
    acc.keys.push(keyOrLock);
  } else {
    acc.locks.push(keyOrLock);
  }
  return acc;
}, { keys: [], locks: [] });
const keyShearLines = keys.map(getShearLines);
const lockShearLines = locks.map(getShearLines);
const nonOverlappingKeysAndLocks = lockShearLines.reduce(
  (acc, lockShearLine) => {
    let nonOverlappingKeys = 0;
    for (const keyShearLine of keyShearLines) {
      const shearLineSum = lockShearLine.map((lockPinLine, i) =>
        lockPinLine + keyShearLine[i]
      );
      if (Math.max(...shearLineSum) < PIN_POSITIONS) {
        nonOverlappingKeys++;
      }
    }
    return acc + nonOverlappingKeys;
  },
  0,
);
console.log(nonOverlappingKeysAndLocks);
function getShearLines(shearGraph) {
  const shearLines = [];
  shearGraph = shearGraph.split("\n");
  for (let i = 0; i < shearGraph[0].length; i++) {
    let shearLine = -1;
    for (let j = 0; j < shearGraph.length; j++) {
      if (shearGraph[j].charAt(i) === "#") {
        shearLine++;
      }
    }
    shearLines.push(shearLine);
  }
  return shearLines;
}
