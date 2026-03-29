import type { GameState } from '../lib/types';
import { getPhaseName, getPhaseRounds, checkPhaseTransition, allEffectCardsDrawn } from '../lib/gameLogic';
import { getCompanyCard } from '../data/cards';
import { ROLE_NAMES } from '../lib/types';

interface PhaseInfoProps {
  gameState: GameState;
  playerId: string;
  onAdvancePhase: () => void;
  onEndRound: () => void;
  onCalculateFinal: () => void;
  loading: boolean;
}

export function PhaseInfo({
  gameState,
  playerId,
  onAdvancePhase,
  onEndRound,
  onCalculateFinal,
  loading,
}: PhaseInfoProps) {
  const isHost = gameState.hostId === playerId;
  const { canAdvance, reason } = checkPhaseTransition(gameState);
  const company = getCompanyCard(gameState.company ?? '');
  const allDrawn = allEffectCardsDrawn(gameState);
  const dramaResolved = gameState.dramaResolved || !gameState.dramaCardDrawnThisRound;
  const readyForRoundEnd = allDrawn && (gameState.dramaCardDrawnThisRound ? gameState.dramaResolved : true);

  return (
    <div className="phase-info">
      <div className="phase-header">
        <div className="phase-main">
          <span className="phase-badge">
            {getPhaseName(gameState.phase)}
          </span>
          <span className="round-badge">
            ラウンド {gameState.round} / 8　{getPhaseRounds(gameState.phase)}
          </span>
        </div>
        {company && (
          <div className="company-badge">
            {company.name}
            <span className="company-target">目標利益: {company.targetProfit}</span>
          </div>
        )}
      </div>

      <div className="phase-players">
        {gameState.players.map((p) => (
          <span key={p.id} className={`player-chip ${p.id === playerId ? 'self' : ''}`}>
            {p.name}
            {p.role && <span className="player-role-chip"> ({ROLE_NAMES[p.role].slice(0, 2)})</span>}
          </span>
        ))}
      </div>

      {/* Phase transition */}
      {canAdvance && isHost && gameState.phase < 6 && (
        <div className="phase-advance">
          <div className="advance-ready">✓ フェーズ移行条件達成: {reason}</div>
          <button
            className="btn btn-phase"
            onClick={onAdvancePhase}
            disabled={loading}
          >
            フェーズ{gameState.phase + 1}へ移行
          </button>
        </div>
      )}

      {!canAdvance && gameState.phase < 6 && (
        <div className="phase-condition">
          <span className="condition-label">移行条件: </span>
          <span>{reason}</span>
        </div>
      )}

      {/* Round end */}
      {isHost && (
        <div className="round-actions">
          {gameState.phase === 6 ? (
            <button
              className="btn btn-win"
              onClick={onCalculateFinal}
              disabled={loading}
            >
              最終結果を計算する
            </button>
          ) : (
            <button
              className="btn btn-end-round"
              onClick={onEndRound}
              disabled={loading || !readyForRoundEnd}
              title={!readyForRoundEnd ? '全員がカードを引き、ドラマカードを処理してください' : ''}
            >
              ラウンド終了（資金-1）
              {!readyForRoundEnd && ' ⏳'}
            </button>
          )}

          {!readyForRoundEnd && (
            <div className="round-checklist">
              <span className={allDrawn ? 'ok' : 'pending'}>
                {allDrawn ? '✓' : '○'} 全員カード引き済み
              </span>
              <span className={dramaResolved ? 'ok' : 'pending'}>
                {dramaResolved ? '✓' : '○'} ドラマカード処理済み
              </span>
            </div>
          )}
        </div>
      )}

      {/* Attribute guess display */}
      {gameState.attributeGuess && (
        <div className="attribute-guess">
          <span className="attr-label">ニーズ予測:</span>
          <span>頻度={gameState.attributeGuess.freq}</span>
          <span>深刻度={gameState.attributeGuess.severity}</span>
          <span>代替={gameState.attributeGuess.alt}</span>
          <span>事業性={gameState.attributeGuess.biz}</span>
        </div>
      )}

      {/* Checklist */}
      <div className="checklist-section">
        <div className="checklist-title">チェックリスト</div>
        <div className="checklist-items">
          {Object.entries(gameState.checklist).map(([key, val]) => {
            const labels: Record<string, string> = {
              medScene: '現場確認(医)',
              medUser: 'ユーザー確認(医)',
              devSpec: '仕様確定(開)',
              qaData: 'データ収集(QA)',
              qaRisk: 'リスク評価(QA)',
              bizSales: '販路確認(事)',
            };
            return (
              <span key={key} className={`checklist-item ${val ? 'checked' : ''}`}>
                {val ? '☑' : '☐'} {labels[key]}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
