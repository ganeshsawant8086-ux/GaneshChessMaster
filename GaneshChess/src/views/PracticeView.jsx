import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { EvalBar } from '../components/EvalBar';
import { CHESS_PUZZLES } from '../services/puzzles';
import { getTacticalHint, getEvaluationDisplay } from '../services/aiEngine';
import { sounds } from '../services/soundEffects';
import { Sparkles, RotateCcw, Copy, Check, Lightbulb, Play, Compass, ArrowRight, Award, Box } from 'lucide-react';

/**
 * Practice, Puzzles, and Position Analysis View
 */
export const PracticeView = ({ settings, initialFen = null }) => {
  const [activeTab, setActiveTab] = useState(initialFen ? 'analysis' : 'puzzles'); // 'puzzles' | 'analysis'
  const [selectedPuzzle, setSelectedPuzzle] = useState(CHESS_PUZZLES[0]);
  const [puzzleStep, setPuzzleStep] = useState(0);
  const [puzzleStatus, setPuzzleStatus] = useState(null); // 'solving' | 'correct' | 'wrong'
  const [puzzleMessage, setPuzzleMessage] = useState(CHESS_PUZZLES[0].prompt);
  const [is3D, setIs3D] = useState(settings.is3DView ?? true);

  // Analysis state
  const chessRef = useRef(new Chess(initialFen || undefined));
  const [boardState, setBoardState] = useState(chessRef.current.board());
  const [fen, setFen] = useState(chessRef.current.fen());
  const [customFenInput, setCustomFenInput] = useState('');
  const [fenCopied, setFenCopied] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [hintMove, setHintMove] = useState(null);
  const [hintExplanation, setHintExplanation] = useState('');
  const [evaluation, setEvaluation] = useState({ score: 0, text: '0.0', whiteWinPct: 50 });
  const [isFlipped, setIsFlipped] = useState(false);

  // Setup puzzle
  useEffect(() => {
    if (activeTab === 'puzzles' && selectedPuzzle) {
      loadPuzzle(selectedPuzzle);
    }
  }, [selectedPuzzle, activeTab]);

  const loadPuzzle = (puzzle) => {
    try {
      chessRef.current = new Chess(puzzle.fen);
      setBoardState(chessRef.current.board());
      setFen(puzzle.fen);
      setPuzzleStep(0);
      setPuzzleStatus('solving');
      setPuzzleMessage(puzzle.prompt);
      setLastMove(null);
      setHintMove(null);
      setHintExplanation('');
      setIsFlipped(puzzle.turn === 'b');
      setEvaluation(getEvaluationDisplay(chessRef.current));
    } catch (e) {
      console.error('Failed to load puzzle FEN', e);
    }
  };

  const handlePuzzleMove = ({ from, to, promotion = 'q' }) => {
    if (puzzleStatus === 'correct') return;

    try {
      const chess = chessRef.current;
      const move = chess.move({ from, to, promotion });

      if (!move) return;

      const expectedSan = selectedPuzzle.solution[puzzleStep];

      if (move.san === expectedSan) {
        // Correct move
        sounds.playVictory();
        setBoardState(chess.board());
        setFen(chess.fen());
        setLastMove({ from, to });
        setHintMove(null);

        const nextStep = puzzleStep + 1;
        setPuzzleStep(nextStep);

        if (nextStep >= selectedPuzzle.solution.length) {
          // Completed puzzle!
          setPuzzleStatus('correct');
          setPuzzleMessage(`Brilliant! ${selectedPuzzle.explanation}`);
        } else {
          // Opponent replies in multi-move puzzle
          const opponentMoveSan = selectedPuzzle.solution[nextStep];
          setTimeout(() => {
            const oppMove = chess.move(opponentMoveSan);
            if (oppMove) {
              sounds.playMove();
              setBoardState(chess.board());
              setFen(chess.fen());
              setLastMove({ from: oppMove.from, to: oppMove.to });
              setPuzzleStep(nextStep + 1);
            }
          }, 500);
        }
      } else {
        // Wrong move
        sounds.playDefeat();
        setPuzzleStatus('wrong');
        setPuzzleMessage('Not the best move. Try again!');
        // Revert move after brief glimpse
        setTimeout(() => {
          chess.undo();
          setBoardState(chess.board());
          setFen(chess.fen());
        }, 600);
      }
    } catch {
      // Invalid
    }
  };

  // Free analysis move
  const handleAnalysisMove = ({ from, to, promotion = 'q' }) => {
    try {
      const chess = chessRef.current;
      const move = chess.move({ from, to, promotion });
      if (!move) return;

      if (move.captured) sounds.playCapture();
      else if (chess.inCheck()) sounds.playCheck();
      else sounds.playMove();

      setBoardState(chess.board());
      setFen(chess.fen());
      setLastMove({ from, to });
      setHintMove(null);
      setHintExplanation('');
      setEvaluation(getEvaluationDisplay(chess));
    } catch (e) {
      console.warn('Analysis move failed', e);
    }
  };

  const handleApplyFen = () => {
    if (!customFenInput.trim()) return;
    try {
      const newChess = new Chess(customFenInput.trim());
      chessRef.current = newChess;
      setBoardState(newChess.board());
      setFen(newChess.fen());
      setLastMove(null);
      setHintMove(null);
      setHintExplanation('');
      setEvaluation(getEvaluationDisplay(newChess));
      sounds.playMove();
    } catch {
      alert('Invalid FEN string format! Please check the notation.');
    }
  };

  const handleCopyFen = () => {
    navigator.clipboard.writeText(fen).then(() => {
      setFenCopied(true);
      setTimeout(() => setFenCopied(false), 2000);
    });
  };

  const handleResetAnalysis = () => {
    chessRef.current = new Chess();
    setBoardState(chessRef.current.board());
    setFen(chessRef.current.fen());
    setLastMove(null);
    setHintMove(null);
    setHintExplanation('');
    setEvaluation(getEvaluationDisplay(chessRef.current));
  };

  const handleGetHint = () => {
    const hint = getTacticalHint(chessRef.current);
    if (hint) {
      setHintMove({ from: hint.from, to: hint.to });
      setHintExplanation(hint.explanation);
      sounds.playMove();
    }
  };

  return (
    <div className="practice-view-container">
      {/* Mode Switcher Tabs */}
      <div className="practice-mode-nav">
        <button
          className={`practice-tab-btn ${activeTab === 'puzzles' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('puzzles')}
        >
          <Sparkles size={18} />
          <span>Tactical Puzzles</span>
        </button>
        <button
          className={`practice-tab-btn ${activeTab === 'analysis' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          <Compass size={18} />
          <span>Position Analysis & FEN</span>
        </button>
      </div>

      <div className="practice-layout">
        {/* Board & Eval Column */}
        <div className="practice-board-col">
          <div className="board-and-eval-container">
            <EvalBar evaluation={evaluation} isFlipped={isFlipped} />
            <div className="board-interactive-wrapper">
              <ChessBoard
                chess={chessRef.current}
                boardState={boardState}
                isFlipped={isFlipped}
                is3D={is3D}
                theme={settings.boardTheme}
                pieceStyle={settings.pieceStyle}
                showCoordinates={settings.showCoordinates}
                showLegalMoves={settings.showLegalMoves}
                autoQueen={settings.autoQueen}
                lastMove={lastMove}
                hintMove={hintMove}
                onMove={activeTab === 'puzzles' ? handlePuzzleMove : handleAnalysisMove}
                soundEnabled={settings.soundEnabled}
              />
            </div>
          </div>

          {/* Turn / Status strip */}
          <div className="practice-status-strip">
            <span>
              Turn: <strong>{chessRef.current.turn() === 'w' ? 'White' : 'Black'} to move</strong>
            </span>
            <div className="practice-strip-actions">
              <button
                className={`btn-toggle-3d-pill ${is3D ? 'pill-3d-active' : ''}`}
                onClick={() => setIs3D(!is3D)}
                title="Toggle 3D / 2D perspective"
              >
                <Box size={14} />
                <span>{is3D ? '3D View' : '2D View'}</span>
              </button>
              <button
                className="btn-flip-subtle"
                onClick={() => setIsFlipped(!isFlipped)}
                title="Flip Board"
              >
                Flip Board
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Controls & Content */}
        <div className="practice-sidebar-col">
          {activeTab === 'puzzles' ? (
            /* Tactical Puzzles Panel */
            <div className="puzzles-panel">
              <div className="panel-header">
                <h3>{selectedPuzzle.title}</h3>
                <span className={`diff-badge badge-${selectedPuzzle.difficulty.toLowerCase()}`}>
                  {selectedPuzzle.difficulty}
                </span>
              </div>

              {/* Puzzle Message Banner */}
              <div className={`puzzle-status-box status-${puzzleStatus}`}>
                {puzzleStatus === 'correct' ? (
                  <div className="correct-banner">
                    <Award size={20} className="icon-gold" />
                    <span>{puzzleMessage}</span>
                  </div>
                ) : (
                  <p>{puzzleMessage}</p>
                )}
              </div>

              {/* Puzzle Actions */}
              <div className="puzzle-actions">
                <button
                  className="btn-practice-action"
                  onClick={() => {
                    setHintExplanation(selectedPuzzle.hint);
                    sounds.playMove();
                  }}
                >
                  <Lightbulb size={16} />
                  <span>Show Hint</span>
                </button>
                <button
                  className="btn-practice-action"
                  onClick={() => loadPuzzle(selectedPuzzle)}
                >
                  <RotateCcw size={16} />
                  <span>Reset Puzzle</span>
                </button>
              </div>

              {hintExplanation && (
                <div className="practice-hint-callout">
                  <strong>Hint:</strong> {hintExplanation}
                </div>
              )}

              {/* Puzzle Library List */}
              <div className="puzzle-list-section">
                <h4>Select a Drill</h4>
                <div className="puzzle-cards-list">
                  {CHESS_PUZZLES.map(p => (
                    <div
                      key={p.id}
                      className={`puzzle-card-item ${selectedPuzzle.id === p.id ? 'active-puzzle' : ''}`}
                      onClick={() => setSelectedPuzzle(p)}
                    >
                      <div className="puzzle-item-info">
                        <span className="puzzle-item-title">{p.title}</span>
                        <span className="puzzle-item-cat">{p.category}</span>
                      </div>
                      <span className={`diff-tag tag-${p.difficulty.toLowerCase()}`}>
                        {p.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Free Position Analysis Panel */
            <div className="analysis-panel">
              <div className="panel-header">
                <h3>Free Board Analysis</h3>
                <button className="btn-reset-board" onClick={handleResetAnalysis} title="Reset to starting board">
                  <RotateCcw size={16} />
                  <span>Reset Board</span>
                </button>
              </div>

              {/* Tactical Coach / Best Move */}
              <div className="best-move-card">
                <button className="btn-find-best-move" onClick={handleGetHint}>
                  <Sparkles size={18} />
                  <span>Find Best Tactical Move</span>
                </button>

                {hintExplanation && (
                  <div className="analysis-hint-details">
                    <p>{hintExplanation}</p>
                  </div>
                )}
              </div>

              {/* FEN Manager */}
              <div className="fen-manager-card">
                <div className="fen-header-row">
                  <label className="fen-label">Current Position FEN</label>
                  <button className="btn-copy-fen" onClick={handleCopyFen}>
                    {fenCopied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    <span>{fenCopied ? 'Copied!' : 'Copy FEN'}</span>
                  </button>
                </div>
                <code className="fen-display">{fen}</code>

                <div className="fen-import-section">
                  <label className="fen-label">Load Custom Position (FEN)</label>
                  <div className="fen-input-group">
                    <input
                      type="text"
                      className="fen-input"
                      placeholder="Paste FEN string..."
                      value={customFenInput}
                      onChange={e => setCustomFenInput(e.target.value)}
                    />
                    <button className="btn-apply-fen" onClick={handleApplyFen}>
                      Load
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
