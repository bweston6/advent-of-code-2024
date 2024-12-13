function solveSimult(a, b, c, d, u, v) {
  if (Math.abs(a) > Math.abs(c)) {
    const f = u * c / a;
    const g = b * c / a;
    const y = (v - f) / (d - g);
    return [(f - g * y) / c, y];
  }
  const f = v * a / c;
  const g = d * a / c;
  const x = (u - f) / (b - g);
  return [(f - g * x) / a, x];
}

function sumTokens(machines) {
  return machines.reduce((acc, machine) => {
    let [a, b] = solveSimult(
      machine.ax,
      machine.bx,
      machine.ay,
      machine.by,
      machine.x,
      machine.y,
    );

    // remove double float inaccuracies
    a = Number(parseFloat(a).toPrecision(15));
    b = Number(parseFloat(b).toPrecision(15));

    if (a % 1 != 0 || b % 1 != 0) {
      // no solution
      return acc;
    }

    return acc + a * 3 + b;
  }, 0);
}

if (import.meta.main) {
  const machineStrings = await Deno.readTextFile("input.txt");
  const machines = machineStrings
    .trim()
    .split("\n\n")
    .map((machineString) => {
      const regex =
        /X\+(?<ax>\d+).*Y\+(?<ay>\d+)\n.*X\+(?<bx>\d+).*Y\+(?<by>\d+)\n.*X=(?<x>\d+).*Y=(?<y>\d+)/;
      const machine = structuredClone(machineString.match(regex).groups);
      for (const key in machine) {
        machine[key] = Number(machine[key]);
      }
      return machine;
    });

  console.log(sumTokens(machines));
  console.log(sumTokens(machines.map((machine) => {
    machine.x = machine.x + 10000000000000;
    machine.y = machine.y + 10000000000000;
    return machine;
  })));
}
