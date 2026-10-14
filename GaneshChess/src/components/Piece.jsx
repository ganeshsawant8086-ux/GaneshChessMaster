import React from 'react';

/**
 * Premium Vector Chess Pieces (Staunton / Neo Tournament Standard)
 * Supports piece type: 'p' (pawn), 'n' (knight), 'b' (bishop), 'r' (rook), 'q' (queen), 'k' (king)
 * and color: 'w' (white), 'b' (black)
 */
export const Piece = ({
  type,
  color,
  size = '100%',
  styleType = 'classic',
  is3D = false,
  className = ''
}) => {
  const isWhite = color === 'w';
  const pieceKey = type.toLowerCase();

  // Gradient IDs unique to piece type and color
  const gradId = `piece-grad-${color}-${styleType}`;
  const strokeColor = isWhite ? '#22201e' : '#141312';
  const detailColor = isWhite ? '#3a3734' : '#524d47';

  const renderSVGPaths = () => {
    switch (pieceKey) {
      case 'k': // King
        return (
          <>
            {/* Cross */}
            <path d="M22.5 11.5V5.5M19.5 8.5h6" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" />
            {/* Crown finial */}
            <path d="M22.5 25c0 0 4.5-7.5 3-10.5-1-2-3-2-3-2s-2 0-3 2c-1.5 3 3 10.5 3 10.5" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.2" />
            {/* Crown body */}
            <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-2-4-8-1.5-8-1.5s-2-3.5-8-3.5-8 3.5-8 3.5-6-2.5-8 1.5c-3 6 6 10.5 6 10.5v7z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
            {/* Ribs / details */}
            <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke={detailColor} strokeWidth="1.1" fill="none" />
            {/* Base */}
            <path d="M11.5 37c0 3 2 5 11 5s11-2 11-5" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
          </>
        );

      case 'q': // Queen
        return (
          <>
            {/* Crown spikes and body */}
            <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-6-15-4.5 15-4.5-15-6 15-7-11 2 12z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
            {/* Jewels */}
            <circle cx="6" cy="12" r="1.8" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1" />
            <circle cx="14" cy="9" r="1.8" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1" />
            <circle cx="22.5" cy="8" r="1.8" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1" />
            <circle cx="31" cy="9" r="1.8" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1" />
            <circle cx="39" cy="12" r="1.8" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1" />
            {/* Body */}
            <path d="M9 26c0 2 1.5 2 2.5 4 2.5 5 1 5.5 1 5.5h20s-1.5-.5 1-5.5c1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
            <path d="M11.5 30c3.5-1 17-1 22 0m-20.5 3.5c3.5-1 14-1 19 0" stroke={detailColor} strokeWidth="1.1" fill="none" />
            {/* Base */}
            <path d="M11 38.5c0 2.5 3 4.5 11.5 4.5s11.5-2 11.5-4.5" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
          </>
        );

      case 'r': // Rook
        return (
          <>
            {/* Tower */}
            <path d="M9 39h27v-5.5H9V39z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
            <path d="M12 33.5l1.5-15h18l1.5 15H12z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
            {/* Battlements */}
            <path d="M9 18.5h27V12h-4v3h-5v-3h-5v3h-5v-3H9v6.5z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
            {/* Rungs */}
            <path d="M14 29.5c5-1 12-1 17 0" stroke={detailColor} strokeWidth="1.1" fill="none" />
            <path d="M14 18.5h17" stroke={detailColor} strokeWidth="1.1" fill="none" />
            {/* Base */}
            <path d="M9 39c0 2.5 2.5 4.5 13.5 4.5s13.5-2 13.5-4.5" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
          </>
        );

      case 'b': // Bishop
        return (
          <>
            <circle cx="22.5" cy="8" r="1.8" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1" />
            <path d="M17.5 26c-1-5 2.5-11 5-14 2.5 3 6 9 5 14-1 4-3 5-5 5s-4-1-5-5z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
            <path d="M15 17c3.5 3 6 4 9 0" stroke={detailColor} strokeWidth="1.1" fill="none" />
            <path d="M12 34c3-1 6-2 10.5-2s7.5 1 10.5 2c0 2-2 4-10.5 4S12 36 12 34z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
            <path d="M15 31.5c2.5-3 5-4 7.5-4s5 1 7.5 4" stroke={detailColor} strokeWidth="1.1" fill="none" />
            <path d="M11 39c0 2.5 3 4.5 11.5 4.5s11.5-2 11.5-4.5" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
            {/* Slit */}
            <path d="M21 14l5 5" stroke={isWhite ? '#22201e' : '#6b645b'} strokeWidth="1.4" strokeLinecap="round" />
          </>
        );

      case 'n': // Knight
        return (
          <>
            {/* Mane & head */}
            <path d="M22 10c-3 0-5 2-6 4-2 0-3.5 1.5-3.5 3.5 0 1 .5 2 1.5 2.5-.5 1-.5 2 0 3 .5 1 1.5 1.5 2.5 1.5l1 3.5s2 1 4 1 3.5-.5 4.5-2c1.5-2.5 1-6 2.5-8 .5-1 1-1.5 1.5-2-1-2-3.5-4.5-7.5-4.5z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
            {/* Body */}
            <path d="M12 37.5c2-4 4-7.5 8-11.5 3-3 5.5-4 8.5-5 2 2 3.5 5 2.5 8.5-.5 2-2 4-3.5 5.5-2 2-3 4.5-3 7.5h-12.5z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
            {/* Eye */}
            <circle cx="16" cy="18" r="1.3" fill={isWhite ? '#22201e' : '#e5e7eb'} />
            {/* Base */}
            <path d="M9.5 39.5c0 2.5 3.5 4 13 4s13-1.5 13-4h-26z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
            <path d="M15 28.5c2.5-.5 5 0 7 1.5" stroke={detailColor} strokeWidth="1.1" fill="none" />
          </>
        );

      case 'p': // Pawn
      default:
        return (
          <>
            {/* Head */}
            <circle cx="22.5" cy="12" r="4.8" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
            {/* Neck & Body */}
            <path d="M19.5 18c-3 3-4 6-4 10 0 3 1.5 4.5 7 4.5s7-1.5 7-4.5c0-4-1-7-4-10" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
            {/* Collar */}
            <path d="M12.5 36.5c3.5-1 6.5-1.5 10-1.5s6.5.5 10 1.5" stroke={detailColor} strokeWidth="1.1" fill="none" />
            {/* Base */}
            <path d="M11.5 39.5c0 2 2.5 4 11 4s11-2 11-4" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="1.3" />
          </>
        );
    }
  };

  return (
    <div
      className={`chess-piece-wrapper ${className} ${is3D ? 'piece-3d' : ''}`}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        pointerEvents: 'none',
        position: 'relative'
      }}
    >
      <svg
        viewBox="0 0 45 45"
        style={{
          width: '80%',
          height: '80%',
          overflow: 'visible',
          filter: is3D
            ? (isWhite
                ? 'drop-shadow(0 8px 6px rgba(0,0,0,0.45))'
                : 'drop-shadow(0 8px 7px rgba(0,0,0,0.75))')
            : (isWhite
                ? 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))'
                : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'),
          transition: 'transform 0.15s ease'
        }}
      >
        <defs>
          {/* White Piece 3D Lighting Gradient */}
          <linearGradient id={`piece-grad-w-${styleType}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {styleType === 'royal' ? (
              <>
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fde047" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="65%" stopColor="#f4f2ee" />
                <stop offset="100%" stopColor="#ddd8cf" />
              </>
            )}
          </linearGradient>

          {/* Black Piece 3D Lighting Gradient */}
          <linearGradient id={`piece-grad-b-${styleType}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {styleType === 'royal' ? (
              <>
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="60%" stopColor="#291102" />
                <stop offset="100%" stopColor="#170901" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#44403c" />
                <stop offset="50%" stopColor="#292524" />
                <stop offset="100%" stopColor="#1c1917" />
              </>
            )}
          </linearGradient>
        </defs>

        {renderSVGPaths()}
      </svg>
    </div>
  );
};
