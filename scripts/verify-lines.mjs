// テストと同じ歩き方で全基本問題の手順を検証し、
// responses（玉方応手の事前計算）のズレがあれば修正版を出力する。
// 使い方: node scripts/verify-lines.mjs [plies]

import {
  ATTACK,
  DEFENSE,
  applyMove,
  chooseLongestDefense,
  isInCheck,
  isMate,
  minimumMatePlies,
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
  return move.kind === "board" && move.fromRow === hint.origin[0] && move.fromCol === hint.origin[1];
}

const requestedPlies = Number(process.argv[2] || 0);
const targets = PUZZLES.filter((puzzle) => !puzzle.derivedFrom)
  .filter((puzzle) => !requestedPlies || puzzle.plies === requestedPlies);

for (const puzzle of targets) {
  let state = puzzleState(puzzle);
  const issues = [];
  const walkedDefenses = [];
  if (isInCheck(state, DEFENSE)) issues.push("initial-check");
  if (minimumMatePlies(state, puzzle.plies) !== puzzle.plies) issues.push("wrong-length");
  const winning = winningCheckingMoves(state, puzzle.plies);
  if (new Set(winning.map(semanticKey)).size !== 1) issues.push("first-not-unique");

  let remaining = puzzle.plies;
  let step = 0;
  while (remaining > 0 && !issues.length) {
    const hinted = winningCheckingMoves(state, remaining).filter((move) => matchesHint(move, hintFor(puzzle, step)));
    if (!hinted.length) { issues.push(`hint${step + 1}-not-winning`); break; }
    state = applyMove(state, hinted[0]);
    remaining -= 1;
    if (isMate(state, DEFENSE)) {
      const surplus = Object.values(state.hands[ATTACK] || {}).reduce((sum, count) => sum + count, 0);
      if (surplus) issues.push("surplus");
      if (remaining !== 0) issues.push("early-mate");
      break;
    }
    const defense = chooseLongestDefense(state, remaining);
    if (!defense) { issues.push("no-defense"); break; }
    if (defense.kind === "drop") issues.push(`defense${step + 1}-is-drop`);
    walkedDefenses.push({ origin: [defense.fromRow, defense.fromCol], target: [defense.toRow, defense.toCol] });
    state = applyMove(state, defense);
    remaining -= 1;
    step += 1;
  }

  const stored = JSON.stringify(puzzle.responses || []);
  const walked = JSON.stringify(walkedDefenses);
  const responsesMatch = stored === walked;
  if (issues.length) {
    console.log(`${puzzle.id}: FAIL ${issues.join(",")}`);
  } else if (!responsesMatch) {
    console.log(`${puzzle.id}: responsesズレ → 修正版: ${walked}`);
  } else {
    console.log(`${puzzle.id}: OK`);
  }
}
