import React from 'react';
import { Piece } from '../components/Piece';
import { BookOpen, Shield, Zap, Sparkles, Award } from 'lucide-react';

/**
 * Interactive Rules and Chess Guide View
 */
export const RulesGuideView = () => {
  const pieces = [
    {
      type: 'k',
      name: 'King',
      value: 'Infinite (Game ends if mated)',
      movement: 'Moves exactly one square in any direction (vertically, horizontally, or diagonally). It cannot move into a square attacked by enemy pieces.',
      tip: 'Safeguard your king early by castling!'
    },
    {
      type: 'q',
      name: 'Queen',
      value: '9 Points',
      movement: 'The most versatile piece. Moves any number of vacant squares horizontally, vertically, or diagonally, combining the moves of a Rook and Bishop.',
      tip: 'Do not bring your queen out too early where it can be harassed by developing enemy pawns.'
    },
    {
      type: 'r',
      name: 'Rook',
      value: '5 Points',
      movement: 'Moves any number of vacant squares in a straight line horizontally or vertically along ranks and files.',
      tip: 'Place rooks on open files to control key avenues into the opponent’s camp.'
    },
    {
      type: 'b',
      name: 'Bishop',
      value: '3 Points',
      movement: 'Moves any number of vacant squares diagonally. Each player starts with one light-squared bishop and one dark-squared bishop.',
      tip: 'A bishop pair working together is a lethal tactical weapon across the long diagonals.'
    },
    {
      type: 'n',
      name: 'Knight',
      value: '3 Points',
      movement: 'Moves in an "L-shape" (two squares in one cardinal direction and then one square perpendicular). The only piece that can jump over other pieces!',
      tip: 'Knights excel in closed, cluttered positions and dominant central outposts (like d5 or e5).'
    },
    {
      type: 'p',
      name: 'Pawn',
      value: '1 Point',
      movement: 'Moves forward one square at a time, but can move two squares forward on its very first move. Captures diagonally forward one square.',
      tip: 'Pawns are the soul of chess. Push pawns to claim space and create passed pawns.'
    }
  ];

  return (
    <div className="rules-view-container">
      <div className="rules-hero-banner">
        <div className="rules-hero-content">
          <BookOpen size={36} className="hero-icon" />
          <h2 className="rules-title">Chess Masterclass & Official Rules</h2>
          <p className="rules-subtitle">
            Everything you need to know about chess pieces, legal moves, special tactics, and grandmaster principles.
          </p>
        </div>
      </div>

      {/* The Pieces Section */}
      <div className="rules-section">
        <div className="rules-section-header">
          <Shield size={22} className="rules-sec-icon" />
          <h3>The 6 Chess Pieces</h3>
        </div>
        <div className="pieces-guide-grid">
          {pieces.map(p => (
            <div key={p.type} className="piece-guide-card">
              <div className="piece-guide-top">
                <div className="piece-avatar-box">
                  <Piece type={p.type} color="w" size="48px" />
                </div>
                <div className="piece-meta">
                  <h4 className="piece-guide-name">{p.name}</h4>
                  <span className="piece-guide-val">{p.value}</span>
                </div>
              </div>
              <p className="piece-guide-desc">{p.movement}</p>
              <div className="piece-guide-pro-tip">
                <Zap size={14} className="pro-tip-icon" />
                <span><strong>Pro Tip:</strong> {p.tip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Rules */}
      <div className="rules-section">
        <div className="rules-section-header">
          <Sparkles size={22} className="rules-sec-icon" />
          <h3>Special Chess Rules</h3>
        </div>
        <div className="special-rules-grid">
          <div className="special-rule-card">
            <h4>Castling (O-O and O-O-O)</h4>
            <p>
              A special dual move allowing the King to slide two squares toward a Rook, and that Rook jumps over the King to the adjacent square.
            </p>
            <ul>
              <li>Neither the King nor the involved Rook may have previously moved.</li>
              <li>All squares between the King and Rook must be empty.</li>
              <li>The King cannot be in check, nor pass through or land on a square under attack.</li>
            </ul>
          </div>

          <div className="special-rule-card">
            <h4>En Passant Capture</h4>
            <p>
              If a pawn moves two squares forward from its starting square and lands directly beside an opposing pawn on the same rank, the opposing pawn may capture it diagonally "as it passes", landing on the square the pawn skipped over.
            </p>
            <ul>
              <li>This capture must be made on the very next turn immediately after the double push, or the right is forfeited!</li>
            </ul>
          </div>

          <div className="special-rule-card">
            <h4>Pawn Promotion</h4>
            <p>
              When a pawn reaches the opposite end of the board (the 8th rank for White or 1st rank for Black), it immediately transforms into a Queen, Rook, Bishop, or Knight of the same color.
            </p>
            <ul>
              <li>In Ganesh Chess Master, a promotion modal pops up so you can pick your preferred piece (or auto-promote to Queen in settings!).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Winning and Drawing */}
      <div className="rules-section">
        <div className="rules-section-header">
          <Award size={22} className="rules-sec-icon" />
          <h3>How Games End: Wins & Draws</h3>
        </div>
        <div className="endgame-rules-list">
          <div className="endgame-rule-item">
            <span className="endgame-badge win-badge">Checkmate</span>
            <p>The enemy King is under attack ("in check") and there is no legal move to escape, block, or capture the attacker. The game ends immediately.</p>
          </div>

          <div className="endgame-rule-item">
            <span className="endgame-badge draw-badge">Stalemate</span>
            <p>The player whose turn it is has no legal moves anywhere on the board, but their King is NOT in check. The game is ruled a tie / draw.</p>
          </div>

          <div className="endgame-rule-item">
            <span className="endgame-badge draw-badge">Threefold Repetition</span>
            <p>The exact identical board position with the same player to move and same castling rights occurs three times during the match.</p>
          </div>

          <div className="endgame-rule-item">
            <span className="endgame-badge draw-badge">Insufficient Material</span>
            <p>Neither player has enough firepower left to deliver checkmate (e.g. King vs King, King + Bishop vs King, or King + Knight vs King).</p>
          </div>
        </div>
      </div>
    </div>
  );
};
