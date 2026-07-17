import {
  ATTACK,
  DEFENSE,
  applyMove,
  chooseLongestDefense,
  generateLegalMoves,
  isMate,
  stateFromPosition,
} from "./game-core.mjs";

function hintForStep(puzzle, attackerStep) {
  if (puzzle.hints) return puzzle.hints[attackerStep];
  return {
    hand: puzzle.hintHand,
    origin: puzzle.hintHand ? null : puzzle.hintSquare,
    target: puzzle.hintTarget || puzzle.hintSquare,
    promote: puzzle.hintPromote,
  };
}

function matchesPlan(move, plan) {
  if (!plan || move.toRow !== plan.target?.[0] || move.toCol !== plan.target?.[1]) return false;
  if (plan.promote === true && move.promote !== true) return false;
  if (plan.hand) return move.kind === "drop" && move.type === plan.hand;
  return move.kind === "board"
    && move.fromRow === plan.origin?.[0]
    && move.fromCol === plan.origin?.[1];
}

function moveWithType(state, move) {
  const type = move.kind === "drop" ? move.type : state.board[move.fromRow][move.fromCol]?.type;
  return { ...move, type };
}

// 検証済みのヒントと玉方応手を、盤面再生用の完全手順へ変換する。
export function buildAnswerLine(puzzle) {
  let state = stateFromPosition(puzzle.position);
  let remaining = puzzle.plies;
  let attackerStep = 0;
  const line = [];

  while (remaining > 0) {
    const plan = hintForStep(puzzle, attackerStep);
    const attackCandidates = generateLegalMoves(state, ATTACK).filter((move) => matchesPlan(move, plan));
    const attack = attackCandidates.find((move) => move.promote === Boolean(plan?.promote)) || attackCandidates[0];
    if (!attack) return null;

    line.push(moveWithType(state, attack));
    state = applyMove(state, attack);
    remaining -= 1;
    if (isMate(state, DEFENSE)) break;
    if (remaining <= 0) return null;

    const defensePlan = puzzle.responses?.[attackerStep];
    const defense = generateLegalMoves(state, DEFENSE).find((move) => matchesPlan(move, defensePlan))
      || chooseLongestDefense(state, remaining);
    if (!defense) return null;

    line.push(moveWithType(state, defense));
    state = applyMove(state, defense);
    remaining -= 1;
    attackerStep += 1;
  }

  return line.length === puzzle.plies && isMate(state, DEFENSE) ? line : null;
}
