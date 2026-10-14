import React from 'react';
import { Palette, Volume2, Sparkles, User, Sliders, Check } from 'lucide-react';
import { saveStoredSettings } from '../services/storage';

/**
 * Settings and Customization View
 */
export const SettingsView = ({ settings, onUpdateSettings }) => {
  const themes = [
    { id: 'emerald', name: 'Emerald Classic', light: '#eeeed2', dark: '#769656', desc: 'Popular tournament green & ivory' },
    { id: 'wood', name: 'Royal Walnut', light: '#f0d9b5', dark: '#b58863', desc: 'Warm traditional handcrafted wood' },
    { id: 'midnight', name: 'Midnight Slate', light: '#9fb1c5', dark: '#374b64', desc: 'Sleek high-contrast modern blue' },
    { id: 'neon', name: 'Cyberpunk Neon', light: '#d8b4fe', dark: '#581c87', desc: 'Futuristic purple glow' },
    { id: 'marble', name: 'Monochrome Slate', light: '#e2e8f0', dark: '#475569', desc: 'Minimalist clean aesthetic' },
  ];

  const pieceStyles = [
    { id: 'classic', name: 'Classic Staunton', desc: 'Crisp, official tournament vector set' },
    { id: 'royal', name: 'Royal Gold & Ebony', desc: 'Gilded outlines with rich contrast' },
  ];

  const handleToggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    onUpdateSettings(updated);
    saveStoredSettings(updated);
  };

  const handleSelect = (key, value) => {
    const updated = { ...settings, [key]: value };
    onUpdateSettings(updated);
    saveStoredSettings(updated);
  };

  return (
    <div className="settings-view-container">
      <div className="settings-header">
        <h2 className="settings-title">Game Settings & Preferences</h2>
        <p className="settings-subtitle">Customize board appearance, sound effects, and gameplay assists.</p>
      </div>

      <div className="settings-sections-grid">
        {/* Board Theme Selection */}
        <div className="settings-card">
          <div className="card-header">
            <Palette size={20} className="icon-accent" />
            <h3>Board Theme</h3>
          </div>
          <p className="card-desc">Select your preferred chessboard color palette.</p>

          <div className="theme-options-grid">
            {themes.map(t => (
              <div
                key={t.id}
                className={`theme-card-option ${settings.boardTheme === t.id ? 'theme-active' : ''}`}
                onClick={() => handleSelect('boardTheme', t.id)}
              >
                <div className="theme-mini-board">
                  <div className="mini-square" style={{ backgroundColor: t.light }}></div>
                  <div className="mini-square" style={{ backgroundColor: t.dark }}></div>
                  <div className="mini-square" style={{ backgroundColor: t.dark }}></div>
                  <div className="mini-square" style={{ backgroundColor: t.light }}></div>
                </div>
                <div className="theme-info">
                  <div className="theme-name">{t.name}</div>
                  <div className="theme-sub">{t.desc}</div>
                </div>
                {settings.boardTheme === t.id && (
                  <Check size={18} className="theme-check-icon" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Piece Style Selection */}
        <div className="settings-card">
          <div className="card-header">
            <Sparkles size={20} className="icon-accent" />
            <h3>Piece Style</h3>
          </div>
          <p className="card-desc">Choose piece artwork rendering.</p>

          <div className="piece-styles-list">
            {pieceStyles.map(ps => (
              <div
                key={ps.id}
                className={`piece-style-option ${settings.pieceStyle === ps.id ? 'style-active' : ''}`}
                onClick={() => handleSelect('pieceStyle', ps.id)}
              >
                <div className="piece-style-details">
                  <div className="piece-style-name">{ps.name}</div>
                  <div className="piece-style-desc">{ps.desc}</div>
                </div>
                {settings.pieceStyle === ps.id && (
                  <Check size={18} className="theme-check-icon" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Gameplay & Assist Toggles */}
        <div className="settings-card">
          <div className="card-header">
            <Sliders size={20} className="icon-accent" />
            <h3>Assists & Display</h3>
          </div>
          <p className="card-desc">Configure visual assists, coordinates, and evaluation.</p>

          <div className="toggle-list">
            <div className="toggle-item">
              <div>
                <div className="toggle-title">Sound Effects</div>
                <div className="toggle-sub">Play audio for moves, captures, checks, and game over</div>
              </div>
              <button
                className={`toggle-switch ${settings.soundEnabled ? 'toggle-on' : ''}`}
                onClick={() => handleToggle('soundEnabled')}
              >
                <span className="toggle-knob"></span>
              </button>
            </div>

            <div className="toggle-item">
              <div>
                <div className="toggle-title">3D Chessboard Perspective</div>
                <div className="toggle-sub">Enable authentic 3D perspective tilt with upright standing pieces</div>
              </div>
              <button
                className={`toggle-switch ${settings.is3DView ? 'toggle-on' : ''}`}
                onClick={() => handleToggle('is3DView')}
              >
                <span className="toggle-knob"></span>
              </button>
            </div>

            <div className="toggle-item">
              <div>
                <div className="toggle-title">Show Coordinates</div>
                <div className="toggle-sub">Display rank (1-8) and file (a-h) along board edges</div>
              </div>
              <button
                className={`toggle-switch ${settings.showCoordinates ? 'toggle-on' : ''}`}
                onClick={() => handleToggle('showCoordinates')}
              >
                <span className="toggle-knob"></span>
              </button>
            </div>

            <div className="toggle-item">
              <div>
                <div className="toggle-title">Show Legal Moves</div>
                <div className="toggle-sub">Highlight target squares and capture rings when selecting a piece</div>
              </div>
              <button
                className={`toggle-switch ${settings.showLegalMoves ? 'toggle-on' : ''}`}
                onClick={() => handleToggle('showLegalMoves')}
              >
                <span className="toggle-knob"></span>
              </button>
            </div>

            <div className="toggle-item">
              <div>
                <div className="toggle-title">Live Evaluation Bar</div>
                <div className="toggle-sub">Display computer positional score and advantage percentage</div>
              </div>
              <button
                className={`toggle-switch ${settings.showEvalBar ? 'toggle-on' : ''}`}
                onClick={() => handleToggle('showEvalBar')}
              >
                <span className="toggle-knob"></span>
              </button>
            </div>

            <div className="toggle-item">
              <div>
                <div className="toggle-title">Auto-Promote to Queen</div>
                <div className="toggle-sub">Automatically promote pawns to Queen without showing piece modal</div>
              </div>
              <button
                className={`toggle-switch ${settings.autoQueen ? 'toggle-on' : ''}`}
                onClick={() => handleToggle('autoQueen')}
              >
                <span className="toggle-knob"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Player Profile */}
        <div className="settings-card">
          <div className="card-header">
            <User size={20} className="icon-accent" />
            <h3>Player Profile</h3>
          </div>
          <p className="card-desc">Default display name for two-player and offline matches.</p>

          <div className="profile-input-group">
            <label className="input-label">Default Player Name</label>
            <input
              type="text"
              className="text-input"
              value={settings.playerName || 'Player 1'}
              onChange={e => {
                const updated = { ...settings, playerName: e.target.value };
                onUpdateSettings(updated);
                saveStoredSettings(updated);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
