import { useState } from 'react';
import type { GameState, RoleId, CompanyId, NeedsId } from '../lib/types';
import { ROLE_NAMES, ROLE_COLORS } from '../lib/types';
import { COMPANY_CARDS, NEEDS_CARDS } from '../data/cards';

interface RoleSelectProps {
  gameState: GameState;
  playerId: string;
  onSelectRole: (role: RoleId) => void;
  onStartGame: (companyId: CompanyId, needsCardId: NeedsId) => void;
  loading: boolean;
  error: string | null;
}

const ALL_ROLES: RoleId[] = ['medical', 'dev', 'qa', 'biz', 'coordinator'];

export function RoleSelect({
  gameState,
  playerId,
  onSelectRole,
  onStartGame,
  loading,
  error,
}: RoleSelectProps) {
  const [selectedCompany, setSelectedCompany] = useState<CompanyId>('startup_a');
  const [selectedNeeds, setSelectedNeeds] = useState<NeedsId>('N-01');

  const isHost = gameState.hostId === playerId;
  const myPlayer = gameState.players.find((p) => p.id === playerId);
  const myRole = myPlayer?.role;

  const takenRoles = gameState.players.filter((p) => p.id !== playerId).map((p) => p.role);

  const allRolesSelected =
    gameState.players.length >= 4 && gameState.players.every((p) => p.role !== null);

  const canStart = isHost && allRolesSelected;

  return (
    <div className="role-select-screen">
      <div className="role-select-container">
        <h1 className="game-logo">メドテック・クエスト</h1>
        <h2>役割を選択してください</h2>

        <div className="room-code-info">
          ルームコード: <strong>{gameState.roomId}</strong>
          <span className="copy-hint">他のプレイヤーに共有してください</span>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {/* Players list */}
        <div className="players-list">
          <h3>参加プレイヤー ({gameState.players.length}人)</h3>
          {gameState.players.map((p) => (
            <div key={p.id} className="player-row">
              <span className="player-name-chip">{p.name}</span>
              {p.id === gameState.hostId && <span className="host-badge">ホスト</span>}
              {p.role ? (
                <span className="role-chip" style={{ backgroundColor: ROLE_COLORS[p.role] }}>
                  {ROLE_NAMES[p.role]}
                </span>
              ) : (
                <span className="role-pending">選択中...</span>
              )}
            </div>
          ))}
        </div>

        {/* Role selection */}
        {!myRole && (
          <div className="role-grid">
            <h3>あなたの役割を選ぶ</h3>
            {ALL_ROLES.map((role) => {
              const taken = takenRoles.includes(role);
              return (
                <button
                  key={role}
                  className={`role-card ${taken ? 'taken' : ''}`}
                  style={{ borderColor: ROLE_COLORS[role] }}
                  onClick={() => !taken && onSelectRole(role)}
                  disabled={loading || taken}
                >
                  <div className="role-card-name" style={{ color: ROLE_COLORS[role] }}>
                    {ROLE_NAMES[role]}
                  </div>
                  {role === 'medical' && <div className="role-desc">現場情報の要。隠れたニーズ情報を持つ。</div>}
                  {role === 'dev' && <div className="role-desc">製品性能の要。試作・技術開発をリード。</div>}
                  {role === 'qa' && <div className="role-desc">品質・規制の要。リスク管理を担う。</div>}
                  {role === 'biz' && <div className="role-desc">事業・資金の要。販路・財務をリード。</div>}
                  {role === 'coordinator' && (
                    <div className="role-desc">5人目（任意）。全体の連携を強化する。</div>
                  )}
                  {taken && <div className="taken-label">選択済み</div>}
                </button>
              );
            })}
          </div>
        )}

        {myRole && (
          <div className="my-role-display">
            <div className="selected-role-label">あなたの役割:</div>
            <div
              className="selected-role-name"
              style={{ color: ROLE_COLORS[myRole] }}
            >
              {ROLE_NAMES[myRole]}
            </div>
          </div>
        )}

        {/* Game setup (host only) */}
        {isHost && (
          <div className="game-setup">
            <h3>ゲーム設定（ホストのみ）</h3>

            <div className="setup-section">
              <label>会社カードを選ぶ</label>
              <div className="company-cards">
                {COMPANY_CARDS.map((c) => (
                  <div
                    key={c.id}
                    className={`company-card ${selectedCompany === c.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCompany(c.id as CompanyId)}
                  >
                    <div className="company-name">{c.name}</div>
                    <div className="company-stats">
                      資金:{c.funds} / 信頼:{c.trust} / 目標利益:{c.targetProfit}
                    </div>
                    <div className="company-special">{c.special}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="setup-section">
              <label>ニーズカードを選ぶ（医療者が後で確認）</label>
              <div className="needs-cards">
                {NEEDS_CARDS.map((n) => (
                  <div
                    key={n.id}
                    className={`needs-card ${selectedNeeds === n.id ? 'selected' : ''}`}
                    onClick={() => setSelectedNeeds(n.id)}
                  >
                    <div className="needs-id">{n.id}</div>
                    <div className="needs-front">{n.front}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn btn-start"
              onClick={() => onStartGame(selectedCompany, selectedNeeds)}
              disabled={loading || !canStart}
              title={!canStart ? '全員（4人以上）が役割を選択してください' : ''}
            >
              ゲームスタート！
              {!canStart && ` (${gameState.players.filter((p) => p.role).length}/${Math.max(4, gameState.players.length)}人選択済み)`}
            </button>
          </div>
        )}

        {!isHost && (
          <p className="host-waiting">
            ホスト（{gameState.players.find((p) => p.id === gameState.hostId)?.name}）がゲームを開始するのを待っています...
          </p>
        )}
      </div>
    </div>
  );
}
