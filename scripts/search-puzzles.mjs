// 新しい詰将棋問題の候補をエンジン検証付きで探索する作問支援ツール。
// 使い方: node scripts/search-puzzles.mjs <template>
// 出力された候補は tests/game-core.test.mjs と同じ条件
// （初形無王手・最短手数一致・初手唯一・駒余りなしの強制手順）を満たす。

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

const JA_RANKS = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
const JA_PIECES = { K: "玉", R: "飛", B: "角", G: "金", S: "銀", N: "桂", L: "香", P: "歩" };

function label([row, col]) {
  return `${9 - col}${JA_RANKS[row]}`;
}

function moveLabel(state, move) {
  if (move.kind === "drop") return `${JA_PIECES[move.type]}*${label([move.toRow, move.toCol])}`;
  const item = state.board[move.fromRow][move.fromCol];
  const name = `${item.promoted ? "+" : ""}${JA_PIECES[item.type]}`;
  return `${name}${label([move.fromRow, move.fromCol])}→${label([move.toRow, move.toCol])}${move.promote ? "成" : ""}`;
}

function semanticKey(move) {
  if (move.kind === "drop") return `${move.type}*${move.toRow},${move.toCol}`;
  return `${move.fromRow},${move.fromCol}-${move.toRow},${move.toCol}`;
}

function hintFromMove(move) {
  if (move.kind === "drop") return { hand: move.type, target: [move.toRow, move.toCol] };
  return { origin: [move.fromRow, move.fromCol], target: [move.toRow, move.toCol] };
}

function matchesHint(move, hint) {
  if (move.toRow !== hint.target[0] || move.toCol !== hint.target[1]) return false;
  if (hint.hand) return move.kind === "drop" && move.type === hint.hand;
  return move.kind === "board" && move.fromRow === hint.origin[0] && move.fromCol === hint.origin[1];
}

function attackHandCount(state) {
  return Object.values(state.hands[ATTACK] || {}).reduce((sum, count) => sum + count, 0);
}

// テストと同じ歩き方（hint → hinted[0] → chooseLongestDefense）で
// 駒余りなしの完全手順を探す。戻り値は { hints, responses, notation } か null。
function findVerifiedLine(state, remaining) {
  if (remaining <= 0) return null;
  const winning = winningCheckingMoves(state, remaining);
  const seen = new Set();
  for (const candidate of winning) {
    const key = semanticKey(candidate);
    if (seen.has(key)) continue;
    seen.add(key);
    const hint = hintFromMove(candidate);
    const applied = winning.filter((move) => matchesHint(move, hint))[0];
    const next = applyMove(state, applied);
    if (isMate(next, DEFENSE)) {
      if (attackHandCount(next) !== 0) continue;
      return { hints: [hint], responses: [], notation: [moveLabel(state, applied)] };
    }
    const defense = chooseLongestDefense(next, remaining - 1);
    if (!defense) continue;
    const after = applyMove(next, defense);
    const rest = findVerifiedLine(after, remaining - 2);
    if (!rest) continue;
    return {
      hints: [hint, ...rest.hints],
      responses: [
        defense.kind === "drop"
          ? { hand: defense.type, target: [defense.toRow, defense.toCol] }
          : { origin: [defense.fromRow, defense.fromCol], target: [defense.toRow, defense.toCol] },
        ...rest.responses,
      ],
      notation: [moveLabel(state, applied), moveLabel(next, defense), ...rest.notation],
    };
  }
  return null;
}

function solutionSignature(position, plies) {
  const state = stateFromPosition(position);
  if (isInCheck(state, DEFENSE)) return null;
  if (minimumMatePlies(state, plies) !== plies) return null;
  const winning = winningCheckingMoves(state, plies);
  const keys = new Set(winning.map(semanticKey));
  if (keys.size !== 1) return null;
  return [...keys][0];
}

export function validatePuzzle(position, plies) {
  const state = stateFromPosition(position);
  if (isInCheck(state, DEFENSE)) return { ok: false, reason: "initial-check" };
  if (minimumMatePlies(state, plies) !== plies) return { ok: false, reason: "wrong-length" };
  const winning = winningCheckingMoves(state, plies);
  const firstKeys = new Set(winning.map(semanticKey));
  if (firstKeys.size !== 1) return { ok: false, reason: `first-moves:${firstKeys.size}` };
  const line = findVerifiedLine(state, plies);
  if (!line) return { ok: false, reason: "no-clean-line" };
  if (line.responses.some((response) => response.hand)) return { ok: false, reason: "drop-defense" };

  // 不要駒（飾り駒）チェック: どの駒を外しても同じ唯一解のまま成立するなら不合格。
  const baseline = [...firstKeys][0];
  for (let i = 0; i < position.board.length; i += 1) {
    if (position.board[i].type === "K") continue;
    const board = position.board.filter((_, j) => j !== i);
    if (solutionSignature({ ...position, board }, plies) === baseline) {
      return { ok: false, reason: `decorative-piece:${position.board[i].type}@${position.board[i].row},${position.board[i].col}` };
    }
  }
  return { ok: true, line };
}

