import {
  ATTACK,
  DEFENSE,
  applyMove,
  generateLegalMoves,
  isInCheck,
  isMate,
} from "./game-core.mjs";
import { PUZZLES, puzzleState } from "./puzzles.mjs";

const STORAGE_KEY = "tsume-shogi-preferences-v1";
const RANKS_JA = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
const HAND_ORDER = ["R", "B", "G", "S", "N", "L", "P"];

const I18N = {
  ja: {
    brandTagline: "一手ずつ、読めるようになる。",
    settings: "設定",
    defender: "玉方",
    escapeGoal: "すべての逃げ道をふさぐ",
    yourTurn: "あなたの手番",
    yourPieces: "持ち駒",
    tapPiece: "駒を選び、盤に置きます",
    findMate: "詰みを見つけよう",
    startHint: "盤上の駒か持ち駒をタップしてください。",
    reset: "やり直す",
    hint: "ヒント",
    next: "次の問題",
    pieceGuide: "駒の名前と動きを見る",
    language: "言語",
    languageNote: "翻訳データを追加するだけで、対応言語を増やせる設計です。",
    pieceStyle: "駒の表示",
    kanji: "漢字",
    latin: "ローマ字",
    hybrid: "併記",
    appearance: "盤面の雰囲気",
    traditional: "伝統",
    modern: "モダン",
    night: "夜",
    offlineReady: "オフライン対応",
    offlineCopy: "ホーム画面に追加すると、通信のない場所でも練習できます。",
    collection: "COLLECTION",
    choosePuzzle: "問題を選ぶ",
    learn: "LEARN",
    guideIntro: "▲が駒の向いている方向です。最初は名前より、動ける形を覚えれば大丈夫。",
    officialRules: "日本将棋連盟の公式ルールを見る",
    promoteQuestion: "成りますか？",
    promoteCopy: "成ると駒の動きが変わります。",
    doNotPromote: "成らない",
    promote: "成る",
    mateInOne: "1手詰め",
    beginner: "入門",
    chooseDestination: "行き先を選んでください",
    chooseDestinationCopy: "光っているマスへ動かせます。",
    chooseDrop: "打つ場所を選んでください",
    chooseDropCopy: "光っている空きマスに駒を置けます。",
    noLegalMove: "この駒は今は動かせません。",
    notMate: "もう一度読んでみよう",
    notCheckCopy: "その手では王手になっていません。玉に利いているか確認しましょう。",
    escapeCopy: "王手ですが、玉方に逃げ道か受ける手が残っています。",
    solved: "正解・詰みです！",
    hintTitle: "小さなヒント",
    hintTargetTitle: "置く場所も見てみよう",
    resetDone: "最初の局面に戻しました。",
    completed: "クリア済み",
    open: "未挑戦",
    emptyHand: "持ち駒はありません",
    boardLabel: "9×9の将棋盤",
    selectedPiece: "選択中",
    puzzleLabel: "問題",
  },
  en: {
    brandTagline: "Learn to see mate, one move at a time.",
    settings: "Settings",
    defender: "Defender",
    escapeGoal: "Cover every escape square",
    yourTurn: "Your move",
    yourPieces: "Pieces in hand",
    tapPiece: "Choose a piece, then place it",
    findMate: "Find checkmate",
    startHint: "Tap a piece on the board or in your hand.",
    reset: "Reset",
    hint: "Hint",
    next: "Next puzzle",
    pieceGuide: "Learn the pieces and their moves",
    language: "Language",
    languageNote: "The translation registry is ready for more languages later.",
    pieceStyle: "Piece labels",
    kanji: "Kanji",
    latin: "Letters",
    hybrid: "Both",
    appearance: "Board style",
    traditional: "Traditional",
    modern: "Modern",
    night: "Night",
    offlineReady: "Works offline",
    offlineCopy: "Add it to your Home Screen to practise without a connection.",
    collection: "COLLECTION",
    choosePuzzle: "Choose a puzzle",
    learn: "LEARN",
    guideIntro: "▲ shows the direction each piece faces. Learn the movement shape first; the names can follow.",
    officialRules: "Read the official Japan Shogi Association rules",
    promoteQuestion: "Promote this piece?",
    promoteCopy: "Promotion changes how the piece moves.",
    doNotPromote: "Do not promote",
    promote: "Promote",
    mateInOne: "Mate in 1",
    beginner: "Beginner",
    chooseDestination: "Choose a destination",
    chooseDestinationCopy: "You can move to a highlighted square.",
    chooseDrop: "Choose where to drop it",
    chooseDropCopy: "Place the piece on a highlighted empty square.",
    noLegalMove: "That piece has no legal move here.",
    notMate: "Read the position once more",
    notCheckCopy: "That move is not check. See whether the piece attacks the king.",
    escapeCopy: "It is check, but the defender can still escape or answer it.",
    solved: "Correct — checkmate!",
    hintTitle: "A small hint",
    hintTargetTitle: "Now look at the destination",
    resetDone: "The starting position has been restored.",
    completed: "Completed",
    open: "Not tried",
    emptyHand: "No pieces in hand",
    boardLabel: "9 by 9 shogi board",
    selectedPiece: "Selected",
    puzzleLabel: "Puzzle",
  },
};

