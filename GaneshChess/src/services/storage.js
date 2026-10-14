// LocalStorage manager for Ganesh Chess Master settings and match history

const SETTINGS_KEY = 'ganesh_chess_settings';
const HISTORY_KEY = 'ganesh_chess_history';
const STATS_KEY = 'ganesh_chess_stats';

const DEFAULT_SETTINGS = {
  boardTheme: 'emerald', // emerald, wood, midnight, neon, marble
  pieceStyle: 'classic', // classic, royal, modern
  soundEnabled: true,
  showCoordinates: true,
  showLegalMoves: true,
  showEvalBar: true,
  autoQueen: false,
  is3DView: true, // 3D View enabled
  boardAngle3D: 28, // tilt angle in degrees
  playerName: 'Player 1',
  opponentName: 'Ganesh AI'
};

const DEFAULT_STATS = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
};

export function getStoredSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export function getStoredHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordGameHistory(gameData) {
  try {
    const history = getStoredHistory();
    const entry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      ...gameData
    };
    const updated = [entry, ...history].slice(0, 50); // Keep last 50 games
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

    // Update stats
    updateStats(gameData.result);
    return updated;
  } catch (e) {
    console.error('Failed to save match history', e);
    return [];
  }
}

export function clearGameHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.setItem(STATS_KEY, JSON.stringify(DEFAULT_STATS));
  } catch (e) {
    console.error('Failed to clear history', e);
  }
}

export function getStoredStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

function updateStats(result) {
  try {
    const stats = getStoredStats();
    stats.gamesPlayed += 1;
    if (result === 'win') stats.wins += 1;
    else if (result === 'loss') stats.losses += 1;
    else if (result === 'draw') stats.draws += 1;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to update stats', e);
  }
}
