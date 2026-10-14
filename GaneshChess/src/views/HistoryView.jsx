import React, { useState, useEffect } from 'react';
import { getStoredHistory, getStoredStats, clearGameHistory } from '../services/storage';
import { Trophy, Award, Frown, Handshake, Trash2, Copy, Check, Swords, Calendar, Compass } from 'lucide-react';

/**
 * Match History and Lifetime Statistics View
 */
export const HistoryView = ({ onAnalyzeGame }) => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ gamesPlayed: 0, wins: 0, losses: 0, draws: 0 });
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    setHistory(getStoredHistory());
    setStats(getStoredStats());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your match history and statistics?')) {
      clearGameHistory();
      setHistory([]);
      setStats({ gamesPlayed: 0, wins: 0, losses: 0, draws: 0 });
    }
  };

  const handleCopyPgn = (id, pgn) => {
    if (!pgn) return;
    navigator.clipboard.writeText(pgn).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;

  return (
    <div className="history-view-container">
      <div className="history-header-banner">
        <div>
          <h2 className="history-title">Career Match History & Records</h2>
          <p className="history-subtitle">Track your performance, analyze past games, and celebrate victories.</p>
        </div>
        {history.length > 0 && (
          <button className="btn-clear-history" onClick={handleClearHistory}>
            <Trash2 size={16} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Lifetime Stats Dashboard */}
      <div className="stats-dashboard-grid">
        <div className="stat-card">
          <div className="stat-card-icon icon-matches">
            <Swords size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-number">{stats.gamesPlayed}</div>
            <div className="stat-label">Total Matches</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon icon-win">
            <Trophy size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-number stat-win">{stats.wins}</div>
            <div className="stat-label">Victories</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon icon-loss">
            <Frown size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-number stat-loss">{stats.losses}</div>
            <div className="stat-label">Defeats</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon icon-draw">
            <Handshake size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-number stat-draw">{stats.draws}</div>
            <div className="stat-label">Draws</div>
          </div>
        </div>

        <div className="stat-card stat-card-highlight">
          <div className="stat-card-icon icon-rate">
            <Award size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-number stat-rate">{winRate}%</div>
            <div className="stat-label">Win Rate</div>
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="history-table-container">
        <h3 className="section-title">Recent Matches</h3>
        {history.length === 0 ? (
          <div className="empty-history-state">
            <Trophy size={48} className="empty-icon" />
            <p>No recorded matches yet. Play your first chess game in the Arena!</p>
          </div>
        ) : (
          <div className="history-cards-list">
            {history.map(item => (
              <div key={item.id} className="history-row-card">
                <div className="history-left">
                  <div className={`result-tag tag-${item.result}`}>
                    {item.result.toUpperCase()}
                  </div>
                  <div className="match-details">
                    <div className="match-title">
                      vs {item.opponent || 'Opponent'}
                      {item.difficulty && (
                        <span className="opponent-diff-badge">({item.difficulty})</span>
                      )}
                    </div>
                    <div className="match-meta">
                      <span className="meta-item">
                        <Calendar size={13} /> {item.date}
                      </span>
                      <span className="meta-dot">•</span>
                      <span>{item.movesCount} moves</span>
                      <span className="meta-dot">•</span>
                      <span className="meta-reason">{item.reason}</span>
                    </div>
                  </div>
                </div>

                <div className="history-actions">
                  {item.pgn && (
                    <button
                      className="btn-history-action"
                      onClick={() => handleCopyPgn(item.id, item.pgn)}
                      title="Copy PGN"
                    >
                      {copiedId === item.id ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                      <span>{copiedId === item.id ? 'Copied' : 'PGN'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
