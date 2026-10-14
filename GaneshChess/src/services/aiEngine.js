// Intelligent Chess AI Engine with Alpha-Beta Pruning, PST, Opening Book, and Evaluation Bar

// Standard piece values
const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-Square Tables (White perspective - 8x8 flattened a8 to h1 or row 0 to 7)
// Higher values encourage pieces to occupy strong squares (center control, king safety, knight outposts)
const PST = {
  p: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  r: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
  ],
  q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  k: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
  ]
};

// Opening Book moves for popular responses
const OPENING_BOOK = {
  // Initial moves for white
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -': ['e4', 'd4', 'Nf3', 'c4'],
  // 1. e4 responses for black
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3': ['e5', 'c5', 'e6', 'c6'],
  // 1. d4 responses for black
  'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3': ['d5', 'Nf6', 'e6', 'c5'],
  // 1. e4 e5 2. Nf3
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -': ['Nc6', 'Nf6', 'd6'],
  // 1. d4 d5 2. c4 (Queen's Gambit)
  'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3': ['e6', 'c6', 'dxc4'],
};

/**
 * Static position evaluation function (from White's perspective)
 * Positive = White advantage, Negative = Black advantage
 */
export function evaluateBoard(chess) {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -99999 : 99999;
  }
  if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition()) {
    return 0;
  }

  let totalScore = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const type = piece.type;
      const isWhite = piece.color === 'w';
      const val = PIECE_VALUES[type] || 0;

      // PST row index (invert for black)
      const pstRow = isWhite ? r : 7 - r;
      const pstVal = (PST[type] && PST[type][pstRow][c]) || 0;

      const pieceTotal = val + pstVal;
      totalScore += isWhite ? pieceTotal : -pieceTotal;
    }
  }

  return totalScore;
}

/**
 * Returns evaluation score in pawns (e.g. +1.4 or -0.8) and percentage for EvalBar
 */
export function getEvaluationDisplay(chess) {
  if (!chess) return { score: 0, text: '0.0', whiteWinPct: 50 };

  if (chess.isCheckmate()) {
    const winner = chess.turn() === 'w' ? 'Black' : 'White';
    return {
      score: chess.turn() === 'w' ? -100 : 100,
      text: winner === 'White' ? '+M' : '-M',
      whiteWinPct: winner === 'White' ? 100 : 0
    };
  }

  if (chess.isDraw()) {
    return { score: 0, text: '0.0', whiteWinPct: 50 };
  }

  const cp = evaluateBoard(chess);
  const pawns = (cp / 100).toFixed(1);
  const text = (cp > 0 ? '+' : '') + pawns;

  // Logistic win probability curve like Lichess: P = 1 / (1 + 10^(-score/400))
  const winPct = 1 / (1 + Math.pow(10, -cp / 400));
  const whiteWinPct = Math.min(98, Math.max(2, Math.round(winPct * 100)));

  return {
    score: cp,
    text,
    whiteWinPct
  };
}

/**
 * Move ordering for faster alpha-beta pruning:
 * 1. Captures with MVV-LVA (Most Valuable Victim - Least Valuable Attacker)
 * 2. Checks
 * 3. Quiet moves
 */
function orderMoves(chess, moves) {
  return moves.map(m => {
    let weight = 0;
    if (m.captured) {
      const victim = PIECE_VALUES[m.captured] || 0;
      const attacker = PIECE_VALUES[m.piece] || 0;
      weight += 1000 + (victim * 10 - attacker);
    }
    if (m.promotion) {
      weight += 800;
    }
    if (m.san && m.san.includes('+')) {
      weight += 200;
    }
    return { move: m, weight };
  }).sort((a, b) => b.weight - a.weight).map(item => item.move);
}

/**
 * Quiescence search to avoid the horizon effect on tactical captures
 */
