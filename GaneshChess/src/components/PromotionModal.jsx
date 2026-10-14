import React from 'react';
import { Piece } from './Piece';

/**
 * Pawn Promotion Modal to select Queen, Rook, Bishop, or Knight
 */
export const PromotionModal = ({ color = 'w', onSelect, onCancel }) => {
  const pieces = [
    { type: 'q', label: 'Queen' },
    { type: 'r', label: 'Rook' },
    { type: 'b', label: 'Bishop' },
    { type: 'n', label: 'Knight' }
  ];

  return (
    <div className="modal-backdrop promotion-backdrop" onClick={onCancel}>
      <div className="promotion-modal" onClick={e => e.stopPropagation()}>
        <h3 className="promotion-title">Promote Pawn</h3>
        <p className="promotion-subtitle">Select a piece to promote to:</p>
        <div className="promotion-options">
          {pieces.map(p => (
            <button
              key={p.type}
              className="promotion-btn"
              onClick={() => onSelect(p.type)}
              title={p.label}
            >
              <div className="promotion-piece-icon">
                <Piece type={p.type} color={color} size="64px" />
              </div>
              <span className="promotion-btn-label">{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