const PIECES = {
  K: { kanjiAttack: "王", kanjiDefense: "玉", latin: "K", ja: "玉・王", en: "King", moveJa: "前後・左右・斜めへ1マス。取られない場所へ動きます。", moveEn: "One square in any direction, but never into attack." },
  R: { kanji: "飛", promoted: "竜", latin: "R", ja: "飛車", en: "Rook", moveJa: "縦・横へ、途中に駒がない限り何マスでも。", moveEn: "Any distance vertically or horizontally, without jumping." },
  B: { kanji: "角", promoted: "馬", latin: "B", ja: "角行", en: "Bishop", moveJa: "斜めへ、途中に駒がない限り何マスでも。", moveEn: "Any distance diagonally, without jumping." },
  G: { kanji: "金", latin: "G", ja: "金将", en: "Gold", moveJa: "前3方向・横・真後ろへ1マス。詰みの主役です。", moveEn: "One square forward, sideways, or straight back. A key mating piece." },
  S: { kanji: "銀", promoted: "全", latin: "S", ja: "銀将", en: "Silver", moveJa: "前と斜め4方向へ1マス。横と真後ろには進めません。", moveEn: "One square forward or diagonally; not sideways or straight back." },
  N: { kanji: "桂", promoted: "圭", latin: "N", ja: "桂馬", en: "Knight", moveJa: "前へ2、横へ1。ほかの駒を飛び越えます。", moveEn: "Two forward and one sideways. It jumps over other pieces." },
  L: { kanji: "香", promoted: "杏", latin: "L", ja: "香車", en: "Lance", moveJa: "前へ、途中に駒がない限り何マスでも。", moveEn: "Any distance straight forward, without jumping." },
  P: { kanji: "歩", promoted: "と", latin: "P", ja: "歩兵", en: "Pawn", moveJa: "前へ1マス。持ち駒から打つときは二歩に注意。", moveEn: "One square forward. A dropped pawn cannot create two pawns on one file." },
};

const $ = (selector) => document.querySelector(selector);

let preferences = loadPreferences();
let currentIndex = Math.min(preferences.currentPuzzle || 0, PUZZLES.length - 1);
let state = puzzleState(PUZZLES[currentIndex]);
let legalMoves = generateLegalMoves(state, ATTACK);
let selected = null;
let selectedMoves = [];
let pendingPromotionMoves = [];
let feedbackMode = "start";
let hintStage = 0;
let locked = false;
let toastTimer = null;

