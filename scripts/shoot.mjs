// shoot.mjs — headless screenshots, for environments WITHOUT the Chrome tools
// (CI, a display-less sandbox). In a local Claude Code session you don't need
// this: just point claude-in-chrome at the URL and use `computer` to screenshot.
//
// Usage:  node scripts/shoot.mjs <url> [out-dir] [full-height-px]
// Captures a full-page shot plus three viewport frames at 0 / 45 / 90% scroll,
// so you can actually SEE the rendered reference (or your own built demo).
//
// Needs Playwright. If it's missing the script tells you the one command to run.
import { mkdirSync } from "node:fs";

const [url, outDir = "shots", fullH = "4000"] = process.argv.slice(2);
if (!url) {
  console.error("usage: node scripts/shoot.mjs <url> [out-dir] [full-height-px]");
  process.exit(2);
}

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error(
    "Playwright not available. Install it once in this project/dir:\n" +
      "  npm i -D playwright && npx playwright install chromium\n" +
      "(In a local session, prefer the claude-in-chrome tools instead.)"
  );
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
await page.waitForTimeout(1200); // let entrance animations settle

await page.screenshot({ path: `${outDir}/full.png`, fullPage: true });
const H = Number(fullH);
for (const [name, frac] of [["top", 0], ["mid", 0.45], ["low", 0.9]]) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(H * frac));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outDir}/${name}.png` });
}

await browser.close();
console.log(`wrote ${outDir}/{full,top,mid,low}.png`);
