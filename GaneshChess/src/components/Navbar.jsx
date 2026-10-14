import React from 'react';
import { Crown, Swords, Compass, History, BookOpen, Settings, Volume2, VolumeX, PlusCircle } from 'lucide-react';

/**
 * Top navigation bar with branding, navigation links, sound toggle, and action buttons
 */
export const Navbar = ({
  activeTab,
  onSelectTab,
  soundEnabled,
  onToggleSound,
  onNewGame
}) => {
  const tabs = [
    { id: 'play', label: 'Play Arena', icon: Swords },
    { id: 'practice', label: 'Practice & Puzzles', icon: Compass },
    { id: 'history', label: 'Match History', icon: History },
    { id: 'rules', label: 'Rules & Guide', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand */}
        <div className="navbar-brand" onClick={() => onSelectTab('play')}>
          <div className="brand-logo-icon">
            <Crown size={26} className="crown-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-name">Ganesh Chess</span>
            <span className="brand-sub">Master</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-nav">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`nav-tab-btn ${isActive ? 'nav-tab-active' : ''}`}
                onClick={() => onSelectTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right utility buttons */}
        <div className="navbar-actions">
          <button
            className={`icon-action-btn ${soundEnabled ? 'sound-on' : 'sound-off'}`}
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <button
            className="navbar-btn-cta"
            onClick={onNewGame}
            title="Start a new chess match"
          >
            <PlusCircle size={16} />
            <span>New Match</span>
          </button>
        </div>
      </div>
    </header>
  );
};
