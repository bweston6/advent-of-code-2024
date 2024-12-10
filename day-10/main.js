async function readInputToString() {
  const string = await Deno.readTextFile("input.txt");
  return string;
}

function findTrailheads(map) {
  const trailHeads = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 0) {
        trailHeads.push({ x, y });
      }
    }
  }
  return trailHeads;
}

function sumTrailheadScores(map) {
  const trailHeads = findTrailheads(map);
  return trailHeads.reduce((acc, trailHead) => {
    const endPositions = new Set();
    const frontier = [trailHead];

    while (frontier.length > 0) {
      const point = frontier.pop();
      const value = map[point.y][point.x];

      if (value === 9) {
        endPositions.add(`${point.x},${point.y}`);
        continue;
      }

      for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
          if (
            (x != 0 && y != 0) ||
            point.y + y < 0 ||
            point.y + y >= map.length ||
            point.x + x < 0 ||
            point.x + x >= map[point.y + y].length
          ) {
            continue;
          }

          if (map[point.y + y][point.x + x] - value === 1) {
            frontier.push({ x: point.x + x, y: point.y + y });
          }
        }
      }
    }

    return acc + endPositions.size;
  }, 0);
}

function sumTrailheadRatings(map) {
  const trailHeads = findTrailheads(map);
  return trailHeads.reduce((acc, trailHead) => {
    const frontier = [trailHead];
    let pathCount = 0;

    while (frontier.length > 0) {
      const point = frontier.pop();
      const value = map[point.y][point.x];

      if (value === 9) {
        pathCount++;
        continue;
      }

      for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
          if (
            (x != 0 && y != 0) ||
            point.y + y < 0 ||
            point.y + y >= map.length ||
            point.x + x < 0 ||
            point.x + x >= map[point.y + y].length
          ) {
            continue;
          }

          if (map[point.y + y][point.x + x] - value === 1) {
            frontier.push({ x: point.x + x, y: point.y + y });
          }
        }
      }
    }

    return acc + pathCount;
  }, 0);
}

if (import.meta.main) {
  const mapString = await readInputToString();
  const map = mapString.trim().split("\n").map((line) =>
    line.split("").map(Number)
  );
  console.log(sumTrailheadScores(map));
  console.log(sumTrailheadRatings(map));
}
