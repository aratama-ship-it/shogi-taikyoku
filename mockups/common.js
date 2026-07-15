// 共通: 初期配置の盤面データとレンダリング
const INITIAL = [
  ["香","桂","銀","金","玉","金","銀","桂","香"],
  ["","飛","","","","","","角",""],
  ["歩","歩","歩","歩","歩","歩","歩","歩","歩"],
  ["","","","","","","","",""],
  ["","","","","","","","",""],
  ["","","","","","","","",""],
  ["歩","歩","歩","歩","歩","歩","歩","歩","歩"],
  ["","角","","","","","","飛",""],
  ["香","桂","銀","金","王","金","銀","桂","香"],
];

// row 0-2 = 後手(gote), row 6-8 = 先手(sente)
function renderBoard(container, opts = {}) {
  const board = document.createElement("div");
  board.className = "board";
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      const kanji = INITIAL[r][c];
      if (kanji) {
        const isGote = r <= 2;
        const piece = document.createElement("div");
        piece.className = "piece " + (isGote ? "gote" : "sente");
        piece.innerHTML = `<span>${kanji}</span>`;
        cell.appendChild(piece);
      }
      // デモ用: 選択中の駒と移動可能マスの表現(7六歩を選択した想定)
      if (opts.demo) {
        if (r === 6 && c === 2) cell.classList.add("selected");
        if (r === 5 && c === 2) cell.classList.add("movable");
      }
      board.appendChild(cell);
    }
  }
  container.appendChild(board);
}

function renderHand(container, side, pieces) {
  const hand = document.createElement("div");
  hand.className = "hand " + side;
  pieces.forEach(([kanji, count]) => {
    const p = document.createElement("div");
    p.className = "hand-piece";
    p.innerHTML = `<span class="hp-kanji">${kanji}</span>` +
      (count > 1 ? `<span class="hp-count">${count}</span>` : "");
    hand.appendChild(p);
  });
  container.appendChild(hand);
}
