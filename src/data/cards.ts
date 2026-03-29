import type {
  CompanyCard,
  NeedsCard,
  ClueCard,
  RoleEffectCard,
  DramaCard,
  FinanceCard,
  MedicalDeviceCard,
} from '../lib/types';

// ============================================================
// Company Cards
// ============================================================
export const COMPANY_CARDS: CompanyCard[] = [
  {
    id: 'startup_a',
    name: 'スタートアップA社',
    funds: 4,
    trust: 1,
    targetProfit: 2,
    special: 'ファイナンスカードは最大1枚まで使用可能',
  },
  {
    id: 'maker_b',
    name: '中堅メーカーB社',
    funds: 6,
    trust: 2,
    targetProfit: 4,
    special: '販売フェーズで事業力+1',
  },
  {
    id: 'maker_c',
    name: '大手メーカーC社',
    funds: 8,
    trust: 3,
    targetProfit: 6,
    special: 'フェーズ移行ごとに資金-1',
  },
];

// ============================================================
// Needs Cards
// ============================================================
export const NEEDS_CARDS: NeedsCard[] = [
  {
    id: 'N-01',
    front: '片手で扱える補助具が欲しい',
    back: '感染対策中に持ち替え回数が多く、汚染リスクと作業効率の両立が難しい。特に手袋を着けたままでも操作できるものが求められている。',
    attrs: { freq: '高', severity: '中', alt: 'ややあり', biz: '中' },
  },
  {
    id: 'N-02',
    front: '患者の状態がすぐ分かるものが欲しい',
    back: '夜間は少人数で、異変の見逃しリスクを抱えながら対応している。一目で全患者の状態変化を把握できるシステムが必要だ。',
    attrs: { freq: '高', severity: '高', alt: 'ややあり', biz: '中' },
  },
  {
    id: 'N-03',
    front: '準備物をすぐ揃えられる仕組みが欲しい',
    back: '人によって準備の抜け漏れがあり、緊急時に対応が遅れる原因になっている。標準化と視覚的なガイドが欲しい。',
    attrs: { freq: '中', severity: '中', alt: 'なし', biz: '中' },
  },
  {
    id: 'N-04',
    front: '患者の動きを簡単に記録したい',
    back: '評価者ごとのばらつきが大きく、経過観察の精度が落ちている。リハビリ動作の客観的な記録・比較ツールが必要だ。',
    attrs: { freq: '中', severity: '中', alt: 'ややあり', biz: '高' },
  },
];

