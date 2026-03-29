import type { GameState, PriorityTrackId } from '../lib/types';
import { PRIORITY_TRACK_NAMES, ROLE_NAMES, ROLE_COLORS } from '../lib/types';
import { ROLE_DEFAULT_PRIORITY } from '../lib/gameLogic';

interface PriorityDeclarationPanelProps {
  gameState: GameState;
  playerId: string;
  onDeclare: (track: PriorityTrackId) => void;
  loading: boolean;
}

const TRACK_OPTIONS: PriorityTrackId[] = ['fieldUnderstanding', 'productPower', 'bizPower', 'trust'];

const TRACK_ICONS: Record<PriorityTrackId, string> = {
  fieldUnderstanding: '🏥',
  productPower: '⚙️',
  bizPower: '📈',
  trust: '🤝',
};

export function PriorityDeclarationPanel({
  gameState,
  playerId,
  onDeclare,
  loading,
}: PriorityDeclarationPanelProps) {
  const myPlayer = gameState.players.find((p) => p.id === playerId);
  const myDeclaration = myPlayer ? gameState.priorityDeclarations[myPlayer.id] : undefined;
  const allDeclared = gameState.priorityDeclarationResolved;

  return (
    <div className="priority-declaration-panel">
      <div className="priority-header">
        <h3>優先トラック宣言</h3>
        <p className="priority-subtitle">
          今ラウンド最も力を入れたいトラックを宣言してください（同時公開）
        </p>
      </div>

      {/* Player declaration status */}
      <div className="priority-player-status">
        {gameState.players.map((p) => {
          const declared = gameState.priorityDeclarations[p.id];
          const color = p.role ? ROLE_COLORS[p.role] : '#888';
          return (
            <div
              key={p.id}
              className={`priority-player-badge ${declared ? 'declared' : 'waiting'}`}
              style={{ borderColor: color }}
            >
              <span className="priority-player-name" style={{ color }}>
                {p.name}
                {p.isBot && ' 🤖'}
              </span>
              {allDeclared && declared ? (
                <span className="priority-player-track">
                  {TRACK_ICONS[declared]} {PRIORITY_TRACK_NAMES[declared]}
                </span>
              ) : declared ? (
                <span className="priority-player-track declared-hidden">宣言済み ✓</span>
              ) : (
                <span className="priority-player-track waiting-text">宣言待ち...</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Declaration result (after resolve) */}
      {allDeclared && (
        <div className={`priority-result ${gameState.roundConflictPenalty ? 'penalty' : gameState.roundBonusTrack ? 'bonus' : 'neutral'}`}>
          {gameState.roundBonusTrack && (
            <p>
              <strong>連携ボーナス!</strong>{' '}
              {TRACK_ICONS[gameState.roundBonusTrack]}{' '}
              {PRIORITY_TRACK_NAMES[gameState.roundBonusTrack]} +1
            </p>
          )}
          {gameState.roundConflictPenalty && (
            <p>
              <strong>衝突ペナルティ!</strong> 全トラック -1（誰も同じトラックを選ばなかった）
            </p>
          )}
          {!gameState.roundBonusTrack && !gameState.roundConflictPenalty && (
            <p>効果なし — アクションフェーズへ進んでください</p>
          )}
        </div>
      )}

      {/* Selection buttons (only for human player who hasn't declared yet) */}
      {!allDeclared && myPlayer && !myPlayer.isBot && !myDeclaration && (
        <div className="priority-select">
          <p className="priority-select-label">あなたの宣言:</p>
          <div className="priority-buttons">
            {TRACK_OPTIONS.map((track) => {
              const isDefault = myPlayer.role ? ROLE_DEFAULT_PRIORITY[myPlayer.role] === track : false;
              return (
                <button
                  key={track}
                  className={`priority-btn ${isDefault ? 'priority-btn-suggested' : ''}`}
                  onClick={() => onDeclare(track)}
                  disabled={loading}
                  title={isDefault ? 'あなたの役職に推奨' : ''}
                >
                  {TRACK_ICONS[track]}
                  <span>{PRIORITY_TRACK_NAMES[track]}</span>
                  {isDefault && <span className="priority-suggested-badge">推奨</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Waiting message after human declared */}
      {!allDeclared && myDeclaration && (
        <div className="priority-waiting">
          あなたの宣言: {TRACK_ICONS[myDeclaration]} {PRIORITY_TRACK_NAMES[myDeclaration]}
          <br />
          <span className="waiting-dots">他のプレイヤーの宣言を待っています...</span>
        </div>
      )}

      {/* Role conflict hint */}
      {!allDeclared && (
        <div className="priority-hint">
          <strong>ルール:</strong> 2人以上が同じトラックを宣言 → そのトラック+1（連携ボーナス）
          <br />
          全員が異なるトラックを宣言 → 全トラック-1（衝突ペナルティ）
        </div>
      )}
    </div>
  );
}

// Export role name display helper
export { ROLE_NAMES };
