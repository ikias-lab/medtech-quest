import { useState } from 'react';
import type { GameState } from '../lib/types';
import { ROLE_NAMES, CLUE_ATTR_NAMES, CLUE_ATTR_ICONS } from '../lib/types';
import {
  getRoleEffectCard,
  getMedicalDeviceCard,
  MEDICAL_DEVICE_CARDS,
  FINANCE_CARDS,
  getClueCard,
} from '../data/cards';
import { allEffectCardsDrawn } from '../lib/gameLogic';

interface CardDrawAreaProps {
  gameState: GameState;
  playerId: string;
  onDrawEffectCard: () => void;
  onDrawClueCard: (makePublic: boolean) => void;
  onDrawDramaCard: () => void;
  onSelectDevice: (deviceId: string) => void;
  onApplyFinance: (cardId: string) => void;
  onRevealClue: (clueId: string) => void;
  onSetGuess: (guess: GameState['attributeGuess']) => void;
  loading: boolean;
}

export function CardDrawArea({
  gameState,
  playerId,
  onDrawEffectCard,
  onDrawClueCard,
  onDrawDramaCard,
  onSelectDevice,
  onApplyFinance,
  onRevealClue,
  onSetGuess,
  loading,
}: CardDrawAreaProps) {
  const [showDeviceSelect, setShowDeviceSelect] = useState(false);
  const [showFinanceSelect, setShowFinanceSelect] = useState(false);
  const [showGuessForm, setShowGuessForm] = useState(false);
  const [guess, setGuess] = useState({ freq: '高', severity: '高', alt: 'あり', biz: '高' });

  const player = gameState.players.find((p) => p.id === playerId);
  const isMedical = player?.role === 'medical';
  const hasDrawnEffect = gameState.effectCardsDrawnThisRound.includes(playerId);
  const pendingBots = gameState.players.filter(
    (p) => p.isBot && !gameState.effectCardsDrawnThisRound.includes(p.id)
  );
  const drawnCard = gameState.currentDrawnEffectCard
    ? getRoleEffectCard(gameState.currentDrawnEffectCard)
    : null;

  const allDrawn = allEffectCardsDrawn(gameState);

  return (
    <div className="card-draw-area">
      {/* CPU processing indicator */}
      {pendingBots.length > 0 && (
        <div className="bot-processing">
          🤖 CPU処理中: {pendingBots.map((p) => p.name).join('、')}...
        </div>
      )}

      {/* Phase 1 only: Clue card draw (medical player) */}
      {gameState.phase === 1 && isMedical && !gameState.clueDrawnThisRound && (
        <div className="action-section">
          <h4>【医療者】クルーカードを引く</h4>
          <p>残り {gameState.clueCardDeck.length} 枚</p>
          <div className="btn-row">
            <button
              className="btn btn-primary"
              onClick={() => onDrawClueCard(true)}
              disabled={loading || gameState.clueCardDeck.length === 0}
            >
              公開して引く
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => onDrawClueCard(false)}
              disabled={loading || gameState.clueCardDeck.length === 0}
            >
              非公開で引く
            </button>
          </div>
        </div>
      )}

      {/* Medical: reveal private clues */}
      {isMedical && gameState.medicalPrivateClues.length > 0 && (
        <div className="action-section">
          <h4>非公開クルー（あなただけが見えています）</h4>
          <div className="clue-list">
            {gameState.medicalPrivateClues.map((id) => {
              const card = getClueCard(id);
              const attr = card?.hintAttr;
              return (
                <div key={id} className="clue-reveal-item clue-private">
                  <div className="clue-meta">
                    <span className={`clue-level lv${card?.level}`}>Lv.{card?.level}</span>
                    {attr && (
                      <span className={`clue-attr-badge attr-${attr}`}>
                        {CLUE_ATTR_ICONS[attr]} {CLUE_ATTR_NAMES[attr]}
                      </span>
                    )}
                  </div>
                  <span className="clue-text">{card?.text}</span>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => onRevealClue(id)}
                    disabled={loading}
                  >
                    公開
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Attribute guess (medical) */}
      {isMedical && !gameState.attributeGuess && gameState.phase >= 2 && (
        <div className="action-section">
          <h4>ニーズ属性を予測する</h4>
          {!showGuessForm ? (
            <button className="btn btn-outline" onClick={() => setShowGuessForm(true)}>
              属性予測を入力
            </button>
          ) : (
            <div className="guess-form">
              <div className="form-row">
                <label>頻度</label>
                <select value={guess.freq} onChange={(e) => setGuess({ ...guess, freq: e.target.value })}>
                  <option>高</option>
                  <option>中</option>
                  <option>低</option>
                </select>
              </div>
              <div className="form-row">
                <label>深刻度</label>
                <select value={guess.severity} onChange={(e) => setGuess({ ...guess, severity: e.target.value })}>
                  <option>高</option>
                  <option>中</option>
                  <option>低</option>
                </select>
              </div>
              <div className="form-row">
                <label>代替手段</label>
                <select value={guess.alt} onChange={(e) => setGuess({ ...guess, alt: e.target.value })}>
                  <option>あり</option>
                  <option>ややあり</option>
                  <option>なし</option>
                </select>
              </div>
              <div className="form-row">
                <label>事業性</label>
                <select value={guess.biz} onChange={(e) => setGuess({ ...guess, biz: e.target.value })}>
                  <option>高</option>
                  <option>中</option>
                  <option>低</option>
                </select>
              </div>
              <div className="btn-row">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onSetGuess(guess);
                    setShowGuessForm(false);
                  }}
                  disabled={loading}
                >
                  確定
                </button>
                <button className="btn btn-ghost" onClick={() => setShowGuessForm(false)}>
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Public clue board */}
      {gameState.clueBoard.length > 0 && (
        <div className="action-section">
          <h4>公開クルーボード</h4>
          <p className="clue-board-hint">
            各カードのバッジはニーズのどの属性に関するヒントかを示します。
            {gameState.phase >= 2 && ' ⚠️マークは誤誘導カードの可能性があります。'}
          </p>
          <div className="clue-board">
            {gameState.clueBoard.map((id) => {
              const card = getClueCard(id);
              const attr = card?.hintAttr;
              return (
                <div key={id} className={`clue-board-card ${card?.isMislead && gameState.phase >= 2 ? 'mislead' : ''}`}>
                  <div className="clue-meta">
                    <span className={`clue-level lv${card?.level}`}>Lv.{card?.level}</span>
                    {attr && (
                      <span className={`clue-attr-badge attr-${attr}`}>
                        {CLUE_ATTR_ICONS[attr]} {CLUE_ATTR_NAMES[attr]}
                      </span>
                    )}
                    {card?.isMislead && gameState.phase >= 2 && (
                      <span className="clue-mislead-badge">⚠️ 要検証</span>
                    )}
                  </div>
                  <span className="clue-card-text">{card?.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Phase 2: device selection */}
      {gameState.phase === 2 && !gameState.medicalDeviceCardId && (
        <div className="action-section highlight">
          <h4>【フェーズ2】医療デバイスカードを選択</h4>
          {!showDeviceSelect ? (
            <button className="btn btn-primary" onClick={() => setShowDeviceSelect(true)}>
              デバイス一覧を見る
            </button>
          ) : (
            <div className="device-select-grid">
              {MEDICAL_DEVICE_CARDS.map((card) => (
                <div key={card.id} className="device-card">
                  <div className="device-card-name">{card.name}</div>
                  <div className="device-card-desc">{card.description}</div>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      onSelectDevice(card.id);
                      setShowDeviceSelect(false);
                    }}
                    disabled={loading}
                  >
                    選択
                  </button>
                </div>
              ))}
              <button className="btn btn-ghost" onClick={() => setShowDeviceSelect(false)}>
                閉じる
              </button>
            </div>
          )}
        </div>
      )}

      {gameState.medicalDeviceCardId && (
        <div className="action-section">
          <h4>選択デバイス</h4>
          <div className="selected-device">
            {getMedicalDeviceCard(gameState.medicalDeviceCardId)?.name ?? gameState.medicalDeviceCardId}
          </div>
        </div>
      )}

      {/* Effect card draw */}
      <div className="action-section">
        <h4>役割カードを引く</h4>
        {!hasDrawnEffect ? (
          <div>
            <p>残り {gameState.effectCardDeck.length} 枚</p>
            <button
              className="btn btn-primary"
              onClick={onDrawEffectCard}
              disabled={loading || gameState.effectCardDeck.length === 0}
            >
              カードを引く
            </button>
          </div>
        ) : (
          <div className="drawn-card">
            <span className="drawn-label">引いたカード:</span>
            {drawnCard ? (
              <div className="effect-card-display">
                <div className="effect-card-name">{drawnCard.name}</div>
                {player?.role && (
                  <div className="effect-values">
                    <span>性能+{drawnCard.effects[player.role].perf}</span>
                    <span>品質+{drawnCard.effects[player.role].quality}</span>
                    <span>操作性+{drawnCard.effects[player.role].usability}</span>
                    <span>コスト+{drawnCard.effects[player.role].cost}</span>
                    <span>事業費+{drawnCard.effects[player.role].bizCost}</span>
                  </div>
                )}
              </div>
            ) : (
              <span>引き済み</span>
            )}
          </div>
        )}

        {/* Show who has drawn */}
        <div className="draw-status">
          {gameState.players.map((p) => (
            <span
              key={p.id}
              className={`player-draw-badge ${gameState.effectCardsDrawnThisRound.includes(p.id) ? 'drawn' : 'pending'}`}
              title={p.role ? ROLE_NAMES[p.role] : '未選択'}
            >
              {p.name} {gameState.effectCardsDrawnThisRound.includes(p.id) ? '✓' : '…'}
            </span>
          ))}
        </div>
      </div>

      {/* Drama card */}
      {allDrawn && !gameState.dramaCardDrawnThisRound && (
        <div className="action-section highlight">
          <h4>ドラマカードを引く</h4>
          <button
            className="btn btn-drama"
            onClick={onDrawDramaCard}
            disabled={loading || gameState.dramaCardDeck.length === 0}
          >
            ドラマカードを引く（残り {gameState.dramaCardDeck.length} 枚）
          </button>
        </div>
      )}

      {/* Finance card */}
      <div className="action-section">
        <h4>ファイナンスカード（任意）</h4>
        {!showFinanceSelect ? (
          <button className="btn btn-outline" onClick={() => setShowFinanceSelect(true)}>
            ファイナンスカードを使う
          </button>
        ) : (
          <div className="finance-select">
            {FINANCE_CARDS.map((card) => {
              const disabled =
                (card.requiresTrust !== undefined && gameState.tracks.trust < card.requiresTrust) ||
                (gameState.company === 'startup_a' && gameState.totalLoans >= 1);
              return (
                <div key={card.id} className={`finance-card ${disabled ? 'disabled' : ''}`}>
                  <div className="finance-card-name">{card.name}</div>
                  <div className="finance-card-desc">{card.description}</div>
                  {card.requiresTrust && (
                    <div className="finance-req">要: 信頼≥{card.requiresTrust}</div>
                  )}
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      onApplyFinance(card.id);
                      setShowFinanceSelect(false);
                    }}
                    disabled={loading || disabled}
                  >
                    使用
                  </button>
                </div>
              );
            })}
            <button className="btn btn-ghost" onClick={() => setShowFinanceSelect(false)}>
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
