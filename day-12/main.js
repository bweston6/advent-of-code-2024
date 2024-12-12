async function readInputToString() {
  const string = await Deno.readTextFile("input.txt");
  return string;
}

function getRegions(map) {
  const regions = [];
  const visited = new Set();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const frontier = [{ x, y }];
      const region = [];

      while (frontier.length !== 0) {
        const plant = frontier.shift();
        if (visited.has(`${plant.x},${plant.y}`)) continue;

        visited.add(`${plant.x},${plant.y}`);
        region.push(plant);

        for (const [x, y] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          if (
            plant.y + y < 0 ||
            plant.y + y >= map.length ||
            plant.x + x < 0 ||
            plant.x + x >= map[plant.y + y].length ||
            visited.has(`${plant.x + x},${plant.y + y}`)
          ) {
            continue;
          }
          if (map[plant.y + y][plant.x + x] === map[plant.y][plant.x]) {
            frontier.push({ x: plant.x + x, y: plant.y + y });
          }
        }
      }

      if (region.length > 0) {
        regions.push(region);
      }
    }
  }
  return regions;
}

function getFencePrice(region) {
  const regionStrings = region.map((region) => JSON.stringify(region));
  const area = region.length;
  const perimeter = region.reduce((acc, plant) => {
    let edges = 4;

    for (const [x, y] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (
        regionStrings.includes(
          JSON.stringify({ x: plant.x + x, y: plant.y + y }),
        )
      ) {
        edges--;
      }
    }

    return acc + edges;
  }, 0);

  return area * perimeter;
}

function getDiscountFencePrice(region) {
  const regionStrings = region.map((plant) => JSON.stringify(plant));
  const area = region.length;
  let sides = 0;

  /*
   * For each cardinal direction an edge can face
   *  For each square with an outward facing edge in that direction
   *    add one edge and
   *    remove all connected squares that face outward in this direction from further consideration
   */

  for (const [x, y] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const edgePlants = region.filter((plant) =>
      !regionStrings.includes(
        JSON.stringify({ x: plant.x + x, y: plant.y + y }),
      )
    );
    const edgePlantStrings = edgePlants.map((plant) => JSON.stringify(plant));
    const existingSides = new Set();

    for (let i = 0; i < edgePlants.length; i++) {
      const plant = edgePlants[i];

      if (existingSides.has(`${plant.x},${plant.y}`)) {
        continue;
      }

      sides++;

      const frontier = [plant];

      while (frontier.length != 0) {
        const plant = frontier.shift();
        existingSides.add(`${plant.x},${plant.y}`);

        for (const [x, y] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          if (
            edgePlantStrings.includes(
              JSON.stringify({ x: plant.x + x, y: plant.y + y }),
            ) &&
            !existingSides.has(`${plant.x + x},${plant.y + y}`)
          ) {
            frontier.push({ x: plant.x + x, y: plant.y + y });
          }
        }
      }
    }
  }

  return area * sides;
}

function calculateFenceCost(map) {
  const regions = getRegions(map);
  return regions.reduce((acc, region) => acc + getFencePrice(region), 0);
}

function calculateDiscountFenceCost(map) {
  const regions = getRegions(map);
  return regions.reduce(
    (acc, region) => acc + getDiscountFencePrice(region),
    0,
  );
}

if (import.meta.main) {
  const mapString = await readInputToString();
  const map = mapString.trim().split("\n").map((lines) => lines.split(""));
  console.log(calculateFenceCost(map));
  console.log(calculateDiscountFenceCost(map));
}
