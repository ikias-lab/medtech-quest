import type { Tracks } from '../lib/types';

interface TrackBarProps {
  label: string;
  value: number;
  max: number;
  min?: number;
  danger?: boolean;
  warning?: boolean;
  color: string;
}

function TrackBar({ label, value, max, min = 0, danger, warning, color }: TrackBarProps) {
  const range = max - min;
  const normalized = ((value - min) / range) * 100;
  const pct = Math.max(0, Math.min(100, normalized));

  let barColor = color;
  if (danger) barColor = '#e74c3c';
  else if (warning) barColor = '#f39c12';

  return (
    <div className="track-bar">
      <div className="track-label">
        <span>{label}</span>
        <span className="track-value" style={{ color: danger ? '#e74c3c' : warning ? '#f39c12' : '#fff' }}>
          {value}
          <span className="track-max">/{max}</span>
        </span>
      </div>
      <div className="track-bg">
        <div
          className="track-fill"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

interface TrackPanelProps {
  tracks: Tracks;
  crisisMode: boolean;
}

export function TrackPanel({ tracks, crisisMode }: TrackPanelProps) {
  const riskDanger = tracks.risk >= 4;
  const riskWarning = tracks.risk >= 3;
  const fundsDanger = tracks.funds <= -2;
  const fundsWarning = tracks.funds <= 0;

  return (
    <div className="track-panel">
      <h3 className="section-title">共有トラック</h3>
      {crisisMode && (
        <div className="crisis-banner">⚠ クライシスモード（リスク≥3）</div>
      )}
      <div className="track-list">
        <TrackBar
          label="現場理解"
          value={tracks.fieldUnderstanding}
          max={8}
          color="#3498db"
        />
        <TrackBar
          label="製品力"
          value={tracks.productPower}
          max={8}
          color="#2ecc71"
        />
        <TrackBar
          label="事業力"
          value={tracks.bizPower}
          max={8}
          color="#f39c12"
        />
        <TrackBar
          label="信頼"
          value={tracks.trust}
          max={6}
          color="#9b59b6"
        />
        <TrackBar
          label="リスク"
          value={tracks.risk}
          max={6}
          danger={riskDanger}
          warning={riskWarning && !riskDanger}
          color="#e67e22"
        />
        <TrackBar
          label="資金"
          value={tracks.funds}
          max={12}
          min={-5}
          danger={fundsDanger}
          warning={fundsWarning && !fundsDanger}
          color="#1abc9c"
        />
      </div>
    </div>
  );
}