function loadPreferences() {
  const fallbackLanguage = navigator.language?.toLowerCase().startsWith("ja") ? "ja" : "en";
  const fallback = { language: fallbackLanguage, theme: "washi", pieceStyle: "hybrid", completed: [], currentPuzzle: 0 };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return saved ? { ...fallback, ...saved } : fallback;
  } catch {
    return fallback;
  }
}

function savePreferences() {
  preferences.currentPuzzle = currentIndex;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); } catch { /* Local storage can be unavailable. */ }
}

function t(key) {
  return I18N[preferences.language]?.[key] || I18N.en[key] || key;
}

function localText(value) {
  return value?.[preferences.language] || value?.en || value?.ja || "";
}

function applyPreferences() {
  document.documentElement.lang = preferences.language;
  document.documentElement.dataset.theme = preferences.theme;
  document.documentElement.dataset.pieceStyle = preferences.pieceStyle;
  const themeColors = { washi: "#173f36", paper: "#e8edf0", night: "#101421" };
  document.querySelector('meta[name="theme-color"]').content = themeColors[preferences.theme];

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });

  updateOptionState("#language-options", preferences.language);
  updateOptionState("#piece-style-options", preferences.pieceStyle);
  updateOptionState("#theme-options", preferences.theme);
  $("#board").setAttribute("aria-label", t("boardLabel"));
}