// ============================================================
// Clue Cards
// ============================================================
export const CLUE_CARDS: ClueCard[] = [
  // N-01
  { id: 'C-01-1', needsId: 'N-01', level: 1, text: '処置の頻度は非常に高い（毎日複数回）', isMislead: false },
  { id: 'C-01-2', needsId: 'N-01', level: 1, text: '既存の代替品がいくつか存在する', isMislead: false },
  { id: 'C-01-3', needsId: 'N-01', level: 2, text: '感染管理との両立が最大の課題', isMislead: false },
  { id: 'C-01-4', needsId: 'N-01', level: 2, text: '事業性は非常に高く競合も少ない', isMislead: true },
  { id: 'C-01-5', needsId: 'N-01', level: 3, text: '深刻度は中程度（代替手段で対処可能）', isMislead: false },
  { id: 'C-01-6', needsId: 'N-01', level: 3, text: '手技の複雑さと手袋着用が操作を困難にしている', isMislead: false },

  // N-02
  { id: 'C-02-1', needsId: 'N-02', level: 1, text: '夜間帯のインシデント頻度が高い', isMislead: false },
  { id: 'C-02-2', needsId: 'N-02', level: 1, text: '既存のナースコールでは不十分', isMislead: false },
  { id: 'C-02-3', needsId: 'N-02', level: 2, text: '深刻度は高く、重大事故につながりうる', isMislead: false },
  { id: 'C-02-4', needsId: 'N-02', level: 2, text: '病院全体での導入需要は非常に大きい', isMislead: true },
  { id: 'C-02-5', needsId: 'N-02', level: 3, text: '少人数夜勤で全員への目配りが限界', isMislead: false },
  { id: 'C-02-6', needsId: 'N-02', level: 3, text: '既存システムとの連携ハードルが高い', isMislead: false },

  // N-03
  { id: 'C-03-1', needsId: 'N-03', level: 1, text: '準備手順が標準化されていない部署が多い', isMislead: false },
  { id: 'C-03-2', needsId: 'N-03', level: 1, text: '代替手段がなく現状の課題が深刻', isMislead: false },
  { id: 'C-03-3', needsId: 'N-03', level: 2, text: '緊急時の準備ミスは重篤なリスクにつながる', isMislead: false },
  { id: 'C-03-4', needsId: 'N-03', level: 2, text: '複数の病院から強い引き合いがある', isMislead: true },
  { id: 'C-03-5', needsId: 'N-03', level: 3, text: '頻度は中程度（緊急時のみ）', isMislead: false },
  { id: 'C-03-6', needsId: 'N-03', level: 3, text: '視覚的な手順ガイドとチェックリストが有効', isMislead: false },

  // N-04
  { id: 'C-04-1', needsId: 'N-04', level: 1, text: '記録のばらつきが経過観察の質を下げている', isMislead: false },
  { id: 'C-04-2', needsId: 'N-04', level: 1, text: '動作解析ツールへの代替はほぼない', isMislead: false },
  { id: 'C-04-3', needsId: 'N-04', level: 2, text: '事業性は高く、介護施設への展開も見込める', isMislead: false },
  { id: 'C-04-4', needsId: 'N-04', level: 2, text: '深刻度は非常に高く即時対応が必要', isMislead: true },
  { id: 'C-04-5', needsId: 'N-04', level: 3, text: '評価者間のばらつきが最大の課題', isMislead: false },
  { id: 'C-04-6', needsId: 'N-04', level: 3, text: 'リハビリ科だけでなく整形外科でも需要あり', isMislead: false },
];

