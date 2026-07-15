"use strict";

/* ========== 定数・駒定義 ========== */

const SENTE = "sente";
const GOTE = "gote";

const KANJI = {
  FU: "歩", KY: "香", KE: "桂", GI: "銀", KI: "金",
  KA: "角", HI: "飛", OU: "王", GYOKU: "玉",
};
const PROMOTED_KANJI = { FU: "と", KY: "杏", KE: "圭", GI: "全", KA: "馬", HI: "竜" };
// 杏=成香, 圭=成桂, 全=成銀(将棋アプリの慣用略字)
const PROMOTABLE = new Set(["FU", "KY", "KE", "GI", "KA", "HI"]);

// 移動定義(先手視点。dy<0が前進)。step=1マス移動, slide=走り
const MOVES = {
  FU: { steps: [[0, -1]] },
  KY: { slides: [[0, -1]] },
  KE: { steps: [[-1, -2], [1, -2]] },
  GI: { steps: [[0, -1], [-1, -1], [1, -1], [-1, 1], [1, 1]] },
  KI: { steps: [[0, -1], [-1, -1], [1, -1], [-1, 0], [1, 0], [0, 1]] },
  OU: { steps: [[0, -1], [-1, -1], [1, -1], [-1, 0], [1, 0], [0, 1], [-1, 1], [1, 1]] },
  KA: { slides: [[-1, -1], [1, -1], [-1, 1], [1, 1]] },
  HI: { slides: [[0, -1], [0, 1], [-1, 0], [1, 0]] },
  UMA: { slides: [[-1, -1], [1, -1], [-1, 1], [1, 1]], steps: [[0, -1], [0, 1], [-1, 0], [1, 0]] },
  RYU: { slides: [[0, -1], [0, 1], [-1, 0], [1, 0]], steps: [[-1, -1], [1, -1], [-1, 1], [1, 1]] },
};

const HAND_ORDER = ["HI", "KA", "KI", "GI", "KE", "KY", "FU"];
const RANK_KANJI = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

/* ========== ゲーム状態 ========== */

let state = null;      // { board, hands, turn, moveCount, log, lastMove }
let history = [];      // 待った用スタック(直前状態のJSON)
let selected = null;   // { kind:"board", r, c } | { kind:"hand", type }
let legalTargets = []; // [{r,c,...}]
let gameOver = false;

function initialState() {
  const b = Array.from({ length: 9 }, () => Array(9).fill(null));
  const back = ["KY", "KE", "GI", "KI", "OU", "KI", "GI", "KE", "KY"];
  for (let c = 0; c < 9; c++) {
    b[0][c] = { type: back[c], owner: GOTE, promoted: false };
    b[2][c] = { type: "FU", owner: GOTE, promoted: false };
    b[6][c] = { type: "FU", owner: SENTE, promoted: false };
    b[8][c] = { type: back[c], owner: SENTE, promoted: false };
  }
  b[1][1] = { type: "HI", owner: GOTE, promoted: false };
  b[1][7] = { type: "KA", owner: GOTE, promoted: false };
  b[7][1] = { type: "KA", owner: SENTE, promoted: false };
  b[7][7] = { type: "HI", owner: SENTE, promoted: false };
  return {
    board: b,
    hands: { [SENTE]: {}, [GOTE]: {} },
    turn: SENTE,
    moveCount: 0,
    log: [],
    lastMove: null, // {r,c}
  };
}

/* ========== ルール判定 ========== */

function inBoard(r, c) { return r >= 0 && r < 9 && c >= 0 && c < 9; }
function opponent(side) { return side === SENTE ? GOTE : SENTE; }

function moveDef(piece) {
  if (piece.promoted) {
    if (piece.type === "KA") return MOVES.UMA;
    if (piece.type === "HI") return MOVES.RYU;
    return MOVES.KI; // と金・成香・成桂・成銀
  }
  return MOVES[piece.type];
}