function updateOptionState(selector, value) {
  document.querySelectorAll(`${selector} [data-value]`).forEach((button) => {
    const active = button.dataset.value === value;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function pieceDisplay(item) {
  const info = PIECES[item.type];
  const kanji = item.type === "K"
    ? (item.side === ATTACK ? info.kanjiAttack : info.kanjiDefense)
    : (item.promoted ? info.promoted : info.kanji);
  const latin = `${item.promoted ? "+" : ""}${info.latin}`;
  if (preferences.pieceStyle === "latin") return { main: latin, sub: "" };
  if (preferences.pieceStyle === "kanji") return { main: kanji, sub: "" };
  return { main: kanji, sub: latin };
}

function pieceName(item) {
  const info = PIECES[item.type];
  const base = preferences.language === "ja" ? info.ja : info.en;
  if (!item.promoted) return base;
  return preferences.language === "ja" ? `成${base}` : `Promoted ${base}`;
}

function createPieceElement(item) {
  const display = pieceDisplay(item);
  const element = document.createElement("span");
  element.className = `piece ${item.side}${item.promoted ? " promoted" : ""}`;
  const main = document.createElement("span");
  main.className = "piece-main";
  main.textContent = display.main;
  element.appendChild(main);
  if (display.sub) {
    const sub = document.createElement("small");
    sub.className = "piece-sub";
    sub.textContent = display.sub;
    element.appendChild(sub);
  }
  return element;
}

function renderCoordinates() {
  const fileLabels = $("#file-labels");
  const rankLabels = $("#rank-labels");
  fileLabels.replaceChildren();
  rankLabels.replaceChildren();
  for (let col = 0; col < 9; col += 1) {
    const span = document.createElement("span");
    span.textContent = String(9 - col);
    fileLabels.appendChild(span);
  }
  for (let row = 0; row < 9; row += 1) {
    const span = document.createElement("span");
    span.textContent = preferences.language === "ja" ? RANKS_JA[row] : String.fromCharCode(97 + row);
    rankLabels.appendChild(span);
  }
}

function coordinateName(row, col) {
  return preferences.language === "ja" ? `${9 - col}${RANKS_JA[row]}` : `${9 - col}${String.fromCharCode(97 + row)}`;
}

function renderBoard() {
  const board = $("#board");
  const puzzle = PUZZLES[currentIndex];
  board.replaceChildren();

  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.setAttribute("role", "gridcell");
      const item = state.board[row][col];
      const moveTargets = selectedMoves.filter((move) => move.toRow === row && move.toCol === col);
      const isSelected = selected?.kind === "board" && selected.row === row && selected.col === col;
      const hintOrigin = hintStage >= 1 && !puzzle.hintHand && puzzle.hintSquare?.[0] === row && puzzle.hintSquare?.[1] === col;
      const hintTarget = hintStage >= 2 && (puzzle.hintTarget || puzzle.hintSquare)?.[0] === row && (puzzle.hintTarget || puzzle.hintSquare)?.[1] === col;

      cell.classList.toggle("selected", isSelected);
      cell.classList.toggle("target", moveTargets.length > 0);
      cell.classList.toggle("capture", moveTargets.length > 0 && Boolean(item));
      cell.classList.toggle("hint-square", Boolean(hintOrigin || hintTarget));
      cell.disabled = locked;

      if (item) cell.appendChild(createPieceElement(item));
      const aria = [coordinateName(row, col), item ? pieceName(item) : ""].filter(Boolean).join(" ");
      cell.setAttribute("aria-label", `${aria}${isSelected ? `, ${t("selectedPiece")}` : ""}`);
      cell.addEventListener("click", () => onCellTap(row, col));
      board.appendChild(cell);
    }
  }
}

function renderHand() {
  const hand = $("#attacker-hand");
  const puzzle = PUZZLES[currentIndex];
  hand.replaceChildren();
  let hasPiece = false;

  for (const type of HAND_ORDER) {
    const count = state.hands[ATTACK][type] || 0;
    if (!count) continue;
    hasPiece = true;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hand-piece";
    button.classList.toggle("selected", selected?.kind === "hand" && selected.type === type);
    button.classList.toggle("hinted", hintStage >= 1 && puzzle.hintHand === type);
    button.disabled = locked;
    const item = { type, side: ATTACK, promoted: false };
    button.appendChild(createPieceElement(item));
    if (count > 1) {
      const badge = document.createElement("span");
      badge.className = "piece-count";
      badge.textContent = String(count);
      button.appendChild(badge);
    }
    button.setAttribute("aria-label", `${pieceName(item)} × ${count}`);
    button.addEventListener("click", () => selectHandPiece(type));
    hand.appendChild(button);
  }

  if (!hasPiece) {
    const empty = document.createElement("span");
    empty.className = "hand-empty";
    empty.textContent = t("emptyHand");
    hand.appendChild(empty);
  }
}

function renderMission() {
  const puzzle = PUZZLES[currentIndex];
  $("#puzzle-level").textContent = t("mateInOne");
  $("#puzzle-progress").textContent = `${currentIndex + 1} / ${PUZZLES.length}`;
  $("#puzzle-title").textContent = localText(puzzle.title);
  $("#puzzle-prompt").textContent = localText(puzzle.prompt);
}

function renderFeedback() {
  const container = $("#feedback");
  const mark = $("#feedback-mark");
  const title = $("#feedback-title");
  const message = $("#feedback-message");
  const puzzle = PUZZLES[currentIndex];
  container.classList.remove("success", "try-again");

  if (feedbackMode === "success") {
    container.classList.add("success");
    mark.textContent = "✓";
    title.textContent = t("solved");
    message.textContent = localText(puzzle.success);
  } else if (feedbackMode === "not-check") {
    container.classList.add("try-again");
    mark.textContent = "↺";
    title.textContent = t("notMate");
    message.textContent = t("notCheckCopy");
  } else if (feedbackMode === "escape") {
    container.classList.add("try-again");
    mark.textContent = "↺";
    title.textContent = t("notMate");
    message.textContent = t("escapeCopy");
  } else if (feedbackMode === "hint") {
    mark.textContent = "?";
    title.textContent = hintStage >= 2 ? t("hintTargetTitle") : t("hintTitle");
    message.textContent = localText(puzzle.hint);
  } else if (feedbackMode === "destination") {
    mark.textContent = "→";
    title.textContent = selected?.kind === "hand" ? t("chooseDrop") : t("chooseDestination");
    message.textContent = selected?.kind === "hand" ? t("chooseDropCopy") : t("chooseDestinationCopy");
  } else {
    mark.textContent = "○";
    title.textContent = t("findMate");
    message.textContent = t("startHint");
  }
}

function renderPuzzleList() {
  const list = $("#puzzle-list");
  list.replaceChildren();
  PUZZLES.forEach((puzzle, index) => {
    const complete = preferences.completed.includes(puzzle.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "puzzle-list-item";
    button.classList.toggle("current", index === currentIndex);

    const number = document.createElement("span");
    number.className = "puzzle-number";
    number.textContent = String(index + 1);
    const copy = document.createElement("span");
    copy.className = "puzzle-list-copy";
    const title = document.createElement("strong");
    title.textContent = localText(puzzle.title);
    const status = document.createElement("small");
    status.textContent = `${t("mateInOne")} · ${complete ? t("completed") : t("open")}`;
    copy.append(title, status);
    const check = document.createElement("span");
    check.className = "puzzle-check";
    check.textContent = complete ? "✓" : "";
    button.append(number, copy, check);
    button.addEventListener("click", () => {
      loadPuzzle(index);
      closeSheets();
    });
    list.appendChild(button);
  });
}

function renderPieceGuide() {
  const guide = $("#piece-guide");
  guide.replaceChildren();
  ["K", ...HAND_ORDER].forEach((type) => {
    const info = PIECES[type];
    const card = document.createElement("article");
    card.className = "guide-card";
    const top = document.createElement("div");
    top.className = "guide-card-top";
    const icon = document.createElement("span");
    icon.className = "guide-piece";
    icon.textContent = type === "K" ? info.kanjiDefense : info.kanji;
    const heading = document.createElement("h3");
    heading.textContent = preferences.language === "ja" ? info.ja : info.en;
    const small = document.createElement("small");
    small.textContent = `${info.latin} · ▲`;
    heading.appendChild(small);
    top.append(icon, heading);
    const description = document.createElement("p");
    description.textContent = preferences.language === "ja" ? info.moveJa : info.moveEn;
    card.append(top, description);
    guide.appendChild(card);
  });
}

function renderAll() {
  applyPreferences();
  renderCoordinates();
  renderMission();
  renderBoard();
  renderHand();
  renderFeedback();
  renderPuzzleList();
  renderPieceGuide();
  $("#next-button").disabled = feedbackMode !== "success";
}

function selectBoardPiece(row, col) {
  const item = state.board[row][col];
  if (!item || item.side !== ATTACK || locked) return;
  const moves = legalMoves.filter((move) => move.kind === "board" && move.fromRow === row && move.fromCol === col);
  if (!moves.length) {
    showToast(t("noLegalMove"));
    return;
  }
  selected = { kind: "board", row, col };
  selectedMoves = moves;
  feedbackMode = "destination";
  renderBoard();
  renderFeedback();
}

function selectHandPiece(type) {
  if (locked) return;
  const moves = legalMoves.filter((move) => move.kind === "drop" && move.type === type);
  if (!moves.length) {
    showToast(t("noLegalMove"));
    return;
  }
  selected = { kind: "hand", type };
  selectedMoves = moves;
  feedbackMode = "destination";
  renderBoard();
  renderHand();
  renderFeedback();
}

function onCellTap(row, col) {
  if (locked) return;
  const variants = selectedMoves.filter((move) => move.toRow === row && move.toCol === col);
  if (variants.length) {
    chooseMoveVariant(variants);
    return;
  }
  const item = state.board[row][col];
  if (item?.side === ATTACK) selectBoardPiece(row, col);
}

function chooseMoveVariant(variants) {
  const promoted = variants.find((move) => move.promote);
  const unpromoted = variants.find((move) => !move.promote);
  if (promoted && unpromoted) {
    pendingPromotionMoves = variants;
    openModal("#promotion-layer");
    return;
  }
  commitMove(variants[0]);
}

function commitMove(move) {
  closeModal("#promotion-layer");
  pendingPromotionMoves = [];
  state = applyMove(state, move);
  selected = null;
  selectedMoves = [];
  hintStage = 0;
  locked = true;

  if (isMate(state, DEFENSE)) {
    feedbackMode = "success";
    const id = PUZZLES[currentIndex].id;
    if (!preferences.completed.includes(id)) preferences.completed.push(id);
    savePreferences();
  } else {
    feedbackMode = isInCheck(state, DEFENSE) ? "escape" : "not-check";
  }
  renderAll();
}

function resetPuzzle(showMessage = true) {
  state = puzzleState(PUZZLES[currentIndex]);
  legalMoves = generateLegalMoves(state, ATTACK);
  selected = null;
  selectedMoves = [];
  pendingPromotionMoves = [];
  feedbackMode = "start";
  hintStage = 0;
  locked = false;
  closeModal("#promotion-layer");
  renderAll();
  if (showMessage) showToast(t("resetDone"));
}

function loadPuzzle(index) {
  currentIndex = (index + PUZZLES.length) % PUZZLES.length;
  savePreferences();
  resetPuzzle(false);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showHint() {
  if (feedbackMode === "success") return;
  if (locked) resetPuzzle(false);
  hintStage = Math.min(hintStage + 1, 2);
  feedbackMode = "hint";
  selected = null;
  selectedMoves = [];
  renderBoard();
  renderHand();
  renderFeedback();
}

function openSheet(selector) {
  closeSheets();
  const layer = $(selector);
  layer.classList.remove("hidden");
  layer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  layer.querySelector(".close-button")?.focus();
}

function closeSheets() {
  document.querySelectorAll(".sheet-layer").forEach((layer) => {
    layer.classList.add("hidden");
    layer.setAttribute("aria-hidden", "true");
  });
  document.body.style.overflow = "";
}

function openModal(selector) {
  const layer = $(selector);
  layer.classList.remove("hidden");
  layer.setAttribute("aria-hidden", "false");
  $("#promote-button").focus();
}

function closeModal(selector) {
  const layer = $(selector);
  layer.classList.add("hidden");
  layer.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function bindOptionGroup(selector, preferenceKey, onChange) {
  document.querySelectorAll(`${selector} [data-value]`).forEach((button) => {
    button.addEventListener("click", () => {
      preferences[preferenceKey] = button.dataset.value;
      savePreferences();
      onChange?.();
      renderAll();
    });
  });
}

function bindEvents() {
  $("#settings-button").addEventListener("click", () => openSheet("#settings-layer"));
  $("#brand-button").addEventListener("click", () => openSheet("#puzzles-layer"));
  $("#learn-button").addEventListener("click", () => openSheet("#learn-layer"));
  $("#reset-button").addEventListener("click", () => resetPuzzle(true));
  $("#hint-button").addEventListener("click", showHint);
  $("#next-button").addEventListener("click", () => loadPuzzle(currentIndex + 1));
  document.querySelectorAll("[data-close-sheet]").forEach((button) => button.addEventListener("click", closeSheets));

  bindOptionGroup("#language-options", "language");
  bindOptionGroup("#piece-style-options", "pieceStyle");
  bindOptionGroup("#theme-options", "theme");

  $("#promote-button").addEventListener("click", () => {
    const move = pendingPromotionMoves.find((candidate) => candidate.promote);
    if (move) commitMove(move);
  });
  $("#no-promote-button").addEventListener("click", () => {
    const move = pendingPromotionMoves.find((candidate) => !candidate.promote);
    if (move) commitMove(move);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSheets();
      if (pendingPromotionMoves.length) {
        pendingPromotionMoves = [];
        closeModal("#promotion-layer");
      }
    }
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && window.isSecureContext) {
    navigator.serviceWorker.register("./sw.js").catch(() => { /* The app still works online without registration. */ });
  }
}

bindEvents();
renderAll();
registerServiceWorker();
