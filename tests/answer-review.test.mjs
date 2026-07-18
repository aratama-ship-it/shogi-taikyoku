import assert from "node:assert/strict";
import test from "node:test";

import { buildAnswerLine } from "../answer-line.mjs";
import { replayAnswerPrefix } from "../answer-review.mjs";
import { DEFENSE, applyMove, isMate, stateFromPosition } from "../game-core.mjs";
import { PUZZLES } from "../puzzles.mjs";

test("every answer can be rebuilt at every forward and backward cursor", () => {
  for (const puzzle of PUZZLES) {
    const line = buildAnswerLine(puzzle);
    assert.ok(line, `${puzzle.id} has no answer line`);

    for (let cursor = 0; cursor <= line.length; cursor += 1) {
      const snapshot = replayAnswerPrefix(puzzle, line, cursor);
      let expected = stateFromPosition(puzzle.position);
      for (const move of line.slice(0, cursor)) expected = applyMove(expected, move);

      assert.deepEqual(snapshot.state, expected, `${puzzle.id} differs at cursor ${cursor}`);
      assert.equal(snapshot.playedPlies, cursor);
      assert.equal(snapshot.moveHistory.length, cursor);
      assert.equal(snapshot.attackerStep, Math.floor(cursor / 2));
    }

    assert.equal(isMate(replayAnswerPrefix(puzzle, line, line.length).state, DEFENSE), true);
  }
});

test("answer cursor is clamped to the available line", () => {
  const puzzle = PUZZLES[0];
  const line = buildAnswerLine(puzzle);
  assert.equal(replayAnswerPrefix(puzzle, line, -3).playedPlies, 0);
  assert.equal(replayAnswerPrefix(puzzle, line, 999).playedPlies, line.length);
});
