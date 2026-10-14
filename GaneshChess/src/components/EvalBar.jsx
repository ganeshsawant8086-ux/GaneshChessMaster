import React from 'react';

/**
 * Vertical Evaluation Bar showing live game advantage
 */
export const EvalBar = ({ evaluation, isFlipped = false }) => {
  const { text, whiteWinPct = 50 } = evaluation || { text: '0.0', whiteWinPct: 50 };

  // Calculate percentage of White bar (White from bottom when not flipped, or top if flipped)
  const displayWhitePct = isFlipped ? 100 - whiteWinPct : whiteWinPct;

  return (
    <div className="eval-bar-container" title={`Evaluation: ${text} (${whiteWinPct}% White win chance)`}>
      <div className="eval-bar-track">
        {/* Black side (top if not flipped, bottom if flipped) */}
        <div
          className="eval-bar-black"
          style={{ height: `${100 - displayWhitePct}%` }}
        />
        {/* White side */}
        <div
          className="eval-bar-white"
          style={{ height: `${displayWhitePct}%` }}
        />
      </div>
      <div className="eval-bar-badge">
        <span>{text}</span>
      </div>
    </div>
  );
};
