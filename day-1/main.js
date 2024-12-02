export function add(a, b) {
  return a + b;
}

async function readInputToArray() {
  const text = await Deno.readTextFile("input.txt");
  const textArray = text.split("\n");
  return textArray;
}

function getDistance(leftList, rightList) {
  // sort and merge arrays
  leftList.sort();
  rightList.sort();

  const mergedList = leftList.map((item, index) => {
    return Math.abs(item - rightList[index]);
  });
  const sum = mergedList.reduce((acc, value) => {
    return acc + value;
  });

  return sum;
}

function getSimilarity(leftList, rightList) {
  let similarity = 0;

  leftList.forEach((leftValue) => {
    similarity +=
      rightList.filter((rightValue) => (rightValue === leftValue)).length * leftValue;
  });

  return similarity;
}

if (import.meta.main) {
  const inputArray = await readInputToArray();
  const leftList = [];
  const rightList = [];
  let left, right;

  // process input
  inputArray.forEach((line) => {
    if (line.trim() == "") {
      return;
    }
    [left, right] = line.split("   ");
    leftList.push(Number(left));
    rightList.push(Number(right));
  });

  console.log(getDistance(leftList, rightList));
  console.log(getSimilarity(leftList, rightList));
}
