import React from 'react';

/**
 * High-definition Vector Chess Pieces (Staunton/Neo Standard)
 * Supports piece type: 'p' (pawn), 'n' (knight), 'b' (bishop), 'r' (rook), 'q' (queen), 'k' (king)
 * and color: 'w' (white), 'b' (black)
 */
export const Piece = ({ type, color, size = '100%', styleType = 'classic', className = '' }) => {
  const isWhite = color === 'w';

  // Gradient IDs for rich visual styling
  const whiteFill = styleType === 'royal' ? '#fff9e6' : '#ffffff';
  const whiteStroke = styleType === 'royal' ? '#bfa15f' : '#262421';
  const blackFill = styleType === 'royal' ? '#2c221e' : '#302e2b';
  const blackStroke = styleType === 'royal' ? '#c4a768' : '#e8e6e3';

  // Pre-configured paths for Neo Staunton pieces
  const renderSVGContent = () => {
    switch (type.toLowerCase()) {
      case 'k': // King
        return (
          <g fill={isWhite ? whiteFill : blackFill} stroke={isWhite ? whiteStroke : blackStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Cross */}
            <path d="M22.5 11.5V6M20 9h5" stroke={isWhite ? whiteStroke : blackStroke} strokeWidth="1.6" />
            {/* Crown */}
            <path d="M22.5 25c0 0 4.5-7.5 3-10.5-1-2-3-2-3-2s-2 0-3 2c-1.5 3 3 10.5 3 10.5" fill={isWhite ? whiteFill : blackFill} />
            <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-2-4-8-1.5-8-1.5s-2-3.5-8-3.5-8 3.5-8 3.5-6-2.5-8 1.5c-3 6 6 10.5 6 10.5v7z" />
            <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
            {/* Base */}
            <path d="M11.5 37c0 3 2 5 11 5s11-2 11-5" />
          </g>
        );

      case 'q': // Queen
        return (
          <g fill={isWhite ? whiteFill : blackFill} stroke={isWhite ? whiteStroke : blackStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-6-15-4.5 15-4.5-15-6 15-7-11 2 12z" />
            <circle cx="6" cy="12" r="2" />
            <circle cx="14" cy="9" r="2" />
            <circle cx="22.5" cy="8" r="2" />
            <circle cx="31" cy="9" r="2" />
            <circle cx="39" cy="12" r="2" />
            <path d="M9 26c0 2 1.5 2 2.5 4 2.5 5 1 5.5 1 5.5h20s-1.5-.5 1-5.5c1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" />
            <path d="M11.5 30c3.5-1 17-1 22 0m-20.5 3.5c3.5-1 14-1 19 0" />
            <path d="M11 38.5c0 2.5 3 4.5 11.5 4.5s11.5-2 11.5-4.5" />
          </g>
        );

      case 'r': // Rook
        return (
          <g fill={isWhite ? whiteFill : blackFill} stroke={isWhite ? whiteStroke : blackStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Battlements */}
            <path d="M9 39h27v-5.5H9V39z" />
            <path d="M12 33.5l1.5-15h18l1.5 15H12z" />
            <path d="M9 18.5h27V12h-4v3h-5v-3h-5v3h-5v-3H9v6.5z" />
            <path d="M14 29.5c5-1 12-1 17 0" />
            <path d="M14 18.5h17" />
            <path d="M9 39c0 2.5 2.5 4.5 13.5 4.5s13.5-2 13.5-4.5" />
          </g>
        );

      case 'b': // Bishop
        return (
          <g fill={isWhite ? whiteFill : blackFill} stroke={isWhite ? whiteStroke : blackStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="22.5" cy="8" r="2" />
            <path d="M17.5 26c-1-5 2.5-11 5-14 2.5 3 6 9 5 14-1 4-3 5-5 5s-4-1-5-5z" />
            <path d="M15 17c3.5 3 6 4 9 0" />
            <path d="M12 34c3-1 6-2 10.5-2s7.5 1 10.5 2c0 2-2 4-10.5 4S12 36 12 34z" />
            <path d="M15 31.5c2.5-3 5-4 7.5-4s5 1 7.5 4" />
            <path d="M11 39c0 2.5 3 4.5 11.5 4.5s11.5-2 11.5-4.5" />
            {/* Slit */}
            <path d="M21 14l5 5" stroke={isWhite ? whiteStroke : blackStroke} strokeWidth="1.6" />
          </g>
        );

      case 'n': // Knight
        return (
          <g fill={isWhite ? whiteFill : blackFill} stroke={isWhite ? whiteStroke : blackStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10c-3 0-5 2-6 4-2 0-3.5 1.5-3.5 3.5 0 1 .5 2 1.5 2.5-.5 1-.5 2 0 3 .5 1 1.5 1.5 2.5 1.5l1 3.5s2 1 4 1 3.5-.5 4.5-2c1.5-2.5 1-6 2.5-8 .5-1 1-1.5 1.5-2-1-2-3.5-4.5-7.5-4.5z" />
            <path d="M12 37.5c2-4 4-7.5 8-11.5 3-3 5.5-4 8.5-5 2 2 3.5 5 2.5 8.5-.5 2-2 4-3.5 5.5-2 2-3 4.5-3 7.5h-12.5z" />
            <circle cx="16" cy="18" r="1.5" fill={isWhite ? whiteStroke : blackStroke} />
            <path d="M9.5 39.5c0 2.5 3.5 4 13 4s13-1.5 13-4h-26z" />
            <path d="M15 28.5c2.5-.5 5 0 7 1.5" />
          </g>
        );

      case 'p': // Pawn
      default:
        return (
          <g fill={isWhite ? whiteFill : blackFill} stroke={isWhite ? whiteStroke : blackStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="22.5" cy="12" r="5" />
            <path d="M19.5 18c-3 3-4 6-4 10 0 3 1.5 4.5 7 4.5s7-1.5 7-4.5c0-4-1-7-4-10" />
            <path d="M12.5 36.5c3.5-1 6.5-1.5 10-1.5s6.5.5 10 1.5" />
            <path d="M11.5 39.5c0 2 2.5 4 11 4s11-2 11-4" />
          </g>
        );
    }
  };

  return (
    <div
      className={`chess-piece-wrapper ${className}`}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        pointerEvents: 'none'
      }}
    >
      <svg
        viewBox="0 0 45 45"
        style={{
          width: '85%',
          height: '85%',
          filter: isWhite
            ? 'drop-shadow(0 3px 3px rgba(0,0,0,0.35))'
            : 'drop-shadow(0 3px 4px rgba(0,0,0,0.6))',
          transition: 'transform 0.15s ease'
        }}
      >
        {renderSVGContent()}
      </svg>
    </div>
  );
};
