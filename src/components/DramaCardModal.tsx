import type { GameState } from '../lib/types';
import { getDramaCard } from '../data/cards';

interface DramaCardModalProps {
  gameState: GameState;
  playerId: string;
  onChoose: (choice: 'A' | 'B') => void;
  loading: boolean;
}

function effectSummary(effects: Record<string, number | undefined>): string {
  return Object.entries(effects)
    .filter(([, v]) => v !== undefined && v !== 0)
    .map(([k, v]) => {
      const labels: Record<string, string> = {
        fieldUnderstanding: '現場理解',
        productPower: '製品力',
        bizPower: '事業力',
        trust: '信頼',
        risk: 'リスク',
        funds: '資金',
        actionEffect: '行動効果',
      };
      const sign = (v ?? 0) > 0 ? '+' : '';
      return `${labels[k] ?? k}${sign}${v}`;
    })
    .join('、') || 'なし';
}

export function DramaCardModal({ gameState, playerId, onChoose, loading }: DramaCardModalProps) {
  const isHost = gameState.hostId === playerId;

  if (!gameState.currentDramaCard || gameState.dramaResolved) return null;
  if (!gameState.awaitingDramaChoice) return null;

  const card = getDramaCard(gameState.currentDramaCard);
  if (!card) return null;

  return (
    <div className="modal-overlay">
      <div className="modal drama-modal">
        <div className="drama-header">
          <div className="drama-icon">🎭</div>
          <h2 className="drama-title">{card.title}</h2>
        </div>

        <p className="drama-instruction">
          チームで話し合い、{isHost ? 'ホストが' : ''}選択肢を選んでください
        </p>

        <div className="drama-options">
          <div className="drama-option option-a">
            <div className="option-label">選択A</div>
            <div className="option-desc">{card.optionA.label}</div>
            <div className="option-effects">
              <span className="effects-benefits">
                メリット: {effectSummary(card.optionA.benefits as Record<string, number>)}
              </span>
              <span className="effects-costs">
                コスト: {effectSummary(card.optionA.costs as Record<string, number>)}
              </span>
            </div>
            {isHost && (
              <button
                className="btn btn-option-a"
                onClick={() => onChoose('A')}
                disabled={loading}
              >
                Aを選択
              </button>
            )}
          </div>

          <div className="drama-option option-b">
            <div className="option-label">選択B</div>
            <div className="option-desc">{card.optionB.label}</div>
            <div className="option-effects">
              <span className="effects-benefits">
                メリット: {effectSummary(card.optionB.benefits as Record<string, number>)}
              </span>
              <span className="effects-costs">
                コスト: {effectSummary(card.optionB.costs as Record<string, number>)}
              </span>
            </div>
            {isHost && (
              <button
                className="btn btn-option-b"
                onClick={() => onChoose('B')}
                disabled={loading}
              >
                Bを選択
              </button>
            )}
          </div>
        </div>

        {!isHost && (
          <p className="waiting-text">ホスト（{gameState.players.find((p) => p.id === gameState.hostId)?.name ?? '不明'}）の選択を待っています...</p>
        )}
      </div>
    </div>
  );
}
