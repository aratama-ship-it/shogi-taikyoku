// Deterministic search for tsume-shogi positions whose attacker starts with no pieces in hand.
// Usage: node scripts/search-board-move-puzzles.mjs [plies=5] [limit=12] [attempts=30000]

import {
  ATTACK,
  DEFENSE,
  TOTAL_MATERIAL,
  applyMove,
  chooseLongestDefense,
  isInCheck,
  isMate,
  minimumMatePlies,
  moveKey,
  stateFromPosition,
  winningCheckingMoves,
} from "../game-core.mjs";

const plies = Number(process.argv[2] || 5);
const limit = Number(process.argv[3] || 12);
const maximumAttempts = Number(process.argv[4] || 30000);
let seed = 0x51a09e17;

function random() {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return (seed >>> 0) / 0x100000000;
}

function pick(items) {
  return items[Math.floor(random() * items.length)];
}

function semanticKey(move) {
  if (move.kind === "drop") return `${move.type}*${move.toRow},${move.toCol}`;
  return `${move.fromRow},${move.fromCol}-${move.toRow},${move.toCol}`;
}

function hintFromMove(move) {
  if (move.kind === "drop") return { hand: move.type, target: [move.toRow, move.toCol] };
  return { origin: [move.fromRow, move.fromCol], target: [move.toRow, move.toCol] };
}

function attackHandCount(state) {
  return Object.values(state.hands[ATTACK] || {}).reduce((sum, count) => sum + count, 0);
}

function verifiedLine(state, remaining) {
  const wins = winningCheckingMoves(state, remaining);
  const seen = new Set();
  for (const move of wins) {
    const key = semanticKey(move);
    if (seen.has(key)) continue;
    seen.add(key);
    const next = applyMove(state, move);
    if (isMate(next, DEFENSE)) {
      if (remaining !== 1 || attackHandCount(next) !== 0) continue;
      return { hints: [hintFromMove(move)], responses: [], moves: [moveKey(move)] };
    }
    const defense = chooseLongestDefense(next, remaining - 1);
    if (!defense || defense.kind === "drop") continue;
    const rest = verifiedLine(applyMove(next, defense), remaining - 2);
    if (!rest) continue;
    return {
      hints: [hintFromMove(move), ...rest.hints],
      responses: [
        { origin: [defense.fromRow, defense.fromCol], target: [defense.toRow, defense.toCol] },
        ...rest.responses,
      ],
      moves: [moveKey(move), moveKey(defense), ...rest.moves],
    };
  }
  return null;
}

function solutionSignature(position) {
  const state = stateFromPosition(position);
  if (isInCheck(state, DEFENSE)) return null;
  if (minimumMatePlies(state, plies) !== plies) return null;
  const first = new Set(winningCheckingMoves(state, plies).map(semanticKey));
  return first.size === 1 ? [...first][0] : null;
}

function isMinimal(position, baseline) {
  for (let index = 0; index < position.board.length; index += 1) {
    if (position.board[index].type === "K") continue;
    const board = position.board.filter((_, boardIndex) => boardIndex !== index);
    if (solutionSignature({ ...position, board }) === baseline) return false;
  }
  return true;
}

function candidate() {
  const board = [];
  const occupied = new Set();
  const material = {};
  const kingRow = pick([0, 0, 0, 1, 1, 2]);
  const kingCol = pick([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const put = (entry) => {
    const square = `${entry.row},${entry.col}`;
    if (occupied.has(square)) return false;
    if (entry.type !== "K" && (material[entry.type] || 0) >= TOTAL_MATERIAL[entry.type]) return false;
    occupied.add(square);
    board.push(entry);
    if (entry.type !== "K") material[entry.type] = (material[entry.type] || 0) + 1;
    return true;
  };
  put({ row: kingRow, col: kingCol, type: "K", side: DEFENSE });

  const attackTypes = ["R", "B", "G", "S", "N", "L", "P", "P"];
  const defenseTypes = ["G", "S", "N", "L", "P", "P"];
  const attackCount = 3 + Math.floor(random() * 4);
  const defenseCount = Math.floor(random() * 4);

  for (let index = 0; index < attackCount; index += 1) {
    for (let tries = 0; tries < 30; tries += 1) {
      const row = Math.floor(random() * 7);
      const col = Math.max(0, Math.min(8, kingCol + Math.floor(random() * 9) - 4));
      const type = pick(attackTypes);
      const promoted = ["R", "B", "S", "N", "L", "P"].includes(type) && random() < 0.18;
      if (put({ row, col, type, side: ATTACK, ...(promoted ? { promoted: true } : {}) })) break;
    }
  }

  for (let index = 0; index < defenseCount; index += 1) {
    for (let tries = 0; tries < 30; tries += 1) {
      const row = Math.max(0, Math.min(5, kingRow + Math.floor(random() * 6) - 2));
      const col = Math.max(0, Math.min(8, kingCol + Math.floor(random() * 7) - 3));
      if (put({ row, col, type: pick(defenseTypes), side: DEFENSE })) break;
    }
  }
  return { board, hand: {}, defenseHand: "all" };
}

let found = 0;
const seenPositions = new Set();
for (let attempt = 1; attempt <= maximumAttempts && found < limit; attempt += 1) {
  const position = candidate();
  const signature = JSON.stringify(position.board);
  if (seenPositions.has(signature)) continue;
  seenPositions.add(signature);
  const state = stateFromPosition(position);
  if (isInCheck(state, DEFENSE) || isInCheck(state, ATTACK)) continue;
  const minimum = minimumMatePlies(state, plies);
  if (minimum !== plies) continue;
  const first = new Set(winningCheckingMoves(state, plies).map(semanticKey));
  if (first.size !== 1) continue;
  const line = verifiedLine(state, plies);
  if (!line || line.hints[0].hand || !line.hints.some((hint) => !hint.hand)) continue;
  const baseline = [...first][0];
  if (!isMinimal(position, baseline)) continue;
  found += 1;
  console.log(JSON.stringify({ attempt, position, line }));
}

console.error(JSON.stringify({ attempts: maximumAttempts, found }));
