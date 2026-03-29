import { useGame } from './hooks/useGame';
import { Lobby } from './components/Lobby';
import { RoleSelect } from './components/RoleSelect';
import { GameBoard } from './components/GameBoard';
import { WinLoss } from './components/WinLoss';
import type { GameState } from './lib/types';
import './App.css';

function App() {
  const {
    gameState,
    playerId,
    roomId,
    loading,
    error,
    createRoom,
    joinRoom,
    selectRole,
    startGameAction,
    drawEffectCardAction,
    drawClueCardAction,
    drawDramaCardAction,
    chooseDramaAction,
    endRoundAction,
    advancePhaseAction,
    selectDeviceAction,
    applyFinanceAction,
    toggleChecklistAction,
    revealClueAction,
    setGuessAction,
    calculateFinalAction,
  } = useGame();

  // Lobby: no room joined yet
  if (!roomId || !gameState) {
    return (
      <Lobby
        onCreateRoom={createRoom}
        onJoinRoom={joinRoom}
        loading={loading}
        error={error}
      />
    );
  }

  // Role selection screen
  if (gameState.status === 'lobby' || gameState.status === 'role_select') {
    return (
      <RoleSelect
        gameState={gameState}
        playerId={playerId}
        onSelectRole={selectRole}
        onStartGame={startGameAction}
        loading={loading}
        error={error}
      />
    );
  }

  // Win or loss screen
  if (gameState.status === 'won' || gameState.status === 'lost') {
    return <WinLoss gameState={gameState} />;
  }

  // Main game board
  if (gameState.status === 'playing') {
    return (
      <GameBoard
        gameState={gameState}
        playerId={playerId}
        roomId={roomId}
        onDrawEffectCard={drawEffectCardAction}
        onDrawClueCard={drawClueCardAction}
        onDrawDramaCard={drawDramaCardAction}
        onChooseDrama={chooseDramaAction}
        onEndRound={endRoundAction}
        onAdvancePhase={advancePhaseAction}
        onSelectDevice={selectDeviceAction}
        onApplyFinance={applyFinanceAction}
        onToggleChecklist={toggleChecklistAction}
        onRevealClue={revealClueAction}
        onSetGuess={setGuessAction}
        onCalculateFinal={calculateFinalAction}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <p>読み込み中...</p>
    </div>
  );
}

export default App;

// Helper type export for external use
export type { GameState };
