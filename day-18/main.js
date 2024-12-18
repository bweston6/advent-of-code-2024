import { BinaryHeap } from "jsr:@std/data-structures";

const width = 71;
const height = 71;
let bytes = 1024;

function printMemory(memory) {
  console.log(memory.map((row) => row.join("")).join("\n"));
}

function fallingBytes(positions) {
  const memory = Array(height).fill(null).map(() => Array(width).fill("."));

  for (let i = 0; i < bytes; i++) {
    const position = positions[i];
    memory[position.y][position.x] = "#";
  }

  return memory;
}

function shortestPath(memory) {
  const start = [0, 0];
  const end = [memory[memory.length - 1].length - 1, memory.length - 1];

  const visited = {};
  const pqueue = new BinaryHeap((a, b) => a[0] - b[0]);
  let fewestSteps = Infinity;

  pqueue.push([0, ...start, [start]]);
  while (pqueue.length > 0) {
    const [steps, x, y] = pqueue.pop();

    if (steps >= fewestSteps) {
      break;
    }

    if (
      `${x},${y}` in visited &&
      visited[`${x},${y}`] <= steps
    ) {
      continue;
    }

    visited[`${x},${y}`] = steps;

    if (x == end[0] && y == end[1]) {
      fewestSteps = steps;
    }

    for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      if (
        x + dx >= 0 &&
        y + dy >= 0 &&
        x + dx < width &&
        y + dy < height &&
        memory[y + dy][x + dx] !== "#"
      ) {
        pqueue.push([
          steps + 1,
          x + dx,
          y + dy,
        ]);
      }
    }
  }
  return fewestSteps;
}

const inputString = await Deno.readTextFile("input.txt");
const positions = inputString
  .trim()
  .split("\n")
  .map((line) => structuredClone(line.match(/(?<x>\d+),(?<y>\d+)/).groups))
  .map((position) => {
    return { x: Number(position.x), y: Number(position.y) };
  });

// part 1
const memory = fallingBytes(positions);
let steps = shortestPath(memory);
console.log(steps);

// part 2
do {
  bytes++;
  const memory = fallingBytes(positions);
  steps = shortestPath(memory);
} while (steps != Infinity);

const position = positions[bytes - 1];
console.log(`${position.x},${position.y}`);
