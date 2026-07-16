import assert from "node:assert/strict";
import test from "node:test";

import {
  ATTACK,
  DEFENSE,
  applyMove,
  generateLegalMoves,
  isInCheck,
  isMate,
  mateInOneMoves,
  moveKey,
} from "../game-core.mjs";
import { PUZZLES, puzzleState } from "../puzzles.mjs";

test("every bundled puzzle starts legally and has exactly one mating destination", () => {
  for (const puzzle of PUZZLES) {
    const state = puzzleState(puzzle);
    assert.equal(isInCheck(state, DEFENSE), false, `${puzzle.id} starts with the king in check`);
    assert.equal(isInCheck(state, ATTACK), false, `${puzzle.id} starts with the attacker king in check`);

    const matingMoves = mateInOneMoves(state);
    assert.ok(matingMoves.length >= 1, `${puzzle.id} has no mate in one`);
    const destinations = new Set(matingMoves.map((move) => `${move.toRow},${move.toCol}`));
    assert.equal(destinations.size, 1, `${puzzle.id} has multiple mating destinations: ${matingMoves.map(moveKey).join(", ")}`);
  }
});

test("the intended hint destination checkmates in every puzzle", () => {
  for (const puzzle of PUZZLES) {
    const state = puzzleState(puzzle);
    const target = puzzle.hintTarget || puzzle.hintSquare;
    const matching = generateLegalMoves(state, ATTACK).filter((move) => {
      if (move.toRow !== target[0] || move.toCol !== target[1]) return false;
      if (puzzle.hintHand) return move.kind === "drop" && move.type === puzzle.hintHand;
      return move.kind === "board" && move.fromRow === puzzle.hintSquare[0] && move.fromCol === puzzle.hintSquare[1];
    });
    assert.ok(matching.length > 0, `${puzzle.id} hint does not identify a legal move`);
    assert.ok(matching.some((move) => isMate(applyMove(state, move), DEFENSE)), `${puzzle.id} hint does not mate`);
  }
});

test("a non-mating legal move is not accepted as mate", () => {
  const state = puzzleState(PUZZLES[0]);
  const wrongMove = generateLegalMoves(state, ATTACK).find((move) => move.toRow !== 1 || move.toCol !== 4);
  assert.ok(wrongMove, "fixture needs at least one legal wrong move");
  assert.equal(isMate(applyMove(state, wrongMove), DEFENSE), false);
});