// 疑似合法手(自玉の王手放置は未チェック)
function pseudoMoves(board, r, c) {
  const piece = board[r][c];
  const dir = piece.owner === SENTE ? 1 : -1; // dyに掛ける符号
  const def = moveDef(piece);
  const out = [];
  if (def.steps) {
    for (const [dx, dy] of def.steps) {
      const nr = r + dy * dir, nc = c + dx * dir;
      if (inBoard(nr, nc) && (!board[nr][nc] || board[nr][nc].owner !== piece.owner)) {
        out.push([nr, nc]);
      }
    }
  }
  if (def.slides) {
    for (const [dx, dy] of def.slides) {
      let nr = r + dy * dir, nc = c + dx * dir;
      while (inBoard(nr, nc)) {
        if (!board[nr][nc]) { out.push([nr, nc]); }
        else {
          if (board[nr][nc].owner !== piece.owner) out.push([nr, nc]);
          break;
        }
        nr += dy * dir; nc += dx * dir;
      }
    }
  }
  return out;
}

function findKing(board, side) {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    const p = board[r][c];
    if (p && p.owner === side && p.type === "OU") return [r, c];
  }
  return null;
}

function isInCheck(board, side) {
  const king = findKing(board, side);
  if (!king) return false;
  const opp = opponent(side);
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    const p = board[r][c];
    if (p && p.owner === opp) {
      if (pseudoMoves(board, r, c).some(([mr, mc]) => mr === king[0] && mc === king[1])) return true;
    }
  }
  return false;
}

function cloneBoard(board) {
  return board.map(row => row.map(p => (p ? { ...p } : null)));
}

// 盤上の駒の合法手(王手放置を除外)
function legalBoardMoves(st, r, c) {
  const piece = st.board[r][c];
  const out = [];
  for (const [nr, nc] of pseudoMoves(st.board, r, c)) {
    const b2 = cloneBoard(st.board);
    b2[nr][nc] = b2[r][c];
    b2[r][c] = null;
    if (!isInCheck(b2, piece.owner)) out.push([nr, nc]);
  }
  return out;
}

// 行き所のない駒になるか(不成のまま置けない位置)
function deadEnd(type, owner, r) {
  const last = owner === SENTE ? 0 : 8;
  const second = owner === SENTE ? 1 : 7;
  if ((type === "FU" || type === "KY") && r === last) return true;
  if (type === "KE" && (r === last || r === second)) return true;
  return false;
}

function inPromoZone(owner, r) {
  return owner === SENTE ? r <= 2 : r >= 6;
}

// 打てるマス(二歩・行き所・王手放置・打ち歩詰めをチェック)
function legalDrops(st, type) {
  const side = st.turn;
  const out = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    if (st.board[r][c]) continue;
    if (deadEnd(type, side, r)) continue;
    if (type === "FU") {
      // 二歩
      let nifu = false;
      for (let rr = 0; rr < 9; rr++) {
        const p = st.board[rr][c];
        if (p && p.owner === side && p.type === "FU" && !p.promoted) { nifu = true; break; }
      }
      if (nifu) continue;
    }
    const b2 = cloneBoard(st.board);
    b2[r][c] = { type, owner: side, promoted: false };
    if (isInCheck(b2, side)) continue; // 王手放置
    if (type === "FU" && isInCheck(b2, opponent(side))) {
      // 打ち歩詰めチェック: この歩打ちで相手に合法手が無ければ反則
      const st2 = { ...st, board: b2, turn: opponent(side), hands: st.hands };
      if (!hasAnyLegalMove(st2)) continue;
    }
    out.push([r, c]);
  }
  return out;
}

function hasAnyLegalMove(st) {
  const side = st.turn;
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    const p = st.board[r][c];
    if (p && p.owner === side && legalBoardMoves(st, r, c).length > 0) return true;
  }
  for (const type of Object.keys(st.hands[side])) {
    if (st.hands[side][type] > 0) {
      // 打ち歩詰め再帰を避けるため簡易版(歩以外 or 歩は1箇所でも打てれば真)
      for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
        if (st.board[r][c]) continue;
        if (deadEnd(type, side, r)) continue;
        if (type === "FU") {
          let nifu = false;
          for (let rr = 0; rr < 9; rr++) {
            const p = st.board[rr][c];
            if (p && p.owner === side && p.type === "FU" && !p.promoted) { nifu = true; break; }
          }
          if (nifu) continue;
        }
        const b2 = cloneBoard(st.board);
        b2[r][c] = { type, owner: side, promoted: false };
        if (!isInCheck(b2, side)) return true;
      }
    }
  }
  return false;
}

/* ========== 着手の実行 ========== */

function pushHistory() {
  history.push(JSON.stringify(state));
  if (history.length > 512) history.shift();
}

