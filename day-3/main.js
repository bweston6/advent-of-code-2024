async function readInputToString() {
  const string = await Deno.readTextFile("input.txt");
  return string;
}

function sumMultiplications(input, allowSkips) {
  const regex =
    /(?<func>mul(?=\((?<a>\d{1,3}),(?<b>\d{1,3})\))|do(?=\(\))|don't(?=\(\)))/gm;

  let instruction;
  let sum = 0;
  let skipInstruction = false;

  while ((instruction = regex.exec(input))) {
    if (instruction.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    const args = instruction.groups;

    switch (args.func) {
      case "do":
        skipInstruction = false;
        break;
      case "don't":
        skipInstruction = allowSkips && true;
        break;
      case "mul":
        sum += skipInstruction ? 0 : Number(args.a) * Number(args.b);
        break;
    }
  }

  return sum;
}

if (import.meta.main) {
  const input = await readInputToString();

  console.log(sumMultiplications(input, false));
  console.log(sumMultiplications(input, true));
}
