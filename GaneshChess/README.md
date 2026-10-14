# ♚ Ganesh Chess Master

**Ganesh Chess Master** is a complete, modern, responsive, and professional chess platform built with **React.js**, **Vite**, **chess.js**, and an intelligent **Chess AI Engine**.

---

## ✨ Features & Capabilities

### 1. Standard 8×8 Chessboard & Official Rules
- All 32 vector pieces in standard starting positions.
- Full legal move validation powered by `chess.js`:
  - **Pawn Promotion**: Dedicated modal to choose Queen, Rook, Bishop, or Knight (with optional Auto-Queen toggle in settings).
  - **Castling**: Kingside (`O-O`) and Queenside (`O-O-O`).
  - **En Passant**: Fully supported with move animations.
- **Dynamic Highlights**:
  - Selected piece glow.
  - Soft circular dots for legal destination squares.
  - Glowing capture rings around enemy pieces.
  - Last move highlight for both origin and destination squares.
  - Pulsing crimson highlight when King is under **Check**.

### 2. Three Distinct Game Modes
- **Play Against Computer**:
  - Play against **Ganesh AI** with three difficulty tiers:
    - **Easy (~800 ELO)**: Casual, relaxed pace with occasional blunders.
    - **Medium (~1500 ELO)**: Tactical club player using minimax and piece-square tables.
    - **Hard (~2100+ ELO)**: Deep minimax search with alpha-beta pruning, quiescence capture resolution, and opening book knowledge.
- **Pass & Play (Two Players on the Same Device)**:
  - Turn-by-turn with custom player names and independent clocks.
- **Practice & Analysis Mode**:
  - Free board editor and position analysis.
  - FEN string loader and one-click FEN copier.
  - Tactical puzzles library (Back-rank mate, Royal Knight fork, Opera Game mate, Four-move trap).
  - **Tactical Coach Hint**: Suggests the optimal move with a strategic explanation.

### 3. Precision Clocks & Game Controls
- Configurable Chess Clocks:
  - `1 min` Bullet, `3 min` Blitz, `5 min` Blitz, `10 min` Rapid, `15 min` Classical, or `Unlimited`.
  - Low-time alarm animation & tick sounds when under 20 seconds.
- Interactive Controls:
  - **Undo Move**: Automatically accounts for AI turns in solo play.
  - **Restart Game**: Re-initializes with current settings.
  - **Flip Board**: Rotates perspective 180°.
  - **Resign & Offer Draw**: Smart AI evaluation on draw offers.
  - **Move Scrubber**: Step backward and forward (`|<`, `<`, `>`, `>|`) through match history.
  - **PGN Export**: One-click copy of standard Portable Game Notation.

### 4. Audio & Customization
- **Web Audio API**: Built-in crisp wood move clicks, captures, castling, check warnings, victory fanfare, and defeat cues (zero external audio file dependencies).
- **Themes & Aesthetics**:
  - *Emerald Classic* (Tournament Green & Ivory)
  - *Royal Walnut* (Rich Handcrafted Wood)
  - *Midnight Slate* (Deep Ocean High-Contrast Blue)
  - *Cyberpunk Neon* (Futuristic Violet Glow)
  - *Monochrome Slate* (Minimal Luxury Marble)
- **Local Storage**: Automatically persists match history, lifetime win/loss statistics, and player preferences.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Quick Start

1. Navigate to the project folder:
   ```bash
   cd GaneshChess
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

### Production Build
To create an optimized production bundle:
```bash
npm run build
npm run preview
```

---

## 📁 Project Architecture

```
GaneshChess/
├── index.html                 # Main HTML with Google Fonts & SEO meta tags
├── package.json               # Project dependencies and npm scripts
├── vite.config.js             # Vite configuration
├── public/
│   └── favicon.svg            # Custom golden crown chess favicon
└── src/
    ├── main.jsx               # Application entry point
    ├── App.jsx                # Main Coordinator & view switching
    ├── index.css              # Design tokens, variables & resets
    ├── App.css                # Full responsive UI stylesheet
    ├── components/
    │   ├── Navbar.jsx         # Header navigation, sound toggle, brand
    │   ├── ChessBoard.jsx     # 8x8 interactive board with drag/click
    │   ├── Piece.jsx          # Scalable vector SVG chess pieces
    │   ├── EvalBar.jsx        # Live advantage evaluation bar
    │   ├── PlayerCard.jsx     # Player status, captured pieces & clock
    │   ├── MoveHistory.jsx    # Move table, scrubber & PGN export
    │   ├── GameControls.jsx   # Undo, Restart, Flip, Resign, Draw, Hint
    │   ├── PromotionModal.jsx # Pawn promotion dialog
    │   ├── GameOverModal.jsx  # Win/Loss/Draw modal with confetti
    │   └── NewGameModal.jsx   # Match setup dialog
    ├── views/
    │   ├── PlayView.jsx       # Main chess arena view
    │   ├── PracticeView.jsx   # Tactical puzzles & FEN analysis view
    │   ├── HistoryView.jsx    # Career stats & match history view
    │   ├── SettingsView.jsx   # Themes & visual preferences view
    │   └── RulesGuideView.jsx # Masterclass guide & piece rules
    └── services/
        ├── aiEngine.js        # Minimax, Alpha-Beta, PST & hints
        ├── soundEffects.js    # Web Audio API synthesized sound effects
        ├── storage.js         # LocalStorage settings and history manager
        └── puzzles.js         # Curated chess puzzles dataset
```
