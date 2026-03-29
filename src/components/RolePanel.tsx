import type { GameState, RoleId } from '../lib/types';
import { ROLE_NAMES, ROLE_COLORS } from '../lib/types';
import { getNeedsCard, getClueCard, getMedicalDeviceCard } from '../data/cards';

interface RolePanelProps {
  gameState: GameState;
  playerId: string;
}

function MedicalPanel({ gameState }: { gameState: GameState }) {
  const needsCard = gameState.needsCardId ? getNeedsCard(gameState.needsCardId) : null;

  return (
    <div className="role-panel-content">
      <h4>医療者の秘密情報</h4>

      {needsCard && (
        <div className="info-card">
          <div className="info-card-label">ニーズカード（裏面）</div>
          <div className="info-card-text">{needsCard.back}</div>
          <div className="attrs-grid">
            <div className="attr-item">
              <span className="attr-label">頻度</span>
              <span className="attr-value">{needsCard.attrs.freq}</span>
            </div>
            <div className="attr-item">
              <span className="attr-label">深刻度</span>
              <span className="attr-value">{needsCard.attrs.severity}</span>
            </div>
            <div className="attr-item">
              <span className="attr-label">代替手段</span>
              <span className="attr-value">{needsCard.attrs.alt}</span>
            </div>
            <div className="attr-item">
              <span className="attr-label">事業性</span>
              <span className="attr-value">{needsCard.attrs.biz}</span>
            </div>
          </div>
        </div>
      )}

      {gameState.medicalPrivateClues.length > 0 && (
        <div className="info-section">
          <div className="info-card-label">非公開クルーカード ({gameState.medicalPrivateClues.length}枚)</div>
          {gameState.medicalPrivateClues.map((id) => {
            const card = getClueCard(id);
            return (
              <div key={id} className={`clue-card-item ${card?.isMislead ? 'mislead' : ''}`}>
                <span className="clue-level">Lv.{card?.level}</span>
                <span>{card?.text}</span>
                {card?.isMislead && <span className="mislead-badge">⚠ ミスリード</span>}
              </div>
            );
          })}
        </div>
      )}

      {gameState.clueBoard.length > 0 && (
        <div className="info-section">
          <div className="info-card-label">公開済みクルー ({gameState.clueBoard.length}枚)</div>
          {gameState.clueBoard.map((id) => {
            const card = getClueCard(id);
            return (
              <div key={id} className="clue-card-item public">
                <span className="clue-level">Lv.{card?.level}</span>
                <span>{card?.text}</span>
                {card?.isMislead && <span className="mislead-badge">⚠ ミスリード</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function QAPanel({ gameState }: { gameState: GameState }) {
  const { tracks } = gameState;
  const riskLevel =
    tracks.risk >= 4 ? '危険' : tracks.risk >= 3 ? '高' : tracks.risk >= 2 ? '中' : '低';

  return (
    <div className="role-panel-content">
      <h4>品質規制担当の秘密情報</h4>
      <div className="info-card">
        <div className="info-card-label">リスク内訳（概算）</div>
        <div className="risk-breakdown">
          <div className="risk-item">
            <span>設計リスク</span>
            <span className="risk-level">{tracks.risk >= 2 ? '有' : '低'}</span>
          </div>
          <div className="risk-item">
            <span>規制リスク</span>
            <span className="risk-level">
              {gameState.medicalDeviceCardId === 'MD-06' ? '非常に高い' : tracks.risk >= 3 ? '有' : '低'}
            </span>
          </div>
          <div className="risk-item">
            <span>運用リスク</span>
            <span className="risk-level">{tracks.risk >= 1 ? '有' : '低'}</span>
          </div>
          <div className="risk-item total">
            <span>総合リスクレベル</span>
            <span className={`risk-level risk-${riskLevel}`}>{riskLevel}（{tracks.risk}/6）</span>
          </div>
        </div>
      </div>

      <div className="info-card">
        <div className="info-card-label">QAアドバイス</div>
        {tracks.risk >= 3 && (
          <p className="warning-text">⚠ クライシスモード発動中。リスク軽減を最優先に。</p>
        )}
        {tracks.trust < 2 && (
          <p className="warning-text">信頼スコアが低い。審査での追加確認リスクあり。</p>
        )}
        {gameState.phase >= 4 && (
          <p>評価フェーズ: 臨床データの収集と文書整備を進めてください。</p>
        )}
        {gameState.phase >= 5 && (
          <p>届出準備フェーズ: 認証申請書類のチェックを開始してください。</p>
        )}
        {tracks.risk <= 1 && tracks.trust >= 3 && (
          <p className="success-text">リスク管理は良好です。このまま維持してください。</p>
        )}
      </div>
    </div>
  );
}

function BizPanel({ gameState }: { gameState: GameState }) {
  const device = gameState.medicalDeviceCardId
    ? getMedicalDeviceCard(gameState.medicalDeviceCardId)
    : null;

  return (
    <div className="role-panel-content">
      <h4>事業担当の秘密情報</h4>

      {device ? (
        <div className="info-card">
          <div className="info-card-label">選択デバイスの隠れた失敗条件</div>
          <div className="device-name">{device.name}</div>
          <div className={`hidden-failure ${device.isTrap ? 'trap' : ''}`}>
            {device.isTrap && <span className="trap-badge">⚠ トラップカード</span>}
            <p>{device.hiddenFailure}</p>
            {device.isTrap && device.trapReason && (
              <p className="trap-reason">{device.trapReason}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="info-card">
          <div className="info-card-label">デバイスカード未選択</div>
          <p>フェーズ2でデバイスカードが選択されると、隠れた失敗条件が表示されます。</p>
        </div>
      )}

      <div className="info-card">
        <div className="info-card-label">事業アドバイス</div>
        {gameState.tracks.funds <= 2 && (
          <p className="warning-text">⚠ 資金残高が少ない。ファイナンスカードを検討してください。</p>
        )}
        {gameState.tracks.bizPower < 3 && gameState.phase >= 5 && (
          <p className="warning-text">事業力不足。フェーズ5通過条件を満たすため強化が必要。</p>
        )}
        {gameState.company === 'startup_a' && gameState.totalLoans >= 1 && (
          <p className="warning-text">ファイナンスカードの使用上限に達しています。</p>
        )}
        {gameState.tracks.bizPower >= 5 && (
          <p className="success-text">事業力は十分です。販路拡大フェーズに備えましょう。</p>
        )}
      </div>
    </div>
  );
}

function DevPanel({ gameState }: { gameState: GameState }) {
  return (
    <div className="role-panel-content">
      <h4>開発担当の情報</h4>
      <div className="info-card">
        <div className="info-card-label">製品開発状況</div>
        <div className="dev-status">
          <div className="dev-item">
            <span>製品力</span>
            <span className={gameState.tracks.productPower >= 4 ? 'good' : ''}>{gameState.tracks.productPower}/8</span>
          </div>
          <div className="dev-item">
            <span>Ph.2通過条件</span>
            <span className={gameState.tracks.productPower >= 1 ? 'good' : ''}>製品力≥1</span>
          </div>
          <div className="dev-item">
            <span>Ph.3通過条件</span>
            <span className={gameState.tracks.productPower >= 4 ? 'good' : ''}>製品力≥4</span>
          </div>
          <div className="dev-item">
            <span>Ph.4通過条件</span>
            <span className={gameState.tracks.productPower >= 5 ? 'good' : ''}>製品力≥5</span>
          </div>
        </div>
      </div>

      <div className="info-card">
        <div className="info-card-label">開発アドバイス</div>
        {gameState.tracks.productPower < 2 && (
          <p>早期フェーズ: 現場理解を積んで製品コンセプトを固めましょう。</p>
        )}
        {gameState.tracks.productPower >= 2 && gameState.tracks.productPower < 5 && (
          <p>試作段階: ユーザビリティと性能を重点的に改善してください。</p>
        )}
        {gameState.tracks.productPower >= 5 && (
          <p className="success-text">製品力は評価フェーズ通過レベルに達しています。</p>
        )}
        {gameState.crisisMode && (
          <p className="warning-text">⚠ クライシスモード中。品質リスクへの対応を急いでください。</p>
        )}
      </div>
    </div>
  );
}

function CoordinatorPanel({ gameState }: { gameState: GameState }) {
  return (
    <div className="role-panel-content">
      <h4>コーディネータの情報</h4>
      <div className="info-card">
        <div className="info-card-label">チーム状況サマリ</div>
        <div className="coord-summary">
          <div>プレイヤー数: {gameState.players.length}</div>
          <div>現在フェーズ: {gameState.phase}</div>
          <div>現在ラウンド: {gameState.round}/8</div>
          <div>クライシス: {gameState.crisisMode ? '発動中⚠' : '正常'}</div>
        </div>
      </div>

      <div className="info-card">
        <div className="info-card-label">全体俯瞰アドバイス</div>
        <div className="overall-check">
          <div className={gameState.tracks.fieldUnderstanding >= 3 ? 'ok' : 'ng'}>
            現場理解: {gameState.tracks.fieldUnderstanding}/3 {gameState.tracks.fieldUnderstanding >= 3 ? '✓' : '×'}
          </div>
          <div className={gameState.tracks.productPower >= 4 ? 'ok' : 'ng'}>
            製品力: {gameState.tracks.productPower}/4 {gameState.tracks.productPower >= 4 ? '✓' : '×'}
          </div>
          <div className={gameState.tracks.bizPower >= 3 ? 'ok' : 'ng'}>
            事業力: {gameState.tracks.bizPower}/3 {gameState.tracks.bizPower >= 3 ? '✓' : '×'}
          </div>
          <div className={gameState.tracks.trust >= 2 ? 'ok' : 'ng'}>
            信頼: {gameState.tracks.trust}/2 {gameState.tracks.trust >= 2 ? '✓' : '×'}
          </div>
          <div className={gameState.tracks.risk <= 3 ? 'ok' : 'ng'}>
            リスク: {gameState.tracks.risk}≤3 {gameState.tracks.risk <= 3 ? '✓' : '×'}
          </div>
          <div className={gameState.tracks.funds > 0 ? 'ok' : 'ng'}>
            資金: {gameState.tracks.funds} {gameState.tracks.funds > 0 ? '✓' : '×'}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RolePanel({ gameState, playerId }: RolePanelProps) {
  const player = gameState.players.find((p) => p.id === playerId);
  const role = player?.role as RoleId | null;

  if (!role) return null;

  const color = ROLE_COLORS[role];

  return (
    <div className="role-panel" style={{ borderColor: color }}>
      <div className="role-panel-header" style={{ backgroundColor: color }}>
        <span className="role-name">{ROLE_NAMES[role]}</span>
        <span className="player-name">{player?.name}</span>
      </div>

      {role === 'medical' && <MedicalPanel gameState={gameState} />}
      {role === 'dev' && <DevPanel gameState={gameState} />}
      {role === 'qa' && <QAPanel gameState={gameState} />}
      {role === 'biz' && <BizPanel gameState={gameState} />}
      {role === 'coordinator' && <CoordinatorPanel gameState={gameState} />}
    </div>
  );
}
