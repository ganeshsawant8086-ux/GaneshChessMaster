import React, { useRef, useEffect } from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Copy, Check } from 'lucide-react';

/**
 * Move History Component with SAN notation, move scrubbing, and PGN export
 */
export const MoveHistory = ({
  moves = [], // array of verbose move objects from chess.js or SAN strings
  currentMoveIndex = -1, // -1 means live current position
  onNavigateMove,
  onFirstMove,
  onPrevMove,
  onNextMove,
  onLatestMove,
  pgn = ''
}) => {
  const containerRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  // Auto scroll to bottom on new move if viewing current move
  useEffect(() => {
    if (containerRef.current && currentMoveIndex === -1) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [moves.length, currentMoveIndex]);

  // Group moves into pairs (White move, Black move)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: { ...moves[i], index: i },
      black: moves[i + 1] ? { ...moves[i + 1], index: i + 1 } : null
    });
  }

  const handleCopyPgn = () => {
    if (!pgn) return;
    navigator.clipboard.writeText(pgn).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isLive = currentMoveIndex === -1 || currentMoveIndex === moves.length - 1;

  return (
    <div className="move-history-card">
      <div className="move-history-header">
        <h4 className="move-history-title">Move History ({moves.length} plies)</h4>
        <button
          className="pgn-copy-btn"
          onClick={handleCopyPgn}
          title="Copy PGN to clipboard"
          disabled={moves.length === 0}
        >
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'PGN'}</span>
        </button>
      </div>

      <div className="move-history-list" ref={containerRef}>
        {movePairs.length === 0 ? (
          <div className="empty-history-text">No moves made yet. Make your first move!</div>
        ) : (
          <table className="move-table">
            <tbody>
              {movePairs.map(pair => (
                <tr key={pair.number} className="move-row">
                  <td className="move-number">{pair.number}.</td>
                  <td
                    className={`move-san move-white ${
                      (currentMoveIndex === -1 && pair.white.index === moves.length - 1) ||
                      currentMoveIndex === pair.white.index
                        ? 'active-move'
                        : ''
                    }`}
                    onClick={() => onNavigateMove(pair.white.index)}
                  >
                    {pair.white.san}
                  </td>
                  <td
                    className={`move-san move-black ${
                      pair.black &&
                      ((currentMoveIndex === -1 && pair.black.index === moves.length - 1) ||
                        currentMoveIndex === pair.black.index)
                        ? 'active-move'
                        : ''
                    }`}
                    onClick={() => pair.black && onNavigateMove(pair.black.index)}
                  >
                    {pair.black ? pair.black.san : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Scrubber Navigation Buttons */}
      <div className="move-scrubber-controls">
        <button
          className="scrub-btn"
          onClick={onFirstMove}
          disabled={moves.length === 0 || currentMoveIndex === -1 ? false : currentMoveIndex === 0}
          title="First move (Home)"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          className="scrub-btn"
          onClick={onPrevMove}
          disabled={moves.length === 0 || currentMoveIndex === 0}
          title="Previous move (Left arrow)"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          className="scrub-btn"
          onClick={onNextMove}
          disabled={isLive || moves.length === 0}
          title="Next move (Right arrow)"
        >
          <ChevronRight size={16} />
        </button>
        <button
          className="scrub-btn"
          onClick={onLatestMove}
          disabled={isLive || moves.length === 0}
          title="Latest move (End)"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};
