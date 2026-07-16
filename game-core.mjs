export const ATTACK = "attack";
export const DEFENSE = "defense";

export const PIECE_TYPES = ["R", "B", "G", "S", "N", "L", "P"];
export const PROMOTABLE = new Set(["R", "B", "S", "N", "L", "P"]);

export const TOTAL_MATERIAL = Object.freeze({
  R: 2,
  B: 2,
  G: 4,
  S: 4,
  N: 4,
  L: 4,
  P: 18,
});

const GOLD_STEPS = [[0, -1], [-1, -1], [1, -1], [-1, 0], [1, 0], [0, 1]];
const MOVE_DEFS = Object.freeze({
  K: { steps: [[0, -1], [-1, -1], [1, -1], [-1, 0], [1, 0], [0, 1], [-1, 1], [1, 1]] },
  R: { slides: [[0, -1], [0, 1], [-1, 0], [1, 0]] },
  B: { slides: [[-1, -1], [1, -1], [-1, 1], [1, 1]] },
  G: { steps: GOLD_STEPS },
  S: { steps: [[0, -1], [-1, -1], [1, -1], [-1, 1], [1, 1]] },
  N: { steps: [[-1, -2], [1, -2]] },
  L: { slides: [[0, -1]] },
  P: { steps: [[0, -1]] },
  "+R": { slides: [[0, -1], [0, 1], [-1, 0], [1, 0]], steps: [[-1, -1], [1, -1], [-1, 1], [1, 1]] },
  "+B": { slides: [[-1, -1], [1, -1], [-1, 1], [1, 1]], steps: [[0, -1], [0, 1], [-1, 0], [1, 0]] },
  "+S": { steps: GOLD_STEPS },
  "+N": { steps: GOLD_STEPS },
  "+L": { steps: GOLD_STEPS },
  "+P": { steps: GOLD_STEPS },
});

export function emptyBoard() {
  return Array.from({ length: 9 }, () => Array(9).fill(null));
}

export function piece(type, side, promoted = false) {
  return { type, side, promoted };
}

export function cloneState(state) {
  return {
    board: state.board.map((row) => row.map((item) => item ? { ...item } : null)),
    hands: {
      [ATTACK]: { ...(state.hands?.[ATTACK] || {}) },
      [DEFENSE]: { ...(state.hands?.[DEFENSE] || {}) },
    },
  };
}

export function inside(row, col) {
  return row >= 0 && row < 9 && col >= 0 && col < 9;
}

export function opponent(side) {
  return side === ATTACK ? DEFENSE : ATTACK;
}

function direction(side) {
  return side === ATTACK ? 1 : -1;
}

function movementKey(item) {
  return item.promoted ? `+${item.type}` : item.type;
}

export function promotionZone(side, row) {
  return side === ATTACK ? row <= 2 : row >= 6;
}

export function isDeadEnd(type, side, row) {
  const last = side === ATTACK ? 0 : 8;
  const second = side === ATTACK ? 1 : 7;
  if ((type === "P" || type === "L") && row === last) return true;
  return type === "N" && (row === last || row === second);
}

export function rawTargets(board, row, col) {
  const item = board[row]?.[col];
  if (!item) return [];

  const def = MOVE_DEFS[movementKey(item)];
  const sign = direction(item.side);
  const targets = [];

  for (const [dx, dy] of def.steps || []) {
    const toRow = row + dy * sign;
    const toCol = col + dx * sign;
    if (!inside(toRow, toCol)) continue;
    const occupant = board[toRow][toCol];
    if (!occupant || occupant.side !== item.side) targets.push([toRow, toCol]);
  }

  for (const [dx, dy] of def.slides || []) {
    let toRow = row + dy * sign;
    let toCol = col + dx * sign;
    while (inside(toRow, toCol)) {
      const occupant = board[toRow][toCol];
      if (!occupant) {
        targets.push([toRow, toCol]);
      } else {
        if (occupant.side !== item.side) targets.push([toRow, toCol]);
        break;
      }
      toRow += dy * sign;
      toCol += dx * sign;
    }
  }

  return targets;
}

export function findKing(board, side) {
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const item = board[row][col];
      if (item?.side === side && item.type === "K") return [row, col];
    }
  }
  return null;
}

