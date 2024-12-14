if (import.meta.main) {
  const robotStrings = await Deno.readTextFile("input.txt");
  const robots = robotStrings
    .trim()
    .split("\n")
    .map((robotString) => {
      const regex = /p=(?<x>-?\d+),(?<y>-?\d+) v=(?<vx>-?\d+),(?<vy>-?\d+)/;
      const robot = structuredClone(robotString.match(regex).groups);
      for (const key in robot) {
        robot[key] = Number(robot[key]);
      }
      return robot;
    });

  console.log(calculateSafetyFactor(robots, 101, 103, 100, true));

  // use lowest safety factor as a heuristic to find the easter egg
  const secondsBeforeLoop = 10403;
  const safetyFactors = {};

  for (let seconds = 0; seconds < secondsBeforeLoop; seconds++) {
    const safetyFactor = calculateSafetyFactor(robots, 101, 103, seconds);
    if (safetyFactors[safetyFactor]) {
      safetyFactors[safetyFactor].push(seconds);
      continue;
    }
    safetyFactors[safetyFactor] = [seconds];
  }

  console.log(
    calculateSafetyFactor(
      robots,
      101,
      103,
      safetyFactors[Object.keys(safetyFactors)[0]],
      true,
    ),
  );
}

function calculateSafetyFactor(robots, width, height, seconds, show = false) {
  const robotPositions = robots.map((robot) => {
    // funky modding is so that negative numbers are wrapped positive
    const x = ((robot.x + robot.vx * seconds) % width + width) % width;
    const y = ((robot.y + robot.vy * seconds) % height + height) % height;
    return { x, y };
  });

  if (show) {
    showRobots(robotPositions, width, height);
  }

  const quadrants = countQuadrants(robotPositions, width, height);
  return quadrants.reduce((acc, q) => acc * q);
}

function countQuadrants(robotPositions, width, height) {
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  const quads = new Array(4).fill(0);
  robotPositions.forEach((position) => {
    if (position.x < cx && position.y < cy) quads[0]++;
    if (position.x > cx && position.y < cy) quads[1]++;
    if (position.x < cx && position.y > cy) quads[2]++;
    if (position.x > cx && position.y > cy) quads[3]++;
  });
  return quads;
}

function showRobots(robotPositions, width, height) {
  const map = [...Array(height)].map((e) => Array(width).fill("."));
  robotPositions.forEach((position) => map[position.y][position.x] = "x");
  console.log(map.map((line) => line.join("")).join("\n"));
}
