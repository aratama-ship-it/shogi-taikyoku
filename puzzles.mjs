import { ATTACK, DEFENSE, stateFromPosition } from "./game-core.mjs";

const A = ATTACK;
const D = DEFENSE;

const BASE_PUZZLES = [
  {
    id: "gold-at-the-head",
    plies: 1,
    title: { ja: "金は、とどめの駒", en: "Gold delivers the finish" },
    prompt: {
      ja: "相手の玉がどこにも逃げられない一手を見つけよう。",
      en: "Find the move that leaves the king no escape.",
    },
    hint: {
      ja: "持ち駒の金は、玉のすぐ下に置くと強力です。",
      en: "A gold in hand is powerful directly below the king.",
    },
    success: {
      ja: "頭金！ 金が5一・4一・6一と横の逃げ道を同時に押さえました。",
      en: "A head-gold mate! The gold covers the king and every nearby escape.",
    },
    hintHand: "G",
    hintSquare: [1, 4],
    position: {
      board: [
        { row: 0, col: 3, type: "L", side: D },
        { row: 0, col: 4, type: "K", side: D },
        { row: 0, col: 5, type: "L", side: D },
        { row: 3, col: 3, type: "N", side: A },
      ],
      hand: { G: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "rook-at-the-edge",
    plies: 1,
    title: { ja: "飛車で端を封じる", en: "Seal the edge with a rook" },
    prompt: {
      ja: "端の玉には、逃げ道が少ないという弱点があります。",
      en: "A king on the edge has fewer squares available.",
    },
    hint: {
      ja: "飛車を玉の真下に打ち、金で支えましょう。",
      en: "Drop the rook directly below the king, protected by the gold.",
    },
    success: {
      ja: "飛車打ちの詰み！ 玉は飛車を取ると金に取られます。",
      en: "Rook-drop mate! The king cannot capture the rook because the gold protects it.",
    },
    hintHand: "R",
    hintSquare: [1, 0],
    position: {
      board: [
        { row: 0, col: 0, type: "K", side: D },
        { row: 0, col: 1, type: "L", side: D },
        { row: 1, col: 1, type: "N", side: D },
        { row: 2, col: 1, type: "G", side: A },
      ],
      hand: { R: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "bishop-diagonal",
    plies: 1,
    title: { ja: "角の斜めを生かす", en: "Use the bishop's diagonal" },
    prompt: {
      ja: "角は離れた場所からでも、斜めに王手できます。",
      en: "A bishop can check along a diagonal from a distance.",
    },
    hint: {
      ja: "金に守られる4二へ角を打ってみましょう。",
      en: "Try dropping the bishop on 4b, where the gold protects it.",
    },
    success: {
      ja: "角打ち成功！ 斜めの王手と味方の金が連携しています。",
      en: "Bishop-drop mate! The diagonal check works together with your gold.",
    },
    hintHand: "B",
    hintSquare: [1, 5],
    position: {
      board: [
        { row: 0, col: 3, type: "L", side: D },
        { row: 0, col: 4, type: "K", side: D },
        { row: 0, col: 5, type: "N", side: D },
        { row: 1, col: 3, type: "N", side: D },
        { row: 1, col: 4, type: "P", side: D },
        { row: 2, col: 5, type: "G", side: A },
      ],
      hand: { B: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "silver-at-the-head",
    plies: 1,
    title: { ja: "銀の鋭い一手", en: "A sharp silver drop" },
    prompt: {
      ja: "銀が得意な、前方への攻めを使ってみましょう。",
      en: "Use the silver's strong forward attack.",
    },
    hint: {
      ja: "玉の真下に銀を打ちます。銀を守る駒にも注目。",
      en: "Drop the silver directly below the king. Notice which piece protects it.",
    },
    success: {
      ja: "銀打ちの詰み！ 後ろの金が銀をしっかり守っています。",
      en: "Silver-drop mate! The gold behind it makes the move safe.",
    },
    hintHand: "S",
    hintSquare: [1, 4],
    position: {
      board: [
        { row: 0, col: 3, type: "L", side: D },
        { row: 0, col: 4, type: "K", side: D },
        { row: 0, col: 5, type: "L", side: D },
        { row: 1, col: 3, type: "N", side: D },
        { row: 1, col: 5, type: "N", side: D },
        { row: 2, col: 4, type: "G", side: A },
      ],
      hand: { S: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "knight-jump",
    plies: 1,
    title: { ja: "桂馬は飛び越える", en: "The knight jumps" },
    prompt: {
      ja: "合駒では止められない、桂馬の王手を探しましょう。",
      en: "Find a knight check that cannot be blocked.",
    },
    hint: {
      ja: "桂馬は玉から一つ横、二つ下の位置から王手します。",
      en: "A knight checks from one file to the side and two ranks below.",
    },
    success: {
      ja: "桂馬の詰み！ 飛び越える王手なので、間に駒を置けません。",
      en: "Knight mate! A jumping check cannot be stopped by interposing a piece.",
    },
    hintHand: "N",
    hintSquare: [2, 3],
    position: {
      board: [
        { row: 0, col: 3, type: "L", side: D },
        { row: 0, col: 4, type: "K", side: D },
        { row: 0, col: 5, type: "L", side: D },
        { row: 1, col: 3, type: "N", side: D },
        { row: 1, col: 4, type: "N", side: D },
        { row: 1, col: 5, type: "N", side: D },
        { row: 2, col: 5, type: "P", side: A },
      ],
      hand: { N: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "capture-with-rook",
    plies: 1,
    title: { ja: "飛車を近づけて詰ます", en: "Bring the rook close" },
    prompt: {
      ja: "盤上の飛車を、玉が受けられない距離まで近づけましょう。",
      en: "Bring the rook close enough that the king has no defense.",
    },
    hint: {
      ja: "飛車を9五へ進めます。後ろの桂馬が助けてくれます。",
      en: "Move the rook to 9e. The knight behind it provides support.",
    },
    success: {
      ja: "飛車を近づけて詰み！ 桂馬の利きが飛車を守っています。",
      en: "Rook mate! The knight protects the rook on its final square.",
    },
    hintSquare: [4, 2],
    hintTarget: [4, 0],
    position: {
      board: [
        { row: 2, col: 0, type: "L", side: D },
        { row: 2, col: 1, type: "P", side: D },
        { row: 3, col: 0, type: "K", side: D },
        { row: 3, col: 1, type: "L", side: D },
        { row: 4, col: 2, type: "R", side: A },
        { row: 6, col: 1, type: "N", side: A },
      ],
      hand: {},
      defenseHand: "all",
    },
  },
  {
    id: "rook-sacrifice-gold-finish",
    plies: 3,
    title: { ja: "飛車を捨てて道を作る", en: "Sacrifice the rook" },
    prompt: {
      ja: "3手詰め。飛車を取らせた先に、金の決め手があります。",
      en: "Mate in 3. Let the king take your rook, then finish with gold.",
    },
    hints: [
      {
        ja: "盤上の飛車を7一へ進め、玉を動かします。",
        en: "Move the rook to 7a and force the king to move.",
        origin: [2, 3],
        target: [0, 3],
      },
      {
        ja: "玉が飛車を取ったら、7二へ金を打つ頭金です。",
        en: "After the king captures, drop gold on 7b for a head-gold mate.",
        hand: "G",
        target: [1, 3],
      },
    ],
    responses: [{ origin: [0, 4], target: [0, 3] }],
    success: {
      ja: "飛車を捨てて玉を呼び込み、最後は頭金。駒を取らせるのも大切な攻めです。",
      en: "The rook sacrifice drew the king in, and the gold finished the mate.",
    },
    position: {
      board: [
        { row: 0, col: 4, type: "K", side: D },
        { row: 1, col: 4, type: "P", side: D },
        { row: 1, col: 5, type: "S", side: D },
        { row: 1, col: 6, type: "P", side: A },
        { row: 2, col: 3, type: "R", side: A },
        { row: 4, col: 6, type: "B", side: A },
      ],
      hand: { G: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "knight-relay",
    plies: 3,
    title: { ja: "二枚の桂馬をつなぐ", en: "A relay of two knights" },
    prompt: {
      ja: "3手詰め。一枚目の桂馬で玉を動かし、二枚目で仕留めます。",
      en: "Mate in 3. The first knight drives the king; the second finishes.",
    },
    hints: [
      {
        ja: "持ち駒の桂馬を6三へ。飛び越える王手です。",
        en: "Drop the knight on 6c for an unblockable jumping check.",
        hand: "N",
        target: [2, 3],
      },
      {
        ja: "盤上の桂馬を7一へ進めます。行き所がないため、自動的に成ります。",
        en: "Move the knight on the board to 7a. It must promote on the last rank.",
        origin: [2, 1],
        target: [0, 2],
      },
    ],
    responses: [{ origin: [0, 4], target: [0, 3] }],
    success: {
      ja: "桂馬の連続王手！ 最後に成桂となり、横へ逃げる玉を捕まえました。",
      en: "A knight relay! The second knight promoted and covered the king's final escape.",
    },
    position: {
      board: [
        { row: 0, col: 4, type: "K", side: D },
        { row: 0, col: 5, type: "P", side: D },
        { row: 1, col: 7, type: "R", side: A },
        { row: 2, col: 1, type: "N", side: A },
      ],
      hand: { N: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "silver-then-bishop",
    plies: 3,
    title: { ja: "銀で追い、角で詰ます", en: "Drive with silver, mate with bishop" },
    prompt: {
      ja: "3手詰め。二種類の持ち駒を順番に使いましょう。",
      en: "Mate in 3. Use two different pieces from your hand in sequence.",
    },
    hints: [
      {
        ja: "銀を8二へ打ち、斜めから王手します。",
        en: "Drop the silver on 8b to check diagonally.",
        hand: "S",
        target: [1, 1],
      },
      {
        ja: "玉が下がったら、8一へ角を打ちます。",
        en: "After the king steps down, drop the bishop on 8a.",
        hand: "B",
        target: [0, 1],
      },
    ],
    responses: [{ origin: [0, 2], target: [1, 2] }],
    success: {
      ja: "銀で玉を追い出し、角の斜めで詰み。持ち駒の連携ができました。",
      en: "The silver drove the king out, and the bishop's diagonal completed the mate.",
    },
    position: {
      board: [
        { row: 0, col: 2, type: "K", side: D },
        { row: 0, col: 3, type: "P", side: D },
        { row: 1, col: 3, type: "G", side: D },
        { row: 3, col: 0, type: "P", side: A },
        { row: 3, col: 1, type: "R", side: A },
        { row: 4, col: 2, type: "S", side: A },
      ],
      hand: { B: 1, S: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "rook-silver-gold-relay",
    plies: 5,
    title: { ja: "飛車を捨て、銀で追う", en: "Sacrifice, chase, and finish" },
    prompt: {
      ja: "5手詰め。飛車・銀・金を、使う順番まで読んでみましょう。",
      en: "Mate in 5. Work out the right order for rook, silver, and gold.",
    },
    hints: [
      {
        ja: "まず8二へ飛車を打ち、玉に取らせます。",
        en: "First drop the rook on 8b and let the king capture it.",
        hand: "R",
        target: [1, 1],
      },
      {
        ja: "玉が8二へ来たら、7三へ銀を打って追います。",
        en: "When the king reaches 8b, drop the silver on 7c to drive it away.",
        hand: "S",
        target: [2, 2],
      },
      {
        ja: "最後は8二へ金。三枚の持ち駒をすべて使います。",
        en: "Finish with gold on 8b, using every piece from your hand.",
        hand: "G",
        target: [1, 1],
      },
    ],
    responses: [
      { origin: [0, 1], target: [1, 1] },
      { origin: [1, 1], target: [0, 0] },
    ],
    success: {
      ja: "飛車を捨てて玉を呼び、銀で追って頭金。持ち駒を余さない5手詰めです。",
      en: "The rook sacrifice drew the king in, the silver drove it out, and the gold finished with no piece left in hand.",
    },
    position: {
      board: [
        { row: 0, col: 1, type: "K", side: D },
        { row: 0, col: 2, type: "P", side: D },
        { row: 1, col: 0, type: "P", side: D },
        { row: 1, col: 4, type: "P", side: D },
        { row: 2, col: 0, type: "L", side: A },
        { row: 3, col: 2, type: "L", side: A },
        { row: 6, col: 0, type: "P", side: A },
        { row: 6, col: 1, type: "B", side: A },
      ],
      hand: { R: 1, S: 1, G: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "silver-bishop-gold-relay",
    plies: 5,
    title: { ja: "銀・角・金のリレー", en: "Silver, bishop, gold relay" },
    prompt: {
      ja: "5手詰め。三種類の持ち駒で、玉を往復させます。",
      en: "Mate in 5. Use three different pieces to send the king out and back.",
    },
    hints: [
      {
        ja: "3二へ銀を打ち、玉を下へ呼びます。",
        en: "Drop the silver on 3b to draw the king downward.",
        hand: "S",
        target: [1, 6],
      },
      {
        ja: "玉が3二へ来たら、2三へ角を打ちます。",
        en: "When the king reaches 3b, drop the bishop on 2c.",
        hand: "B",
        target: [2, 7],
      },
      {
        ja: "戻った玉へ3二金。これで持ち駒も残りません。",
        en: "After the king returns, drop gold on 3b. No piece remains in hand.",
        hand: "G",
        target: [1, 6],
      },
    ],
    responses: [
      { origin: [0, 6], target: [1, 6] },
      { origin: [1, 6], target: [0, 6] },
    ],
    success: {
      ja: "銀を取らせ、角で追い戻して金で詰み。三枚を使い切るきれいな手順です。",
      en: "The king took the silver, the bishop drove it back, and the gold completed a clean mate with every hand piece used.",
    },
    position: {
      board: [
        { row: 0, col: 4, type: "G", side: D },
        { row: 0, col: 6, type: "K", side: D },
        { row: 0, col: 8, type: "S", side: D },
        { row: 1, col: 8, type: "N", side: D },
        { row: 3, col: 8, type: "G", side: A },
        { row: 5, col: 5, type: "L", side: A },
        { row: 5, col: 6, type: "P", side: A },
      ],
      hand: { S: 1, B: 1, G: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "knight-silver-bishop-gold-relay",
    plies: 7,
    title: { ja: "桂を捨て、三枚で仕留める", en: "Sacrifice the knight, then finish" },
    prompt: {
      ja: "7手詰め。盤上の桂馬で玉を呼び、銀・角・金を順番に使いましょう。",
      en: "Mate in 7. Draw the king with the knight, then use silver, bishop, and gold in order.",
    },
    hints: [
      {
        ja: "4三の桂馬を3一へ動かして成り、玉に取らせます。",
        en: "Move the knight from 4c to 3a, promote it, and let the king capture.",
        origin: [2, 5],
        target: [0, 6],
      },
      {
        ja: "玉が3一へ来たら、3二へ銀を打って下へ呼びます。",
        en: "When the king reaches 3a, drop the silver on 3b to draw it downward.",
        hand: "S",
        target: [1, 6],
      },
      {
        ja: "玉が3二へ来たら、2三へ角を打って押し戻します。",
        en: "When the king reaches 3b, drop the bishop on 2c to drive it back.",
        hand: "B",
        target: [2, 7],
      },
      {
        ja: "戻った玉へ3二金。持ち駒をすべて使い切ります。",
        en: "Finish with gold on 3b, using every piece from your hand.",
        hand: "G",
        target: [1, 6],
      },
    ],
    responses: [
      { origin: [1, 6], target: [0, 6] },
      { origin: [0, 6], target: [1, 6] },
      { origin: [1, 6], target: [0, 6] },
    ],
    success: {
      ja: "桂馬を捨てて玉を呼び、銀・角・金のリレーで詰み。持ち駒も残りません。",
      en: "The knight sacrifice drew the king in, and the silver-bishop-gold relay finished with no hand piece left.",
    },
    position: {
      board: [
        { row: 0, col: 4, type: "G", side: D },
        { row: 0, col: 8, type: "S", side: D },
        { row: 1, col: 8, type: "N", side: D },
        { row: 1, col: 6, type: "K", side: D },
        { row: 2, col: 5, type: "N", side: A },
        { row: 3, col: 8, type: "G", side: A },
        { row: 5, col: 5, type: "L", side: A },
        { row: 5, col: 6, type: "P", side: A },
      ],
      hand: { S: 1, B: 1, G: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "double-knight-silver-bishop-gold-relay",
    plies: 9,
    title: { ja: "二枚の桂を捨てて仕留める", en: "Sacrifice two knights, then finish" },
    prompt: {
      ja: "9手詰め。二枚の桂馬で玉を二度呼び、銀・角・金へつなぎましょう。",
      en: "Mate in 9. Draw the king twice with two knights, then continue with silver, bishop, and gold.",
    },
    hints: [
      {
        ja: "4四の桂馬を3二へ動かして成り、玉に取らせます。",
        en: "Move the knight from 4d to 3b, promote it, and let the king capture.",
        origin: [3, 5],
        target: [1, 6],
      },
      {
        ja: "続いて4三の桂馬を3一へ動かして成り、もう一度玉に取らせます。",
        en: "Then move the knight from 4c to 3a, promote it, and let the king capture again.",
        origin: [2, 5],
        target: [0, 6],
      },
      {
        ja: "玉が3一へ来たら、3二へ銀を打って下へ呼びます。",
        en: "When the king reaches 3a, drop the silver on 3b to draw it downward.",
        hand: "S",
        target: [1, 6],
      },
      {
        ja: "玉が3二へ来たら、2三へ角を打って押し戻します。",
        en: "When the king reaches 3b, drop the bishop on 2c to drive it back.",
        hand: "B",
        target: [2, 7],
      },
      {
        ja: "戻った玉へ3二金。持ち駒をすべて使い切ります。",
        en: "Finish with gold on 3b, using every piece from your hand.",
        hand: "G",
        target: [1, 6],
      },
    ],
    responses: [
      { origin: [2, 6], target: [1, 6] },
      { origin: [1, 6], target: [0, 6] },
      { origin: [0, 6], target: [1, 6] },
      { origin: [1, 6], target: [0, 6] },
    ],
    success: {
      ja: "二枚の桂馬を順に捨て、銀・角・金のリレーで詰み。攻方の持ち駒も残りません。",
      en: "Two knight sacrifices drew the king in, and the silver-bishop-gold relay finished with no hand piece left.",
    },
    position: {
      board: [
        { row: 0, col: 4, type: "G", side: D },
        { row: 0, col: 8, type: "S", side: D },
        { row: 1, col: 8, type: "N", side: D },
        { row: 2, col: 6, type: "K", side: D },
        { row: 2, col: 5, type: "N", side: A },
        { row: 3, col: 5, type: "N", side: A },
        { row: 3, col: 8, type: "G", side: A },
        { row: 5, col: 5, type: "L", side: A },
        { row: 5, col: 6, type: "P", side: A },
      ],
      hand: { S: 1, B: 1, G: 1 },
      defenseHand: "all",
    },
  },
];

const PIECE_NAMES = {
  R: { ja: "飛車", en: "rook" },
  B: { ja: "角", en: "bishop" },
  G: { ja: "金", en: "gold" },
  S: { ja: "銀", en: "silver" },
  N: { ja: "桂馬", en: "knight" },
  L: { ja: "香車", en: "lance" },
  P: { ja: "歩", en: "pawn" },
};
const JA_RANKS = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

function transformCol(col, mirror, shift) {
  return (mirror ? 8 - col : col) + shift;
}

function transformSquare(square, mirror, shift) {
  return [square[0], transformCol(square[1], mirror, shift)];
}

function squareLabel([row, col], language) {
  const file = 9 - col;
  return language === "ja" ? `${file}${JA_RANKS[row]}` : `${file}${String.fromCharCode(97 + row)}`;
}

function variantHint(seed, hint, mirror, shift) {
  const target = transformSquare(hint.target, mirror, shift);
  if (hint.hand) {
    const name = PIECE_NAMES[hint.hand];
    return {
      ja: `持ち駒の${name.ja}を${squareLabel(target, "ja")}へ打って王手します。`,
      en: `Drop the ${name.en} on ${squareLabel(target, "en")} to give check.`,
      hand: hint.hand,
      target,
    };
  }

  const origin = transformSquare(hint.origin, mirror, shift);
  const piece = seed.position.board.find((item) => item.row === hint.origin[0] && item.col === hint.origin[1]);
  const name = PIECE_NAMES[piece?.type] || { ja: "駒", en: "piece" };
  return {
    ja: `${squareLabel(origin, "ja")}の${name.ja}を${squareLabel(target, "ja")}へ動かして王手します。`,
    en: `Move the ${name.en} from ${squareLabel(origin, "en")} to ${squareLabel(target, "en")} to give check.`,
    origin,
    target,
  };
}

function practiceVariant(seedId, sequence, { mirror = false, shift = 0, extraBoard = [] } = {}) {
  const seed = BASE_PUZZLES.find((puzzle) => puzzle.id === seedId);
  const suffix = String(sequence).padStart(2, "0");
  const sourceHints = seed.hints || [{
    hand: seed.hintHand,
    origin: seed.hintHand ? null : seed.hintSquare,
    target: seed.hintTarget || seed.hintSquare,
  }];
  const hints = sourceHints.map((hint) => variantHint(seed, hint, mirror, shift));

  return {
    id: `${seed.id}-practice-${suffix}`,
    plies: seed.plies,
    title: {
      ja: `${seed.title.ja}・反復${sequence}`,
      en: `${seed.title.en} — Practice ${sequence}`,
    },
    prompt: {
      ja: `${seed.plies}手詰め。同じ詰み筋を、盤の別の場所でも見つけましょう。`,
      en: `Mate in ${seed.plies}. Find the same mating pattern in a different part of the board.`,
    },
    hints,
    responses: (seed.responses || []).map((response) => ({
      ...response,
      origin: transformSquare(response.origin, mirror, shift),
      target: transformSquare(response.target, mirror, shift),
    })),
    success: {
      ja: "同じ詰み筋を別の位置でも発見できました。攻方の持ち駒も残りません。",
      en: "You found the same mating pattern in a new position, with no attacking piece left in hand.",
    },
    position: {
      board: [
        ...seed.position.board.map((item) => ({
          ...item,
          col: transformCol(item.col, mirror, shift),
        })),
        ...extraBoard.map((item) => ({ ...item })),
      ],
      hand: { ...seed.position.hand },
      defenseHand: seed.position.defenseHand,
    },
    derivedFrom: seed.id,
    transform: { mirror, shift, extraBoard: extraBoard.map((item) => ({ ...item })) },
  };
}

const PRACTICE_PUZZLES = [
  practiceVariant("rook-sacrifice-gold-finish", 1, { shift: -2 }),
  practiceVariant("rook-sacrifice-gold-finish", 2, { shift: -1 }),
  practiceVariant("rook-sacrifice-gold-finish", 3, { shift: 1 }),
  practiceVariant("rook-sacrifice-gold-finish", 4, { shift: 2 }),
  practiceVariant("knight-relay", 1, { shift: -1 }),
  practiceVariant("knight-relay", 2, { shift: 1 }),
  practiceVariant("silver-then-bishop", 1, { shift: 1 }),

  practiceVariant("rook-silver-gold-relay", 1, { mirror: true }),
  practiceVariant("silver-bishop-gold-relay", 1, { shift: -1 }),
  practiceVariant("silver-bishop-gold-relay", 2, { shift: -2 }),
  practiceVariant("silver-bishop-gold-relay", 3, { shift: -3 }),
  practiceVariant("silver-bishop-gold-relay", 4, { shift: -4 }),
  practiceVariant("silver-bishop-gold-relay", 5, { mirror: true }),
  practiceVariant("silver-bishop-gold-relay", 6, { mirror: true, shift: 1 }),
  practiceVariant("silver-bishop-gold-relay", 7, { mirror: true, shift: 2 }),
  practiceVariant("silver-bishop-gold-relay", 8, { mirror: true, shift: 3 }),
  practiceVariant("silver-bishop-gold-relay", 9, { mirror: true, shift: 4 }),
  practiceVariant("silver-bishop-gold-relay", 10, { extraBoard: [{ row: 7, col: 0, type: "P", side: D }] }),
  practiceVariant("silver-bishop-gold-relay", 11, { extraBoard: [{ row: 7, col: 4, type: "P", side: D }] }),
  practiceVariant("silver-bishop-gold-relay", 12, { extraBoard: [{ row: 7, col: 8, type: "P", side: D }] }),

  practiceVariant("knight-silver-bishop-gold-relay", 1, { shift: -1 }),
  practiceVariant("knight-silver-bishop-gold-relay", 2, { shift: -2 }),
  practiceVariant("knight-silver-bishop-gold-relay", 3, { shift: -3 }),
  practiceVariant("knight-silver-bishop-gold-relay", 4, { mirror: true }),
  practiceVariant("knight-silver-bishop-gold-relay", 5, { mirror: true, shift: 1 }),
  practiceVariant("knight-silver-bishop-gold-relay", 6, { mirror: true, shift: 2 }),
  practiceVariant("knight-silver-bishop-gold-relay", 7, { mirror: true, shift: 3 }),
  practiceVariant("knight-silver-bishop-gold-relay", 8, { extraBoard: [{ row: 7, col: 0, type: "P", side: D }] }),
  practiceVariant("knight-silver-bishop-gold-relay", 9, { extraBoard: [{ row: 7, col: 8, type: "P", side: D }] }),

  practiceVariant("double-knight-silver-bishop-gold-relay", 1, { shift: -1 }),
  practiceVariant("double-knight-silver-bishop-gold-relay", 2, { mirror: true }),
];

export const PUZZLES = [...BASE_PUZZLES, ...PRACTICE_PUZZLES];

export function puzzleState(puzzle) {
  return stateFromPosition(puzzle.position);
}