function reportCandidate(name, position, plies) {
  const result = validatePuzzle(position, plies);
  if (!result.ok) return false;
  console.log(`\n=== ${name} (${plies}手詰) ===`);
  console.log("手順:", result.line.notation.join("  "));
  console.log("board:", JSON.stringify(position.board));
  console.log("hand:", JSON.stringify(position.hand));
  console.log("hints:", JSON.stringify(result.line.hints));
  console.log("responses:", JSON.stringify(result.line.responses));
  return true;
}

// --- 探索テンプレート ---------------------------------------------------

const A = ATTACK;
const D = DEFENSE;

function* squares(rows, cols) {
  for (const row of rows) for (const col of cols) yield [row, col];
}

function occupied(board, row, col) {
  return board.some((item) => item.row === row && item.col === col);
}

// T1: と金（歩の成り）で仕留める1手詰。支え駒1〜2枚を総当たり。
function searchTokin() {
  const kingCol = 4;
  const base = [
    { row: 0, col: kingCol, type: "K", side: D },
    { row: 2, col: kingCol, type: "P", side: A },
  ];
  const supports = ["G", "S", "N", "L", "R", "B"];
  const defenseFillers = [[], [{ row: 0, col: 3, type: "L", side: D }], [{ row: 0, col: 3, type: "L", side: D }, { row: 0, col: 5, type: "L", side: D }]];
  let found = 0;
  for (const fillers of defenseFillers) {
    for (const type of supports) {
      for (const [row, col] of squares([2, 3, 4], [2, 3, 4, 5, 6])) {
        const board = [...base, ...fillers, { row, col, type, side: A }];
        if (board.length !== new Set(board.map((item) => `${item.row},${item.col}`)).size) continue;
        if (reportCandidate(`tokin ${type}@${label([row, col])} fillers=${fillers.length}`, { board, hand: {}, defenseHand: "all" }, 1)) {
          found += 1;
          if (found >= 12) return;
        }
      }
    }
  }
}

// T2: 竜（成り飛車）を寄せる1手詰。竜と支え駒の位置を総当たり。
function searchDragon() {
  let found = 0;
  for (const kingCol of [6, 7]) {
    const king = { row: 0, col: kingCol, type: "K", side: D };
    for (const [dragonRow, dragonCol] of squares([1, 2, 3], [2, 3, 4, 5, 6, 7, 8])) {
      for (const supportType of ["B", "N", "S", "G", "L"]) {
        for (const [row, col] of squares([2, 3, 4], [4, 5, 6, 7, 8])) {
          if (dragonRow === row && dragonCol === col) continue;
          if ((dragonRow === 0 && dragonCol === kingCol) || (row === 0 && col === kingCol)) continue;
          const board = [
            king,
            { row: dragonRow, col: dragonCol, type: "R", side: A, promoted: true },
            { row, col, type: supportType, side: A },
          ];
          if (reportCandidate(`dragon +R@${label([dragonRow, dragonCol])} ${supportType}@${label([row, col])}`, { board, hand: {}, defenseHand: "all" }, 1)) {
            found += 1;
            if (found >= 12) return;
          }
        }
      }
    }
  }
}

// T3: 持ち駒2枚（捨て駒→とどめ）の3手詰。支え駒2枚を総当たり。
function searchThree(handPieces, supports, kingCol = 6) {
  const king = { row: 0, col: kingCol, type: "K", side: D };
  const hand = {};
  for (const type of handPieces) hand[type] = (hand[type] || 0) + 1;
  const supportSquares = [...squares([1, 2, 3, 4], [kingCol - 2, kingCol - 1, kingCol, kingCol + 1, kingCol + 2].filter((col) => col >= 0 && col <= 8))];
  let found = 0;
  for (let i = 0; i < supportSquares.length; i += 1) {
    for (let j = i + 1; j < supportSquares.length; j += 1) {
      for (const typeA of supports) {
        for (const typeB of supports) {
          const [rowA, colA] = supportSquares[i];
          const [rowB, colB] = supportSquares[j];
          const board = [
            king,
            { row: rowA, col: colA, type: typeA, side: A },
            { row: rowB, col: colB, type: typeB, side: A },
          ];
          if (reportCandidate(`three ${handPieces.join("")} ${typeA}@${label([rowA, colA])} ${typeB}@${label([rowB, colB])}`, { board, hand, defenseHand: "all" }, 3)) {
            found += 1;
            if (found >= 10) return;
          }
        }
      }
    }
  }
}

