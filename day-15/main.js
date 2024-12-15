if (import.meta.main) {
  const inputString = await Deno.readTextFile("input.txt");
  const [mapString, movesString] = inputString.trim().split("\n\n");
  const map = mapString.trim().split("\n").map((line) => line.split(""));
  const moves = movesString.trim().split("\n").join("").split("");

  console.log(sumGPSCoordinates(structuredClone(map), moves));
  console.log(sumDoubleWidthGPSCoordinates(structuredClone(map), moves));
}

function sumGPSCoordinates(map, moves) {
  const finalMap = getFinalMap(map, moves);
  const boxGPSCoordinates = getBoxGPSCoordinates(finalMap);
  return boxGPSCoordinates.reduce((acc, coord) => acc + coord);
}

function getFinalMap(map, moves) {
  const moveMap = {
    "^": { x: 0, y: -1 },
    ">": { x: 1, y: 0 },
    "v": { x: 0, y: 1 },
    "<": { x: -1, y: 0 },
  };

  let robot = getRobotPosition(map);

  for (const move of moves) {
    const direction = moveMap[move];
    if (canPush(robot, direction, map)) {
      push(robot, direction, map);
      robot = { x: robot.x + direction.x, y: robot.y + direction.y };
    }
  }

  return map;
}
function push(coord, direction, map) {
  const tile = map[coord.y + direction.y][coord.x + direction.x];
  const nextCoord = { x: coord.x + direction.x, y: coord.y + direction.y };

  // move the next one(s) out the way
  // horizontal
  if (direction.y == 0) {
    switch (tile) {
      case "O":
      case "[":
      case "]":
        push(nextCoord, direction, map);
    }
  }

  // vertical
  if (direction.y != 0) {
    switch (tile) {
      case "O":
        push(nextCoord, direction, map);
        break;
      case "[":
        push(nextCoord, direction, map);
        push({ x: nextCoord.x + 1, y: nextCoord.y }, direction, map);
        break;
      case "]":
        push({ x: nextCoord.x - 1, y: nextCoord.y }, direction, map);
        push(nextCoord, direction, map);
    }
  }

  // move the current tile
  map[coord.y + direction.y][coord.x + direction.x] = map[coord.y][coord.x];
  map[coord.y][coord.x] = ".";
}

function canPush(coord, direction, map) {
  const tile = map[coord.y + direction.y][coord.x + direction.x];
  switch (tile) {
    // wall, can't push
    case "#":
      return false;
    // empty, can push
    case ".":
      return true;
    // box, check deeper
    case "O":
    case "[":
    case "]":
      if (
        direction.y != 0 &&
        tile != "O"
      ) {
        break;
      }
      return canPush(
        { x: coord.x + direction.x, y: coord.y + direction.y },
        direction,
        map,
      );
  }

  if (direction.y != 0) {
    switch (tile) {
      case "[":
        return canPush(
          { x: coord.x + direction.x, y: coord.y + direction.y },
          direction,
          map,
        ) &&
          canPush(
            { x: coord.x + direction.x + 1, y: coord.y + direction.y },
            direction,
            map,
          );
      case "]":
        return canPush(
          { x: coord.x + direction.x - 1, y: coord.y + direction.y },
          direction,
          map,
        ) &&
          canPush(
            { x: coord.x + direction.x, y: coord.y + direction.y },
            direction,
            map,
          );
    }
  }
}

function getRobotPosition(map) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "@") {
        return { x, y };
      }
    }
  }
}

function getBoxGPSCoordinates(map) {
  const boxGPSCoordinates = [];

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (
        map[y][x] === "O" ||
        map[y][x] === "["
      ) {
        boxGPSCoordinates.push(y * 100 + x);
      }
    }
  }

  return boxGPSCoordinates;
}

function sumDoubleWidthGPSCoordinates(map, moves) {
  const fatMap = fattenMap(map);
  const finalMap = getFinalMap(fatMap, moves);
  const boxGPSCoordinates = getBoxGPSCoordinates(finalMap);
  return boxGPSCoordinates.reduce((acc, coord) => acc + coord);
}

function fattenMap(map) {
  const tileMap = {
    "#": ["#", "#"],
    "O": ["[", "]"],
    ".": [".", "."],
    "@": ["@", "."],
  };

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x] = tileMap[map[y][x]];
    }
  }

  return map.map((row) => row.flat());
}
