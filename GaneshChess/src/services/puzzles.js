// Curated interactive tactical puzzles for Practice Mode

export const CHESS_PUZZLES = [
  {
    id: 'back_rank_1',
    title: 'Back-Rank Decimation',
    category: 'Checkmate',
    difficulty: 'Easy',
    fen: '6k1/5ppp/8/8/8/8/5PPP/1R4K1 w - - 0 1',
    turn: 'w',
    prompt: 'White to move and deliver an instant checkmate!',
    solution: ['Rb8#'],
    hint: 'The enemy king is trapped behind its own shield of pawns. Deliver check on the 8th rank!',
    explanation: 'Rb8# delivers a classic back-rank checkmate because Black has no luft (escape square).'
  },
  {
    id: 'royal_fork_1',
    title: 'The Royal Knight Fork',
    category: 'Tactics',
    difficulty: 'Medium',
    fen: 'r1bqk2r/pp1p1ppp/2n5/1B2p3/4n3/2P2N2/P1P2PPP/R1BQK2R w KQkq - 0 9',
    turn: 'w',
    prompt: 'Find the sharpest move to fork or regain central initiative.',
    solution: ['Qd5'],
    hint: 'Look for a double attack with your Queen targeting both the e4 knight and e5 square.',
    explanation: 'Qd5 creates a deadly double threat attacking the loose knight on e4 and threatening mate/e5.'
  },
  {
    id: 'queen_sacrifice_mate',
    title: "Opera Game Mate",
    category: 'Masterpiece',
    difficulty: 'Hard',
    fen: '4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 1 1',
    turn: 'w',
    prompt: 'White to move and force checkmate in 2 moves!',
    solution: ['Qb8+', 'Nxb8', 'Rd8#'],
    hint: 'Sacrifice the queen on the back rank to deflect the defender!',
    explanation: '1. Qb8+! Nxb8 2. Rd8# is the famous Morphy Opera Game finish, utilizing the pinning bishop.'
  },
  {
    id: 'scholars_finish',
    title: "The Four-Move Trap",
    category: 'Checkmate',
    difficulty: 'Beginner',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 2 3',
    turn: 'w',
    prompt: 'Deliver mate on the weak f7 square.',
    solution: ['Qxf7#'],
    hint: 'Notice the f7 pawn is undefended except by the king, while the bishop and queen battery are aimed right at it!',
    explanation: 'Qxf7# delivers the famous Scholar\'s Mate.'
  },
  {
    id: 'anastasias_mate',
    title: "Anastasia's Mate",
    category: 'Checkmate',
    difficulty: 'Hard',
    fen: '5rk1/1p3ppp/pN6/8/4n3/8/PPP2PPP/3R2K1 w - - 0 1',
    turn: 'w',
    prompt: 'White can win the black knight or secure dominant rank control.',
    solution: ['Nd7'],
    hint: 'Attack the rook and dominate the open file.',
    explanation: 'Nd7 attacks the rook on f8 while sealing off king escape avenues.'
  }
];
