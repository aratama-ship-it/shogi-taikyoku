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

const SOLVER_PUZZLES = process.env.FULL_PUZZLE_TEST === "1"
  ? PUZZLES
  : PUZZLES.filter((puzzle) => !puzzle.derivedFrom);

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

test("the bundle contains the requested number of puzzles for each mate length", () => {
  assert.deepEqual(
    Object.fromEntries([1, 3, 5, 7].map((plies) => [plies, PUZZLES.filter((puzzle) => puzzle.plies === plies).length])),
    { 1: 6, 3: 10, 5: 15, 7: 10 },
  );
  assert.equal(new Set(PUZZLES.map((puzzle) => puzzle.id)).size, PUZZLES.length, "puzzle ids must be unique");
});

test("practice variants match their declared source transformation", () => {
  const byId = new Map(PUZZLES.map((puzzle) => [puzzle.id, puzzle]));
  for (const puzzle of PUZZLES.filter((item) => item.derivedFrom)) {
    const source = byId.get(puzzle.derivedFrom);
    assert.ok(source, `${puzzle.id} has no source puzzle`);
    const { mirror, shift, extraBoard } = puzzle.transform;
    const mapCol = (col) => (mirror ? 8 - col : col) + shift;
    const expectedBoard = [
      ...source.position.board.map((item) => ({ ...item, col: mapCol(item.col) })),
      ...(extraBoard || []),
    ];
    assert.deepEqual(puzzle.position.board, expectedBoard, `${puzzle.id} board does not match its source`);
    assert.deepEqual(puzzle.position.hand, source.position.hand, `${puzzle.id} hand does not match its source`);
    for (const item of puzzle.position.board) {
      assert.ok(item.row >= 0 && item.row < 9 && item.col >= 0 && item.col < 9, `${puzzle.id} has an off-board piece`);
    }
    source.hints.forEach((hint, index) => {
      const variant = puzzle.hints[index];
      assert.deepEqual(variant.target, [hint.target[0], mapCol(hint.target[1])], `${puzzle.id} hint target differs`);
      if (hint.origin) assert.deepEqual(variant.origin, [hint.origin[0], mapCol(hint.origin[1])], `${puzzle.id} hint origin differs`);
      if (hint.hand) assert.equal(variant.hand, hint.hand, `${puzzle.id} hint hand differs`);
    });
    source.responses.forEach((response, index) => {
      const variant = puzzle.responses[index];
      assert.deepEqual(variant.origin, [response.origin[0], mapCol(response.origin[1])], `${puzzle.id} response origin differs`);
      assert.deepEqual(variant.target, [response.target[0], mapCol(response.target[1])], `${puzzle.id} response target differs`);
    });
  }
});

test("solver-checked puzzles have the declared minimum mate length and one first destination", () => {
  for (const puzzle of SOLVER_PUZZLES) {
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

test("the staged hints identify a complete no-surplus forced line in solver-checked puzzles", () => {
  for (const puzzle of SOLVER_PUZZLES) {
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
        const surplus = Object.values(state.hands[ATTACK] || {}).reduce((sum, count) => sum + count, 0);
        assert.equal(surplus, 0, `${puzzle.id} leaves attacking pieces in hand`);
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
