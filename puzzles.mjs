import { ATTACK, DEFENSE, stateFromPosition } from "./game-core.mjs";

const A = ATTACK;
const D = DEFENSE;

export const PUZZLES = [
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
    title: { ja: "取って王手する", en: "Capture with check" },
    prompt: {
      ja: "盤上の飛車で守り駒を取り、玉に迫りましょう。",
      en: "Use the rook on the board to capture a defender and close in on the king.",
    },
    hint: {
      ja: "飛車で9五の駒を取ります。後ろの桂馬が助けてくれます。",
      en: "Capture the piece on 9e with the rook. The knight behind it provides support.",
    },
    success: {
      ja: "飛車で取って詰み！ 桂馬の利きが飛車を守っています。",
      en: "Capture and mate! The knight protects the rook on its final square.",
    },
    hintSquare: [6, 0],
    hintTarget: [4, 0],
    position: {
      board: [
        { row: 2, col: 0, type: "L", side: D },
        { row: 2, col: 1, type: "P", side: D },
        { row: 3, col: 0, type: "K", side: D },
        { row: 3, col: 1, type: "L", side: D },
        { row: 4, col: 0, type: "P", side: D },
        { row: 4, col: 1, type: "N", side: D },
        { row: 6, col: 0, type: "R", side: A },
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
        ja: "盤上の飛車で7一の歩を取り、玉を動かします。",
        en: "Use the rook to capture the pawn on 7a and force the king to move.",
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
    success: {
      ja: "飛車を捨てて玉を呼び込み、最後は頭金。駒を取らせるのも大切な攻めです。",
      en: "The rook sacrifice drew the king in, and the gold finished the mate.",
    },
    position: {
      board: [
        { row: 0, col: 3, type: "P", side: D },
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
];

export function puzzleState(puzzle) {
  return stateFromPosition(puzzle.position);
}
