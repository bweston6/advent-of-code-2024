import { BinaryHeap } from "jsr:@std/data-structures";

const lines = (await Deno.readTextFile("input.txt")).trim().split("\n");
const mapWidth = lines[0].length;
const map = lines.flatMap((line) => line.split(""));
const [start, end] = [map.indexOf("S"), map.indexOf("E")];
const directions = [-mapWidth, 1, mapWidth, -1];

const visited = {};
const pqueue = new BinaryHeap((a, b) => a[0] - b[0]);
let lowestScore = Infinity;
const paths = [];

pqueue.push([0, start, 1, ""]);
while (pqueue.length > 0) {
    const [score, position, direction, path] = pqueue.pop();

    if (score > lowestScore) {
        break;
    }

    if (
        `${position},${direction}` in visited &&
        visited[`${position},${direction}`] < score
    ) {
        continue;
    }

    visited[`${position},${direction}`] = score;

    if (position == end) {
        lowestScore = score;
        paths.push(path);
    }

    if (map[position + directions[direction]] !== "#") {
        // step forward
        pqueue.push([
            score + 1,
            position + directions[direction],
            direction,
            path + "F",
        ]);
    }
    // turn left
    pqueue.push([
        score + 1000,
        position,
        ((direction - 1) % 4 + 4) % 4,
        path + "L",
    ]);
    // turn right
    pqueue.push([
        score + 1000,
        position,
        (direction + 1) % 4,
        path + "R",
    ]);
}

// count unique tiles in optimal paths
const tiles = new Set();
tiles.add(start);
for (const path of paths) {
    let [tile, direction] = [start, 1];
    // follow path
    for (const char of path) {
        if (char === "L") {
            direction = ((direction - 1) % 4 + 4) % 4;
        } else if (char === "R") {
            direction = (direction + 1) % 4;
        } else if (char === "F") {
            tile += directions[direction];
            tiles.add(tile);
        }
    }
}

console.log(lowestScore)
console.log(tiles.size)
