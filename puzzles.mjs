import { ATTACK, DEFENSE, stateFromPosition } from "./game-core.mjs";
import { PUZZLE_TRANSLATIONS } from "./puzzle-i18n.mjs";

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
        { row: 0, col: 4, type: "K", side: D },
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
        { row: 0, col: 4, type: "K", side: D },
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
    id: "pawn-promotion-push",
    plies: 1,
    title: { ja: "歩は成ると金になる", en: "The pawn promotes to gold" },
    prompt: {
      ja: "小さな歩にも、大きな力が隠れています。",
      en: "Even the humble pawn hides great power.",
    },
    hint: {
      ja: "5三の歩を進めて成りましょう。後ろの香車が支えます。",
      en: "Push the pawn on 5c and promote. The lance behind supports it.",
    },
    success: {
      ja: "突き歩成！ と金は金と同じ働きで、開いた香車の利きが守っています。",
      en: "Promotion mate! The tokin works like a gold, protected by the lance on the opened file.",
    },
    hintSquare: [2, 4],
    hintTarget: [1, 4],
    hintPromote: true,
    position: {
      board: [
        { row: 0, col: 4, type: "K", side: D },
        { row: 2, col: 4, type: "P", side: A },
        { row: 3, col: 4, type: "L", side: A },
      ],
      hand: {},
      defenseHand: "all",
    },
  },
  {
    id: "horse-power",
    plies: 1,
    title: { ja: "角は成ると馬になる", en: "The bishop becomes a horse" },
    prompt: {
      ja: "成り駒の力で、玉の逃げ道をすべて消しましょう。",
      en: "A promoted piece can cover every escape at once.",
    },
    hint: {
      ja: "3三の角を2二へ成り込みます。5二の竜が横から支えます。",
      en: "Move the bishop from 3c to 2b and promote. The dragon on 5b supports it sideways.",
    },
    success: {
      ja: "角成りの詰み！ 馬の利きと竜の横利きで、玉はどこへも動けません。",
      en: "Horse mate! The horse's reach and the dragon's sideways power trap the king.",
    },
    hintSquare: [2, 6],
    hintTarget: [1, 7],
    hintPromote: true,
    position: {
      board: [
        { row: 0, col: 6, type: "K", side: D },
        { row: 1, col: 4, type: "R", side: A, promoted: true },
        { row: 2, col: 6, type: "B", side: A },
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
        { row: 1, col: 5, type: "S", side: D },
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
        promote: true,
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
        { row: 3, col: 1, type: "R", side: A },
      ],
      hand: { B: 1, S: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "silver-lure-gold-pincer",
    plies: 3,
    title: { ja: "銀で誘い、金で挟む", en: "Lure with silver, pinch with gold" },
    prompt: {
      ja: "3手詰め。盤上の金と銀が、両側から壁になります。",
      en: "Mate in 3. Your gold and silver form walls on both sides.",
    },
    hints: [
      {
        ja: "4二へ銀を打ち、玉を3二へ誘います。",
        en: "Drop the silver on 4b to lure the king to 3b.",
        hand: "S",
        target: [1, 5],
      },
      {
        ja: "下がった玉へ、3三から金を打って挟みます。",
        en: "Drop the gold on 3c to pinch the king from below.",
        hand: "G",
        target: [2, 6],
      },
    ],
    responses: [{ origin: [0, 6], target: [1, 6] }],
    success: {
      ja: "銀で退路を消しながら誘い、金でとどめ。挟み撃ちの形です。",
      en: "The silver lured the king down, and the gold finished the pincer attack.",
    },
    position: {
      board: [
        { row: 0, col: 6, type: "K", side: D },
        { row: 1, col: 4, type: "G", side: A },
        { row: 1, col: 8, type: "S", side: A },
      ],
      hand: { S: 1, G: 1 },
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
        { row: 3, col: 2, type: "L", side: A },
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
        { row: 3, col: 8, type: "G", side: A },
        { row: 5, col: 5, type: "L", side: A },
      ],
      hand: { S: 1, B: 1, G: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "silver-sacrifice-gold-return",
    plies: 5,
    title: { ja: "銀を取らせて呼び戻す", en: "Give up the silver, call the king back" },
    prompt: {
      ja: "5手詰め。銀を一枚取らせてから、挟み撃ちを完成させましょう。",
      en: "Mate in 5. Give up one silver, then complete the pincer.",
    },
    hints: [
      {
        ja: "2二へ銀を捨てます。玉に取らせましょう。",
        en: "Sacrifice a silver on 2b and let the king take it.",
        hand: "S",
        target: [1, 7],
      },
      {
        ja: "2三へ金。歩が金を支え、玉は3一へ戻ります。",
        en: "Drop the gold on 2c — the pawn supports it and drives the king back to 3a.",
        hand: "G",
        target: [2, 7],
      },
      {
        ja: "最後は3二へ二枚目の銀。これで詰みです。",
        en: "Finish with the second silver on 3b.",
        hand: "S",
        target: [1, 6],
      },
    ],
    responses: [
      { origin: [0, 6], target: [1, 7] },
      { origin: [1, 7], target: [0, 6] },
    ],
    success: {
      ja: "銀を捨てて呼び込み、金で追い返して銀でとどめ。持ち駒を使い切る5手詰めです。",
      en: "The silver sacrifice drew the king out, the gold sent it back, and the second silver finished with an empty hand.",
    },
    position: {
      board: [
        { row: 0, col: 6, type: "K", side: D },
        { row: 1, col: 4, type: "G", side: A },
        { row: 3, col: 7, type: "P", side: A },
      ],
      hand: { S: 2, G: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "lance-backed-silvers",
    plies: 5,
    title: { ja: "香を支えに銀二枚", en: "Silvers backed by the lance" },
    prompt: {
      ja: "5手詰め。離れた香車の利きを信じて攻めましょう。",
      en: "Mate in 5. Trust the lance's reach from afar.",
    },
    hints: [
      {
        ja: "4二へ銀を打ち、玉を2一へ追います。",
        en: "Drop a silver on 4b to push the king to 2a.",
        hand: "S",
        target: [1, 5],
      },
      {
        ja: "1二へ二枚目の銀。香車の利きが支えるので取れません。",
        en: "Drop the second silver on 1b — the lance protects it, so the king cannot take.",
        hand: "S",
        target: [1, 8],
      },
      {
        ja: "3二へ逃げた玉へ、3三から金打ち。詰みです。",
        en: "The king fled to 3b — drop the gold on 3c for mate.",
        hand: "G",
        target: [2, 6],
      },
    ],
    responses: [
      { origin: [0, 6], target: [0, 7] },
      { origin: [0, 7], target: [1, 6] },
    ],
    success: {
      ja: "香車の遠い利きが銀を支え、金でとどめ。離れた駒の連携です。",
      en: "The lance's distant reach supported the silver, and the gold finished — teamwork across the board.",
    },
    position: {
      board: [
        { row: 0, col: 6, type: "K", side: D },
        { row: 1, col: 4, type: "G", side: A },
        { row: 3, col: 8, type: "L", side: A },
      ],
      hand: { S: 2, G: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "silver-stepping-stone",
    plies: 5,
    title: { ja: "銀を重ねて頭金", en: "Stack the silvers, finish with gold" },
    prompt: {
      ja: "5手詰め。一枚目の銀は取らせるための捨て駒です。",
      en: "Mate in 5. The first silver is a sacrifice.",
    },
    hints: [
      {
        ja: "4二へ銀を捨てます。玉に取らせましょう。",
        en: "Sacrifice a silver on 4b and let the king take it.",
        hand: "S",
        target: [1, 5],
      },
      {
        ja: "同玉に4三へ二枚目の銀。5四の金が支えます。",
        en: "Drop the second silver on 4c — the gold on 5d protects it.",
        hand: "S",
        target: [2, 5],
      },
      {
        ja: "5一へ逃げた玉に、5二へ頭金。詰みです。",
        en: "The king fled to 5a — drop the gold on 5b for a head-gold mate.",
        hand: "G",
        target: [1, 4],
      },
    ],
    responses: [
      { origin: [0, 6], target: [1, 5] },
      { origin: [1, 5], target: [0, 4] },
    ],
    success: {
      ja: "銀を取らせて足場を作り、最後は頭金。二枚の銀が道を開きました。",
      en: "The captured silver became a foothold, and the head-gold finished — the two silvers opened the way.",
    },
    position: {
      board: [
        { row: 0, col: 6, type: "K", side: D },
        { row: 1, col: 8, type: "G", side: A },
        { row: 3, col: 4, type: "G", side: A },
      ],
      hand: { S: 2, G: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "knight-gold-corner-drive",
    plies: 5,
    title: { ja: "桂・金・銀の隅追い", en: "Drive the king to the corner" },
    prompt: {
      ja: "5手詰め。桂馬の王手から、玉を隅へ追い込みましょう。",
      en: "Mate in 5. Start with a knight check and drive the king into the corner.",
    },
    hints: [
      {
        ja: "2三へ桂馬を打ちます。跳ぶ王手に合駒はできません。",
        en: "Drop the knight on 2c — a jumping check cannot be blocked.",
        hand: "N",
        target: [2, 7],
      },
      {
        ja: "3一へ金を打ち、玉を2二へ押し出します。",
        en: "Drop the gold on 3a to push the king to 2b.",
        hand: "G",
        target: [0, 6],
      },
      {
        ja: "最後は1三へ銀打ち。斜めの利きで詰みです。",
        en: "Finish with a silver drop on 1c — its diagonal reach completes the mate.",
        hand: "S",
        target: [2, 8],
      },
    ],
    responses: [
      { origin: [0, 6], target: [0, 7] },
      { origin: [0, 7], target: [1, 7] },
    ],
    success: {
      ja: "桂で始まり、金で押し、銀で仕留める。持ち駒三枚の連携です。",
      en: "Knight, gold, then silver — three hand pieces working together.",
    },
    position: {
      board: [
        { row: 0, col: 6, type: "K", side: D },
        { row: 1, col: 4, type: "G", side: A },
        { row: 3, col: 7, type: "G", side: A },
      ],
      hand: { N: 1, S: 1, G: 1 },
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
        promote: true,
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
        { row: 0, col: 8, type: "S", side: D },
        { row: 1, col: 8, type: "N", side: D },
        { row: 1, col: 6, type: "K", side: D },
        { row: 2, col: 5, type: "N", side: A },
        { row: 3, col: 8, type: "G", side: A },
        { row: 5, col: 5, type: "L", side: A },
      ],
      hand: { S: 1, B: 1, G: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "wandering-king-two-knights",
    plies: 7,
    title: { ja: "二枚桂の追い回し", en: "Two knights on the chase" },
    prompt: {
      ja: "7手詰め。逃げ回る玉を、二枚の桂馬で追い詰めます。",
      en: "Mate in 7. Chase the wandering king with two knights.",
    },
    hints: [
      {
        ja: "2四へ桂馬を打って王手します。",
        en: "Drop a knight on 2d to give check.",
        hand: "N",
        target: [3, 7],
      },
      {
        ja: "3四へ銀を打ち、玉を2二へ追います。",
        en: "Drop the silver on 3d to push the king to 2b.",
        hand: "S",
        target: [3, 6],
      },
      {
        ja: "1四へ二枚目の桂馬を打ち、玉を3一へ送り出します。",
        en: "Drop the second knight on 1d to drive the king to 3a.",
        hand: "N",
        target: [3, 8],
      },
      {
        ja: "最後は3二へ金。逃げ回った玉を捕まえます。",
        en: "Finish with the gold on 3b to catch the wandering king.",
        hand: "G",
        target: [1, 6],
      },
    ],
    responses: [
      { origin: [1, 8], target: [2, 7] },
      { origin: [2, 7], target: [1, 7] },
      { origin: [1, 7], target: [0, 6] },
    ],
    success: {
      ja: "桂・銀・桂・金のリレーで、逃げ回る玉を捕まえました。",
      en: "Knight, silver, knight, gold — the wandering king is finally caught.",
    },
    position: {
      board: [
        { row: 1, col: 8, type: "K", side: D },
        { row: 4, col: 7, type: "G", side: A },
      ],
      hand: { N: 2, S: 1, G: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "gold-pin-silver-seal",
    plies: 7,
    title: { ja: "金で止めて銀で締める", en: "Pin with gold, seal with silver" },
    prompt: {
      ja: "7手詰め。桂と銀で追い、金で退路を止めて銀でとどめます。",
      en: "Mate in 7. Chase with knight and silver, stop the escape with gold, and seal with the second silver.",
    },
    hints: [
      {
        ja: "2四へ桂馬を打って王手します。",
        en: "Drop the knight on 2d to give check.",
        hand: "N",
        target: [3, 7],
      },
      {
        ja: "3四へ銀を打ち、玉を2二へ追います。",
        en: "Drop a silver on 3d to push the king to 2b.",
        hand: "S",
        target: [3, 6],
      },
      {
        ja: "3二へ金。玉は1一へ落ちるしかありません。",
        en: "Drop the gold on 3b — the king must slide to 1a.",
        hand: "G",
        target: [1, 6],
      },
      {
        ja: "最後は2二へ二枚目の銀。斜めの利きで詰みです。",
        en: "Finish with the second silver on 2b — its diagonal reach mates.",
        hand: "S",
        target: [1, 7],
      },
    ],
    responses: [
      { origin: [1, 8], target: [2, 7] },
      { origin: [2, 7], target: [1, 7] },
      { origin: [1, 7], target: [0, 8] },
    ],
    success: {
      ja: "桂・銀で追い、金で退路を封鎖、最後は銀。持ち駒四枚を使い切りました。",
      en: "Knight and silver chased, the gold sealed the escape, and the last silver finished — all four hand pieces used.",
    },
    position: {
      board: [
        { row: 1, col: 8, type: "K", side: D },
        { row: 4, col: 7, type: "G", side: A },
      ],
      hand: { N: 1, S: 2, G: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "corner-knight-net",
    plies: 7,
    title: { ja: "隅の玉に桂の網", en: "A knight net in the corner" },
    prompt: {
      ja: "7手詰め。銀を捨ててから、二枚の桂馬で網を張ります。",
      en: "Mate in 7. Sacrifice the silver, then weave a net with two knights.",
    },
    hints: [
      {
        ja: "1二へ銀を捨てます。玉に取らせましょう。",
        en: "Sacrifice the silver on 1b and let the king take it.",
        hand: "S",
        target: [1, 8],
      },
      {
        ja: "2四へ桂馬。1二の玉に飛びの王手です。",
        en: "Drop a knight on 2d — a jumping check on the king at 1b.",
        hand: "N",
        target: [3, 7],
      },
      {
        ja: "3二へ金を打ち、玉を隅へ押し込みます。",
        en: "Drop the gold on 3b to push the king into the corner.",
        hand: "G",
        target: [1, 6],
      },
      {
        ja: "最後は2三へ二枚目の桂馬。2四の桂が1二を塞いでいます。",
        en: "Finish with the second knight on 2c — the first knight guards 1b.",
        hand: "N",
        target: [2, 7],
      },
    ],
    responses: [
      { origin: [0, 8], target: [1, 8] },
      { origin: [1, 8], target: [0, 7] },
      { origin: [0, 7], target: [0, 8] },
    ],
    success: {
      ja: "銀捨てから金で押し込み、二枚の桂馬の利きで隅の玉を仕留めました。",
      en: "After the silver sacrifice and the gold's push, the two knights' reach caught the cornered king.",
    },
    position: {
      board: [
        { row: 0, col: 8, type: "K", side: D },
        { row: 3, col: 8, type: "G", side: A },
      ],
      hand: { N: 2, S: 1, G: 1 },
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
        promote: true,
      },
      {
        ja: "続いて4三の桂馬を3一へ動かして成り、もう一度玉に取らせます。",
        en: "Then move the knight from 4c to 3a, promote it, and let the king capture again.",
        origin: [2, 5],
        target: [0, 6],
        promote: true,
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
        { row: 0, col: 8, type: "S", side: D },
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
  {
    id: "double-silver-sacrifice-chase",
    plies: 9,
    title: { ja: "二枚の銀を捨てる長編", en: "Two silver sacrifices" },
    prompt: {
      ja: "9手詰め。二枚の銀を惜しまず使い、桂馬で仕留めます。",
      en: "Mate in 9. Spend both silvers freely, then finish with a knight.",
    },
    hints: [
      {
        ja: "4二へ銀を打ち、玉を2一へ追います。",
        en: "Drop a silver on 4b to push the king to 2a.",
        hand: "S",
        target: [1, 5],
      },
      {
        ja: "1二へ二枚目の銀を捨てます。玉に取らせましょう。",
        en: "Sacrifice the second silver on 1b and let the king take it.",
        hand: "S",
        target: [1, 8],
      },
      {
        ja: "2四へ桂馬を打ちます。跳ぶ王手に合駒はできません。",
        en: "Drop a knight on 2d — this jumping check cannot be blocked.",
        hand: "N",
        target: [3, 7],
      },
      {
        ja: "1二へ金を打ち、玉を2三へ押し出します。",
        en: "Drop the gold on 1b to push the king to 2c.",
        hand: "G",
        target: [1, 8],
      },
      {
        ja: "最後は3五へ桂馬。跳びの利きで詰みです。",
        en: "Finish with the second knight on 3e.",
        hand: "N",
        target: [4, 6],
      },
    ],
    responses: [
      { origin: [0, 6], target: [0, 7] },
      { origin: [0, 7], target: [1, 8] },
      { origin: [1, 8], target: [1, 7] },
      { origin: [1, 7], target: [2, 7] },
    ],
    success: {
      ja: "二枚の銀捨てから桂・金・桂へ。9手の長い追撃を読み切りました。",
      en: "Two silver sacrifices, then knight, gold, knight — a nine-move chase read to the end.",
    },
    position: {
      board: [
        { row: 0, col: 6, type: "K", side: D },
        { row: 1, col: 4, type: "G", side: A },
        { row: 4, col: 7, type: "G", side: A },
      ],
      hand: { N: 2, S: 2, G: 1 },
      defenseHand: "all",
    },
  },
  {
    id: "dragon-bishop-board-relay",
    plies: 5,
    title: { ja: "竜と二枚角の盤上リレー", en: "Dragon and two-bishop board relay" },
    prompt: {
      ja: "5手詰め。持ち駒はありません。盤上の竜と二枚の角だけで玉を追いましょう。",
      en: "Mate in 5 with no pieces in hand. Chase the king using only the dragon and two bishops on the board.",
    },
    hints: [
      {
        ja: "9四の竜を9一へ進め、玉を斜め下へ追います。",
        en: "Move the dragon from 9d to 9a and drive the king diagonally downward.",
        origin: [3, 0],
        target: [0, 0],
      },
      {
        ja: "6四の角を7三へ成り込み、玉を上段へ戻します。",
        en: "Move the bishop from 6d to 7c and promote, forcing the king back to the top rank.",
        origin: [3, 3],
        target: [2, 2],
        promote: true,
      },
      {
        ja: "最後は5一の角を6二へ成り、馬の利きで詰ませます。",
        en: "Finally, move the bishop from 5a to 6b and promote; the horse completes the mate.",
        origin: [0, 4],
        target: [1, 3],
        promote: true,
      },
    ],
    responses: [
      { origin: [0, 1], target: [1, 2] },
      { origin: [1, 2], target: [0, 3] },
    ],
    success: {
      ja: "竜で追い、角を成り込ませ、もう一枚の角を馬にして詰み。持ち駒を使わない盤上リレーです。",
      en: "The dragon chased, one bishop promoted to keep up the attack, and the other became a horse to mate — all on the board.",
    },
    position: {
      board: [
        { row: 0, col: 1, type: "K", side: D },
        { row: 0, col: 2, type: "S", side: D },
        { row: 3, col: 0, type: "R", side: A, promoted: true },
        { row: 0, col: 4, type: "B", side: A },
        { row: 3, col: 3, type: "B", side: A },
      ],
      hand: {},
      defenseHand: "all",
    },
  },
  {
    id: "promoted-lance-dragon-board-relay",
    plies: 5,
    title: { ja: "成香で追い、竜で仕留める", en: "Chase with a promoted lance, finish with a dragon" },
    prompt: {
      ja: "5手詰め。持ち駒はありません。成香と飛車を盤上で連携させましょう。",
      en: "Mate in 5 with no pieces in hand. Coordinate the promoted lance and rook already on the board.",
    },
    hints: [
      {
        ja: "1四の成香を2三へ動かし、玉を2一へ追います。",
        en: "Move the promoted lance from 1d to 2c, driving the king to 2a.",
        origin: [3, 8],
        target: [2, 7],
      },
      {
        ja: "1七の飛車を1二へ進めて成り、玉を3一へ追います。",
        en: "Move the rook from 1g to 1b and promote, driving the king to 3a.",
        origin: [6, 8],
        target: [1, 8],
        promote: true,
      },
      {
        ja: "最後は1二の竜を3二へ寄せ、金との連携で詰ませます。",
        en: "Finally, move the dragon from 1b to 3b; together with the gold, it completes the mate.",
        origin: [1, 8],
        target: [1, 6],
      },
    ],
    responses: [
      { origin: [1, 8], target: [0, 7] },
      { origin: [0, 7], target: [0, 6] },
    ],
    success: {
      ja: "成香で追い、飛車を竜にして追撃し、最後は横へ寄って詰み。持ち駒なしの盤上攻撃です。",
      en: "The promoted lance chased, the rook became a dragon, and the dragon slid sideways for mate — with no hand pieces.",
    },
    position: {
      board: [
        { row: 1, col: 8, type: "K", side: D },
        { row: 3, col: 8, type: "L", side: A, promoted: true },
        { row: 3, col: 6, type: "G", side: A },
        { row: 6, col: 8, type: "R", side: A },
      ],
      hand: {},
      defenseHand: "all",
    },
  },
];

// 反復問題の自動生成文（fr/es は本文中で自然になるよう冠詞つき）
const PIECE_NAMES = {
  R: { ja: "飛車", en: "rook", fr: "la tour", es: "la torre" },
  B: { ja: "角", en: "bishop", fr: "le fou", es: "el alfil" },
  G: { ja: "金", en: "gold", fr: "l'or", es: "el oro" },
  S: { ja: "銀", en: "silver", fr: "l'argent", es: "la plata" },
  N: { ja: "桂馬", en: "knight", fr: "le cavalier", es: "el caballo" },
  L: { ja: "香車", en: "lance", fr: "la lance", es: "la lanza" },
  P: { ja: "歩", en: "pawn", fr: "le pion", es: "el peón" },
};
const JA_RANKS = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

// 基本問題に fr/es テキストをマージする（反復問題の生成より前に行うこと）。
function mergeTranslations(puzzles) {
  for (const puzzle of puzzles) {
    const translation = PUZZLE_TRANSLATIONS[puzzle.id];
    if (!translation) continue;
    Object.assign(puzzle.title, translation.title);
    Object.assign(puzzle.prompt, translation.prompt);
    Object.assign(puzzle.success, translation.success);
    if (puzzle.hint && translation.hint) Object.assign(puzzle.hint, translation.hint);
    if (puzzle.hints && translation.hints) {
      puzzle.hints.forEach((hint, index) => Object.assign(hint, translation.hints[index] || {}));
    }
  }
}

mergeTranslations(BASE_PUZZLES);

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
    const square = squareLabel(target, "en");
    return {
      ja: `持ち駒の${name.ja}を${squareLabel(target, "ja")}へ打って王手します。`,
      en: `Drop the ${name.en} on ${square} to give check.`,
      fr: `Parachutez ${name.fr} en ${square} pour donner échec.`,
      es: `Suelta ${name.es} en ${square} para dar jaque.`,
      hand: hint.hand,
      target,
    };
  }

  const origin = transformSquare(hint.origin, mirror, shift);
  const piece = seed.position.board.find((item) => item.row === hint.origin[0] && item.col === hint.origin[1]);
  const name = PIECE_NAMES[piece?.type] || { ja: "駒", en: "piece", fr: "la pièce", es: "la pieza" };
  const fromSquare = squareLabel(origin, "en");
  const toSquare = squareLabel(target, "en");
  return {
    ja: `${squareLabel(origin, "ja")}の${name.ja}を${squareLabel(target, "ja")}へ動かし${hint.promote ? "、成って" : "て"}王手します。`,
    en: `Move the ${name.en} from ${fromSquare} to ${toSquare}${hint.promote ? " and promote" : ""} to give check.`,
    fr: `Jouez ${name.fr} de ${fromSquare} en ${toSquare}${hint.promote ? " avec promotion" : ""} pour donner échec.`,
    es: `Mueve ${name.es} de ${fromSquare} a ${toSquare}${hint.promote ? " y promueve la pieza" : ""} para dar jaque.`,
    origin,
    target,
    ...(hint.promote ? { promote: true } : {}),
  };
}

function practiceVariant(seedId, sequence, { mirror = false, shift = 0, extraBoard = [] } = {}) {
  const seed = BASE_PUZZLES.find((puzzle) => puzzle.id === seedId);
  const suffix = String(sequence).padStart(2, "0");
  const sourceHints = seed.hints || [{
    hand: seed.hintHand,
    origin: seed.hintHand ? null : seed.hintSquare,
    target: seed.hintTarget || seed.hintSquare,
    promote: seed.hintPromote,
  }];
  const hints = sourceHints.map((hint) => variantHint(seed, hint, mirror, shift));

  return {
    id: `${seed.id}-practice-${suffix}`,
    plies: seed.plies,
    title: {
      ja: `${seed.title.ja}・反復${sequence}`,
      en: `${seed.title.en} — Practice ${sequence}`,
      fr: `${seed.title.fr} — Exercice ${sequence}`,
      es: `${seed.title.es} — Práctica ${sequence}`,
    },
    prompt: {
      ja: `${seed.plies}手詰め。同じ詰み筋を、盤の別の場所でも見つけましょう。`,
      en: `Mate in ${seed.plies}. Find the same mating pattern in a different part of the board.`,
      fr: `Mat en ${seed.plies} coups. Retrouvez le même schéma de mat ailleurs sur le plateau.`,
      es: `Mate en ${seed.plies}. Encuentra el mismo patrón de mate en otra parte del tablero.`,
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
      fr: "Vous avez retrouvé le même schéma de mat dans une nouvelle position, sans pièce restante en main.",
      es: "Encontraste el mismo patrón de mate en una posición nueva, sin piezas sobrantes en mano.",
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

  practiceVariant("knight-silver-bishop-gold-relay", 1, { shift: -1 }),
  practiceVariant("knight-silver-bishop-gold-relay", 2, { shift: -2 }),
  practiceVariant("knight-silver-bishop-gold-relay", 3, { shift: -3 }),
  practiceVariant("knight-silver-bishop-gold-relay", 4, { mirror: true }),
  practiceVariant("knight-silver-bishop-gold-relay", 5, { mirror: true, shift: 1 }),
  practiceVariant("knight-silver-bishop-gold-relay", 6, { mirror: true, shift: 2 }),
  practiceVariant("knight-silver-bishop-gold-relay", 7, { mirror: true, shift: 3 }),

  practiceVariant("double-knight-silver-bishop-gold-relay", 1, { shift: -1 }),
  practiceVariant("double-knight-silver-bishop-gold-relay", 2, { mirror: true }),

  practiceVariant("silver-lure-gold-pincer", 1, { shift: -2 }),
  practiceVariant("knight-gold-corner-drive", 1, { mirror: true }),
  practiceVariant("corner-knight-net", 1, { mirror: true }),
  practiceVariant("double-silver-sacrifice-chase", 1, { mirror: true }),

  practiceVariant("dragon-bishop-board-relay", 1, { shift: 1 }),
  practiceVariant("dragon-bishop-board-relay", 2, { shift: 2 }),
  practiceVariant("dragon-bishop-board-relay", 3, { shift: 3 }),
  practiceVariant("dragon-bishop-board-relay", 4, { mirror: true }),
  practiceVariant("dragon-bishop-board-relay", 5, { mirror: true, shift: -2 }),

  practiceVariant("promoted-lance-dragon-board-relay", 1, { shift: -1 }),
  practiceVariant("promoted-lance-dragon-board-relay", 2, { mirror: true }),
  practiceVariant("promoted-lance-dragon-board-relay", 3, { mirror: true, shift: 1 }),
];

export const PUZZLES = [...BASE_PUZZLES, ...PRACTICE_PUZZLES];

export function puzzleState(puzzle) {
  return stateFromPosition(puzzle.position);
}