// ============================================================
// Role Effect Cards (24 cards, 3 layers)
// ============================================================
export const ROLE_EFFECT_CARDS: RoleEffectCard[] = [
  // Layer 1: Field/Market Focus (1-8)
  {
    id: 'E-01',
    name: '現場視察',
    layer: 1,
    effects: {
      medical:     { perf: 0, quality: 0, cost: 0, usability: 2, bizCost: 1 },
      dev:         { perf: 1, quality: 0, cost: 0, usability: 1, bizCost: 0 },
      qa:          { perf: 0, quality: 1, cost: 0, usability: 1, bizCost: 0 },
      biz:         { perf: 0, quality: 0, cost: 1, usability: 0, bizCost: 1 },
      coordinator: { perf: 0, quality: 0, cost: 0, usability: 1, bizCost: 0 },
    },
  },
  {
    id: 'E-02',
    name: '医療者ヒアリング',
    layer: 1,
    effects: {
      medical:     { perf: 0, quality: 0, cost: 0, usability: 3, bizCost: 0 },
      dev:         { perf: 0, quality: 0, cost: 0, usability: 2, bizCost: 0 },
      qa:          { perf: 0, quality: 0, cost: 0, usability: 1, bizCost: 0 },
      biz:         { perf: 0, quality: 0, cost: 1, usability: 1, bizCost: 1 },
      coordinator: { perf: 0, quality: 0, cost: 0, usability: 2, bizCost: 0 },
    },
  },
  {
    id: 'E-03',
    name: '市場調査',
    layer: 1,
    effects: {
      medical:     { perf: 0, quality: 0, cost: 1, usability: 1, bizCost: 1 },
      dev:         { perf: 1, quality: 0, cost: 0, usability: 0, bizCost: 0 },
      qa:          { perf: 0, quality: 0, cost: 0, usability: 0, bizCost: 1 },
      biz:         { perf: 0, quality: 0, cost: 0, usability: 0, bizCost: 3 },
      coordinator: { perf: 0, quality: 0, cost: 0, usability: 0, bizCost: 1 },
    },
  },
  {
    id: 'E-04',
    name: 'ニーズ仮説立案',
    layer: 1,
    effects: {
      medical:     { perf: 0, quality: 0, cost: 0, usability: 2, bizCost: 0 },
      dev:         { perf: 1, quality: 0, cost: 0, usability: 1, bizCost: 0 },
      qa:          { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 0 },
      biz:         { perf: 0, quality: 0, cost: 0, usability: 0, bizCost: 2 },
      coordinator: { perf: 0, quality: 0, cost: 0, usability: 1, bizCost: 1 },
    },
  },
  {
    id: 'E-05',
    name: '競合分析',
    layer: 1,
    effects: {
      medical:     { perf: 0, quality: 0, cost: 0, usability: 1, bizCost: 1 },
      dev:         { perf: 1, quality: 0, cost: 1, usability: 0, bizCost: 0 },
      qa:          { perf: 0, quality: 0, cost: 0, usability: 0, bizCost: 0 },
      biz:         { perf: 0, quality: 0, cost: 0, usability: 0, bizCost: 2 },
      coordinator: { perf: 0, quality: 0, cost: 0, usability: 0, bizCost: 1 },
    },
  },
  {
    id: 'E-06',
    name: 'ユーザー観察記録',
    layer: 1,
    effects: {
      medical:     { perf: 0, quality: 0, cost: 0, usability: 3, bizCost: 0 },
      dev:         { perf: 0, quality: 0, cost: 0, usability: 2, bizCost: 0 },
      qa:          { perf: 0, quality: 1, cost: 0, usability: 1, bizCost: 0 },
      biz:         { perf: 0, quality: 0, cost: 0, usability: 1, bizCost: 1 },
      coordinator: { perf: 0, quality: 0, cost: 0, usability: 1, bizCost: 0 },
    },
  },
  {
    id: 'E-07',
    name: 'KOL面談',
    layer: 1,
    effects: {
      medical:     { perf: 0, quality: 0, cost: 0, usability: 1, bizCost: 2 },
      dev:         { perf: 1, quality: 0, cost: 0, usability: 0, bizCost: 1 },
      qa:          { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 1 },
      biz:         { perf: 0, quality: 0, cost: 0, usability: 0, bizCost: 3 },
      coordinator: { perf: 0, quality: 0, cost: 0, usability: 1, bizCost: 1 },
    },
  },
  {
    id: 'E-08',
    name: 'エスノグラフィ調査',
    layer: 1,
    effects: {
      medical:     { perf: 0, quality: 0, cost: 0, usability: 2, bizCost: 1 },
      dev:         { perf: 0, quality: 0, cost: 0, usability: 2, bizCost: 0 },
      qa:          { perf: 0, quality: 0, cost: 0, usability: 1, bizCost: 0 },
      biz:         { perf: 0, quality: 0, cost: 1, usability: 0, bizCost: 2 },
      coordinator: { perf: 1, quality: 0, cost: 0, usability: 1, bizCost: 0 },
    },
  },

  // Layer 2: Tech/Cost Focus (9-16)
  {
    id: 'E-09',
    name: 'プロトタイプ製作',
    layer: 2,
    effects: {
      medical:     { perf: 1, quality: 0, cost: -1, usability: 1, bizCost: 0 },
      dev:         { perf: 3, quality: 0, cost: 0, usability: 1, bizCost: 0 },
      qa:          { perf: 1, quality: 1, cost: 0, usability: 0, bizCost: 0 },
      biz:         { perf: 1, quality: 0, cost: 0, usability: 0, bizCost: 1 },
      coordinator: { perf: 1, quality: 0, cost: 0, usability: 0, bizCost: 0 },
    },
  },
  {
    id: 'E-10',
    name: 'コスト最適化',
    layer: 2,
    effects: {
      medical:     { perf: 0, quality: 0, cost: 1, usability: 0, bizCost: 0 },
      dev:         { perf: 1, quality: 0, cost: 2, usability: 0, bizCost: 0 },
      qa:          { perf: 0, quality: 0, cost: 1, usability: 0, bizCost: 0 },
      biz:         { perf: 0, quality: 0, cost: 2, usability: 0, bizCost: 2 },
      coordinator: { perf: 0, quality: 0, cost: 1, usability: 0, bizCost: 0 },
    },
  },
  {
    id: 'E-11',
    name: '技術検証実験',
    layer: 2,
    effects: {
      medical:     { perf: 1, quality: 0, cost: 0, usability: 1, bizCost: 0 },
      dev:         { perf: 3, quality: 1, cost: 0, usability: 0, bizCost: 0 },
      qa:          { perf: 1, quality: 2, cost: 0, usability: 0, bizCost: 0 },
      biz:         { perf: 0, quality: 0, cost: -1, usability: 0, bizCost: 1 },
      coordinator: { perf: 1, quality: 0, cost: 0, usability: 0, bizCost: 0 },
    },
  },
  {
    id: 'E-12',
    name: 'サプライヤー交渉',
    layer: 2,
    effects: {
      medical:     { perf: 0, quality: 0, cost: 1, usability: 0, bizCost: 0 },
      dev:         { perf: 0, quality: 0, cost: 2, usability: 0, bizCost: 0 },
      qa:          { perf: 0, quality: 0, cost: 1, usability: 0, bizCost: 0 },
      biz:         { perf: 0, quality: 0, cost: 3, usability: 0, bizCost: 1 },
      coordinator: { perf: 0, quality: 0, cost: 1, usability: 0, bizCost: 0 },
    },
  },
  {
    id: 'E-13',
    name: '量産試作',
    layer: 2,
    effects: {
      medical:     { perf: 0, quality: 1, cost: -1, usability: 1, bizCost: 0 },
      dev:         { perf: 2, quality: 1, cost: 0, usability: 1, bizCost: 0 },
      qa:          { perf: 0, quality: 2, cost: 0, usability: 0, bizCost: 0 },
      biz:         { perf: 0, quality: 0, cost: 1, usability: 0, bizCost: 2 },
      coordinator: { perf: 1, quality: 0, cost: 0, usability: 0, bizCost: 0 },
    },
  },
  {
    id: 'E-14',
    name: '設計最適化',
    layer: 2,
    effects: {
      medical:     { perf: 1, quality: 0, cost: 0, usability: 1, bizCost: 0 },
      dev:         { perf: 2, quality: 1, cost: 1, usability: 0, bizCost: 0 },
      qa:          { perf: 0, quality: 2, cost: 0, usability: 0, bizCost: 0 },
      biz:         { perf: 0, quality: 0, cost: 1, usability: 0, bizCost: 0 },
      coordinator: { perf: 1, quality: 1, cost: 0, usability: 0, bizCost: 0 },
    },
  },
  {
    id: 'E-15',
    name: '外部委託製造',
    layer: 2,
    effects: {
      medical:     { perf: 0, quality: 0, cost: 2, usability: 0, bizCost: 1 },
      dev:         { perf: 1, quality: 0, cost: 2, usability: 0, bizCost: 0 },
      qa:          { perf: 0, quality: 0, cost: 1, usability: 0, bizCost: -1 },
      biz:         { perf: 0, quality: 0, cost: 2, usability: 0, bizCost: 2 },
      coordinator: { perf: 0, quality: 0, cost: 1, usability: 0, bizCost: 0 },
    },
  },
  {
    id: 'E-16',
    name: 'ユーザビリティ改善',
    layer: 2,
    effects: {
      medical:     { perf: 0, quality: 0, cost: 0, usability: 3, bizCost: 0 },
      dev:         { perf: 1, quality: 0, cost: 0, usability: 2, bizCost: 0 },
      qa:          { perf: 0, quality: 1, cost: 0, usability: 1, bizCost: 0 },
      biz:         { perf: 0, quality: 0, cost: 0, usability: 1, bizCost: 1 },
      coordinator: { perf: 1, quality: 0, cost: 0, usability: 2, bizCost: 0 },
    },
  },

  // Layer 3: Quality/Regulation Focus (17-24)
  {
    id: 'E-17',
    name: '臨床評価試験',
    layer: 3,
    effects: {
      medical:     { perf: 1, quality: 2, cost: -1, usability: 1, bizCost: 1 },
      dev:         { perf: 1, quality: 1, cost: 0, usability: 0, bizCost: 0 },
      qa:          { perf: 0, quality: 3, cost: 0, usability: 0, bizCost: 1 },
      biz:         { perf: 0, quality: 1, cost: -1, usability: 0, bizCost: 2 },
      coordinator: { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 1 },
    },
  },
  {
    id: 'E-18',
    name: '規制要件調査',
    layer: 3,
    effects: {
      medical:     { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 0 },
      dev:         { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 0 },
      qa:          { perf: 0, quality: 3, cost: 1, usability: 0, bizCost: 1 },
      biz:         { perf: 0, quality: 0, cost: 0, usability: 0, bizCost: 1 },
      coordinator: { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 0 },
    },
  },
  {
    id: 'E-19',
    name: 'リスクアセスメント',
    layer: 3,
    effects: {
      medical:     { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 0 },
      dev:         { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 0 },
      qa:          { perf: 0, quality: 2, cost: 1, usability: 0, bizCost: 2 },
      biz:         { perf: 0, quality: 0, cost: 0, usability: 0, bizCost: 1 },
      coordinator: { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 1 },
    },
  },
  {
    id: 'E-20',
    name: '品質管理体制整備',
    layer: 3,
    effects: {
      medical:     { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 0 },
      dev:         { perf: 0, quality: 2, cost: 0, usability: 0, bizCost: 0 },
      qa:          { perf: 0, quality: 3, cost: 2, usability: 0, bizCost: 2 },
      biz:         { perf: 0, quality: 1, cost: 1, usability: 0, bizCost: 1 },
      coordinator: { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 0 },
    },
  },
  {
    id: 'E-21',
    name: '認証申請書類作成',
    layer: 3,
    effects: {
      medical:     { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 1 },
      dev:         { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 0 },
      qa:          { perf: 0, quality: 2, cost: 2, usability: 0, bizCost: 3 },
      biz:         { perf: 0, quality: 0, cost: 0, usability: 0, bizCost: 2 },
      coordinator: { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 1 },
    },
  },
  {
    id: 'E-22',
    name: '外部審査対応',
    layer: 3,
    effects: {
      medical:     { perf: 0, quality: 1, cost: -1, usability: 0, bizCost: 0 },
      dev:         { perf: 0, quality: 2, cost: 0, usability: 0, bizCost: 0 },
      qa:          { perf: 0, quality: 3, cost: 1, usability: 0, bizCost: 2 },
      biz:         { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 1 },
      coordinator: { perf: 1, quality: 1, cost: 0, usability: 0, bizCost: 1 },
    },
  },
  {
    id: 'E-23',
    name: '販売後調査計画',
    layer: 3,
    effects: {
      medical:     { perf: 0, quality: 1, cost: 0, usability: 1, bizCost: 1 },
      dev:         { perf: 1, quality: 1, cost: 0, usability: 0, bizCost: 0 },
      qa:          { perf: 0, quality: 2, cost: 1, usability: 0, bizCost: 2 },
      biz:         { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 3 },
      coordinator: { perf: 0, quality: 1, cost: 0, usability: 0, bizCost: 1 },
    },
  },
  {
    id: 'E-24',
    name: '教育・研修整備',
    layer: 3,
    effects: {
      medical:     { perf: 0, quality: 1, cost: 0, usability: 2, bizCost: 1 },
      dev:         { perf: 0, quality: 1, cost: 0, usability: 1, bizCost: 0 },
      qa:          { perf: 0, quality: 2, cost: 1, usability: 1, bizCost: 1 },
      biz:         { perf: 0, quality: 0, cost: 0, usability: 1, bizCost: 2 },
      coordinator: { perf: 0, quality: 1, cost: 0, usability: 1, bizCost: 1 },
    },
  },
];

