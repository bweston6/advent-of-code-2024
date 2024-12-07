async function readInputToString() {
  const string = await Deno.readTextFile("input.txt");
  return string;
}

function sumPossibleResults(equations, operators) {
  return equations.reduce((acc, equation) => {
    // enumerate each permutation of ops with repetition
    for (let p = 0; p < operators.length ** (equation.params.length - 1); p++) {
      // get place values of p in base `operators.length`
      const opCodes = [];
      let permutation = p;
      while (permutation != 0) {
        opCodes.unshift(permutation % operators.length);
        permutation = Math.floor(permutation / operators.length);
      }
      // add leading zeros
      while (opCodes.length < equation.params.length - 1) {
        opCodes.unshift(0);
      }

      const result = equation.params.reduce((acc, param, i) => {
        return operators[opCodes[i - 1]](acc, param);
      });

      if (equation.result == result) {
        return acc + result;
      }
    }

    return acc;
  }, 0);
}

if (import.meta.main) {
  const equationString = await readInputToString();
  const equations = equationString
    .split("\n")
    .filter((line) => line)
    .map(
      (line) => {
        const lineParts = line.split(": ");
        return {
          result: lineParts[0],
          params: lineParts[1].split(" ").map(Number),
        };
      },
    );
  console.log(
    sumPossibleResults(equations, [(a, b) => a + b, (a, b) => a * b]),
  );
  console.log(
    sumPossibleResults(equations, [
      (a, b) => a + b,
      (a, b) => a * b,
      (a, b) => Number(`${a}${b}`),
    ]),
  );
}
