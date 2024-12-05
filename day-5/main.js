async function readInputToString() {
  const string = await Deno.readTextFile("input.txt");
  return string
}

function isValid(manual, rules) {
  for (const rule of rules) {
    if (
      manual.indexOf(rule[0]) != -1 &&
      manual.indexOf(rule[1]) != -1 &&
      manual.indexOf(rule[0]) > manual.indexOf(rule[1])
    ) {
      return false
    }
  }
  return true
}

function sumMiddlePageOfValidManuals(rules, manuals) {
  return manuals.reduce((pageSum, manual) => {
    if (isValid(manual, rules)) {
      pageSum += manual[Math.floor(manual.length / 2)]
    }
    return pageSum
  }, 0)
}

function sumMiddlePageOfSortedManuals(rules, manuals) {
  return manuals.reduce((pageSum, manual) => {
    manual.sort((a, b) => {
      for (const rule of rules) {
        if (
          rule.includes(a) &&
          rule.includes(b)
        ) {
          return rule.indexOf(a) - rule.indexOf(b)
        }
      }
      // default to equivalent
      return 0;
    })
    pageSum += manual[Math.floor(manual.length / 2)]
    return pageSum
  }, 0)
}

if (import.meta.main) {
  const input = await readInputToString();
  let [rules, manuals] = input.split('\n\n');
  rules = rules.split('\n').map((rule) => rule.split('|').map(Number));
  manuals = manuals
    .split('\n')
    .filter((manual) => manual)
    .map((manual) => manual
      .split(',')
      .map(Number)
    );

  const sumOfValid = sumMiddlePageOfValidManuals(rules, manuals)
  const sumOfSorted = sumMiddlePageOfSortedManuals(rules, manuals)

  console.log(sumOfValid);
  console.log(sumOfSorted);
  console.log("difference", sumOfSorted - sumOfValid)
}
