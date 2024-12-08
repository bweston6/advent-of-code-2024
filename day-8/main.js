async function readInputToString() {
  const string = await Deno.readTextFile("input.txt");
  return string;
}

function plotMap(map, points) {
  map = structuredClone(map);
  for (const point of points) {
    map[point[1]][point[0]] = "#";
  }
  return map.map((row) => row.join("")).join("\n");
}

function getAntennas(map) {
  // get antennas
  const antennas = {};
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].match(/[\w\d]/i)) {
        antennas[map[y][x]] = antennas[map[y][x]]
          ? [...antennas[map[y][x]], [x, y]]
          : [[x, y]];
      }
    }
  }
  return antennas;
}

function countAntinodes(map) {
  const antennas = getAntennas(map);

  // for each antenna locate antinode aginst all others in the same frequency
  const antinodes = [];
  for (const frequency in antennas) {
    for (const antenna1 of antennas[frequency]) {
      for (const antenna2 of antennas[frequency]) {
        if (antenna1 == antenna2) {
          continue;
        }
        const deltaX = antenna2[0] - antenna1[0];
        const deltaY = antenna2[1] - antenna1[1];
        const theta = Math.atan2(deltaY, deltaX);
        const distance = Math.sqrt(deltaY ** 2 + deltaX ** 2);
        const antinode = [
          Math.round(distance * 2 * Math.cos(theta) + antenna1[0]),
          Math.round(distance * 2 * Math.sin(theta) + antenna1[1]),
        ];

        // don't add to the list if the node is oob
        if (
          antinode[1] < 0 ||
          antinode[1] >= map.length ||
          antinode[0] < 0 ||
          antinode[0] >= map[0].length
        ) {
          continue;
        }

        antinodes.push(antinode);
      }
    }
  }

  // return unique antinodes
  return new Set(
    antinodes.map((antinode) => `${antinode[0]},${antinode[1]}`),
  ).size;
}

function countHarmonicAntinodes(map) {
  const antennas = getAntennas(map);

  // for each antenna locate antinode aginst all others in the same frequency
  const antinodes = [];
  for (const frequency in antennas) {
    for (const antenna1 of antennas[frequency]) {
      for (const antenna2 of antennas[frequency]) {
        if (antenna1 == antenna2) {
          continue;
        }
        const deltaX = antenna2[0] - antenna1[0];
        const deltaY = antenna2[1] - antenna1[1];
        const theta = Math.atan2(deltaY, deltaX);

        // iterate over map for points that lie on the line between the two antennas
        for (let y = 0; y < map.length; y++) {
          const yDistance = (y - antenna1[1]) / Math.sin(theta);
          for (let x = 0; x < map[y].length; x++) {
            const xDistance = (x - antenna1[0]) / Math.cos(theta);
            const difference = xDistance - yDistance;

            // skip points that aren't on the line
            if (Math.abs(difference) >= 0.01) {
              continue;
            }
            antinodes.push([x, y]);
          }
        }
      }
    }
  }

  // return unique antinodes
  return new Set(
    antinodes.map((antinode) => `${antinode[0]},${antinode[1]}`),
  ).size;
}

if (import.meta.main) {
  const mapString = await readInputToString();
  const map = mapString
    .split("\n")
    .filter(
      (line) => line,
    )
    .map((line) => line.split(""));
  console.log(countAntinodes(map));
  console.log(countHarmonicAntinodes(map));
}
