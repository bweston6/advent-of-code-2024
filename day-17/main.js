let ip = 0;
let output = [];
const opcodes = {
  0: adv,
  1: bxl,
  2: bst,
  3: jnz,
  4: bxc,
  5: out,
  6: bdv,
  7: cdv,
};

const input = await Deno.readTextFile("input.txt");
let { a, b, c, program: programString } =
  input.match(/.* (?<a>\d+)\n.* (?<b>\d+)\n.* (?<c>\d+)\n\n.* (?<program>.*)/)
    .groups;
const program = programString.trim().split(",").map(Number);

console.log(run(program));
console.log(getProgramAsOutput(program));

function run(program) {
  while (ip < program.length) {
    opcodes[program[ip]](program[ip + 1]);
    ip += 2;
  }
  return output.join(",");
}

function getProgramAsOutput(program) {
  let startingA = 0;
  output = [];

  while (output.length != program.length) {
    a = startingA;
    b = 0;
    c = 0;
    ip = 0;

    while (ip < program.length) {
      opcodes[program[ip]](program[ip + 1]);
      ip += 2;
      if (
        JSON.stringify(program.slice(0, output.length)) !=
          JSON.stringify(output)
      ) {
        startingA++;
        a = startingA;
        b = 0;
        c = 0;
        ip = 0;
        output = [];
      }
    }
  }

  return startingA;
}

function getComboOperandValue(operand) {
  if (operand <= 3) return operand;
  if (operand === 4) return a;
  if (operand === 5) return b;
  if (operand === 6) return c;
}

function adv(operand) {
  a = Math.floor(a / 2 ** getComboOperandValue(operand));
}

function bxl(operand) {
  b ^= operand;
}

function bst(operand) {
  b = getComboOperandValue(operand) % 8;
}

function jnz(operand) {
  if (a === 0) return;
  ip = operand - 2;
}

function bxc(_operand) {
  b ^= c;
}

function out(operand) {
  output.push(getComboOperandValue(operand) % 8);
}

function bdv(operand) {
  b = Math.floor(a / 2 ** getComboOperandValue(operand));
}
function cdv(operand) {
  c = Math.floor(a / 2 ** getComboOperandValue(operand));
}