function notation(side, r, c, kanji, suffix) {
  const mark = side === SENTE ? "▲" : "△";
  return `${mark}${9 - c}${RANK_KANJI[r]}${kanji}${suffix || ""}`;
}

function pieceKanji(p) {
  if (p.promoted) return PROMOTED_KANJI[p.type];
  if (p.type === "OU") return p.owner === GOTE ? KANJI.GYOKU : KANJI.OU;
  return KANJI[p.type];
}

function doBoardMove(fr, fc, tr, tc, promote) {
  pushHistory();
  const st = state;
  const piece = st.board[fr][fc];
  const captured = st.board[tr][tc];
  if (captured) {
    const hand = st.hands[piece.owner];
    hand[captured.type] = (hand[captured.type] || 0) + 1;
  }
  st.board[tr][tc] = piece;
  st.board[fr][fc] = null;
  const baseKanji = pieceKanji(piece); // 成る前の表記(例: 角)
  if (promote) piece.promoted = true;
  st.moveCount++;
  st.log.push(notation(piece.owner, tr, tc, baseKanji, promote ? "成" : ""));
  st.lastMove = { r: tr, c: tc };
  endTurn();
}

function doDrop(type, r, c) {
  pushHistory();
  const st = state;
  st.hands[st.turn][type]--;
  if (st.hands[st.turn][type] === 0) delete st.hands[st.turn][type];
  st.board[r][c] = { type, owner: st.turn, promoted: false };
  st.moveCount++;
  st.log.push(notation(st.turn, r, c, KANJI[type], "打"));
  st.lastMove = { r, c };
  endTurn();
}

function endTurn() {
  const st = state;
  st.turn = opponent(st.turn);
  selected = null;
  legalTargets = [];
  save();
  render();
  // 詰み・手詰まり判定
  if (!hasAnyLegalMove(st)) {
    gameOver = true;
    const winner = opponent(st.turn) === SENTE ? "先手" : "後手";
    const reason = isInCheck(st.board, st.turn) ? "詰み" : "手詰まり";
    setTimeout(() => showResult(`${reason}!`, `${winner}の勝ちです`), 250);
  }
}

/* ========== 永続化 ========== */

const STORAGE_KEY = "shogi-app-state-v1";

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* private mode等 */ }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

/* ========== UI ========== */

const $ = (sel) => document.querySelector(sel);

function render() {
  renderBoard();
  renderHands();
  renderStatus();
  renderLog();
}

function renderBoard() {
  const boardEl = $("#board");
  boardEl.innerHTML = "";
  const st = state;
  const inCheckNow = isInCheck(st.board, st.turn);
  const kingPos = inCheckNow ? findKing(st.board, st.turn) : null;

  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.r = r;
    cell.dataset.c = c;
    const p = st.board[r][c];
    if (p) {
      const el = document.createElement("div");
      el.className = "piece " + (p.owner === GOTE ? "gote" : "sente") + (p.promoted ? " promoted" : "");
      el.innerHTML = `<span>${pieceKanji(p)}</span>`;
      cell.appendChild(el);
    }
    if (selected && selected.kind === "board" && selected.r === r && selected.c === c) {
      cell.classList.add("selected");
    }
    if (legalTargets.some(([tr, tc]) => tr === r && tc === c)) {
      cell.classList.add("movable");
    }
    if (st.lastMove && st.lastMove.r === r && st.lastMove.c === c) {
      cell.classList.add("last-move");
    }
    if (kingPos && kingPos[0] === r && kingPos[1] === c) {
      cell.classList.add("in-check");
    }
    cell.addEventListener("click", () => onCellTap(r, c));
    boardEl.appendChild(cell);
  }
}

function renderHands() {
  for (const side of [SENTE, GOTE]) {
    const el = $(side === SENTE ? "#hand-sente" : "#hand-gote");
    el.innerHTML = "";
    for (const type of HAND_ORDER) {
      const n = state.hands[side][type];
      if (!n) continue;
      const hp = document.createElement("div");
      hp.className = "hand-piece" + (side === GOTE ? " gote" : "");
      if (selected && selected.kind === "hand" && selected.side === side && selected.type === type) {
        hp.classList.add("selected");
      }
      hp.innerHTML = `<span class="hp-kanji">${KANJI[type]}</span>` +
        (n > 1 ? `<span class="hp-count">${n}</span>` : "");
      hp.addEventListener("click", () => onHandTap(side, type));
      el.appendChild(hp);
    }
  }
}

