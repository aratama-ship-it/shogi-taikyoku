// 不要駒（飾り駒）チェック: 盤上の駒を1枚ずつ外しても問題が
// 同じ唯一解・同じ手数のまま成立するなら、その駒は不要駒。
// 使い方: node scripts/check-minimality.mjs [plies]  （plies指定で対象を絞る）

import {
  DEFENSE,
  isInCheck,
  minimumMatePlies,
  stateFromPosition,
  winningCheckingMoves,
} from "../game-core.mjs";
import { PUZZLES } from "../puzzles.mjs";

const JA_RANKS = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

function label(row, col) {
  return `${9 - col}${JA_RANKS[row]}`;
}

function semanticKey(move) {
  if (move.kind === "drop") return `${move.type}*${move.toRow},${move.toCol}`;
  return `${move.fromRow},${move.fromCol}-${move.toRow},${move.toCol}`;
}

// 問題が「同じ唯一解・同じ手数」で成立しているかを判定する。
function solutionSignature(position, plies) {
  const state = stateFromPosition(position);
  if (isInCheck(state, DEFENSE)) return null;
  if (minimumMatePlies(state, plies) !== plies) return null;
  const winning = winningCheckingMoves(state, plies);
  const keys = new Set(winning.map(semanticKey));
  if (keys.size !== 1) return null;
  return [...keys][0];
}

// 貪欲法で不要駒を外し切った最小盤面を返す。
function reduceToMinimal(position, plies) {
  const baseline = solutionSignature(position, plies);
  if (!baseline) return null;
  let board = [...position.board];
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < board.length; i += 1) {
      if (board[i].type === "K") continue;
      const candidate = board.filter((_, j) => j !== i);
      if (solutionSignature({ ...position, board: candidate }, plies) === baseline) {
        board = candidate;
        changed = true;
        break;
      }
    }
  }
  return board;
}

if (process.argv[2] === "reduce") {
  const id = process.argv[3];
  const puzzle = PUZZLES.find((item) => item.id === id);
  const minimal = reduceToMinimal(puzzle.position, puzzle.plies);
  console.log(`${id}: 最小盤面 ${minimal.length}枚（元 ${puzzle.position.board.length}枚）`);
  console.log(JSON.stringify(minimal));
  process.exit(0);
}

const requestedPlies = Number(process.argv[2] || 0);
const targets = PUZZLES.filter((puzzle) => !puzzle.derivedFrom)
  .filter((puzzle) => !requestedPlies || puzzle.plies === requestedPlies);

for (const puzzle of targets) {
  const baseline = solutionSignature(puzzle.position, puzzle.plies);
  if (!baseline) {
    console.log(`${puzzle.id}: ベースラインが成立しない（要調査）`);
    continue;
  }
  const removable = [];
  puzzle.position.board.forEach((piece, index) => {
    if (piece.type === "K") return;
    const board = puzzle.position.board.filter((_, i) => i !== index);
    const signature = solutionSignature({ ...puzzle.position, board }, puzzle.plies);
    if (signature === baseline) {
      removable.push(`${piece.side === "attack" ? "攻" : "玉"}${piece.type}@${label(piece.row, piece.col)}`);
    }
  });
  console.log(`${puzzle.id} (${puzzle.plies}手): ${removable.length ? "★不要駒あり → " + removable.join(", ") : "OK（全駒必要）"}`);
}
