-- MedTech Quest: ゲームルームテーブル
-- ゲームの全状態を game_state (JSONB) に格納するシンプル構成

CREATE TABLE IF NOT EXISTS public.rooms (
  id         TEXT        PRIMARY KEY,          -- 6文字ルームコード
  game_state JSONB       NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at を自動更新するトリガー
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS有効化（PoC: 全員に読み書き許可）
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_rooms" ON public.rooms
  FOR ALL USING (true) WITH CHECK (true);

-- Realtime有効化
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
