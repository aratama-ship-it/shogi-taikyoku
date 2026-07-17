// 反復問題の変換（mirror/shift）候補が完全に成立するか検証する。
// 使い方: node scripts/probe-transform.mjs <seedId> <mirror:0|1> <shift>

import {
  ATTACK,
  DEFENSE,
  applyMove,
  chooseLongestDefense,
  isInCheck,
  isMate,
  minimumMatePlies,
  stateFromPosition,
  winningCheckingMoves,
} from "../game-core.mjs";
import { PUZZLES } from "../puzzles.mjs";

const [, , seedId, mirrorArg, shiftArg] = process.argv;
const mirror = mirrorArg === "1";
const shift = Number(shiftArg || 0);
const seed = PUZZLES.find((puzzle) => puzzle.id === seedId);
if (!seed) { console.log("seed not found"); process.exit(1); }

const mapCol = (col) => (mirror ? 8 - col : col) + shift;
const board = seed.position.board.map((item) => ({ ...item, col: mapCol(item.col) }));
if (board.some((item) => item.col < 0 || item.col > 8)) { console.log("off-board"); process.exit(0); }

const sourceHints = seed.hints || [{
  hand: seed.hintHand,
  origin: seed.hintHand ? null : seed.hintSquare,
  target: seed.hintTarget || seed.hintSquare,
}];
const hints = sourceHints.map((hint) => ({
  hand: hint.hand,
  origin: hint.origin ? [hint.origin[0], mapCol(hint.origin[1])] : null,
  target: [hint.target[0], mapCol(hint.target[1])],
}));
const expectedResponses = (seed.responses || []).map((response) => ({
  origin: [response.origin[0], mapCol(response.origin[1])],
  target: [response.target[0], mapCol(response.target[1])],
}));

function semanticKey(move) {
  if (move.kind === "drop") return `${move.type}*${move.toRow},${move.toCol}`;
  return `${move.fromRow},${move.fromCol}-${move.toRow},${move.toCol}`;
}
function matchesHint(move, hint) {
  if (move.toRow !== hint.target[0] || move.toCol !== hint.target[1]) return false;
  if (hint.hand) return move.kind === "drop" && move.type === hint.hand;
  return move.kind === "board" && move.fromRow === hint.origin[0] && move.fromCol === hint.origin[1];
}

let state = stateFromPosition({ ...seed.position, board });
const issues = [];
if (isInCheck(state, DEFENSE)) issues.push("initial-check");
if (minimumMatePlies(state, seed.plies) !== seed.plies) issues.push("wrong-length");
if (new Set(winningCheckingMoves(state, seed.plies).map(semanticKey)).size !== 1) issues.push("first-not-unique");
let remaining = seed.plies;
let step = 0;
const walked = [];
while (remaining > 0 && !issues.length) {
  const hinted = winningCheckingMoves(state, remaining).filter((move) => matchesHint(move, hints[step]));
  if (!hinted.length) { issues.push(`hint${step + 1}-not-winning`); break; }
  state = applyMove(state, hinted[0]);
  remaining -= 1;
  if (isMate(state, DEFENSE)) {
    const surplus = Object.values(state.hands[ATTACK] || {}).reduce((sum, count) => sum + count, 0);
    if (surplus) issues.push("surplus");
    break;
  }
  const defense = chooseLongestDefense(state, remaining);
  if (!defense || defense.kind === "drop") { issues.push("bad-defense"); break; }
  walked.push({ origin: [defense.fromRow, defense.fromCol], target: [defense.toRow, defense.toCol] });
  state = applyMove(state, defense);
  remaining -= 1;
  step += 1;
}
if (!issues.length && JSON.stringify(walked) !== JSON.stringify(expectedResponses)) issues.push("responses-diverge");
console.log(`${seedId} mirror=${mirror} shift=${shift}: ${issues.length ? "NG " + issues.join(",") : "OK"}`);