// ============================================================
// Drama Cards (12)
// ============================================================
export const DRAMA_CARDS: DramaCard[] = [
  {
    id: 'D-01',
    title: '協力的な現場担当者が現れた',
    optionA: {
      label: '積極的に協力を依頼する（信頼醸成・資金使用）',
      benefits: { fieldUnderstanding: 2, trust: 1 },
      costs: { funds: -1 },
    },
    optionB: {
      label: '情報だけもらい独自に進める（リスクあり）',
      benefits: { fieldUnderstanding: 1 },
      costs: { risk: 1 },
    },
  },
  {
    id: 'D-02',
    title: 'ニーズの解釈がチーム内でズレていた',
    optionA: {
      label: 'ワークショップを開催して認識を揃える',
      benefits: { fieldUnderstanding: 1, trust: 1 },
      costs: { funds: -1 },
    },
    optionB: {
      label: '一人の主張を通して進める（効率優先）',
      benefits: { actionEffect: 1 },
      costs: { risk: 1 },
    },
  },
  {
    id: 'D-03',
    title: '似た製品が他社から先行発表された',
    optionA: {
      label: '品質・差別化で勝負する（開発強化）',
      benefits: { productPower: 2 },
      costs: { bizPower: -1, funds: -1 },
    },
    optionB: {
      label: '市場受容を活かして価格競争に参入する',
      benefits: { bizPower: 1, funds: 1 },
      costs: { productPower: -1 },
    },
  },
  {
    id: 'D-04',
    title: '試作部材が予定より早く届いた',
    optionA: {
      label: '急いでプロトタイプを完成させる',
      benefits: { productPower: 2 },
      costs: { funds: -1 },
    },
    optionB: {
      label: '丁寧に検証して信頼を積む',
      benefits: { risk: -1, trust: 1 },
      costs: {},
    },
  },
  {
    id: 'D-05',
    title: '医療事故のニュースが報道された',
    optionA: {
      label: '自主的に安全宣言を出す（信頼回復）',
      benefits: { risk: -1, trust: 1 },
      costs: { funds: -1, bizPower: -1 },
    },
    optionB: {
      label: '静観する（リスク上昇）',
      benefits: {},
      costs: { risk: 1 },
    },
  },
  {
    id: 'D-06',
    title: '規制当局から追加確認が来た',
    optionA: {
      label: '全面協力して書類を整備する',
      benefits: { trust: 2, risk: -1 },
      costs: { funds: -1, bizPower: -1 },
    },
    optionB: {
      label: '最小限の対応で先を急ぐ',
      benefits: { actionEffect: 1 },
      costs: { risk: 1, trust: -1 },
    },
  },
  {
    id: 'D-07',
    title: '導入候補施設から見学申し込みが来た',
    optionA: {
      label: '積極的に受け入れて販路開拓する',
      benefits: { bizPower: 2 },
      costs: { trust: -1 },
    },
    optionB: {
      label: '慎重に対応してリスクを下げる',
      benefits: { risk: -1 },
      costs: {},
    },
  },
  {
    id: 'D-08',
    title: '大学病院との共同研究話が来た',
    optionA: {
      label: '共同研究を正式に締結する',
      benefits: { bizPower: 2, fieldUnderstanding: 1 },
      costs: { funds: -1 },
    },
    optionB: {
      label: '非公式な情報共有にとどめる',
      benefits: { risk: -1, bizPower: 1 },
      costs: {},
    },
  },
  {
    id: 'D-09',
    title: '突貫対応でチームが疲弊した',
    optionA: {
      label: '休息期間を設けてチームを立て直す',
      benefits: { risk: -1, trust: 1 },
      costs: { funds: -1 },
    },
    optionB: {
      label: 'このままスパートをかける',
      benefits: { productPower: 1 },
      costs: { risk: 1, trust: -1 },
    },
  },
  {
    id: 'D-10',
    title: '資金繰りが一時的に苦しくなった',
    optionA: {
      label: '銀行から短期借入で乗り切る',
      benefits: { funds: 2 },
      costs: { productPower: -1 },
    },
    optionB: {
      label: '投資家に頭を下げて支援を求める',
      benefits: { funds: 2 },
      costs: { trust: -1 },
    },
  },
  {
    id: 'D-11',
    title: '現場スタッフから想定外の使われ方を報告された',
    optionA: {
      label: '設計を見直して新用途を正式採用する',
      benefits: { fieldUnderstanding: 1, bizPower: 1 },
      costs: { productPower: -1, funds: -1 },
    },
    optionB: {
      label: 'リスクを評価して製品改善に活かす',
      benefits: { risk: -1, productPower: 1 },
      costs: { trust: -1 },
    },
  },
  {
    id: 'D-12',
    title: '競合が価格を大幅に下げてきた',
    optionA: {
      label: '品質と安全を前面に出して対抗する',
      benefits: { trust: 1, risk: -1 },
      costs: { funds: -1 },
    },
    optionB: {
      label: '販路拡大で巻き返しを図る',
      benefits: { bizPower: 1 },
      costs: { productPower: -1, trust: -1 },
    },
  },
];

