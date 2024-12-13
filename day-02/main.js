async function readInputToArray() {
  const text = await Deno.readTextFile("input.txt");
  const textArray = text.split("\n");
  return textArray.filter((string) => string);
}

function isSafe(levels) {
  const sign = Math.sign(levels[0] - levels[1]);

  // early return both levels are the same
  if (sign == 0) {
    return;
  }

  let isSafe = true;

  for (let i = 1; i < levels.length; i++) {
    const difference = levels[i - 1] - levels[i];
    if (
      Math.sign(difference) != sign ||
      Math.abs(difference) > 3
    ) {
      isSafe = false;
      break;
    }
  }

  return isSafe;
}

function getSafeReports(reports) {
  let safeReports = 0;

  reports.forEach((report) => {
    const levels = report
      .split(" ")
      .map((level) => {
        return Number(level);
      });

    if (isSafe(levels)) {
      safeReports++;
    }
  });

  return safeReports;
}
function getDampenedSafeReports(reports) {
  let safeReports = 0;

  reports.forEach((report) => {
    const levels = report
      .split(" ")
      .map(Number);

    for (let i = 0; i < levels.length; i++) {
      const newLevels = [...levels];
      newLevels.splice(i, 1);
      if (isSafe(newLevels)) {
        safeReports++;
        break;
      }
    }
  });

  return safeReports;
}

if (import.meta.main) {
  const reports = await readInputToArray();

  console.log(getSafeReports(reports));
  console.log(getDampenedSafeReports(reports));
}
