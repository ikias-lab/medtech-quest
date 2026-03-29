import type { GameState } from '../lib/types';
import { getCompanyCard } from '../data/cards';

interface WinLossProps {
  gameState: GameState;
}

export function WinLoss({ gameState }: WinLossProps) {
  const won = gameState.status === 'won';
  const company = getCompanyCard(gameState.company ?? '');

  return (
    <div className={`win-loss-screen ${won ? 'win' : 'loss'}`}>
      <div className="result-card">
        <div className="result-icon">{won ? '🎉' : '💔'}</div>
        <h1 className="result-title">
          {won ? 'ゲームクリア！' : 'ゲームオーバー'}
        </h1>

        {!won && gameState.lossReason && (
          <div className="loss-reason">
            <span className="loss-reason-label">敗因:</span>
            <span>{gameState.lossReason}</span>
          </div>
        )}

        <div className="result-stats">
          <div className="stat-row">
            <span>最終フェーズ</span>
            <span>{gameState.phase}</span>
          </div>
          <div className="stat-row">
            <span>最終ラウンド</span>
            <span>{gameState.round}</span>
          </div>
          <div className="stat-row">
            <span>製品力</span>
            <span>{gameState.tracks.productPower}</span>
          </div>
          <div className="stat-row">
            <span>事業力</span>
            <span>{gameState.tracks.bizPower}</span>
          </div>
          <div className="stat-row">
            <span>信頼</span>
            <span>{gameState.tracks.trust}</span>
          </div>
          <div className="stat-row">
            <span>リスク</span>
            <span className={gameState.tracks.risk >= 4 ? 'bad' : ''}>{gameState.tracks.risk}</span>
          </div>
          <div className="stat-row">
            <span>資金</span>
            <span className={gameState.tracks.funds < 0 ? 'bad' : ''}>{gameState.tracks.funds}</span>
          </div>
          {gameState.finalSales !== null && (
            <div className="stat-row">
              <span>最終売上</span>
              <span>{gameState.finalSales}</span>
            </div>
          )}
          {gameState.finalProfit !== null && (
            <div className="stat-row highlight">
              <span>最終利益</span>
              <span className={gameState.finalProfit >= 0 ? 'good' : 'bad'}>
                {gameState.finalProfit}
              </span>
            </div>
          )}
          {company && (
            <div className="stat-row">
              <span>目標利益</span>
              <span>{company.targetProfit}</span>
            </div>
          )}
        </div>

        <div className="players-result">
          <h3>チームメンバー</h3>
          {gameState.players.map((p) => (
            <div key={p.id} className="player-result-row">
              <span className="player-result-name">{p.name}</span>
              <span className="player-result-role">
                {p.role ?? '役割なし'}
              </span>
            </div>
          ))}
        </div>

        {won && (
          <div className="win-message">
            <p>素晴らしいチームワークでメドテック事業を成功させました！</p>
          </div>
        )}
      </div>
    </div>
  );
}
