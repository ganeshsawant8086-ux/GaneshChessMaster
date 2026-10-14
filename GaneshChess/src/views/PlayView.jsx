import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { EvalBar } from '../components/EvalBar';
import { PlayerCard } from '../components/PlayerCard';
import { MoveHistory } from '../components/MoveHistory';
import { GameControls } from '../components/GameControls';
import { GameOverModal } from '../components/GameOverModal';
import { sounds } from '../services/soundEffects';
import { getBestMove, getEvaluationDisplay, getTacticalHint } from '../services/aiEngine';
import { recordGameHistory } from '../services/storage';
import { AlertCircle, Sparkles, X, Box } from 'lucide-react';

/**
 * Main Chess Arena View
 */
export const PlayView = ({
  gameConfig,
  settings,
  onOpenNewGameModal,
  onSwitchToPracticeWithFen
}) => {
  // Core chess instance
  const chessRef = useRef(new Chess());
  const [boardState, setBoardState] = useState(chessRef.current.board());
  const [fen, setFen] = useState(chessRef.current.fen());
  const [moves, setMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [isFlipped, setIsFlipped] = useState(gameConfig.playerColor === 'b');
  const [is3D, setIs3D] = useState(settings.is3DView ?? true);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [activeHint, setActiveHint] = useState(null);

  // Clocks
  const [whiteTime, setWhiteTime] = useState(gameConfig.timeControl);
  const [blackTime, setBlackTime] = useState(gameConfig.timeControl);
  const [isClockRunning, setIsClockRunning] = useState(false);

  // History preview scrubber
  const [historyIndex, setHistoryIndex] = useState(-1); // -1 means live position

  // Game over state
  const [gameOverInfo, setGameOverInfo] = useState(null);

  // Evaluation bar state
  const [evaluation, setEvaluation] = useState({ score: 0, text: '0.0', whiteWinPct: 50 });

  // Status message
  const [statusMessage, setStatusMessage] = useState('Game started. Good luck!');

  // Sync settings sound enabled
  useEffect(() => {
    sounds.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Reset or start match when gameConfig changes
  useEffect(() => {
    startNewMatch(gameConfig);
  }, [gameConfig]);

  const startNewMatch = (config) => {
    chessRef.current = new Chess();
    setBoardState(chessRef.current.board());
    setFen(chessRef.current.fen());
    setMoves([]);
    setLastMove(null);
    setActiveHint(null);
    setGameOverInfo(null);
    setHistoryIndex(-1);
    setWhiteTime(config.timeControl);
    setBlackTime(config.timeControl);
    setIsClockRunning(config.timeControl !== null);
    setIsFlipped(config.playerColor === 'b');
    setStatusMessage('Match initialized. White moves first.');
    setEvaluation({ score: 0, text: '0.0', whiteWinPct: 50 });

    // If human is playing Black against AI, AI makes the opening move as White!
    if (config.mode === 'vs-computer' && config.playerColor === 'b') {
      setTimeout(() => {
        triggerAiMove(chessRef.current);
      }, 600);
    }
  };

  // Clock countdown timer
  useEffect(() => {
    if (!isClockRunning || gameOverInfo) return;

    const timer = setInterval(() => {
      const turn = chessRef.current.turn();

      if (turn === 'w') {
        setWhiteTime(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            handleTimeout('w');
            return 0;
          }
          if (prev <= 10 && settings.soundEnabled) sounds.playTick();
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            handleTimeout('b');
            return 0;
          }
          if (prev <= 10 && settings.soundEnabled) sounds.playTick();
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isClockRunning, gameOverInfo, settings.soundEnabled]);

  const handleTimeout = (loserColor) => {
    setIsClockRunning(false);
    const winnerColor = loserColor === 'w' ? 'Black' : 'White';
    const isPlayerWin = (gameConfig.playerColor === 'w' && winnerColor === 'White') ||
                        (gameConfig.playerColor === 'b' && winnerColor === 'Black');

    sounds.playGameOverSound ? sounds.playGameOverSound(isPlayerWin) : sounds.playVictory();

    const info = {
      result: gameConfig.mode === 'vs-computer' ? (isPlayerWin ? 'win' : 'loss') : 'win',
      title: `${winnerColor} Won on Time!`,
      reason: `${loserColor === 'w' ? 'White' : 'Black'} flagged out of time.`
    };
    setGameOverInfo(info);
    recordMatch(info);
  };

  // Check Game Over states
  const checkGameOver = useCallback(() => {
    const chess = chessRef.current;
    if (!chess.isGameOver()) return false;

    setIsClockRunning(false);
    let result = 'draw';
    let title = 'Game Drawn!';
    let reason = 'Draw';

    if (chess.isCheckmate()) {
      const winner = chess.turn() === 'w' ? 'Black' : 'White';
      const isPlayerWin = (gameConfig.playerColor === 'w' && winner === 'White') ||
                          (gameConfig.playerColor === 'b' && winner === 'Black');

      result = gameConfig.mode === 'vs-computer' ? (isPlayerWin ? 'win' : 'loss') : 'win';
      title = `Checkmate! ${winner} Wins!`;
      reason = `${winner} delivered checkmate.`;

      if (result === 'win') sounds.playVictory();
      else sounds.playDefeat();
    } else if (chess.isStalemate()) {
      reason = 'Draw by Stalemate: No legal moves available.';
      sounds.playDefeat();
    } else if (chess.isThreefoldRepetition()) {
      reason = 'Draw by Threefold Repetition.';
      sounds.playDefeat();
    } else if (chess.isInsufficientMaterial()) {
      reason = 'Draw by Insufficient Material.';
      sounds.playDefeat();
    } else {
      reason = 'Game ended in a draw (50-move rule).';
      sounds.playDefeat();
    }

    const info = { result, title, reason };
    setGameOverInfo(info);
    recordMatch(info);
    return true;
  }, [gameConfig]);

  const recordMatch = (info) => {
    recordGameHistory({
      mode: gameConfig.mode,
      difficulty: gameConfig.difficulty,
      result: info.result,
      reason: info.reason,
      movesCount: chessRef.current.history().length,
      playerColor: gameConfig.playerColor,
      opponent: gameConfig.mode === 'vs-computer' ? `Ganesh AI (${gameConfig.difficulty})` : 'Player 2',
      pgn: chessRef.current.pgn()
    });
  };

  // Execute a legal move
  const handleMove = ({ from, to, promotion = 'q' }) => {
    if (gameOverInfo || isAiThinking) return;

    // If currently scrubbing history, snap back to live
    if (historyIndex !== -1) {
      setHistoryIndex(-1);
    }

    try {
      const chess = chessRef.current;
      const move = chess.move({ from, to, promotion });

      if (!move) return;

      // Sound triggers
      if (chess.isCheckmate()) {
        sounds.playVictory();
      } else if (chess.inCheck()) {
        sounds.playCheck();
      } else if (move.captured) {
        sounds.playCapture();
      } else if (move.san === 'O-O' || move.san === 'O-O-O') {
        sounds.playCastle();
      } else {
        sounds.playMove();
      }

      // Update state
      setBoardState(chess.board());
      setFen(chess.fen());
      const updatedMoves = chess.history({ verbose: true });
      setMoves(updatedMoves);
      setLastMove({ from, to });
      setActiveHint(null);

      // Update evaluation bar
      setEvaluation(getEvaluationDisplay(chess));

      // Check if game over
      if (checkGameOver()) return;

      // Update status
      const nextTurnName = chess.turn() === 'w' ? 'White' : 'Black';
      setStatusMessage(`${nextTurnName}'s turn to move.`);

      // If playing against computer and it's AI's turn
      const isAiTurn = gameConfig.mode === 'vs-computer' && chess.turn() !== gameConfig.playerColor;
      if (isAiTurn) {
        triggerAiMove(chess);
      }
    } catch (e) {
      console.warn('Move rejected:', e);
    }
  };

  // AI Move Execution
  const triggerAiMove = async (chess) => {
    setIsAiThinking(true);
    setStatusMessage(`Ganesh AI (${gameConfig.difficulty}) is contemplating...`);

    // Natural delay so move doesn't feel robotic or jarring
    const delay = gameConfig.difficulty === 'easy' ? 400 : 700;

    setTimeout(async () => {
      try {
        const bestMove = await getBestMove(chess, gameConfig.difficulty);
        if (!bestMove) {
          setIsAiThinking(false);
          checkGameOver();
          return;
        }

        const move = chess.move(bestMove);
        if (move) {
          // Play sound
          if (chess.isCheckmate()) {
            sounds.playDefeat();
          } else if (chess.inCheck()) {
            sounds.playCheck();
          } else if (move.captured) {
            sounds.playCapture();
          } else if (move.san === 'O-O' || move.san === 'O-O-O') {
            sounds.playCastle();
          } else {
            sounds.playMove();
          }

          setBoardState(chess.board());
          setFen(chess.fen());
          setMoves(chess.history({ verbose: true }));
          setLastMove({ from: move.from, to: move.to });
          setEvaluation(getEvaluationDisplay(chess));

          if (!checkGameOver()) {
            setStatusMessage('Your turn to move!');
          }
        }
      } catch (e) {
        console.error('AI Move Error:', e);
      } finally {
        setIsAiThinking(false);
      }
    }, delay);
  };

  // Undo Move
  const handleUndo = () => {
    if (moves.length === 0 || isAiThinking || gameOverInfo) return;

    const chess = chessRef.current;
    if (gameConfig.mode === 'vs-computer') {
      // Revert AI move and Human move (2 plies)
      chess.undo();
      if (chess.turn() !== gameConfig.playerColor) {
        chess.undo();
      }
    } else {
      // Revert 1 ply for Pass & Play / Practice
      chess.undo();
    }

    setBoardState(chess.board());
    setFen(chess.fen());
    const hist = chess.history({ verbose: true });
    setMoves(hist);
    setLastMove(hist.length > 0 ? { from: hist[hist.length - 1].from, to: hist[hist.length - 1].to } : null);
    setActiveHint(null);
    setEvaluation(getEvaluationDisplay(chess));
    setStatusMessage('Move undone.');
  };

  // Restart match
  const handleRestart = () => {
    startNewMatch(gameConfig);
  };

  // Flip board
  const handleFlipBoard = () => {
    setIsFlipped(prev => !prev);
  };

  // Resign
  const handleResign = () => {
    if (gameOverInfo) return;
    const currentTurn = chessRef.current.turn();
    const resigningColor = currentTurn === 'w' ? 'White' : 'Black';
    const winningColor = resigningColor === 'White' ? 'Black' : 'White';

    sounds.playDefeat();
    const info = {
      result: 'loss',
      title: `${winningColor} Wins by Resignation`,
      reason: `${resigningColor} resigned the match.`
    };
    setGameOverInfo(info);
    recordMatch(info);
  };

  // Offer Draw
  const handleOfferDraw = () => {
    if (gameOverInfo) return;

    if (gameConfig.mode === 'vs-computer') {
      // AI evaluates if it should accept draw: accepts if position is dead even (-50 to +50 centipawns)
      const score = Math.abs(evaluation.score);
      if (score <= 60 && moves.length > 20) {
        sounds.playDefeat();
        const info = {
          result: 'draw',
          title: 'Draw Agreed!',
          reason: 'Ganesh AI accepted your draw offer in a balanced position.'
        };
        setGameOverInfo(info);
        recordMatch(info);
      } else {
        setStatusMessage('Ganesh AI declined the draw offer and continues playing!');
      }
    } else {
      // Pass & play or Practice
      sounds.playDefeat();
      const info = {
        result: 'draw',
        title: 'Draw Agreed!',
        reason: 'Both players agreed to a mutual draw.'
      };
      setGameOverInfo(info);
      recordMatch(info);
    }
  };

  // Tactical Hint
  const handleHint = () => {
    if (gameOverInfo || isAiThinking) return;
    const hint = getTacticalHint(chessRef.current);
    if (hint) {
      setActiveHint(hint);
    }
  };

  // History Scrubber Navigation
  const navigateToPly = (targetIndex) => {
    if (targetIndex < 0 || targetIndex >= moves.length) {
      // Return to live
      setHistoryIndex(-1);
      setBoardState(chessRef.current.board());
      return;
    }

    // Replay moves up to targetIndex
    const tempChess = new Chess();
    for (let i = 0; i <= targetIndex; i++) {
      tempChess.move(moves[i]);
    }
    setHistoryIndex(targetIndex);
    setBoardState(tempChess.board());
    setLastMove({ from: moves[targetIndex].from, to: moves[targetIndex].to });
  };

  // Compute captured pieces from boardState
  const calculateCapturedPieces = () => {
    const initialCounts = { p: 8, n: 2, b: 2, r: 2, q: 1 };
    const currentCountsWhite = { p: 0, n: 0, b: 0, r: 0, q: 0 };
    const currentCountsBlack = { p: 0, n: 0, b: 0, r: 0, q: 0 };

    if (boardState) {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = boardState[r][c];
          if (!piece || piece.type === 'k') continue;
          if (piece.color === 'w') {
            currentCountsWhite[piece.type] = (currentCountsWhite[piece.type] || 0) + 1;
          } else {
            currentCountsBlack[piece.type] = (currentCountsBlack[piece.type] || 0) + 1;
          }
        }
      }
    }

    // Pieces captured BY White (meaning lost Black pieces)
    const capturedByWhite = [];
    // Pieces captured BY Black (meaning lost White pieces)
    const capturedByBlack = [];

    Object.keys(initialCounts).forEach(type => {
      const lostWhite = Math.max(0, initialCounts[type] - (currentCountsWhite[type] || 0));
      for (let i = 0; i < lostWhite; i++) capturedByBlack.push(type);

      const lostBlack = Math.max(0, initialCounts[type] - (currentCountsBlack[type] || 0));
      for (let i = 0; i < lostBlack; i++) capturedByWhite.push(type);
    });

    // Material difference
    const values = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    const whiteSum = capturedByWhite.reduce((sum, p) => sum + (values[p] || 0), 0);
    const blackSum = capturedByBlack.reduce((sum, p) => sum + (values[p] || 0), 0);

    return {
      capturedByWhite,
      capturedByBlack,
      whiteAdvantage: Math.max(0, whiteSum - blackSum),
      blackAdvantage: Math.max(0, blackSum - whiteSum)
    };
  };

  const { capturedByWhite, capturedByBlack, whiteAdvantage, blackAdvantage } = calculateCapturedPieces();

  // Determine top & bottom player cards depending on flip
  const currentTurn = chessRef.current.turn();
  const isWhiteTurn = currentTurn === 'w';

  const whitePlayer = {
    name: gameConfig.mode === 'vs-computer' && gameConfig.playerColor === 'b' ? `Ganesh AI (${gameConfig.difficulty})` : gameConfig.p1Name,
    isAi: gameConfig.mode === 'vs-computer' && gameConfig.playerColor === 'b',
    difficulty: gameConfig.difficulty,
    color: 'w'
  };

  const blackPlayer = {
    name: gameConfig.mode === 'vs-computer' && gameConfig.playerColor === 'w' ? `Ganesh AI (${gameConfig.difficulty})` : gameConfig.p2Name,
    isAi: gameConfig.mode === 'vs-computer' && gameConfig.playerColor === 'w',
    difficulty: gameConfig.difficulty,
    color: 'b'
  };

  const topPlayer = isFlipped ? whitePlayer : blackPlayer;
  const bottomPlayer = isFlipped ? blackPlayer : whitePlayer;
  const topTime = isFlipped ? whiteTime : blackTime;
  const bottomTime = isFlipped ? blackTime : whiteTime;
  const topTurn = isFlipped ? isWhiteTurn : !isWhiteTurn;
  const bottomTurn = isFlipped ? !isWhiteTurn : isWhiteTurn;
  const topCaptured = isFlipped ? capturedByBlack : capturedByWhite;
  const bottomCaptured = isFlipped ? capturedByWhite : capturedByBlack;
  const topMaterialScore = isFlipped ? blackAdvantage : whiteAdvantage;
  const bottomMaterialScore = isFlipped ? whiteAdvantage : blackAdvantage;

  return (
    <div className="play-view-container">
      <div className="chess-arena-layout">
        {/* Left Column: Board + Players + Eval Bar */}
        <div className="board-column">
          {/* Top Player Card */}
          <PlayerCard
            player={topPlayer}
            isTurn={topTurn}
            timeLeft={topTime}
            capturedPieces={topCaptured}
            materialScore={topMaterialScore}
          />

          {/* Board with Eval Bar */}
          <div className="board-and-eval-container">
            {settings.showEvalBar && (
              <EvalBar evaluation={evaluation} isFlipped={isFlipped} />
            )}

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
                hintMove={activeHint ? { from: activeHint.from, to: activeHint.to } : null}
                isAiThinking={isAiThinking}
                onMove={handleMove}
                soundEnabled={settings.soundEnabled}
              />

              {/* Status and 3D View Toggle Row */}
              <div className="board-status-row">
                <div className="board-status-badge">
                  {isAiThinking ? (
                    <span className="status-thinking">
                      <span className="dot-pulse"></span> Ganesh AI is computing move...
                    </span>
                  ) : chessRef.current.inCheck() ? (
                    <span className="status-check">
                      <AlertCircle size={15} /> Check! King is threatened
                    </span>
                  ) : (
                    <span>{statusMessage}</span>
                  )}
                </div>

                <button
                  className={`btn-toggle-3d-pill ${is3D ? 'pill-3d-active' : ''}`}
                  onClick={() => setIs3D(prev => !prev)}
                  title="Toggle between 3D perspective and 2D flat view"
                >
                  <Box size={14} />
                  <span>{is3D ? '3D View' : '2D View'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Player Card */}
          <PlayerCard
            player={bottomPlayer}
            isTurn={bottomTurn}
            timeLeft={bottomTime}
            capturedPieces={bottomCaptured}
            materialScore={bottomMaterialScore}
          />
        </div>

        {/* Right Column: Move History, Controls, Tactical Hint */}
        <div className="sidebar-column">
          {/* Tactical Hint Card */}
          {activeHint && (
            <div className="hint-card">
              <div className="hint-header">
                <div className="hint-title-group">
                  <Sparkles size={18} className="hint-icon" />
                  <h4>Tactical Coach Hint</h4>
                </div>
                <button className="hint-close-btn" onClick={() => setActiveHint(null)}>
                  <X size={16} />
                </button>
              </div>
              <p className="hint-text">{activeHint.explanation}</p>
              <div className="hint-action-tag">
                Recommended move: <strong>{activeHint.san}</strong> ({activeHint.from} → {activeHint.to})
              </div>
            </div>
          )}

          {/* Move History */}
          <MoveHistory
            moves={moves}
            currentMoveIndex={historyIndex}
            onNavigateMove={navigateToPly}
            onFirstMove={() => navigateToPly(0)}
            onPrevMove={() => navigateToPly(historyIndex === -1 ? moves.length - 2 : historyIndex - 1)}
            onNextMove={() => navigateToPly(historyIndex === -1 ? moves.length - 1 : historyIndex + 1)}
            onLatestMove={() => navigateToPly(-1)}
            pgn={chessRef.current.pgn()}
          />

          {/* Game Controls Bar */}
          <GameControls
            onUndo={handleUndo}
            canUndo={moves.length > 0}
            onRestart={handleRestart}
            onNewGame={onOpenNewGameModal}
            onFlipBoard={handleFlipBoard}
            is3D={is3D}
            onToggle3D={() => setIs3D(prev => !prev)}
            onResign={handleResign}
            onOfferDraw={handleOfferDraw}
            onHint={handleHint}
            showHintBtn={true}
            isGameOver={!!gameOverInfo}
            isAiThinking={isAiThinking}
          />
        </div>
      </div>

      {/* Game Over Celebration Modal */}
      {gameOverInfo && (
        <GameOverModal
          result={gameOverInfo.result}
          title={gameOverInfo.title}
          reason={gameOverInfo.reason}
          moveCount={moves.length}
          onRematch={handleRestart}
          onNewGame={onOpenNewGameModal}
          onAnalyze={() => onSwitchToPracticeWithFen(fen)}
          onClose={() => setGameOverInfo(null)}
        />
      )}
    </div>
  );
};
