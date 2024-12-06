async function readInputToString() {
  const string = await Deno.readTextFile("input.txt");
  return string
}

function getGuardPosition(map) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] == "^") {
        return [y, x];
      }
    }
  }
}

const directions = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
]

function countGuardSteps(map) {
  let direction = 0;
  let guardPosition = getGuardPosition(map);
  let nextGuardPosition = guardPosition.map((coord, index) => directions[direction][index] + coord);
  let steps = [guardPosition];

  while (
    nextGuardPosition[0] >= 0 &&
    nextGuardPosition[0] < map.length &&
    nextGuardPosition[1] >= 0 &&
    nextGuardPosition[1] < map[nextGuardPosition[0]].length
  ) {
    switch (map[nextGuardPosition[0]][nextGuardPosition[1]]) {
      case '.':
      case '^':
        // continue in same direction
        guardPosition = nextGuardPosition;
        steps.push(guardPosition)
        break;
      case '#':
        // turn right and try again
        direction = (direction + 1) % directions.length
        break;
    }
    nextGuardPosition = guardPosition.map((coord, index) => directions[direction][index] + coord);
  }


  return [...new Set(steps.map((step) => `${step[0]},${step[1]}`))].length;
}

function countObstructionCycles(map) {
  let cyclesCounter = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (
        map[y][x] === '^' ||
        map[y][x] === '#'
      ) {
        continue
      }
      let workingMap = structuredClone(map)
      workingMap[y][x] = 'O'

      let direction = 0;
      let guardPosition = getGuardPosition(workingMap);
      let nextGuardPosition = guardPosition.map((coord, index) => directions[direction][index] + coord);
      let steps = [guardPosition];
      let stepCount = 0;

      while (
        nextGuardPosition[0] >= 0 &&
        nextGuardPosition[0] < workingMap.length &&
        nextGuardPosition[1] >= 0 &&
        nextGuardPosition[1] < workingMap[nextGuardPosition[0]].length
      ) {
        // very naive cycle detector
        stepCount++;
        if (stepCount > 1000000) {
          cyclesCounter++;
          console.log(plotMap(workingMap,[]))
          console.log('\n')
          break;
        }

        switch (workingMap[nextGuardPosition[0]][nextGuardPosition[1]]) {
          case '.':
          case '^':
            // continue in same direction
            guardPosition = nextGuardPosition;
            steps.push(guardPosition)
            break;
          case '#':
          case 'O':
            // turn right and try again
            direction = (direction + 1) % directions.length
            break;
        }
        nextGuardPosition = guardPosition.map((coord, index) => directions[direction][index] + coord);
      }

    }
  }
  return cyclesCounter;
}

function plotMap(map, points) {
  map = structuredClone(map)
  for (let point of points) {
    map[point[0]][point[1]] = 'X';
  }
  return map.map((row) => row.join('')).join('\n');
}

if (import.meta.main) {
  const mapString = await readInputToString();
  const map = mapString.trim().split('\n').map((row) => row.split(''))
  console.log(countGuardSteps(map))
  console.log(countObstructionCycles(map))
}
