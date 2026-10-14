import React, { useState } from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { PlayView } from './views/PlayView';
import { PracticeView } from './views/PracticeView';
import { HistoryView } from './views/HistoryView';
import { RulesGuideView } from './views/RulesGuideView';
import { SettingsView } from './views/SettingsView';
import { NewGameModal } from './components/NewGameModal';
import { getStoredSettings } from './services/storage';

export function App() {
  const [activeTab, setActiveTab] = useState('play');
  const [settings, setSettings] = useState(getStoredSettings());
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);
  const [practiceFen, setPracticeFen] = useState(null);

  // Active game configuration
  const [gameConfig, setGameConfig] = useState({
    mode: 'vs-computer', // 'vs-computer' | 'pass-and-play' | 'practice'
    difficulty: 'medium', // 'easy' | 'medium' | 'hard'
    playerColor: 'w', // 'w' | 'b'
    timeControl: 300, // 5 min in seconds (300)
    p1Name: settings.playerName || 'Player',
    p2Name: 'Ganesh AI (MEDIUM)'
  });

  const handleStartGame = (newConfig) => {
    setGameConfig(newConfig);
    if (newConfig.mode === 'practice') {
      setActiveTab('practice');
    } else {
      setActiveTab('play');
    }
  };

  const handleToggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(updated);
  };

  const handleAnalyzeFromGame = (fen) => {
    setPracticeFen(fen);
    setActiveTab('practice');
  };

  return (
    <div className={`app-root theme-${settings.boardTheme}`}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        onNewGame={() => setIsNewGameModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="main-viewport">
        {activeTab === 'play' && (
          <PlayView
            gameConfig={gameConfig}
            settings={settings}
            onOpenNewGameModal={() => setIsNewGameModalOpen(true)}
            onSwitchToPracticeWithFen={handleAnalyzeFromGame}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeView
            settings={settings}
            initialFen={practiceFen}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            onAnalyzeGame={handleAnalyzeFromGame}
          />
        )}

        {activeTab === 'rules' && (
          <RulesGuideView />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
          />
        )}
      </main>

      {/* New Game Setup Dialog */}
      <NewGameModal
        isOpen={isNewGameModalOpen}
        onClose={() => setIsNewGameModalOpen(false)}
        onStartGame={handleStartGame}
        initialConfig={gameConfig}
      />
    </div>
  );
}

export default App;
