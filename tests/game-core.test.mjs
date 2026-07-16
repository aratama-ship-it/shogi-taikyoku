import assert from "node:assert/strict";
import test from "node:test";

import {
  ATTACK,
  DEFENSE,
  applyMove,
  chooseLongestDefense,
  generateLegalMoves,
  isInCheck,
  isMate,
  minimumMatePlies,
  moveKey,
  winningCheckingMoves,
} from "../game-core.mjs";
import { PUZZLES, puzzleState } from "../puzzles.mjs";

function semanticKey(move) {
  if (move.kind === "drop") return `${move.type}*${move.toRow},${move.toCol}`;
  return `${move.fromRow},${move.fromCol}-${move.toRow},${move.toCol}`;
}

function hintFor(puzzle, attackerStep) {
  if (puzzle.hints) return puzzle.hints[attackerStep];
  return {
    hand: puzzle.hintHand,
    origin: puzzle.hintHand ? null : puzzle.hintSquare,
    target: puzzle.hintTarget || puzzle.hintSquare,
  };
}

function matchesHint(move, hint) {
  if (move.toRow !== hint.target[0] || move.toCol !== hint.target[1]) return false;
  if (hint.hand) return move.kind === "drop" && move.type === hint.hand;
  return move.kind === "board"
    && move.fromRow === hint.origin[0]
    && move.fromCol === hint.origin[1];
}

test("every bundled puzzle has the declared minimum mate length and one first destination", () => {
  for (const puzzle of PUZZLES) {
    const state = puzzleState(puzzle);
    assert.equal(isInCheck(state, DEFENSE), false, `${puzzle.id} starts with the king in check`);
    assert.equal(isInCheck(state, ATTACK), false, `${puzzle.id} starts with the attacker king in check`);
    assert.equal(minimumMatePlies(state, puzzle.plies), puzzle.plies, `${puzzle.id} is not mate in ${puzzle.plies}`);

    const winning = winningCheckingMoves(state, puzzle.plies);
    assert.ok(winning.length > 0, `${puzzle.id} has no winning first move`);
    assert.equal(
      new Set(winning.map(semanticKey)).size,
      1,
      `${puzzle.id} has multiple first moves: ${winning.map(moveKey).join(", ")}`,
    );
  }
});

test("the staged hints identify a complete forced line in every puzzle", () => {
  for (const puzzle of PUZZLES) {
    let state = puzzleState(puzzle);
    let remaining = puzzle.plies;
    let attackerStep = 0;

    while (remaining > 0) {
      const hint = hintFor(puzzle, attackerStep);
      const winning = winningCheckingMoves(state, remaining);
      const hintedMoves = winning.filter((move) => matchesHint(move, hint));
      assert.ok(hintedMoves.length > 0, `${puzzle.id} hint ${attackerStep + 1} does not identify a winning move`);

      state = applyMove(state, hintedMoves[0]);
      remaining -= 1;
      if (isMate(state, DEFENSE)) {
        assert.equal(remaining, 0, `${puzzle.id} mates before its declared length`);
        break;
      }

      const defense = chooseLongestDefense(state, remaining);
      assert.ok(defense, `${puzzle.id} has no automatic defense at ply ${puzzle.plies - remaining + 1}`);
      state = applyMove(state, defense);
      remaining -= 1;
      attackerStep += 1;
    }
  }
});

test("a non-forcing legal move is rejected", () => {
  const puzzle = PUZZLES.find((item) => item.plies === 3);
  const state = puzzleState(puzzle);
  const winningKeys = new Set(winningCheckingMoves(state, puzzle.plies).map(moveKey));
  const wrongMove = generateLegalMoves(state, ATTACK).find((move) => !winningKeys.has(moveKey(move)));
  assert.ok(wrongMove, "fixture needs at least one legal wrong move");
  const next = applyMove(state, wrongMove);
  assert.equal(isMate(next, DEFENSE), false);
});
