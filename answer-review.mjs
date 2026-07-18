import { DEFENSE, applyMove, stateFromPosition } from "./game-core.mjs";

// 巻き戻しは逆向きの指し手を作らず、初期局面から指定手数まで再生して復元する。
// これにより、駒取り・成り・持ち駒の増減も通常の着手処理と同じ結果になる。
export function replayAnswerPrefix(puzzle, answerLine, cursor) {
  const boundedCursor = Math.max(0, Math.min(Number(cursor) || 0, answerLine.length));
  let state = stateFromPosition(puzzle.position);
  const moveHistory = [];
  let attackerStep = 0;

  for (const move of answerLine.slice(0, boundedCursor)) {
    state = applyMove(state, move);
    moveHistory.push(move);
    if (move.side === DEFENSE) attackerStep += 1;
  }

  return {
    state,
    moveHistory,
    playedPlies: boundedCursor,
    attackerStep,
  };
}
