import { cp, copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "public");
await mkdir(output, { recursive: true });

for (const file of [
  "index.html",
  "styles.css",
  "legal.css",
  "privacy.html",
  "support.html",
  "app.mjs",
  "answer-line.mjs",
  "game-core.mjs",
  "puzzles.mjs",
  "puzzle-i18n.mjs",
  "random-puzzle.mjs",
  "manifest.webmanifest",
  "sw.js",
  "og.png",
]) {
  await copyFile(resolve(root, file), resolve(output, file));
}

await cp(resolve(root, "icons"), resolve(output, "icons"), { recursive: true, force: true });
