import { useState } from 'react';

interface LobbyProps {
  onCreateRoom: (playerName: string) => Promise<string>;
  onJoinRoom: (code: string, playerName: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function Lobby({ onCreateRoom, onJoinRoom, loading, error }: LobbyProps) {
  const [playerName, setPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [mode, setMode] = useState<'home' | 'create' | 'join'>('home');

  const handleCreate = async () => {
    if (!playerName.trim()) return;
    await onCreateRoom(playerName.trim());
  };

  const handleJoin = async () => {
    if (!playerName.trim() || !joinCode.trim()) return;
    await onJoinRoom(joinCode.trim(), playerName.trim());
  };

  return (
    <div className="lobby-screen">
      <div className="lobby-container">
        <div className="game-logo-area">
          <h1 className="game-title-main">メドテック・クエスト</h1>
          <p className="game-subtitle">MedTech Quest</p>
          <p className="game-desc">
            4〜5人、90分、協力型ボードゲーム<br />
            医療機器開発チームとして、ニーズを探索し製品を世に届けよう
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {mode === 'home' && (
          <div className="lobby-actions">
            <button className="btn btn-large btn-primary" onClick={() => setMode('create')}>
              ルームを作成する
            </button>
            <button className="btn btn-large btn-outline" onClick={() => setMode('join')}>
              ルームに参加する
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="lobby-form">
            <h2>ルーム作成</h2>
            <div className="form-group">
              <label>あなたの名前</label>
              <input
                type="text"
                className="form-input"
                placeholder="名前を入力"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <div className="btn-row">
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={loading || !playerName.trim()}
              >
                {loading ? '作成中...' : 'ルームを作成'}
              </button>
              <button className="btn btn-ghost" onClick={() => setMode('home')} disabled={loading}>
                戻る
              </button>
            </div>
          </div>
        )}

        {mode === 'join' && (
          <div className="lobby-form">
            <h2>ルームに参加</h2>
            <div className="form-group">
              <label>あなたの名前</label>
              <input
                type="text"
                className="form-input"
                placeholder="名前を入力"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
              />
            </div>
            <div className="form-group">
              <label>ルームコード（6文字）</label>
              <input
                type="text"
                className="form-input code-input"
                placeholder="例: ABC123"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              />
            </div>
            <div className="btn-row">
              <button
                className="btn btn-primary"
                onClick={handleJoin}
                disabled={loading || !playerName.trim() || joinCode.length !== 6}
              >
                {loading ? '参加中...' : '参加する'}
              </button>
              <button className="btn btn-ghost" onClick={() => setMode('home')} disabled={loading}>
                戻る
              </button>
            </div>
          </div>
        )}

        <div className="game-rules-hint">
          <h3>ゲームのルール概要</h3>
          <ul>
            <li>4〜5人で協力して医療機器開発プロジェクトを進めます</li>
            <li>各プレイヤーは異なる役割を担い、情報の非対称性を活用します</li>
            <li>8ラウンド、6フェーズを経て製品を市場に届けることが目標です</li>
            <li>リスク≥4 または 資金≤-2 で即時敗北になります</li>
            <li>最終利益が目標値以上で勝利です</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
