import React from 'react';
import { User, Bot, Clock } from 'lucide-react';
import { Piece } from './Piece';

/**
 * Player Card component showing name, avatar, captured pieces, and live digital clock
 */
export const PlayerCard = ({
  player, // { name, isAi, difficulty, color }
  isTurn,
  timeLeft, // in seconds, null if unlimited
  capturedPieces = [], // array of piece type characters ['p', 'n']
  materialScore = 0, // e.g. +3
  lowTimeThreshold = 30
}) => {
  const isWhite = player.color === 'w';
  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '∞';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isLowTime = timeLeft !== null && timeLeft <= lowTimeThreshold;

  // Group captured pieces for tidy display
  const pieceCounts = capturedPieces.reduce((acc, p) => {
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  // Sorting order: Q, R, B, N, P
  const pieceOrder = ['q', 'r', 'b', 'n', 'p'];
  const oppositeColor = isWhite ? 'b' : 'w';

  return (
    <div className={`player-card ${isTurn ? 'player-card-active' : ''} ${isWhite ? 'player-white' : 'player-black'}`}>
      <div className="player-info-section">
        <div className={`player-avatar ${player.isAi ? 'avatar-ai' : 'avatar-user'}`}>
          {player.isAi ? <Bot size={22} /> : <User size={22} />}
        </div>
        <div className="player-details">
          <div className="player-name-row">
            <span className="player-name">{player.name}</span>
            {player.isAi && (
              <span className={`ai-badge badge-${player.difficulty || 'medium'}`}>
                {player.difficulty ? player.difficulty.toUpperCase() : 'AI'}
              </span>
            )}
            <span className={`color-indicator color-${isWhite ? 'w' : 'b'}`} title={isWhite ? 'Plays White' : 'Plays Black'}>
              {isWhite ? 'White' : 'Black'}
            </span>
          </div>

          {/* Captured pieces and material difference */}
          <div className="captured-pieces-row">
            <div className="captured-list">
              {pieceOrder.map(type => {
                const count = pieceCounts[type];
                if (!count) return null;
                return (
                  <div key={type} className="captured-item" title={`${count} captured ${type}`}>
                    <Piece type={type} color={oppositeColor} size="16px" />
                    {count > 1 && <span className="captured-count">×{count}</span>}
                  </div>
                );
              })}
            </div>
            {materialScore > 0 && (
              <span className="material-score">+{materialScore}</span>
            )}
          </div>
        </div>
      </div>

      {/* Clock */}
      <div className={`player-clock ${isTurn ? 'clock-active' : ''} ${isLowTime ? 'clock-low-time' : ''}`}>
        <Clock size={16} className="clock-icon" />
        <span className="clock-digits">{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};
