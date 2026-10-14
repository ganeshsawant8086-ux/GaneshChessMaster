import React from 'react';

/**
 * 3D Isometric & Staunton Tournament Chess Pieces
 * Supports piece type: 'p' (pawn), 'n' (knight), 'b' (bishop), 'r' (rook), 'q' (queen), 'k' (king)
 * and color: 'w' (white), 'b' (black)
 * Matches realistic 3D perspective models with cylindrical bases and high-angle rendering.
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

  // Gradients
  const bodyGradId = `piece-3d-${color}-body`;
  const rimGradId = `piece-3d-${color}-rim`;
  const specGradId = `piece-3d-${color}-spec`;
  const innerRookGradId = `piece-3d-${color}-inner`;

  const strokeColor = isWhite ? '#1e1c1a' : '#0d0c0b';
  const detailColor = isWhite ? '#4a453f' : '#38342f';

  // Render 3D Perspective Piece (Matching User Reference Image)
  const render3DPiece = () => {
    switch (pieceKey) {
      case 'p': // 3D Pawn
        return (
          <g>
            {/* Base Rims */}
            <ellipse cx="22.5" cy="38" rx="12" ry="4" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1.2" />
            <path d="M11 38 C 11 34.5 13 32 15 31 C 19 32.5 26 32.5 30 31 C 32 32 34 34.5 34 38 Z" fill={`url(#${bodyGradId})`} stroke={strokeColor} strokeWidth="1.1" />
            <ellipse cx="22.5" cy="31" rx="8.5" ry="2.6" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />

            {/* Stem / Trunk */}
            <path d="M15.5 31 C 16.5 25 18.5 21 20 18 L 25 18 C 26.5 21 28.5 25 29.5 31 Z" fill={`url(#${bodyGradId})`} stroke={strokeColor} strokeWidth="1.1" />

            {/* Collar Ring */}
            <ellipse cx="22.5" cy="18" rx="5.5" ry="1.9" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />

            {/* Spherical Head */}
            <circle cx="22.5" cy="11.5" r="5.6" fill={`url(#${specGradId})`} stroke={strokeColor} strokeWidth="1.2" />
            {/* Specular gloss dot */}
            <ellipse cx="20.5" cy="9.5" rx="1.8" ry="1.2" fill={isWhite ? '#ffffff' : '#6b655e'} opacity="0.65" />
          </g>
        );

      case 'r': // 3D Rook with circular battlement crown viewed from above
        return (
          <g>
            {/* Base Rims */}
            <ellipse cx="22.5" cy="38.5" rx="13" ry="4.2" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1.2" />
            <path d="M10 38.5 C 10 35.5 12 33.5 14 32.5 L 31 32.5 C 33 33.5 35 35.5 35 38.5 Z" fill={`url(#${bodyGradId})`} stroke={strokeColor} strokeWidth="1.1" />
            <ellipse cx="22.5" cy="32.5" rx="9.5" ry="3" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />

            {/* Tower Trunk */}
            <path d="M13.5 32.5 L 15 17 L 30 17 L 31.5 32.5 Z" fill={`url(#${bodyGradId})`} stroke={strokeColor} strokeWidth="1.1" />
            <ellipse cx="22.5" cy="17" rx="8.5" ry="2.7" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />

            {/* Castle Crown - Circular with battlements */}
            <path d="M13 17 L 13 11 C 13 8 32 8 32 11 L 32 17 Z" fill={`url(#${bodyGradId})`} stroke={strokeColor} strokeWidth="1.1" />
            {/* Inner recessed circle of crown */}
            <ellipse cx="22.5" cy="11" rx="9.5" ry="3.2" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />
            <ellipse cx="22.5" cy="11" rx="6" ry="2" fill={`url(#${innerRookGradId})`} stroke={strokeColor} strokeWidth="0.8" />

            {/* 4 Battlement notches */}
            <rect x="21" y="8" width="3" height="3" fill={`url(#${innerRookGradId})`} />
            <rect x="12.5" y="9.5" width="2.5" height="2.5" fill={`url(#${innerRookGradId})`} />
            <rect x="30" y="9.5" width="2.5" height="2.5" fill={`url(#${innerRookGradId})`} />
          </g>
        );

      case 'n': // 3D Knight - 3/4 carved horse head
        return (
          <g>
            {/* Base Rims */}
            <ellipse cx="22.5" cy="38.5" rx="13" ry="4.2" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1.2" />
            <path d="M10 38.5 C 10 35.5 12 33.5 14 32.5 L 31 32.5 C 33 33.5 35 35.5 35 38.5 Z" fill={`url(#${bodyGradId})`} stroke={strokeColor} strokeWidth="1.1" />
            <ellipse cx="22.5" cy="32.5" rx="9.5" ry="3" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />

            {/* 3D Horse Head & Neck */}
            <path
              d="M14 32.5 C 12 28 13 22 16 17 C 15 15 15 12 17 9.5 C 19 7 21 6.5 22.5 8 C 24 6.5 27 7.5 28 10 C 29 12 28 14 29 16 C 30 18 31 22 31 26 C 31 29 29.5 31 29.5 32.5 Z"
              fill={`url(#${bodyGradId})`}
              stroke={strokeColor}
              strokeWidth="1.2"
            />
            {/* Muzzle & Jaw */}
            <path
              d="M16 17 C 14 18 12 20 12 23 C 12 25 14 26 17 25 C 19 24 21 21 22 18 Z"
              fill={`url(#${bodyGradId})`}
              stroke={strokeColor}
              strokeWidth="1.1"
            />
            {/* Mane ridges */}
            <path d="M22.5 8 C 24 11 25.5 14 27 18 C 28 21 29 25 29.5 29" stroke={detailColor} strokeWidth="1.3" strokeLinecap="round" fill="none" />
            {/* Ear */}
            <path d="M20 7 L 22 11 L 18 11 Z" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />
            {/* Eye */}
            <circle cx="17.5" cy="14" r="1.2" fill={strokeColor} />
            {/* Nostril */}
            <circle cx="13.5" cy="22" r="0.9" fill={strokeColor} />
          </g>
        );

      case 'b': // 3D Bishop with angled miter and finial ball
        return (
          <g>
            {/* Base Rims */}
            <ellipse cx="22.5" cy="38.5" rx="12.5" ry="4" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1.2" />
            <path d="M10.5 38.5 C 10.5 35.5 12.5 33.5 14.5 32.5 L 30.5 32.5 C 32.5 33.5 34.5 35.5 34.5 38.5 Z" fill={`url(#${bodyGradId})`} stroke={strokeColor} strokeWidth="1.1" />
            <ellipse cx="22.5" cy="32.5" rx="9" ry="2.8" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />

            {/* Stem & Mid Collar */}
            <path d="M15 32.5 C 16.5 28 17.5 24 19 21 L 26 21 C 27.5 24 28.5 28 30 32.5 Z" fill={`url(#${bodyGradId})`} stroke={strokeColor} strokeWidth="1.1" />
            <ellipse cx="22.5" cy="21" rx="6.5" ry="2.2" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />

            {/* Miter Head */}
            <path
              d="M16 21 C 15 15 17.5 9 22.5 7.5 C 27.5 9 30 15 29 21 Z"
              fill={`url(#${specGradId})`}
              stroke={strokeColor}
              strokeWidth="1.2"
            />
            {/* Diagonal Cut Slit */}
            <path d="M21 12 L 25 16" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
            {/* Finial Ball */}
            <circle cx="22.5" cy="6.5" r="1.8" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />
          </g>
        );

      case 'q': // 3D Queen - Radiating coronet and jewels
        return (
          <g>
            {/* Base Rims */}
            <ellipse cx="22.5" cy="39" rx="13.5" ry="4.4" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1.2" />
            <path d="M9.5 39 C 9.5 36 12 34 14 33 L 31 33 C 33 34 35.5 36 35.5 39 Z" fill={`url(#${bodyGradId})`} stroke={strokeColor} strokeWidth="1.1" />
            <ellipse cx="22.5" cy="33" rx="10" ry="3.2" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />

            {/* Fluted Waist */}
            <path d="M14.5 33 C 16 26 17.5 22 19 18 L 26 18 C 27.5 22 29 26 30.5 33 Z" fill={`url(#${bodyGradId})`} stroke={strokeColor} strokeWidth="1.1" />
            <ellipse cx="22.5" cy="18" rx="6.5" ry="2.2" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />

            {/* Coronet Dome */}
            <path
              d="M13 18 L 11 11 L 16 14 L 19 8 L 22.5 12 L 26 8 L 29 14 L 34 11 L 32 18 Z"
              fill={`url(#${specGradId})`}
              stroke={strokeColor}
              strokeWidth="1.2"
            />
            {/* Coronet Pearls */}
            <circle cx="11" cy="10.5" r="1.5" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="0.8" />
            <circle cx="19" cy="7.5" r="1.5" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="0.8" />
            <circle cx="26" cy="7.5" r="1.5" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="0.8" />
            <circle cx="34" cy="10.5" r="1.5" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="0.8" />
            <circle cx="22.5" cy="11.5" r="1.8" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="0.8" />
          </g>
        );

      case 'k': // 3D King - Imperial crown with standing cross
        return (
          <g>
            {/* Base Rims */}
            <ellipse cx="22.5" cy="39" rx="14" ry="4.5" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1.2" />
            <path d="M9 39 C 9 36 11.5 34 13.5 33 L 31.5 33 C 33.5 34 36 36 36 39 Z" fill={`url(#${bodyGradId})`} stroke={strokeColor} strokeWidth="1.1" />
            <ellipse cx="22.5" cy="33" rx="10.5" ry="3.3" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />

            {/* Lower Trunk & Tier Collar */}
            <path d="M14 33 C 15.5 28 17 24 18.5 21 L 26.5 21 C 28 24 29.5 28 31 33 Z" fill={`url(#${bodyGradId})`} stroke={strokeColor} strokeWidth="1.1" />
            <ellipse cx="22.5" cy="21" rx="7.5" ry="2.4" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />

            {/* Royal Crown Dome */}
            <path
              d="M14 21 C 12 17 14 12 17 10 C 20.5 12 24.5 12 28 10 C 31 12 33 17 31 21 Z"
              fill={`url(#${specGradId})`}
              stroke={strokeColor}
              strokeWidth="1.2"
            />
            {/* Crown Finial */}
            <ellipse cx="22.5" cy="10" rx="3.5" ry="1.4" fill={`url(#${rimGradId})`} stroke={strokeColor} strokeWidth="1" />

            {/* Standing 3D Cross */}
            <path d="M22.5 3.5 V 10 M 19.5 6.5 H 25.5" stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" />
            <path d="M22.5 4.5 V 9 M 20.5 6.5 H 24.5" stroke={isWhite ? '#ffffff' : '#6b655e'} strokeWidth="1" strokeLinecap="round" />
          </g>
        );

      default:
        return null;
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
          width: '84%',
          height: '84%',
          overflow: 'visible',
          filter: is3D
            ? (isWhite
                ? 'drop-shadow(0 10px 8px rgba(0,0,0,0.4))'
                : 'drop-shadow(0 10px 10px rgba(0,0,0,0.7))')
            : (isWhite
                ? 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))'
                : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'),
          transition: 'transform 0.15s ease'
        }}
      >
        <defs>
          {/* 3D Ivory White Shading Gradients */}
          <linearGradient id={`piece-3d-w-body`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#fbf9f5" />
            <stop offset="70%" stopColor="#ede7dc" />
            <stop offset="100%" stopColor="#c5bea0" />
          </linearGradient>

          <linearGradient id={`piece-3d-w-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f4f0e8" />
            <stop offset="100%" stopColor="#b5ac9b" />
          </linearGradient>

          <radialGradient id={`piece-3d-w-spec`} cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f7f4ee" />
            <stop offset="85%" stopColor="#e4ddd0" />
            <stop offset="100%" stopColor="#b8ad9c" />
          </radialGradient>

          <linearGradient id={`piece-3d-w-inner`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a39a89" />
            <stop offset="100%" stopColor="#d5cebe" />
          </linearGradient>

          {/* 3D Obsidian / Satin Ebony Shading Gradients */}
          <linearGradient id={`piece-3d-b-body`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4e4944" />
            <stop offset="35%" stopColor="#2e2b28" />
            <stop offset="75%" stopColor="#1a1817" />
            <stop offset="100%" stopColor="#0c0b0a" />
          </linearGradient>

          <linearGradient id={`piece-3d-b-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#55504a" />
            <stop offset="50%" stopColor="#282523" />
            <stop offset="100%" stopColor="#121110" />
          </linearGradient>

          <radialGradient id={`piece-3d-b-spec`} cx="36%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#524d47" />
            <stop offset="45%" stopColor="#2c2926" />
            <stop offset="85%" stopColor="#171514" />
            <stop offset="100%" stopColor="#090807" />
          </radialGradient>

          <linearGradient id={`piece-3d-b-inner`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#080707" />
            <stop offset="100%" stopColor="#22201e" />
          </linearGradient>
        </defs>

        {render3DPiece()}
      </svg>
    </div>
  );
};
