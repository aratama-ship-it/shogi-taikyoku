import { ATTACK, DEFENSE, stateFromPosition } from "./game-core.mjs";

const A = ATTACK;
const D = DEFENSE;

export const PUZZLES = [
  {
    id: "gold-at-the-head",
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
];

export function puzzleState(puzzle) {
  return stateFromPosition(puzzle.position);
}
