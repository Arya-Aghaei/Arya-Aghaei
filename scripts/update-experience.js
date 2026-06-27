const fs = require("node:fs");
const path = require("node:path");

const README_PATH = path.join(__dirname, "..", "README.md");
const EXPERIENCE_START = { year: 2015, month: 6, day: 1 };
const MARKER_PATTERN =
  /<!-- EXPERIENCE_YEARS:START -->.*?<!-- EXPERIENCE_YEARS:END -->/s;

function getToday() {
  if (!process.env.CURRENT_DATE) {
    return new Date();
  }

  const parsed = new Date(`${process.env.CURRENT_DATE}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("CURRENT_DATE must use YYYY-MM-DD format.");
  }

  return parsed;
}

function fullYearsSince(start, today) {
  const currentYear = today.getUTCFullYear();
  const currentMonth = today.getUTCMonth() + 1;
  const currentDay = today.getUTCDate();
  let years = currentYear - start.year;

  if (
    currentMonth < start.month ||
    (currentMonth === start.month && currentDay < start.day)
  ) {
    years -= 1;
  }

  return Math.max(0, years);
}

const readme = fs.readFileSync(README_PATH, "utf8");
const years = fullYearsSince(EXPERIENCE_START, getToday());
const replacement = `<!-- EXPERIENCE_YEARS:START -->${years}+ years<!-- EXPERIENCE_YEARS:END -->`;

if (!MARKER_PATTERN.test(readme)) {
  throw new Error("Could not find EXPERIENCE_YEARS markers in README.md.");
}

const updated = readme.replace(MARKER_PATTERN, replacement);

if (updated === readme) {
  console.log(`Experience already up to date: ${years}+ years.`);
} else {
  fs.writeFileSync(README_PATH, updated);
  console.log(`Updated experience to ${years}+ years.`);
}
