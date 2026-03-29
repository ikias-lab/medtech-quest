// Generate a 6-character uppercase alphanumeric room code
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Generate a random UUID v4
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Get or create a persistent player ID stored in localStorage
export function getOrCreatePlayerId(): string {
  const KEY = 'medtech_player_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = generateUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

// Fisher-Yates shuffle (returns a new array)
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Clamp a number between min and max
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// Format timestamp to HH:mm:ss
export function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return iso;
  }
}
