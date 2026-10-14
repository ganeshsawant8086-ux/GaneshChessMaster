import React, { useState } from 'react';
import { Piece } from './Piece';
import { PromotionModal } from './PromotionModal';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

/**
 * 8x8 Interactive Responsive Chessboard
 */
export const ChessBoard = ({
  chess,
  boardState, // 8x8 array from chess.board()
  isFlipped = false,
  is3D = false,
  theme = 'emerald',
  pieceStyle = 'classic',
  showCoordinates = true,
  showLegalMoves = true,
  autoQueen = false,
  lastMove = null, // { from, to }
  hintMove = null, // { from, to }
  isAiThinking = false,
  onMove, // callback ({ from, to, promotion })
  soundEnabled = true
}) => {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalTargetSquares, setLegalTargetSquares] = useState([]);
  const [pendingPromotion, setPendingPromotion] = useState(null); // { from, to, color }
  const [draggedSquare, setDraggedSquare] = useState(null);

  // Check if King is in check
  const inCheck = chess ? chess.inCheck() : false;
  const currentTurn = chess ? chess.turn() : 'w';

  // Find the king's square for check highlight
  let kingInCheckSquare = null;
  if (inCheck && boardState) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = boardState[r][c];
        if (piece && piece.type === 'k' && piece.color === currentTurn) {
          kingInCheckSquare = `${FILES[c]}${RANKS[r]}`;
          break;
        }
      }
    }
  }

  // Get legal moves for a given square
  const getMovesForSquare = (sq) => {
    if (!chess) return [];
    try {
      const verboseMoves = chess.moves({ square: sq, verbose: true });
      return verboseMoves.map(m => ({
        to: m.to,
        isCapture: !!m.captured,
        promotion: m.promotion
      }));
    } catch {
      return [];
    }
  };

  // Handle clicking a square
  const handleSquareClick = (squareKey, piece) => {
    if (isAiThinking) return;

    // 1. If we already have a square selected, see if clicked square is a legal destination
    if (selectedSquare) {
      const matchMove = legalTargetSquares.find(m => m.to === squareKey);

      if (matchMove) {
        attemptMove(selectedSquare, squareKey, matchMove);
        setSelectedSquare(null);
        setLegalTargetSquares([]);
        return;
      }

      // If clicked the same square, deselect
      if (selectedSquare === squareKey) {
        setSelectedSquare(null);
        setLegalTargetSquares([]);
        return;
      }
    }

    // 2. If clicking on own piece, select it and compute legal moves
    if (piece && piece.color === currentTurn) {
      setSelectedSquare(squareKey);
      const moves = getMovesForSquare(squareKey);
      setLegalTargetSquares(moves);
    } else {
      setSelectedSquare(null);
      setLegalTargetSquares([]);
    }
  };

  // Execute or initiate move (handles pawn promotion check)
  const attemptMove = (from, to, moveInfo) => {
    const fromPiece = getPieceAtSquare(from);
    const isPawn = fromPiece && fromPiece.type === 'p';
    const isPromotionRank = (fromPiece?.color === 'w' && to[1] === '8') || (fromPiece?.color === 'b' && to[1] === '1');

    if (isPawn && isPromotionRank) {
      if (autoQueen) {
        onMove({ from, to, promotion: 'q' });
      } else {
        setPendingPromotion({ from, to, color: fromPiece.color });
      }
      return;
    }

    // Regular move
    onMove({ from, to, promotion: 'q' });
  };

  const handlePromotionSelect = (promoPiece) => {
    if (pendingPromotion) {
      onMove({
        from: pendingPromotion.from,
        to: pendingPromotion.to,
        promotion: promoPiece
      });
      setPendingPromotion(null);
    }
  };

  // Helper to fetch piece at notation square 'e4'
  const getPieceAtSquare = (squareKey) => {
    if (!boardState) return null;
    const fileIdx = FILES.indexOf(squareKey[0]);
    const rankIdx = RANKS.indexOf(squareKey[1]);
    if (fileIdx === -1 || rankIdx === -1) return null;
    return boardState[rankIdx][fileIdx];
  };

  // Drag and Drop handlers
  const handleDragStart = (e, squareKey, piece) => {
    if (isAiThinking || !piece || piece.color !== currentTurn) {
      e.preventDefault();
      return;
    }
    setDraggedSquare(squareKey);
    setSelectedSquare(squareKey);
    setLegalTargetSquares(getMovesForSquare(squareKey));
    e.dataTransfer.setData('text/plain', squareKey);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetSquare) => {
    e.preventDefault();
    if (!draggedSquare) return;

    const matchMove = legalTargetSquares.find(m => m.to === targetSquare);
    if (matchMove) {
      attemptMove(draggedSquare, targetSquare, matchMove);
    }

    setDraggedSquare(null);
    setSelectedSquare(null);
    setLegalTargetSquares([]);
  };

  // Determine ranks & files order based on board flip
  const displayRanks = isFlipped ? [...RANKS].reverse() : RANKS;
  const displayFiles = isFlipped ? [...FILES].reverse() : FILES;

  return (
    <div className={`chess-scene-container ${is3D ? 'scene-3d-active' : ''}`}>
      <div className={`chess-board-wrapper theme-${theme} ${is3D ? 'is-3d-view' : ''}`}>
        <div className="chess-board">
          {displayRanks.map((rank, rankIdx) => (
            <div key={rank} className="board-row">
              {displayFiles.map((file, fileIdx) => {
                const squareKey = `${file}${rank}`;
                const actualFileIdx = FILES.indexOf(file);
                const actualRankIdx = RANKS.indexOf(rank);
                const piece = boardState ? boardState[actualRankIdx][actualFileIdx] : null;

                const isLight = (actualFileIdx + actualRankIdx) % 2 === 0;
                const isSelected = selectedSquare === squareKey;
                const isLegalMove = showLegalMoves && legalTargetSquares.some(m => m.to === squareKey);
                const isCaptureMove = isLegalMove && (piece !== null || (selectedSquare && getPieceAtSquare(selectedSquare)?.type === 'p' && file !== selectedSquare[0]));
                const isLastMoveSquare = lastMove && (lastMove.from === squareKey || lastMove.to === squareKey);
                const isHintSquare = hintMove && (hintMove.from === squareKey || hintMove.to === squareKey);
                const isKingInCheck = kingInCheckSquare === squareKey;

                return (
                  <div
                    key={squareKey}
                    data-square={squareKey}
                    className={`board-square ${isLight ? 'square-light' : 'square-dark'} ${
                      isSelected ? 'square-selected' : ''
                    } ${isLastMoveSquare ? 'square-last-move' : ''} ${
                      isKingInCheck ? 'square-in-check' : ''
                    } ${isHintSquare ? 'square-hint' : ''}`}
                    onClick={() => handleSquareClick(squareKey, piece)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, squareKey)}
                  >
                    {/* Square Coordinates */}
                    {showCoordinates && (
                      <>
                        {/* Rank coordinate on first file */}
                        {fileIdx === 0 && (
                          <span className="coord-rank">{rank}</span>
                        )}
                        {/* File coordinate on bottom rank */}
                        {rankIdx === 7 && (
                          <span className="coord-file">{file}</span>
                        )}
                      </>
                    )}

                    {/* Grounded 3D Base Shadow on Square */}
                    {is3D && piece && (
                      <div className="piece-3d-ground-shadow"></div>
                    )}

                    {/* Corner Bracket Reticle for Selected Square & Last Move */}
                    {(isSelected || isLastMoveSquare) && (
                      <div className={`square-corner-brackets ${isSelected ? 'brackets-selected' : 'brackets-last-move'}`}>
                        <span className="bracket bracket-tl"></span>
                        <span className="bracket bracket-tr"></span>
                        <span className="bracket bracket-bl"></span>
                        <span className="bracket bracket-br"></span>
                      </div>
                    )}

                    {/* Piece */}
                    {piece && (
                      <div
                        className={`piece-container ${piece.color === currentTurn && !isAiThinking ? 'piece-movable' : ''}`}
                        draggable={piece.color === currentTurn && !isAiThinking}
                        onDragStart={(e) => handleDragStart(e, squareKey, piece)}
                      >
                        <Piece
                          type={piece.type}
                          color={piece.color}
                          styleType={pieceStyle}
                          is3D={is3D}
                        />
                      </div>
                    )}

                    {/* Legal Move Indicators */}
                    {isLegalMove && !isCaptureMove && (
                      <div className="legal-move-dot"></div>
                    )}
                    {isCaptureMove && (
                      <div className="legal-capture-ring"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Promotion Modal */}
        {pendingPromotion && (
          <PromotionModal
            color={pendingPromotion.color}
            onSelect={handlePromotionSelect}
            onCancel={() => setPendingPromotion(null)}
          />
        )}
      </div>
    </div>
  );
};