export function isInCheck(state, side) {
  const king = findKing(state.board, side);
  if (!king) return false;
  const enemy = opponent(side);

  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const item = state.board[row][col];
      if (item?.side !== enemy) continue;
      if (rawTargets(state.board, row, col).some(([r, c]) => r === king[0] && c === king[1])) return true;
    }
  }
  return false;
}

function promotionChoices(item, fromRow, toRow) {
  if (item.promoted || !PROMOTABLE.has(item.type)) return [false];
  const canPromote = promotionZone(item.side, fromRow) || promotionZone(item.side, toRow);
  if (!canPromote) return [false];
  if (isDeadEnd(item.type, item.side, toRow)) return [true];
  return [false, true];
}

function hasUnpromotedPawnOnFile(state, side, col) {
  return state.board.some((row) => {
    const item = row[col];
    return item?.side === side && item.type === "P" && !item.promoted;
  });
}

export function applyMove(state, move) {
  const next = cloneState(state);
  if (move.kind === "drop") {
    const count = next.hands[move.side][move.type] || 0;
    if (count <= 0) throw new Error(`No ${move.type} in hand`);
    next.hands[move.side][move.type] = count - 1;
    if (next.hands[move.side][move.type] === 0) delete next.hands[move.side][move.type];
    next.board[move.toRow][move.toCol] = piece(move.type, move.side, false);
    return next;
  }

  const moving = next.board[move.fromRow][move.fromCol];
  if (!moving) throw new Error("No piece at move origin");
  const captured = next.board[move.toRow][move.toCol];
  if (captured && captured.type !== "K") {
    const hand = next.hands[move.side];
    hand[captured.type] = (hand[captured.type] || 0) + 1;
  }
  next.board[move.toRow][move.toCol] = { ...moving, promoted: move.promote || moving.promoted };
  next.board[move.fromRow][move.fromCol] = null;
  return next;
}

function boardMoves(state, side) {
  const moves = [];
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const item = state.board[row][col];
      if (item?.side !== side) continue;

      for (const [toRow, toCol] of rawTargets(state.board, row, col)) {
        if (state.board[toRow][toCol]?.type === "K") continue;
        for (const promote of promotionChoices(item, row, toRow)) {
          const move = {
            kind: "board",
            side,
            fromRow: row,
            fromCol: col,
            toRow,
            toCol,
            promote,
          };
          const next = applyMove(state, move);
          if (!isInCheck(next, side)) moves.push(move);
        }
      }
    }
  }
  return moves;
}

function dropMoves(state, side, { enforcePawnDropMate }) {
  const moves = [];
  const hand = state.hands?.[side] || {};
  for (const type of PIECE_TYPES) {
    if (!hand[type]) continue;

    for (let row = 0; row < 9; row += 1) {
      for (let col = 0; col < 9; col += 1) {
        if (state.board[row][col]) continue;
        if (isDeadEnd(type, side, row)) continue;
        if (type === "P" && hasUnpromotedPawnOnFile(state, side, col)) continue;

        const move = { kind: "drop", side, type, toRow: row, toCol: col, promote: false };
        const next = applyMove(state, move);
        if (isInCheck(next, side)) continue;

        if (enforcePawnDropMate && type === "P" && isInCheck(next, opponent(side))) {
          const replies = generateLegalMoves(next, opponent(side), { enforcePawnDropMate: false });
          if (replies.length === 0) continue;
        }
        moves.push(move);
      }
    }
  }
  return moves;
}

export function generateLegalMoves(state, side, options = {}) {
  const settings = { enforcePawnDropMate: true, ...options };
  return [...boardMoves(state, side), ...dropMoves(state, side, settings)];
}

export function isMate(state, side = DEFENSE) {
  return isInCheck(state, side) && generateLegalMoves(state, side).length === 0;
}

export function isCheckingMove(state, move) {
  return isInCheck(applyMove(state, move), opponent(move.side));
}

export function isMateInOneMove(state, move) {
  if (move.side !== ATTACK) return false;
  const next = applyMove(state, move);
  return isInCheck(next, DEFENSE) && isMate(next, DEFENSE);
}