// T4: 持ち駒3枚の5手詰。支え駒2枚を総当たり。
function searchFive(handPieces, supports, kingCol = 6, limit = 6) {
  const king = { row: 0, col: kingCol, type: "K", side: D };
  const hand = {};
  for (const type of handPieces) hand[type] = (hand[type] || 0) + 1;
  const supportSquares = [...squares([1, 2, 3], [kingCol - 2, kingCol - 1, kingCol, kingCol + 1, kingCol + 2].filter((col) => col >= 0 && col <= 8))];
  let found = 0;
  for (let i = 0; i < supportSquares.length; i += 1) {
    for (let j = i + 1; j < supportSquares.length; j += 1) {
      for (const typeA of supports) {
        for (const typeB of supports) {
          const [rowA, colA] = supportSquares[i];
          const [rowB, colB] = supportSquares[j];
          const board = [
            king,
            { row: rowA, col: colA, type: typeA, side: A },
            { row: rowB, col: colB, type: typeB, side: A },
          ];
          if (reportCandidate(`five ${handPieces.join("")} ${typeA}@${label([rowA, colA])} ${typeB}@${label([rowB, colB])}`, { board, hand, defenseHand: "all" }, 5)) {
            found += 1;
            if (found >= limit) return;
          }
        }
      }
    }
  }
}

const mode = process.argv[2] || "all";
if (mode === "tokin" || mode === "all") searchTokin();
if (mode === "dragon" || mode === "all") searchDragon();
if (mode === "three" || mode === "all") {
  searchThree(["S", "G"], ["N", "S", "G", "L", "P"]);
}
if (mode === "five-nsg") searchFive(["N", "S", "G"], ["G", "S", "L", "P"]);
if (mode === "five-ssg") searchFive(["S", "S", "G"], ["G", "S", "L", "P"]);

// T5: 長手数（7手・9手）。5手詰めで見つけた金2枚の壁を土台に、
// 持ち駒と玉の初期位置を変えて総当たり。
function searchLong(handPieces, plies, limit = 4) {
  const hand = {};
  for (const type of handPieces) hand[type] = (hand[type] || 0) + 1;
  const wallSets = [
    [{ row: 1, col: 4, type: "G", side: A }, { row: 3, col: 7, type: "G", side: A }],
    [{ row: 1, col: 4, type: "G", side: A }, { row: 3, col: 7, type: "S", side: A }],
    [{ row: 2, col: 4, type: "G", side: A }, { row: 3, col: 7, type: "G", side: A }],
    [{ row: 1, col: 4, type: "G", side: A }, { row: 3, col: 6, type: "G", side: A }],
    [{ row: 1, col: 4, type: "G", side: A }, { row: 4, col: 7, type: "G", side: A }],
  ];
  let found = 0;
  for (const walls of wallSets) {
    for (const [kingRow, kingCol] of squares([0, 1, 2], [5, 6, 7, 8])) {
      if (walls.some((item) => item.row === kingRow && item.col === kingCol)) continue;
      const board = [{ row: kingRow, col: kingCol, type: "K", side: D }, ...walls];
      const wallLabel = walls.map((item) => `${item.type}@${label([item.row, item.col])}`).join(" ");
      if (reportCandidate(`long${plies} ${handPieces.join("")} K@${label([kingRow, kingCol])} ${wallLabel}`, { board, hand, defenseHand: "all" }, plies)) {
        found += 1;
        if (found >= limit) return;
      }
    }
  }
}

if (mode === "seven") searchLong(["N", "N", "S", "G"], 7);
if (mode === "seven-nssg") searchLong(["N", "S", "S", "G"], 7);
if (mode === "seven-nsgg") searchLong(["N", "S", "G", "G"], 7);

// T6: 壁1枚だけの長手数探索（不要駒ゼロを狙う）。
function searchSingleWall(handPieces, plies, limit = 3) {
  const hand = {};
  for (const type of handPieces) hand[type] = (hand[type] || 0) + 1;
  let found = 0;
  for (const wallType of ["G", "S", "L", "P"]) {
    for (const [wallRow, wallCol] of squares([2, 3, 4], [4, 5, 6, 7, 8])) {
      for (const [kingRow, kingCol] of squares([0, 1], [5, 6, 7, 8])) {
        if (wallRow === kingRow && wallCol === kingCol) continue;
        const board = [
          { row: kingRow, col: kingCol, type: "K", side: D },
          { row: wallRow, col: wallCol, type: wallType, side: A },
        ];
        if (reportCandidate(`single ${handPieces.join("")} K@${label([kingRow, kingCol])} ${wallType}@${label([wallRow, wallCol])}`, { board, hand, defenseHand: "all" }, plies)) {
          found += 1;
          if (found >= limit) return;
        }
      }
    }
  }
}

if (mode === "seven-single") searchSingleWall(["N", "N", "S", "G"], 7);
if (mode === "seven-single2") searchSingleWall(["N", "S", "S", "G"], 7);
if (mode === "nine") searchLong(["N", "N", "S", "S", "G"], 9, 2);
