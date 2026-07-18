import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [appSource, indexSource] = await Promise.all([
  readFile(new URL("../app.mjs", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
]);

test("the play screen exposes both judgement modes beside feedback", () => {
  assert.match(indexSource, /id="judgement-options"/);
  assert.match(indexSource, /data-value="immediate"/);
  assert.match(indexSource, /data-value="end"/);
  assert.match(indexSource, /class="feedback-tools"[\s\S]*id="feedback"[\s\S]*id="judgement-options"/);
  const settingsSection = indexSource.slice(indexSource.indexOf('id="settings-layer"'), indexSource.indexOf('id="puzzles-layer"'));
  assert.doesNotMatch(settingsSection, /id="judgement-options"/);
});

test("feedback and judgement appear above the move sequence", () => {
  const feedbackPosition = indexSource.indexOf('class="feedback-tools"');
  const sequencePosition = indexSource.indexOf('class="sequence-card"');
  assert.ok(feedbackPosition >= 0);
  assert.ok(sequencePosition >= 0);
  assert.ok(feedbackPosition < sequencePosition);
});

test("the puzzle selector is folded into the compact mission card and the defender strip is removed", () => {
  assert.match(indexSource, /class="mission-card"[\s\S]*id="puzzle-picker-button"[\s\S]*id="turn-banner"/);
  assert.doesNotMatch(indexSource, /class="opponent-strip"/);
  assert.doesNotMatch(indexSource, /data-i18n="defender"/);
});

test("the play controls expose a confirmed answer reveal", () => {
  assert.match(indexSource, /id="answer-button"/);
  assert.match(indexSource, /id="answer-layer"/);
  assert.match(indexSource, /id="confirm-answer-button"/);
  assert.match(appSource, /buildAnswerLine\(PUZZLES\[currentIndex\]\)/);
  assert.match(appSource, /feedbackMode = "answer-complete"/);
});

test("revealed answers can move backward, forward, pause, and resume", () => {
  assert.match(indexSource, /id="answer-navigator"/);
  assert.match(indexSource, /id="answer-prev-button"/);
  assert.match(indexSource, /id="answer-next-step-button"/);
  assert.match(indexSource, /id="answer-autoplay-button"/);
  assert.match(appSource, /replayAnswerPrefix\(puzzle, answerLine, cursor\)/);
  assert.match(appSource, /function stepAnswer\(delta\)/);
  assert.match(appSource, /function toggleAnswerAutoplay\(\)/);
  assert.match(appSource, /feedbackMode = "answer-review"/);
  assert.equal((appSource.match(/answerPrevious:/g) || []).length, 4);
  assert.equal((appSource.match(/answerNextStep:/g) || []).length, 4);
});

test("play-through remains the default and immediate mode checks the forced line", () => {
  assert.match(appSource, /judgementMode: "end"/);
  assert.match(appSource, /preferences\.judgementMode === "immediate"/);
  assert.match(appSource, /isWinningCheckingMove\(state, move, remaining\)/);
  assert.match(appSource, /feedbackMode = "wrong-line"/);
  assert.match(appSource, /bindOptionGroup\("#judgement-options", "judgementMode"/);
});