// ============================================================
// Finance Cards (5)
// ============================================================
export const FINANCE_CARDS: FinanceCard[] = [
  { id: 'F-01', name: '銀行融資', description: '事業力+2。担保不要の融資を獲得' },
  { id: 'F-02', name: 'VC投資', description: '事業力+3。信頼≥2が必要', requiresTrust: 2 },
  { id: 'F-03', name: '補助金採択', description: '事業力+2、信頼+1。公的支援を獲得' },
  { id: 'F-04', name: '緊急つなぎ融資', description: '事業力+1。短期の資金繰りを解消' },
  { id: 'F-05', name: 'クラウドファンディング', description: '事業力を現在の信頼トラック値に設定。共感を資金に変える' },
];

// ============================================================
// Medical Device Cards (6)
// ============================================================
export const MEDICAL_DEVICE_CARDS: MedicalDeviceCard[] = [
  {
    id: 'MD-01',
    name: '携帯型バイタルモニタ',
    description: '患者のバイタルを常時モニタリングする小型デバイス。軽量で持ち運び可能。',
    isTrap: false,
    hiddenFailure: '電池切れ時の警告音が夜間の睡眠を妨げるという現場報告がある（軽微）',
    devCostModifier: 0,
  },
  {
    id: 'MD-02',
    name: '自動処置補助アーム',
    description: '医療従事者の処置作業を補助するロボットアーム。精度と再現性が高い。',
    isTrap: false,
    hiddenFailure: '開発コストが高く、製造期間も長い。資金計画の見直しが必要になる可能性あり',
    devCostModifier: 1,
  },
  {
    id: 'MD-03',
    name: 'スマート点滴管理システム',
    description: '点滴の速度・残量を自動管理するシステム。院内Wi-Fi連携が前提。',
    isTrap: true,
    trapReason: '院内Wi-Fi環境に依存するため、導入施設が限られる。市場適合性が低い。',
    hiddenFailure: '既存の院内インフラとの互換性問題が多発しており、導入後の苦情が増加傾向',
    devCostModifier: 0,
  },
  {
    id: 'MD-04',
    name: 'リハビリ動作解析デバイス',
    description: '患者の動作をセンサーで解析し、リハビリ効果を定量化するデバイス。',
    isTrap: false,
    hiddenFailure: 'センサーの装着に時間がかかり、高齢患者には負担が大きい場合がある',
    devCostModifier: 0,
  },
  {
    id: 'MD-05',
    name: '夜間見守りセンサー',
    description: '非接触で患者の状態を検知する赤外線センサー。ナースステーションに通知。',
    isTrap: false,
    hiddenFailure: '誤検知率がやや高く、アラート疲れを引き起こす可能性がある（要調整）',
    devCostModifier: 0,
  },
  {
    id: 'MD-06',
    name: '手術補助マーカー',
    description: '手術部位を正確にマーキングするデジタルデバイス。誤手術防止に特化。',
    isTrap: true,
    trapReason: '高度管理医療機器に該当する可能性があり、認証取得に2-3年要する。規制リスク大。',
    hiddenFailure: 'クラスIII医療機器の可能性があり、PMDAへの承認申請が必要になるリスクが高い',
    devCostModifier: 0,
  },
];

// Helper: get card by ID
export function getCompanyCard(id: string) {
  return COMPANY_CARDS.find((c) => c.id === id) ?? null;
}

export function getNeedsCard(id: string) {
  return NEEDS_CARDS.find((c) => c.id === id) ?? null;
}

export function getClueCard(id: string) {
  return CLUE_CARDS.find((c) => c.id === id) ?? null;
}

export function getRoleEffectCard(id: string) {
  return ROLE_EFFECT_CARDS.find((c) => c.id === id) ?? null;
}

export function getDramaCard(id: string) {
  return DRAMA_CARDS.find((c) => c.id === id) ?? null;
}

export function getFinanceCard(id: string) {
  return FINANCE_CARDS.find((c) => c.id === id) ?? null;
}

export function getMedicalDeviceCard(id: string) {
  return MEDICAL_DEVICE_CARDS.find((c) => c.id === id) ?? null;
}
