import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Frown, Handshake, RotateCw, Compass, PlusCircle } from 'lucide-react';

/**
 * Game Over celebration modal with outcome, statistics, confetti, and rematch options
 */
export const GameOverModal = ({
  result, // 'win' | 'loss' | 'draw'
  title, // e.g. "Checkmate! White Wins!"
  reason, // e.g. "Checkmate", "Stalemate", "Time out", "Resignation"
  moveCount,
  onRematch,
  onNewGame,
  onAnalyze,
  onClose
}) => {
  useEffect(() => {
    if (result === 'win') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // fail-safe
      }
    }
  }, [result]);

  const getResultIcon = () => {
    if (result === 'win') return <Trophy className="result-modal-icon icon-win" size={54} />;
    if (result === 'loss') return <Frown className="result-modal-icon icon-loss" size={54} />;
    return <Handshake className="result-modal-icon icon-draw" size={54} />;
  };

  const getResultTitle = () => {
    if (title) return title;
    if (result === 'win') return 'Victory!';
    if (result === 'loss') return 'Game Over';
    return 'Draw!';
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="game-over-modal" onClick={e => e.stopPropagation()}>
        <div className={`modal-glow glow-${result}`}></div>

        <div className="modal-icon-wrapper">
          {getResultIcon()}
        </div>

        <h2 className="game-over-title">{getResultTitle()}</h2>
        <p className="game-over-reason">{reason}</p>

        <div className="game-stats-pill">
          <div className="stat-item">
            <span className="stat-label">Moves</span>
            <span className="stat-val">{moveCount}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">Result</span>
            <span className={`stat-val val-${result}`}>{result.toUpperCase()}</span>
          </div>
        </div>

        <div className="modal-actions-list">
          <button className="btn-modal-primary" onClick={onRematch}>
            <RotateCw size={18} />
            <span>Rematch</span>
          </button>

          <button className="btn-modal-secondary" onClick={onAnalyze}>
            <Compass size={18} />
            <span>Analyze Game</span>
          </button>

          <button className="btn-modal-subtle" onClick={onNewGame}>
            <PlusCircle size={18} />
            <span>New Game Setup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
