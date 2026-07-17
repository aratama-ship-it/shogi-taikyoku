import {
  ATTACK,
  DEFENSE,
  applyMove,
  chooseLongestDefense,
  generateLegalMoves,
  isCheckingMove,
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
    pickerSummary: "1手・3手・5手・7手・9手から選択",
    filterByMoves: "手数から問題を選べます。",
    allPuzzles: "すべて",
    comingSoon: "準備中",
    noPuzzlesYet: "この手数の問題は、これから追加します。",
    learn: "LEARN",
    guideIntro: "▲が駒の向いている方向です。最初は名前より、動ける形を覚えれば大丈夫。",
    officialRules: "日本将棋連盟の公式ルールを見る",
    promoteQuestion: "成りますか？",
    promoteCopy: "成ると駒の動きが変わります。",
    doNotPromote: "成らない",
    promote: "成る",
    mateInOne: "1手詰め",
    mateInThree: "3手詰め",
    beginner: "入門",
    chooseDestination: "行き先を選んでください",
    chooseDestinationCopy: "光っているマスへ動かせます。",
    chooseDrop: "打つ場所を選んでください",
    chooseDropCopy: "光っている空きマスに駒を置けます。",
    noLegalMove: "この駒は今は動かせません。",
    notMate: "もう一度読んでみよう",
    notCheckCopy: "その手では王手になっていません。詰将棋では、攻め方は毎手王手をかけます。",
    failedTitle: "詰みませんでした",
    failedCopy: "手数を使い切りました。最初の局面に戻って、もう一度読み直しましょう。",
    noChecksTitle: "王手が続けられません",
    noChecksCopy: "王手の連続が途切れました。「やり直す」で最初から読み直しましょう。",
    hintOffLineCopy: "いまの手順は正解の筋から外れています。「やり直す」で最初から読み直せます。",
    goodCheck: "王手です",
    goodCheckCopy: "玉方が最も長く逃げる応手を指します。",
    continueAttack: "次の王手を探そう",
    continueAttackCopy: "玉方が応手しました。攻め方は続けて王手します。",
    defenderThinking: "玉方が応手中",
    moveSequence: "ここまでの手順",
    sequenceEmpty: "正解の手順がここに並びます",
    solved: "正解・詰みです！",
    promptGeneric: "王手の連続で、玉を詰ませましょう。",
    hintThemeTitle: "手筋のテーマ",
    hintTitle: "小さなヒント",
    hintTargetTitle: "置く場所も見てみよう",
    resetDone: "最初の局面に戻しました。",
    completed: "クリア済み",
    open: "未挑戦",
    emptyHand: "持ち駒はありません",
    boardLabel: "9×9の将棋盤",
    selectedPiece: "選択中",
    puzzleLabel: "問題",
    mateInN: "{n}手詰め",
    puzzleCountOne: "{n}問",
    puzzleCountMany: "{n}問",
    dropSuffix: "打",
    promoteSuffix: "成",
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
    pickerSummary: "Choose mate in 1, 3, 5, 7, or 9",
    filterByMoves: "Choose puzzles by mate length.",
    allPuzzles: "All puzzles",
    comingSoon: "Coming soon",
    noPuzzlesYet: "Puzzles of this length will be added here.",
    learn: "LEARN",
    guideIntro: "▲ shows the direction each piece faces. Learn the movement shape first; the names can follow.",
    officialRules: "Read the official Japan Shogi Association rules",
    promoteQuestion: "Promote this piece?",
    promoteCopy: "Promotion changes how the piece moves.",
    doNotPromote: "Do not promote",
    promote: "Promote",
    mateInOne: "Mate in 1",
    mateInThree: "Mate in 3",
    beginner: "Beginner",
    chooseDestination: "Choose a destination",
    chooseDestinationCopy: "You can move to a highlighted square.",
    chooseDrop: "Choose where to drop it",
    chooseDropCopy: "Place the piece on a highlighted empty square.",
    noLegalMove: "That piece has no legal move here.",
    notMate: "Read the position once more",
    notCheckCopy: "That move is not check. In tsume shogi, every attacking move must give check.",
    failedTitle: "No checkmate",
    failedCopy: "You used all your moves without mate. Reset and read the position again.",
    noChecksTitle: "No more checks",
    noChecksCopy: "The chain of checks is broken. Reset and start reading again.",
    hintOffLineCopy: "You have left the solution line. Reset to start reading from the beginning.",
    goodCheck: "Check",
    goodCheckCopy: "The defender will now choose the longest resistance.",
    continueAttack: "Find the next check",
    continueAttackCopy: "The defender has replied. Keep checking with your next move.",
    defenderThinking: "Defender is replying",
    moveSequence: "Moves so far",
    sequenceEmpty: "The correct sequence will appear here",
    solved: "Correct — checkmate!",
    promptGeneric: "Every move must give check. Find the forced mate.",
    hintThemeTitle: "The theme",
    hintTitle: "A small hint",
    hintTargetTitle: "Now look at the destination",
    resetDone: "The starting position has been restored.",
    completed: "Completed",
    open: "Not tried",
    emptyHand: "No pieces in hand",
    boardLabel: "9 by 9 shogi board",
    selectedPiece: "Selected",
    puzzleLabel: "Puzzle",
    mateInN: "Mate in {n}",
    puzzleCountOne: "{n} puzzle",
    puzzleCountMany: "{n} puzzles",
    dropSuffix: " drop",
    promoteSuffix: "+",
  },
  fr: {
    brandTagline: "Apprendre à voir le mat, un coup à la fois.",
    settings: "Réglages",
    defender: "Défenseur",
    escapeGoal: "Fermez toutes les cases de fuite",
    yourTurn: "À vous de jouer",
    yourPieces: "Pièces en main",
    tapPiece: "Choisissez une pièce, puis placez-la",
    findMate: "Trouvez le mat",
    startHint: "Touchez une pièce sur le plateau ou en main.",
    reset: "Recommencer",
    hint: "Indice",
    next: "Problème suivant",
    pieceGuide: "Découvrir les pièces et leurs déplacements",
    language: "Langue",
    languageNote: "Il suffit d'ajouter un dictionnaire de traduction pour prendre en charge une nouvelle langue.",
    pieceStyle: "Affichage des pièces",
    kanji: "Kanji",
    latin: "Lettres",
    hybrid: "Les deux",
    appearance: "Style du plateau",
    traditional: "Traditionnel",
    modern: "Moderne",
    night: "Nuit",
    offlineReady: "Fonctionne hors ligne",
    offlineCopy: "Ajoutez l'appli à l'écran d'accueil pour vous entraîner sans connexion.",
    collection: "COLLECTION",
    choosePuzzle: "Choisir un problème",
    pickerSummary: "Mat en 1, 3, 5, 7 ou 9 coups",
    filterByMoves: "Choisissez les problèmes par longueur du mat.",
    allPuzzles: "Tous les problèmes",
    comingSoon: "Bientôt disponible",
    noPuzzlesYet: "Les problèmes de cette longueur seront ajoutés ici.",
    learn: "APPRENDRE",
    guideIntro: "▲ indique la direction de chaque pièce. Retenez d'abord la forme du déplacement ; les noms viendront ensuite.",
    officialRules: "Lire les règles officielles de la Japan Shogi Association",
    promoteQuestion: "Promouvoir cette pièce ?",
    promoteCopy: "La promotion change le déplacement de la pièce.",
    doNotPromote: "Ne pas promouvoir",
    promote: "Promouvoir",
    mateInOne: "Mat en 1 coup",
    mateInThree: "Mat en 3 coups",
    beginner: "Débutant",
    chooseDestination: "Choisissez une destination",
    chooseDestinationCopy: "Vous pouvez jouer sur une case en surbrillance.",
    chooseDrop: "Choisissez où parachuter la pièce",
    chooseDropCopy: "Posez la pièce sur une case libre en surbrillance.",
    noLegalMove: "Cette pièce n'a aucun coup légal ici.",
    notMate: "Relisez la position",
    notCheckCopy: "Ce coup ne donne pas échec. Au tsume shogi, chaque coup de l'attaquant doit donner échec.",
    failedTitle: "Pas de mat",
    failedCopy: "Tous les coups sont joués sans mat. Recommencez et relisez la position.",
    noChecksTitle: "Plus d'échec possible",
    noChecksCopy: "La suite d'échecs est rompue. Recommencez depuis le début.",
    hintOffLineCopy: "Vous avez quitté la ligne de solution. Recommencez pour reprendre du début.",
    goodCheck: "Échec au roi",
    goodCheckCopy: "Le défenseur choisira la résistance la plus longue.",
    continueAttack: "Trouvez l'échec suivant",
    continueAttackCopy: "Le défenseur a répondu. Continuez à donner échec.",
    defenderThinking: "Le défenseur répond",
    moveSequence: "Coups joués",
    sequenceEmpty: "La séquence correcte apparaîtra ici",
    solved: "Correct — échec et mat !",
    promptGeneric: "Chaque coup doit donner échec. Trouvez le mat forcé.",
    hintThemeTitle: "Le thème",
    hintTitle: "Un petit indice",
    hintTargetTitle: "Regardez maintenant la destination",
    resetDone: "La position de départ a été rétablie.",
    completed: "Terminé",
    open: "Non tenté",
    emptyHand: "Aucune pièce en main",
    boardLabel: "Plateau de shogi 9×9",
    selectedPiece: "Sélectionnée",
    puzzleLabel: "Problème",
    mateInN: "Mat en {n} coups",
    puzzleCountOne: "{n} problème",
    puzzleCountMany: "{n} problèmes",
    dropSuffix: " drop",
    promoteSuffix: "+",
  },
  es: {
    brandTagline: "Aprende a ver el mate, jugada a jugada.",
    settings: "Ajustes",
    defender: "Defensor",
    escapeGoal: "Cierra todas las casillas de escape",
    yourTurn: "Tu turno",
    yourPieces: "Piezas en mano",
    tapPiece: "Elige una pieza y colócala",
    findMate: "Encuentra el jaque mate",
    startHint: "Toca una pieza del tablero o de tu mano.",
    reset: "Reiniciar",
    hint: "Pista",
    next: "Siguiente problema",
    pieceGuide: "Conoce las piezas y sus movimientos",
    language: "Idioma",
    languageNote: "Basta con añadir un diccionario de traducción para sumar más idiomas.",
    pieceStyle: "Etiquetas de las piezas",
    kanji: "Kanji",
    latin: "Letras",
    hybrid: "Ambos",
    appearance: "Estilo del tablero",
    traditional: "Tradicional",
    modern: "Moderno",
    night: "Noche",
    offlineReady: "Funciona sin conexión",
    offlineCopy: "Añádela a tu pantalla de inicio para practicar sin conexión.",
    collection: "COLECCIÓN",
    choosePuzzle: "Elegir un problema",
    pickerSummary: "Mate en 1, 3, 5, 7 o 9",
    filterByMoves: "Elige los problemas por longitud del mate.",
    allPuzzles: "Todos los problemas",
    comingSoon: "Próximamente",
    noPuzzlesYet: "Los problemas de esta longitud se añadirán aquí.",
    learn: "APRENDER",
    guideIntro: "▲ muestra la dirección de cada pieza. Aprende primero la forma del movimiento; los nombres vendrán después.",
    officialRules: "Leer las reglas oficiales de la Asociación Japonesa de Shogi",
    promoteQuestion: "¿Promover esta pieza?",
    promoteCopy: "La promoción cambia cómo se mueve la pieza.",
    doNotPromote: "No promover",
    promote: "Promover",
    mateInOne: "Mate en 1",
    mateInThree: "Mate en 3",
    beginner: "Principiante",
    chooseDestination: "Elige una casilla de destino",
    chooseDestinationCopy: "Puedes mover a una casilla iluminada.",
    chooseDrop: "Elige dónde soltar la pieza",
    chooseDropCopy: "Coloca la pieza en una casilla libre iluminada.",
    noLegalMove: "Esa pieza no tiene jugadas legales ahora.",
    notMate: "Lee la posición otra vez",
    notCheckCopy: "Esa jugada no da jaque. En el tsume shogi, cada jugada del atacante debe dar jaque.",
    failedTitle: "Sin jaque mate",
    failedCopy: "Usaste todas las jugadas sin dar mate. Reinicia y vuelve a leer la posición.",
    noChecksTitle: "No hay más jaques",
    noChecksCopy: "La cadena de jaques se rompió. Reinicia y empieza de nuevo.",
    hintOffLineCopy: "Has salido de la línea de solución. Reinicia para leer desde el principio.",
    goodCheck: "Jaque",
    goodCheckCopy: "El defensor elegirá la resistencia más larga.",
    continueAttack: "Busca el siguiente jaque",
    continueAttackCopy: "El defensor ha respondido. Sigue dando jaque.",
    defenderThinking: "El defensor está respondiendo",
    moveSequence: "Jugadas hasta ahora",
    sequenceEmpty: "La secuencia correcta aparecerá aquí",
    solved: "¡Correcto: jaque mate!",
    promptGeneric: "Cada jugada debe dar jaque. Encuentra el mate forzado.",
    hintThemeTitle: "El tema",
    hintTitle: "Una pequeña pista",
    hintTargetTitle: "Mira ahora la casilla de destino",
    resetDone: "Se restauró la posición inicial.",
    completed: "Completado",
    open: "Sin intentar",
    emptyHand: "No hay piezas en mano",
    boardLabel: "Tablero de shogi de 9×9",
    selectedPiece: "Seleccionada",
    puzzleLabel: "Problema",
    mateInN: "Mate en {n}",
    puzzleCountOne: "{n} problema",
    puzzleCountMany: "{n} problemas",
    dropSuffix: " drop",
    promoteSuffix: "+",
  },
};

