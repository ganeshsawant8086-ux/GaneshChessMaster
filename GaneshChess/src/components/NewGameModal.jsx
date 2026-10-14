import React, { useState } from 'react';
import { Bot, Users, Compass, Zap, Flame, Clock, ShieldCheck, X } from 'lucide-react';

/**
 * New Game Setup Modal
 */
export const NewGameModal = ({ isOpen, onClose, onStartGame, initialConfig = {} }) => {
  const [mode, setMode] = useState(initialConfig.mode || 'vs-computer');
  const [difficulty, setDifficulty] = useState(initialConfig.difficulty || 'medium');
  const [colorPreference, setColorPreference] = useState(initialConfig.playerColor || 'w');
  const [timeControl, setTimeControl] = useState(initialConfig.timeControl || 300); // 5 min in seconds, null for unlimited
  const [p1Name, setP1Name] = useState(initialConfig.p1Name || 'Player');
  const [p2Name, setP2Name] = useState(initialConfig.p2Name || 'Opponent');

  if (!isOpen) return null;

  const handleStart = () => {
    // Determine player color if random
    let assignedColor = colorPreference;
    if (colorPreference === 'random') {
      assignedColor = Math.random() < 0.5 ? 'w' : 'b';
    }

    onStartGame({
      mode,
      difficulty,
      playerColor: assignedColor,
      timeControl,
      p1Name: p1Name.trim() || 'Player 1',
      p2Name: mode === 'vs-computer' ? `Ganesh AI (${difficulty.toUpperCase()})` : (p2Name.trim() || 'Player 2')
    });
    onClose();
  };

  const timeOptions = [
    { label: '1 min', value: 60, sub: 'Bullet' },
    { label: '3 min', value: 180, sub: 'Blitz' },
    { label: '5 min', value: 300, sub: 'Blitz' },
    { label: '10 min', value: 600, sub: 'Rapid' },
    { label: '15 min', value: 900, sub: 'Rapid' },
    { label: 'Unlimited', value: null, sub: 'Casual' },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="new-game-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">New Game Setup</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-scroll">
          {/* Game Mode */}
          <div className="setup-section">
            <label className="section-label">Select Game Mode</label>
            <div className="mode-options-grid">
              <button
                className={`mode-card ${mode === 'vs-computer' ? 'mode-active' : ''}`}
                onClick={() => setMode('vs-computer')}
              >
                <div className="mode-icon-circle icon-bot">
                  <Bot size={24} />
                </div>
                <div className="mode-info">
                  <div className="mode-name">Vs Computer</div>
                  <div className="mode-desc">Play against intelligent Ganesh AI</div>
                </div>
              </button>

              <button
                className={`mode-card ${mode === 'pass-and-play' ? 'mode-active' : ''}`}
                onClick={() => setMode('pass-and-play')}
              >
                <div className="mode-icon-circle icon-users">
                  <Users size={24} />
                </div>
                <div className="mode-info">
                  <div className="mode-name">Pass & Play</div>
                  <div className="mode-desc">Two players on the same screen</div>
                </div>
              </button>

              <button
                className={`mode-card ${mode === 'practice' ? 'mode-active' : ''}`}
                onClick={() => setMode('practice')}
              >
                <div className="mode-icon-circle icon-practice">
                  <Compass size={24} />
                </div>
                <div className="mode-info">
                  <div className="mode-name">Practice & Analysis</div>
                  <div className="mode-desc">Free board, hints, and tactical drills</div>
                </div>
              </button>
            </div>
          </div>

          {/* AI Difficulty (only if vs-computer) */}
          {mode === 'vs-computer' && (
            <div className="setup-section">
              <label className="section-label">AI Difficulty Level</label>
              <div className="difficulty-grid">
                <button
                  className={`diff-pill ${difficulty === 'easy' ? 'diff-active diff-easy' : ''}`}
                  onClick={() => setDifficulty('easy')}
                >
                  <Zap size={16} />
                  <span>Easy (~800 ELO)</span>
                </button>

                <button
                  className={`diff-pill ${difficulty === 'medium' ? 'diff-active diff-medium' : ''}`}
                  onClick={() => setDifficulty('medium')}
                >
                  <ShieldCheck size={16} />
                  <span>Medium (~1500 ELO)</span>
                </button>

                <button
                  className={`diff-pill ${difficulty === 'hard' ? 'diff-active diff-hard' : ''}`}
                  onClick={() => setDifficulty('hard')}
                >
                  <Flame size={16} />
                  <span>Hard (~2100+ ELO)</span>
                </button>
              </div>
            </div>
          )}

          {/* Side Selection */}
          <div className="setup-section">
            <label className="section-label">Play As</label>
            <div className="side-selection-row">
              <button
                className={`side-choice-btn ${colorPreference === 'w' ? 'side-active' : ''}`}
                onClick={() => setColorPreference('w')}
              >
                <span className="side-piece-dot white-dot"></span>
                <span>White (Moves First)</span>
              </button>

              <button
                className={`side-choice-btn ${colorPreference === 'random' ? 'side-active' : ''}`}
                onClick={() => setColorPreference('random')}
              >
                <span className="side-piece-dot random-dot">?</span>
                <span>Random Side</span>
              </button>

              <button
                className={`side-choice-btn ${colorPreference === 'b' ? 'side-active' : ''}`}
                onClick={() => setColorPreference('b')}
              >
                <span className="side-piece-dot black-dot"></span>
                <span>Black</span>
              </button>
            </div>
          </div>

          {/* Time Control */}
          <div className="setup-section">
            <label className="section-label">Chess Clock Time Control</label>
            <div className="time-options-grid">
              {timeOptions.map(t => (
                <button
                  key={t.label}
                  className={`time-card ${timeControl === t.value ? 'time-active' : ''}`}
                  onClick={() => setTimeControl(t.value)}
                >
                  <div className="time-val">{t.label}</div>
                  <div className="time-sub">{t.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Player Names */}
          {mode === 'pass-and-play' && (
            <div className="setup-section">
              <label className="section-label">Player Names</label>
              <div className="name-inputs-row">
                <input
                  type="text"
                  className="setup-input"
                  placeholder="White Player Name"
                  value={p1Name}
                  onChange={e => setP1Name(e.target.value)}
                />
                <input
                  type="text"
                  className="setup-input"
                  placeholder="Black Player Name"
                  value={p2Name}
                  onChange={e => setP2Name(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-start-game" onClick={handleStart}>
            Start Match
          </button>
        </div>
      </div>
    </div>
  );
};