function quiescence(chess, alpha, beta, isMaximizing, depth = 0) {
  const standPat = evaluateBoard(chess);
  if (depth >= 2) return standPat;

  if (isMaximizing) {
    if (standPat >= beta) return beta;
    if (standPat > alpha) alpha = standPat;

    // Only search captures
    const captureMoves = chess.moves({ verbose: true }).filter(m => m.captured);
    for (const move of captureMoves) {
      chess.move(move);
      const score = quiescence(chess, alpha, beta, false, depth + 1);
      chess.undo();

      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  } else {
    if (standPat <= alpha) return alpha;
    if (standPat < beta) beta = standPat;

    const captureMoves = chess.moves({ verbose: true }).filter(m => m.captured);
    for (const move of captureMoves) {
      chess.move(move);
      const score = quiescence(chess, alpha, beta, true, depth + 1);
      chess.undo();

      if (score <= alpha) return alpha;
      if (score < beta) beta = score;
    }
    return beta;
  }
}

/**
 * Minimax with Alpha-Beta Pruning
 */
function minimax(chess, depth, alpha, beta, isMaximizing) {
  if (depth === 0 || chess.isGameOver()) {
    return quiescence(chess, alpha, beta, isMaximizing, 0);
  }

  const rawMoves = chess.moves({ verbose: true });
  const moves = orderMoves(chess, rawMoves);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();

      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();

      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Primary AI Move Selector
 * Supports difficulty: 'easy', 'medium', 'hard'
 */
export async function getBestMove(chess, difficulty = 'medium') {
  const legalMoves = chess.moves({ verbose: true });
  if (legalMoves.length === 0) return null;

  // 1. Check opening book if in early game
  const fenPrefix = chess.fen().split(' ').slice(0, 4).join(' ');
  const bookMoves = OPENING_BOOK[fenPrefix];
  if (bookMoves && bookMoves.length > 0) {
    const matched = bookMoves
      .map(bm => chess.moves().find(m => m === bm))
      .filter(Boolean);
    if (matched.length > 0) {
      const chosen = matched[Math.floor(Math.random() * matched.length)];
      return chosen;
    }
  }

  // 2. Easy mode: Random with 40% bias toward capturing or moving forward
  if (difficulty === 'easy') {
    // 35% random blunder or simple move
    if (Math.random() < 0.35) {
      const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
      return randomMove;
    }
    // Otherwise pick a quick 1-ply capture or check
    const captures = legalMoves.filter(m => m.captured || m.san.includes('+'));
    if (captures.length > 0 && Math.random() < 0.7) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    // Or 1-ply minimax
    return findBestMoveAtDepth(chess, 1);
  }

  // 3. Medium mode: Depth 2-3 with PST
  if (difficulty === 'medium') {
    return findBestMoveAtDepth(chess, 2);
  }

  // 4. Hard mode: Depth 3-4 with quiescence and move ordering
  return findBestMoveAtDepth(chess, 3);
}

function findBestMoveAtDepth(chess, depth) {
  const isWhite = chess.turn() === 'w';
  const rawMoves = chess.moves({ verbose: true });
  const moves = orderMoves(chess, rawMoves);

  let bestMove = moves[0];
  let bestValue = isWhite ? -Infinity : Infinity;

  for (const move of moves) {
    chess.move(move);
    const value = minimax(chess, depth - 1, -Infinity, Infinity, !isWhite);
    chess.undo();

    if (isWhite) {
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    } else {
      if (value < bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }
  }

  return bestMove;
}

/**
 * Hint generator for Practice Mode
 * Explains WHY this move is strong
 */
export function getTacticalHint(chess) {
  const bestMove = findBestMoveAtDepth(chess, 3);
  if (!bestMove) return null;

  let rationale = `Play ${bestMove.san}`;
  if (bestMove.captured) {
    rationale += ` to capture the ${bestMove.captured.toUpperCase()} on ${bestMove.to}.`;
  } else if (bestMove.san.includes('+')) {
    rationale += ` to deliver a powerful check to the enemy king!`;
  } else if (bestMove.san === 'O-O' || bestMove.san === 'O-O-O') {
    rationale += ` to castle and safeguard your king while activating your rook.`;
  } else if (['e4', 'd4', 'e5', 'd5', 'c4', 'c5'].includes(bestMove.to)) {
    rationale += ` to seize control of the critical center squares.`;
  } else if (bestMove.piece === 'n' || bestMove.piece === 'b') {
    rationale += ` to develop a minor piece and prepare for kingside castling.`;
  } else {
    rationale += ` to improve piece activity and positional dominance.`;
  }

  return {
    move: bestMove,
    from: bestMove.from,
    to: bestMove.to,
    san: bestMove.san,
    explanation: rationale
  };
}
