async function readInputTo2DArray() {
  const string = await Deno.readTextFile("input.txt");
  const array = string
    .split("\n")
    .map((line) => {
      return line.split("");
    });
  return array;
}

function wordSearchCount(wordSearch, word) {
  let count = 0;
  const directions = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];

  for (let y = 0; y < wordSearch.length; y++) {
    for (let x = 0; x < wordSearch[y].length; x++) {
      // foreach letter in the array
      // check if it matches the first letter in the word
      if (wordSearch[y][x] != word.charAt(0)) {
        continue;
      }
      // if so search all directions for additional matches
      count += directions.reduce((acc, direction) => {
        const match = recursivelyMatch(
          wordSearch,
          x,
          y,
          direction,
          word.slice(1),
        );
        return acc + match.matches;
      }, 0);
    }
  }

  return count;
}

function recursivelyMatch(
  wordSearch,
  x,
  y,
  relativeDirection,
  word,
  aLocation,
) {
  if (word == "") {
    // if we run out of letters then the word is matched
    return { matches: 1, aLocation };
  }

  x += relativeDirection[0];
  y += relativeDirection[1];

  if (
    y < 0 ||
    y >= wordSearch.length ||
    x < 0 ||
    x >= wordSearch[y].length
  ) {
    // check out of bounds
    return { matches: 0 };
  }

  if (word.charAt(0) != wordSearch[y][x]) {
    return { matches: 0 };
  }

  if (word.charAt(0) == "A") {
    aLocation = [x, y];
  }

  return recursivelyMatch(
    wordSearch,
    x,
    y,
    relativeDirection,
    word.slice(1),
    aLocation,
  );
}

function xMasCount(wordSearch, word) {
  const aLocations = [];
  const directions = [
    [1, 1],
    [-1, 1],
    [-1, -1],
    [1, -1],
  ];

  for (let y = 0; y < wordSearch.length; y++) {
    for (let x = 0; x < wordSearch[y].length; x++) {
      // foreach letter in the array
      // check if it matches the first letter in the word
      if (wordSearch[y][x] != word.charAt(0)) {
        continue;
      }
      // if so search all directions for additional matches
      aLocations.push(...directions.reduce((acc, direction) => {
        const match = recursivelyMatch(
          wordSearch,
          x,
          y,
          direction,
          word.slice(1),
        );
        if (match.matches) {
          return [...acc, match.aLocation];
        }
        return acc;
      }, []));
    }
  }

  // count matches that share an 'A'
  const aLocationCounts = {};
  for (const location of aLocations) {
    const key = `${location[0]},${location[1]}`;
    aLocationCounts[key] = aLocationCounts[key] ? aLocationCounts[key] + 1 : 1;
  }

  const sharedALocations = Object.keys(aLocationCounts).filter((key) => {
    return aLocationCounts[key] > 1;
  });

  return sharedALocations.length;
}

if (import.meta.main) {
  const wordSearch = await readInputTo2DArray();
  console.log(wordSearchCount(wordSearch, "XMAS"));
  console.log(xMasCount(wordSearch, "MAS"));
}