export function mateInOneMoves(state) {
  return generateLegalMoves(state, ATTACK).filter((move) => isMateInOneMove(state, move));
}

function stateKey(state, side, remainingPlies) {
  const board = state.board.map((row) => row.map((item) => {
    if (!item) return "_";
    return `${item.side === ATTACK ? "a" : "d"}${item.promoted ? "+" : ""}${item.type}`;
  }).join(",")).join("/");
  const hands = [ATTACK, DEFENSE].map((owner) => PIECE_TYPES
    .map((type) => `${type}${state.hands[owner]?.[type] || 0}`)
    .join(""))
    .join("/");
  return `${side}:${remainingPlies}:${board}:${hands}`;
}

function forceMateSearch(state, side, remainingPlies, memo) {
  if (isMate(state, DEFENSE)) return true;
  if (remainingPlies <= 0) return false;

  const key = stateKey(state, side, remainingPlies);
  if (memo.has(key)) return memo.get(key);

  let result;
  if (side === ATTACK) {
    const checks = generateLegalMoves(state, ATTACK).filter((move) => isCheckingMove(state, move));
    result = checks.some((move) => forceMateSearch(applyMove(state, move), DEFENSE, remainingPlies - 1, memo));
  } else {
    if (!isInCheck(state, DEFENSE)) {
      result = false;
    } else {
      const replies = generateLegalMoves(state, DEFENSE);
      result = replies.length === 0 || replies.every((move) => (
        forceMateSearch(applyMove(state, move), ATTACK, remainingPlies - 1, memo)
      ));
    }
  }

  memo.set(key, result);
  return result;
}

export function canForceMate(state, side = ATTACK, remainingPlies = 1) {
  return forceMateSearch(state, side, remainingPlies, new Map());
}

export function winningCheckingMoves(state, remainingPlies) {
  if (remainingPlies <= 0) return [];
  const memo = new Map();
  return generateLegalMoves(state, ATTACK).filter((move) => {
    const next = applyMove(state, move);
    return isInCheck(next, DEFENSE)
      && forceMateSearch(next, DEFENSE, remainingPlies - 1, memo);
  });
}

export function minimumMatePlies(state, maximumPlies = 9) {
  for (let plies = 1; plies <= maximumPlies; plies += 2) {
    if (canForceMate(state, ATTACK, plies)) return plies;
  }
  return null;
}

export function chooseLongestDefense(state, remainingPlies) {
  if (!isInCheck(state, DEFENSE)) return null;
  const replies = generateLegalMoves(state, DEFENSE);
  if (!replies.length) return null;

  const ranked = replies.map((move) => {
    const next = applyMove(state, move);
    const distance = minimumMatePlies(next, Math.max(remainingPlies - 1, 0));
    return { move, distance: distance ?? Number.POSITIVE_INFINITY };
  });
  ranked.sort((a, b) => {
    if (a.distance !== b.distance) return b.distance - a.distance;
    return moveKey(a.move).localeCompare(moveKey(b.move));
  });
  return ranked[0].move;
}

export function allRemainingDefensePieces(board, attackerHand = {}) {
  const remaining = { ...TOTAL_MATERIAL };
  for (const row of board) {
    for (const item of row) {
      if (item && item.type !== "K") remaining[item.type] -= 1;
    }
  }
  for (const [type, count] of Object.entries(attackerHand)) remaining[type] -= count;
  for (const type of Object.keys(remaining)) {
    if (remaining[type] <= 0) delete remaining[type];
  }
  return remaining;
}

export function stateFromPosition(position) {
  const board = emptyBoard();
  for (const entry of position.board) {
    board[entry.row][entry.col] = piece(entry.type, entry.side, Boolean(entry.promoted));
  }
  const attackHand = { ...(position.hand || {}) };
  const defenseHand = position.defenseHand === "all"
    ? allRemainingDefensePieces(board, attackHand)
    : { ...(position.defenseHand || {}) };
  return { board, hands: { [ATTACK]: attackHand, [DEFENSE]: defenseHand } };
}

export function moveKey(move) {
  if (move.kind === "drop") return `${move.type}*${move.toRow},${move.toCol}`;
  return `${move.fromRow},${move.fromCol}-${move.toRow},${move.toCol}${move.promote ? "+" : "="}`;
}
