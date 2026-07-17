import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { pickRandomPuzzleIndex } from "../random-puzzle.mjs";

test("random selection avoids the current puzzle when alternatives exist", () => {
  const entries = [{ index: 3 }, { index: 5 }, { index: 7 }];
  assert.equal(pickRandomPuzzleIndex(entries, 5, 0), 3);
  assert.equal(pickRandomPuzzleIndex(entries, 5, 0.999), 7);
});

test("random selection handles empty, single, and out-of-category states", () => {
  assert.equal(pickRandomPuzzleIndex([], 4, 0.5), null);
  assert.equal(pickRandomPuzzleIndex([{ index: 4 }], 4, 0.5), 4);
  assert.equal(pickRandomPuzzleIndex([{ index: 8 }, { index: 9 }], 4, 0), 8);
});

test("the puzzle sheet exposes and binds the category random button", async () => {
  const [indexSource, appSource] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.mjs", import.meta.url), "utf8"),
  ]);
  assert.match(indexSource, /id="random-puzzle-button"/);
  assert.match(appSource, /pickRandomPuzzleIndex\(filteredPuzzleEntries\(\), currentIndex\)/);
  assert.match(appSource, /#random-puzzle-button"\)\.addEventListener\("click", chooseRandomPuzzle\)/);
});
