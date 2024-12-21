const MAX_CHEAT_LENGTH = 4;

const inputString = await Deno.readTextFile("input.txt");
const mapString = inputString.trim().split("\n");
const width = mapString[0].length;
const map = mapString.join("").split("");

const path = getPath(map);
const cheats = countCheats(map, path);
console.log(cheats.filter((cheat) => cheat.timeSaved >= 100).length);

function getPath(map) {
  let position = map.join("").indexOf("S");
  const path = [position];

  while (map[position] !== "E") {
    for (
      position of [
        position - 1,
        position + 1,
        position - width,
        position + width,
      ]
    ) {
      if (path.includes(position)) continue;
      if (map[position] !== "." && map[position] !== "E") continue;
      if (position < 0) continue;
      if (position >= map.length) continue;

      path.push(position);
      break;
    }
  }

  return path;
}

function countCheats(map, path) {
  const cheats = [];
  const regex = new RegExp("^(?:S|\\.)#+(?:E|\\.)", "d");
  for (const position of path) {
    for (
      const direction of [
        "L",
        "R",
        "U",
        "D",
      ]
    ) {
      const cheatString = getDirection(direction, map, position);
      const match = regex.exec(cheatString);

      if (match === null) continue;

      const start = getPosition(position, 0, direction);
      const end = getPosition(
        position,
        (match.indices[0][1] - 1) - match.indices[0][0],
        direction,
      );

      const startIndex = path.indexOf(start) + 1;
      const endIndex = path.indexOf(end);
      const cheatLength = match[0].split("#").length - 1;
      const timeSaved = endIndex - startIndex - cheatLength;
      if (timeSaved <= 0) continue;

      cheats.push({ start, end, timeSaved });
    }
  }

  return cheats;
}

function getPosition(position, indices, direction) {
  switch (direction) {
    case "L":
      return position - indices;
    case "R":
      return position + indices;
    case "U":
      return position - width * indices;
    case "D":
      return position + width * indices;
  }
}

function getDirection(direction, map, position) {
  let string = "";
  switch (direction) {
    case "L":
      return map
        .slice(
          Math.max(
            position - MAX_CHEAT_LENGTH + 1,
            Math.floor((position + 1) / width) * width,
          ),
          position + 1,
        )
        .reverse()
        .join("");
    case "R":
      return map
        .slice(
          position,
          Math.min(
            position + MAX_CHEAT_LENGTH,
            Math.ceil(position / width) * width,
          ),
        )
        .join("");
    case "U":
      for (let i = 0; i < MAX_CHEAT_LENGTH; i++) {
        string += map[position - width * i] ?? "";
      }
      return string;
    case "D":
      for (let i = 0; i < MAX_CHEAT_LENGTH; i++) {
        string += map[position + width * i] ?? "";
      }
      return string;
  }
}

function printPath(originalMap, path) {
  let map = structuredClone(originalMap);
  path.forEach((position) => map[position] = "o");
  while (map.length != 0) {
    console.log(map.slice(0, width).join(""));
    map = map.slice(width);
  }
}