const PIECES = {
  K: {
    kanjiAttack: "王", kanjiDefense: "玉", latin: "K",
    ja: "玉・王", en: "King", fr: "Roi", es: "Rey",
    moveJa: "前後・左右・斜めへ1マス。取られない場所へ動きます。",
    moveEn: "One square in any direction, but never into attack.",
    moveFr: "Une case dans toutes les directions, jamais sur une case attaquée.",
    moveEs: "Una casilla en cualquier dirección, nunca hacia una casilla atacada.",
  },
  R: {
    kanji: "飛", promoted: "竜", latin: "R",
    ja: "飛車", en: "Rook", fr: "Tour", es: "Torre",
    promotedFr: "Dragon", promotedEs: "Dragón",
    moveJa: "縦・横へ、途中に駒がない限り何マスでも。",
    moveEn: "Any distance vertically or horizontally, without jumping.",
    moveFr: "En vertical ou horizontal, sur toute distance, sans sauter.",
    moveEs: "En vertical u horizontal, cualquier distancia, sin saltar.",
  },
  B: {
    kanji: "角", promoted: "馬", latin: "B",
    ja: "角行", en: "Bishop", fr: "Fou", es: "Alfil",
    promotedFr: "Cheval dragon", promotedEs: "Caballo dragón",
    moveJa: "斜めへ、途中に駒がない限り何マスでも。",
    moveEn: "Any distance diagonally, without jumping.",
    moveFr: "En diagonale, sur toute distance, sans sauter.",
    moveEs: "En diagonal, cualquier distancia, sin saltar.",
  },
  G: {
    kanji: "金", latin: "G",
    ja: "金将", en: "Gold", fr: "Or", es: "Oro",
    moveJa: "前3方向・横・真後ろへ1マス。詰みの主役です。",
    moveEn: "One square forward, sideways, or straight back. A key mating piece.",
    moveFr: "Une case vers l'avant (3 directions), sur les côtés ou droit derrière. Pièce clé du mat.",
    moveEs: "Una casilla al frente (3 direcciones), a los lados o directamente atrás. Pieza clave del mate.",
  },
  S: {
    kanji: "銀", promoted: "全", latin: "S",
    ja: "銀将", en: "Silver", fr: "Argent", es: "Plata",
    promotedFr: "Argent promu", promotedEs: "Plata promovida",
    moveJa: "前と斜め4方向へ1マス。横と真後ろには進めません。",
    moveEn: "One square forward or diagonally; not sideways or straight back.",
    moveFr: "Une case vers l'avant ou en diagonale ; ni de côté ni droit derrière.",
    moveEs: "Una casilla al frente o en diagonal; ni de lado ni directamente atrás.",
  },
  N: {
    kanji: "桂", promoted: "圭", latin: "N",
    ja: "桂馬", en: "Knight", fr: "Cavalier", es: "Caballo",
    promotedFr: "Cavalier promu", promotedEs: "Caballo promovido",
    moveJa: "前へ2、横へ1。ほかの駒を飛び越えます。",
    moveEn: "Two forward and one sideways. It jumps over other pieces.",
    moveFr: "Deux cases vers l'avant et une de côté, en sautant par-dessus les pièces.",
    moveEs: "Dos casillas al frente y una al lado, saltando sobre otras piezas.",
  },
  L: {
    kanji: "香", promoted: "杏", latin: "L",
    ja: "香車", en: "Lance", fr: "Lance", es: "Lanza",
    promotedFr: "Lance promue", promotedEs: "Lanza promovida",
    moveJa: "前へ、途中に駒がない限り何マスでも。",
    moveEn: "Any distance straight forward, without jumping.",
    moveFr: "Droit devant, sur toute distance, sans sauter.",
    moveEs: "Recto hacia delante, cualquier distancia, sin saltar.",
  },
  P: {
    kanji: "歩", promoted: "と", latin: "P",
    ja: "歩兵", en: "Pawn", fr: "Pion", es: "Peón",
    promotedFr: "Tokin (pion promu)", promotedEs: "Tokin (peón promovido)",
    moveJa: "前へ1マス。持ち駒から打つときは二歩に注意。",
    moveEn: "One square forward. A dropped pawn cannot create two pawns on one file.",
    moveFr: "Une case vers l'avant. Un pion parachuté ne peut pas doubler un pion sur la même colonne.",
    moveEs: "Una casilla al frente. Un peón lanzado no puede crear dos peones en la misma columna.",
  },
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
let defenseTimer = null;
let playedPlies = 0;
let attackerStep = 0;
let onVerifiedLine = true;
let moveHistory = [];
let puzzleFilter = "all";

function loadPreferences() {
  const prefix = (navigator.language || "").toLowerCase().slice(0, 2);
  const fallbackLanguage = ["ja", "fr", "es"].includes(prefix) ? prefix : "en";
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

function mateLabel(puzzle) {
  if (puzzle.plies === 1) return t("mateInOne");
  if (puzzle.plies === 3) return t("mateInThree");
  return t("mateInN").replace("{n}", puzzle.plies);
}

function puzzleCountLabel(count) {
  return t(count === 1 ? "puzzleCountOne" : "puzzleCountMany").replace("{n}", count);
}

function filteredPuzzleEntries() {
  return PUZZLES
    .map((puzzle, index) => ({ puzzle, index }))
    .filter(({ puzzle }) => puzzleFilter === "all" || puzzle.plies === Number(puzzleFilter));
}

function currentHint() {
  const puzzle = PUZZLES[currentIndex];
  if (puzzle.hints) return puzzle.hints[attackerStep];
  return {
    ja: puzzle.hint?.ja,
    en: puzzle.hint?.en,
    hand: puzzle.hintHand,
    origin: puzzle.hintHand ? null : puzzle.hintSquare,
    target: puzzle.hintTarget || puzzle.hintSquare,
  };
}

function matchesPlannedMove(move, plan) {
  if (!plan || move.toRow !== plan.target[0] || move.toCol !== plan.target[1]) return false;
  if (plan.hand) return move.kind === "drop" && move.type === plan.hand;
  return move.kind === "board"
    && move.fromRow === plan.origin[0]
    && move.fromCol === plan.origin[1];
}

function moveWithType(position, move) {
  const type = move.kind === "drop" ? move.type : position.board[move.fromRow][move.fromCol]?.type;
  return { ...move, type };
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

function pieceInfoName(info) {
  return info[preferences.language] || info.en;
}

function pieceMoveText(info) {
  const key = { ja: "moveJa", en: "moveEn", fr: "moveFr", es: "moveEs" }[preferences.language];
  return info[key] || info.moveEn;
}

function pieceName(item) {
  const info = PIECES[item.type];
  const base = pieceInfoName(info);
  if (!item.promoted) return base;
  if (preferences.language === "ja") return `成${base}`;
  if (preferences.language === "fr") return info.promotedFr || `${base} promu`;
  if (preferences.language === "es") return info.promotedEs || `${base} promovida`;
  return `Promoted ${base}`;
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
  const hint = currentHint();
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
      const hintOrigin = hintStage >= 2 && hint?.origin?.[0] === row && hint?.origin?.[1] === col;
      const hintTarget = hintStage >= 3 && hint?.target?.[0] === row && hint?.target?.[1] === col;

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
  const hint = currentHint();
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
    button.classList.toggle("hinted", hintStage >= 2 && hint?.hand === type);
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
  const filtered = filteredPuzzleEntries();
  const filteredPosition = filtered.findIndex(({ index }) => index === currentIndex);
  $("#puzzle-level").textContent = mateLabel(puzzle);
  $("#puzzle-progress").textContent = filteredPosition >= 0
    ? `${filteredPosition + 1} / ${filtered.length}`
    : `${currentIndex + 1} / ${PUZZLES.length}`;
  // 題名は答えに直結するため表示しない。番号のみ示し、題名はヒント第1段階で使う。
  $("#puzzle-title").textContent = `${t("puzzleLabel")} ${currentIndex + 1}`;
  // 問題文も詰み筋を示唆するため、盤面では汎用文のみ表示する。
  $("#puzzle-prompt").textContent = t("promptGeneric");
  $("#turn-banner").textContent = feedbackMode === "good-check" ? t("defenderThinking") : t("yourTurn");
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
  } else if (feedbackMode === "failed") {
    container.classList.add("try-again");
    mark.textContent = "↺";
    title.textContent = t("failedTitle");
    message.textContent = t("failedCopy");
  } else if (feedbackMode === "no-checks") {
    container.classList.add("try-again");
    mark.textContent = "↺";
    title.textContent = t("noChecksTitle");
    message.textContent = t("noChecksCopy");
  } else if (feedbackMode === "hint-offline") {
    mark.textContent = "?";
    title.textContent = t("hintTitle");
    message.textContent = t("hintOffLineCopy");
  } else if (feedbackMode === "good-check") {
    mark.textContent = "✓";
    title.textContent = t("goodCheck");
    message.textContent = t("goodCheckCopy");
  } else if (feedbackMode === "continue") {
    mark.textContent = "→";
    title.textContent = t("continueAttack");
    message.textContent = t("continueAttackCopy");
  } else if (feedbackMode === "hint") {
    mark.textContent = "?";
    if (hintStage <= 1) {
      // 第1段階: 手筋のテーマ（旧タイトル）と問題文だけを見せる。
      title.textContent = t("hintThemeTitle");
      message.textContent = `${localText(puzzle.title)} — ${localText(puzzle.prompt)}`;
    } else {
      title.textContent = hintStage >= 3 ? t("hintTargetTitle") : t("hintTitle");
      message.textContent = localText(currentHint());
    }
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

function renderPuzzleFilters() {
  document.querySelectorAll("#puzzle-filters [data-plies]").forEach((button) => {
    const value = button.dataset.plies;
    const count = value === "all"
      ? PUZZLES.length
      : PUZZLES.filter((puzzle) => puzzle.plies === Number(value)).length;
    const active = value === puzzleFilter;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    button.querySelector("strong").textContent = value === "all"
      ? t("allPuzzles")
      : mateLabel({ plies: Number(value) });
    button.querySelector("small").textContent = count > 0 ? puzzleCountLabel(count) : t("comingSoon");
  });
}

function renderPuzzleList() {
  const list = $("#puzzle-list");
  list.replaceChildren();
  const entries = filteredPuzzleEntries();
  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "puzzle-empty";
    const title = document.createElement("strong");
    title.textContent = `${mateLabel({ plies: Number(puzzleFilter) })} · ${t("comingSoon")}`;
    const copy = document.createElement("p");
    copy.textContent = t("noPuzzlesYet");
    empty.append(title, copy);
    list.appendChild(empty);
    return;
  }

  entries.forEach(({ puzzle, index }) => {
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
    title.textContent = `${t("puzzleLabel")} ${index + 1}`;
    const status = document.createElement("small");
    status.textContent = `${mateLabel(puzzle)} · ${complete ? t("completed") : t("open")}`;
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

function formatMove(entry) {
  const mark = entry.side === ATTACK ? "▲" : "△";
  const destination = coordinateName(entry.toRow, entry.toCol);
  const info = PIECES[entry.type];
  const name = preferences.language === "ja" ? (info.kanji || info.kanjiDefense) : info.latin;
  const suffix = entry.kind === "drop"
    ? t("dropSuffix")
    : (entry.promote ? t("promoteSuffix") : "");
  return `${mark}${destination} ${name}${suffix}`;
}

function renderSequence() {
  const puzzle = PUZZLES[currentIndex];
  const sequence = $("#move-sequence");
  sequence.replaceChildren();
  $("#move-count-label").textContent = `${playedPlies} / ${puzzle.plies}`;
  if (!moveHistory.length) {
    const empty = document.createElement("span");
    empty.className = "sequence-empty";
    empty.textContent = t("sequenceEmpty");
    sequence.appendChild(empty);
    return;
  }
  moveHistory.forEach((entry, index) => {
    const chip = document.createElement("span");
    chip.className = `move-chip ${entry.side}`;
    chip.textContent = `${index + 1}. ${formatMove(entry)}`;
    sequence.appendChild(chip);
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
    heading.textContent = pieceInfoName(info);
    const small = document.createElement("small");
    small.textContent = `${info.latin} · ▲`;
    heading.appendChild(small);
    top.append(icon, heading);
    const description = document.createElement("p");
    description.textContent = pieceMoveText(info);
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
  renderSequence();
  renderFeedback();
  renderPuzzleFilters();
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
  const puzzle = PUZZLES[currentIndex];
  const nextState = applyMove(state, move);

  // 王手でない手はルール違反として、盤面を変えずに差し戻す。
  if (!isInCheck(nextState, DEFENSE)) {
    feedbackMode = "not-check";
    selected = null;
    selectedMoves = [];
    hintStage = 0;
    renderAll();
    return;
  }

  // 王手であれば正解手順かどうかに関わらず受け入れ、手数いっぱいまで対局を進める。
  onVerifiedLine = onVerifiedLine && matchesPlannedMove(move, currentHint());
  const entry = moveWithType(state, move);
  state = nextState;
  moveHistory.push(entry);
  playedPlies += 1;
  selected = null;
  selectedMoves = [];
  hintStage = 0;
  locked = true;

  if (isMate(state, DEFENSE)) {
    feedbackMode = "success";
    const id = puzzle.id;
    if (!preferences.completed.includes(id)) preferences.completed.push(id);
    savePreferences();
  } else if (playedPlies >= puzzle.plies) {
    // 手数を使い切っても詰まなかった。ここで初めて失敗が分かる。
    feedbackMode = "failed";
  } else {
    feedbackMode = "good-check";
    renderAll();
    scheduleDefense(puzzle.plies - playedPlies);
    return;
  }
  renderAll();
}

function scheduleDefense(remainingPlies) {
  clearTimeout(defenseTimer);
  defenseTimer = setTimeout(() => {
    defenseTimer = null;
    const puzzle = PUZZLES[currentIndex];
    const planned = onVerifiedLine ? puzzle.responses?.[attackerStep] : null;
    const reply = generateLegalMoves(state, DEFENSE).find((move) => matchesPlannedMove(move, planned))
      || chooseLongestDefense(state, remainingPlies);
    if (!reply) {
      feedbackMode = "no-checks";
      locked = true;
      renderAll();
      return;
    }

    moveHistory.push(moveWithType(state, reply));
    state = applyMove(state, reply);
    playedPlies += 1;
    attackerStep += 1;
    selected = null;
    selectedMoves = [];
    hintStage = 0;
    legalMoves = generateLegalMoves(state, ATTACK);

    // 王手を続けられる手が残っていなければ、この時点で失敗となる。
    if (!legalMoves.some((move) => isCheckingMove(state, move))) {
      feedbackMode = "no-checks";
      locked = true;
      renderAll();
      return;
    }

    locked = false;
    feedbackMode = "continue";
    renderAll();
  }, 680);
}

function resetPuzzle(showMessage = true) {
  clearTimeout(defenseTimer);
  defenseTimer = null;
  state = puzzleState(PUZZLES[currentIndex]);
  legalMoves = generateLegalMoves(state, ATTACK);
  selected = null;
  selectedMoves = [];
  pendingPromotionMoves = [];
  feedbackMode = "start";
  hintStage = 0;
  locked = false;
  playedPlies = 0;
  attackerStep = 0;
  onVerifiedLine = true;
  moveHistory = [];
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

function nextPuzzleIndex() {
  const filtered = filteredPuzzleEntries();
  if (!filtered.length) return (currentIndex + 1) % PUZZLES.length;
  const position = filtered.findIndex(({ index }) => index === currentIndex);
  return filtered[position >= 0 ? (position + 1) % filtered.length : 0].index;
}

function showHint() {
  if (feedbackMode === "success") return;
  if (defenseTimer) return;
  if (locked) resetPuzzle(false);
  if (!onVerifiedLine) {
    // 正解手順から外れている間は、的外れなヒントを出さずにその旨を伝える。
    feedbackMode = "hint-offline";
    selected = null;
    selectedMoves = [];
    renderBoard();
    renderHand();
    renderFeedback();
    return;
  }
  hintStage = Math.min(hintStage + 1, 3);
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
  $("#puzzle-picker-button").addEventListener("click", () => openSheet("#puzzles-layer"));
  $("#learn-button").addEventListener("click", () => openSheet("#learn-layer"));
  $("#reset-button").addEventListener("click", () => resetPuzzle(true));
  $("#hint-button").addEventListener("click", showHint);
  $("#next-button").addEventListener("click", () => loadPuzzle(nextPuzzleIndex()));
  document.querySelectorAll("[data-close-sheet]").forEach((button) => button.addEventListener("click", closeSheets));

  document.querySelectorAll("#puzzle-filters [data-plies]").forEach((button) => {
    button.addEventListener("click", () => {
      puzzleFilter = button.dataset.plies;
      renderPuzzleFilters();
      renderPuzzleList();
      renderMission();
    });
  });

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
