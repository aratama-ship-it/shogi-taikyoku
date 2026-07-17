import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [appSource, indexSource] = await Promise.all([
  readFile(new URL("../app.mjs", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
]);

test("settings expose both judgement modes", () => {
  assert.match(indexSource, /id="judgement-options"/);
  assert.match(indexSource, /data-value="immediate"/);
  assert.match(indexSource, /data-value="end"/);
});

test("the play controls expose a confirmed answer reveal", () => {
  assert.match(indexSource, /id="answer-button"/);
  assert.match(indexSource, /id="answer-layer"/);
  assert.match(indexSource, /id="confirm-answer-button"/);
  assert.match(appSource, /buildAnswerLine\(PUZZLES\[currentIndex\]\)/);
  assert.match(appSource, /feedbackMode = "answer-complete"/);
});

test("play-through remains the default and immediate mode checks the forced line", () => {
  assert.match(appSource, /judgementMode: "end"/);
  assert.match(appSource, /preferences\.judgementMode === "immediate"/);
  assert.match(appSource, /isWinningCheckingMove\(state, move, remaining\)/);
  assert.match(appSource, /feedbackMode = "wrong-line"/);
  assert.match(appSource, /bindOptionGroup\("#judgement-options", "judgementMode"/);
});
