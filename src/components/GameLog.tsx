import type { LogEntry } from '../lib/types';
import { formatTime } from '../lib/utils';

interface GameLogProps {
  log: LogEntry[];
}

export function GameLog({ log }: GameLogProps) {
  const recent = [...log].reverse().slice(0, 10);

  return (
    <div className="game-log">
      <h3 className="section-title">ゲームログ</h3>
      <div className="log-list">
        {recent.length === 0 ? (
          <div className="log-empty">まだログはありません</div>
        ) : (
          recent.map((entry, i) => (
            <div key={i} className="log-entry">
              <span className="log-time">{formatTime(entry.timestamp)}</span>
              <span className="log-message">{entry.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