function renderStatus() {
  const st = state;
  const turnName = st.turn === SENTE ? "▲ 先手の番" : "△ 後手の番";
  const check = isInCheck(st.board, st.turn) ? " 【王手!】" : "";
  $("#turn-banner").textContent = gameOver ? "対局終了" : `${turnName}${check}`;
  $("#turn-banner").classList.toggle("check", !!check && !gameOver);
  $("#move-count").textContent = st.moveCount > 0 ? `${st.moveCount}手目まで` : "対局開始";
}

function renderLog() {
  const el = $("#kifu-log");
  el.textContent = state.log.length ? state.log.join("  ") : "(棋譜はここに表示されます)";
  el.scrollLeft = el.scrollWidth;
}

/* ---- 操作 ---- */

function onCellTap(r, c) {
  if (gameOver) return;
  const st = state;
  const p = st.board[r][c];

  // 移動先として選択中?
  if (legalTargets.some(([tr, tc]) => tr === r && tc === c)) {
    if (selected.kind === "board") {
      const piece = st.board[selected.r][selected.c];
      const canPromote = PROMOTABLE.has(piece.type) && !piece.promoted &&
        (inPromoZone(piece.owner, r) || inPromoZone(piece.owner, selected.r));
      if (canPromote) {
        if (deadEnd(piece.type, piece.owner, r)) {
          doBoardMove(selected.r, selected.c, r, c, true); // 強制成り
        } else {
          askPromotion(() => doBoardMove(selected.r, selected.c, r, c, true),
                       () => doBoardMove(selected.r, selected.c, r, c, false));
        }
      } else {
        doBoardMove(selected.r, selected.c, r, c, false);
      }
    } else if (selected.kind === "hand") {
      doDrop(selected.type, r, c);
    }
    return;
  }

  // 自分の駒を選択
  if (p && p.owner === st.turn) {
    selected = { kind: "board", r, c };
    legalTargets = legalBoardMoves(st, r, c);
    render();
    return;
  }

  // 選択解除
  selected = null;
  legalTargets = [];
  render();
}

function onHandTap(side, type) {
  if (gameOver || side !== state.turn) return;
  if (selected && selected.kind === "hand" && selected.type === type) {
    selected = null; legalTargets = [];
  } else {
    selected = { kind: "hand", side, type };
    legalTargets = legalDrops(state, type);
  }
  render();
}

/* ---- ダイアログ ---- */

function askPromotion(onYes, onNo) {
  const overlay = $("#promo-overlay");
  overlay.classList.remove("hidden");
  $("#promo-yes").onclick = () => { overlay.classList.add("hidden"); onYes(); };
  $("#promo-no").onclick = () => { overlay.classList.add("hidden"); onNo(); };
}

function showResult(title, message) {
  $("#result-title").textContent = title;
  $("#result-message").textContent = message;
  $("#result-overlay").classList.remove("hidden");
}

/* ---- ボタン ---- */

function setupButtons() {
  $("#btn-undo").addEventListener("click", () => {
    if (history.length === 0) return;
    state = JSON.parse(history.pop());
    gameOver = false;
    selected = null; legalTargets = [];
    save();
    render();
  });
  $("#btn-resign").addEventListener("click", () => {
    if (gameOver) return;
    if (!confirm("投了しますか?")) return;
    gameOver = true;
    const winner = opponent(state.turn) === SENTE ? "先手" : "後手";
    showResult("投了", `${winner}の勝ちです`);
  });
  $("#btn-new").addEventListener("click", () => {
    if (state.moveCount > 0 && !gameOver) {
      if (!confirm("対局中です。新しい対局を始めますか?")) return;
    }
    startNewGame();
  });
  $("#result-new").addEventListener("click", () => {
    $("#result-overlay").classList.add("hidden");
    startNewGame();
  });
  $("#result-close").addEventListener("click", () => {
    $("#result-overlay").classList.add("hidden");
  });
}

function startNewGame() {
  state = initialState();
  history = [];
  selected = null; legalTargets = [];
  gameOver = false;
  save();
  render();
}

/* ========== 起動 ========== */

window.addEventListener("DOMContentLoaded", () => {
  state = load() || initialState();
  setupButtons();
  render();
});
