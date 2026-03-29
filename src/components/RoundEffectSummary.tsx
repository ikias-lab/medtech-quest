import type { GameState } from '../lib/types';
import { ROLE_NAMES, ROLE_COLORS } from '../lib/types';

interface RoundEffectSummaryProps {
  gameState: GameState;
}

function Delta({ value, label }: { value: number; label: string }) {
  if (value === 0) return <span className="delta delta-zero">{label} ±0</span>;
  const sign = value > 0 ? '+' : '';
  return (
    <span className={`delta ${value > 0 ? 'delta-pos' : 'delta-neg'}`}>
      {label} {sign}{value}
    </span>
  );
}

export function RoundEffectSummary({ gameState }: RoundEffectSummaryProps) {
  const { roundEffectHistory, players } = gameState;

  if (roundEffectHistory.length === 0) return null;

  // Aggregate totals
  const totals = roundEffectHistory.reduce(
    (acc, e) => ({
      productPower: acc.productPower + e.productPowerDelta,
      bizPower: acc.bizPower + e.bizPowerDelta,
      funds: acc.funds + e.fundsDelta,
    }),
    { productPower: 0, bizPower: 0, funds: 0 }
  );

  return (
    <div className="round-effect-summary">
      <h4 className="res-title">今ラウンドのカード効果</h4>

      <div className="res-rows">
        {roundEffectHistory.map((entry) => {
          const player = players.find((p) => p.id === entry.playerId);
          const color = player?.role ? ROLE_COLORS[player.role] : '#888';
          const roleName = ROLE_NAMES[entry.role];
          return (
            <div key={entry.playerId} className="res-row">
              <div className="res-player" style={{ borderLeftColor: color }}>
                <span className="res-role" style={{ color }}>{roleName}</span>
                <span className="res-name">{entry.playerName}</span>
              </div>
              <div className="res-card-name">「{entry.cardName}」</div>
              <div className="res-deltas">
                <Delta value={entry.productPowerDelta} label="製品力" />
                <Delta value={entry.bizPowerDelta} label="事業力" />
                <Delta value={entry.fundsDelta} label="資金" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total row */}
      {roundEffectHistory.length > 1 && (
        <div className="res-total">
          <span className="res-total-label">ラウンド合計</span>
          <div className="res-deltas">
            <Delta value={totals.productPower} label="製品力" />
            <Delta value={totals.bizPower} label="事業力" />
            <Delta value={totals.funds} label="資金" />
          </div>
        </div>
      )}
    </div>
  );
}
