import React from 'react';
import { RotateCcw, RotateCw, Flag, Handshake, Lightbulb, PlusCircle, ArrowUpDown } from 'lucide-react';

/**
 * Game Controls bar with Undo, Restart, New Game, Flip, Resign, Draw, Hint
 */
export const GameControls = ({
  onUndo,
  canUndo,
  onRestart,
  onNewGame,
  onFlipBoard,
  onResign,
  onOfferDraw,
  onHint,
  showHintBtn = true,
  isGameOver = false,
  isAiThinking = false
}) => {
  return (
    <div className="game-controls-container">
      <div className="primary-controls-grid">
        <button
          className="control-btn btn-undo"
          onClick={onUndo}
          disabled={!canUndo || isAiThinking}
          title="Undo last move"
        >
          <RotateCcw size={18} />
          <span>Undo</span>
        </button>

        <button
          className="control-btn btn-restart"
          onClick={onRestart}
          disabled={isAiThinking}
          title="Restart match with current settings"
        >
          <RotateCw size={18} />
          <span>Restart</span>
        </button>

        <button
          className="control-btn btn-flip"
          onClick={onFlipBoard}
          title="Flip board perspective"
        >
          <ArrowUpDown size={18} />
          <span>Flip</span>
        </button>

        {showHintBtn && (
          <button
            className="control-btn btn-hint"
            onClick={onHint}
            disabled={isGameOver || isAiThinking}
            title="Get tactical advice or best move"
          >
            <Lightbulb size={18} />
            <span>Hint</span>
          </button>
        )}
      </div>

      <div className="secondary-controls-grid">
        <button
          className="control-btn btn-action-subtle btn-resign"
          onClick={onResign}
          disabled={isGameOver || isAiThinking}
          title="Resign game"
        >
          <Flag size={16} />
          <span>Resign</span>
        </button>

        <button
          className="control-btn btn-action-subtle btn-draw"
          onClick={onOfferDraw}
          disabled={isGameOver || isAiThinking}
          title="Offer a draw"
        >
          <Handshake size={16} />
          <span>Offer Draw</span>
        </button>

        <button
          className="control-btn btn-primary-gradient btn-new-game"
          onClick={onNewGame}
          title="Start a new game"
        >
          <PlusCircle size={17} />
          <span>New Game</span>
        </button>
      </div>
    </div>
  );
};
