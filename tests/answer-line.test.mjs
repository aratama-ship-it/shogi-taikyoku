import assert from "node:assert/strict";
import test from "node:test";

import { buildAnswerLine } from "../answer-line.mjs";
import { ATTACK, DEFENSE, applyMove, isMate, stateFromPosition } from "../game-core.mjs";
import { PUZZLES } from "../puzzles.mjs";

test("every puzzle can reveal a complete verified answer line", () => {
  for (const puzzle of PUZZLES) {
    const line = buildAnswerLine(puzzle);
    assert.ok(line, `${puzzle.id} has no replayable answer`);
    assert.equal(line.length, puzzle.plies, `${puzzle.id} answer length differs`);

    let state = stateFromPosition(puzzle.position);
    line.forEach((move, index) => {
      assert.equal(move.side, index % 2 === 0 ? ATTACK : DEFENSE, `${puzzle.id} has the wrong side at ply ${index + 1}`);
      state = applyMove(state, move);
    });
    assert.equal(isMate(state, DEFENSE), true, `${puzzle.id} revealed answer does not mate`);
  }
});
