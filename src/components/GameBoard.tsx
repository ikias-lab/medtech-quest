import type { GameState } from '../lib/types';
import { TrackPanel } from './TrackPanel';
import { RolePanel } from './RolePanel';
import { CardDrawArea } from './CardDrawArea';
import { DramaCardModal } from './DramaCardModal';
import { PhaseInfo } from './PhaseInfo';
import { GameLog } from './GameLog';

interface GameBoardProps {
  gameState: GameState;
  playerId: string;
  roomId: string;
  onDrawEffectCard: () => void;
  onDrawClueCard: (makePublic: boolean) => void;
  onDrawDramaCard: () => void;
  onChooseDrama: (choice: 'A' | 'B') => void;
  onEndRound: () => void;
  onAdvancePhase: () => void;
  onSelectDevice: (deviceId: string) => void;
  onApplyFinance: (cardId: string) => void;
  onToggleChecklist: (key: keyof GameState['checklist']) => void;
  onRevealClue: (clueId: string) => void;
  onSetGuess: (guess: GameState['attributeGuess']) => void;
  onCalculateFinal: () => void;
  loading: boolean;
  error: string | null;
}

export function GameBoard({
  gameState,
  playerId,
  roomId,
  onDrawEffectCard,
  onDrawClueCard,
  onDrawDramaCard,
  onChooseDrama,
  onEndRound,
  onAdvancePhase,
  onSelectDevice,
  onApplyFinance,
  onToggleChecklist,
  onRevealClue,
  onSetGuess,
  onCalculateFinal,
  loading,
  error,
}: GameBoardProps) {
  return (
    <div className="game-board">
      {/* Header bar */}
      <div className="game-header">
        <div className="game-title">メドテック・クエスト</div>
        <div className="room-code-display">ルームコード: <strong>{roomId}</strong></div>
        {loading && <div className="loading-indicator">処理中...</div>}
      </div>

      {error && (
        <div className="error-banner">{error}</div>
      )}

      {/* Main layout: left column (tracks + phase), right column (role + draw + log) */}
      <div className="board-layout">
        {/* Left column */}
        <div className="board-left">
          <PhaseInfo
            gameState={gameState}
            playerId={playerId}
            onAdvancePhase={onAdvancePhase}
            onEndRound={onEndRound}
            onCalculateFinal={onCalculateFinal}
            onToggleChecklist={onToggleChecklist}
            loading={loading}
          />
          <TrackPanel tracks={gameState.tracks} crisisMode={gameState.crisisMode} />
          <GameLog log={gameState.log} />
        </div>

        {/* Right column */}
        <div className="board-right">
          <RolePanel gameState={gameState} playerId={playerId} />
          <CardDrawArea
            gameState={gameState}
            playerId={playerId}
            onDrawEffectCard={onDrawEffectCard}
            onDrawClueCard={onDrawClueCard}
            onDrawDramaCard={onDrawDramaCard}
            onSelectDevice={onSelectDevice}
            onApplyFinance={onApplyFinance}
            onRevealClue={onRevealClue}
            onSetGuess={onSetGuess}
            loading={loading}
          />
        </div>
      </div>

      {/* Drama modal (full-screen overlay) */}
      {gameState.awaitingDramaChoice && (
        <DramaCardModal
          gameState={gameState}
          playerId={playerId}
          onChoose={onChooseDrama}
          loading={loading}
        />
      )}

    </div>
  );
}
