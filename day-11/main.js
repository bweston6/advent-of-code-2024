async function readInputToString() {
  const string = await Deno.readTextFile("input.txt");
  return string;
}


function countStones(stones, blinks) {
  const cache = new Map();

  function count(stone, blinks) {
    const cacheKey = `${stone}:${blinks}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    if (blinks === 0) {
      return 1;
    }

    if (stone === 0) {
      const result = count(1, blinks - 1);
      cache.set(cacheKey, result);
      return result;
    }

    const stoneString = stone.toString();
    if (stoneString.length % 2 === 0) {
      const middle = stoneString.length / 2;
      const result =
        count(Number(stoneString.slice(0, middle)), blinks - 1) +
        count(Number(stoneString.slice(middle)), blinks - 1);
      cache.set(cacheKey, result);
      return result;
    }

    const result = count(stone * 2024, blinks - 1);
    cache.set(cacheKey, result);
    return result;
  }

  return stones.reduce((acc, stone) => acc + count(stone, blinks), 0);
}

if (import.meta.main) {
  const stoneString = await readInputToString();
  const stones = stoneString.trim().split(" ").map(Number);
  console.log(countStones(stones, 25));
  console.log(countStones(stones, 75));
}
