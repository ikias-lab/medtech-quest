// Player roles
export type RoleId = 'medical' | 'dev' | 'qa' | 'biz' | 'coordinator';

export const ROLE_NAMES: Record<RoleId, string> = {
  medical: '医療者',
  dev: '開発担当',
  qa: '品質規制担当',
  biz: '事業担当',
  coordinator: 'Co（コーディネータ）',
};

export const ROLE_COLORS: Record<RoleId, string> = {
  medical: '#e74c3c',
  dev: '#3498db',
  qa: '#2ecc71',
  biz: '#f39c12',
  coordinator: '#9b59b6',
};

// Company cards
export type CompanyId = 'startup_a' | 'maker_b' | 'maker_c';

export interface CompanyCard {
  id: CompanyId;
  name: string;
  funds: number;
  trust: number;
  targetProfit: number;
  special: string;
}

// Needs cards
export type NeedsId = 'N-01' | 'N-02' | 'N-03' | 'N-04';

export interface NeedsCardAttrs {
  freq: '高' | '中' | '低';
  severity: '高' | '中' | '低';
  alt: 'あり' | 'ややあり' | 'なし';
  biz: '高' | '中' | '低';
}

export interface NeedsCard {
  id: NeedsId;
  front: string;
  back: string;
  attrs: NeedsCardAttrs;
}

// Clue cards
export interface ClueCard {
  id: string;
  needsId: NeedsId;
  level: 1 | 2 | 3;
  text: string;
  isMislead: boolean;
}

// Role effect cards
export interface RoleEffects {
  perf: number;
  quality: number;
  cost: number;
  usability: number;
  bizCost: number;
}

export interface RoleEffectCard {
  id: string;
  name: string;
  layer: 1 | 2 | 3;
  effects: {
    medical: RoleEffects;
    dev: RoleEffects;
    qa: RoleEffects;
    biz: RoleEffects;
    coordinator: RoleEffects;
  };
}

// Drama cards
export interface DramaEffect {
  fieldUnderstanding?: number;
  productPower?: number;
  bizPower?: number;
  trust?: number;
  risk?: number;
  funds?: number;
  actionEffect?: number;
}

export interface DramaOption {
  label: string;
  benefits: DramaEffect;
  costs: DramaEffect;
}

export interface DramaCard {
  id: string;
  title: string;
  optionA: DramaOption;
  optionB: DramaOption;
}

// Finance cards
export interface FinanceCard {
  id: string;
  name: string;
  description: string;
  requiresTrust?: number;
}

// Medical device cards
export interface MedicalDeviceCard {
  id: string;
  name: string;
  description: string;
  isTrap: boolean;
  trapReason?: string;
  hiddenFailure: string;
  devCostModifier: number; // 0 = normal, 1 = high
}

// Tracks
export interface Tracks {
  fieldUnderstanding: number;
  productPower: number;
  bizPower: number;
  trust: number;
  risk: number;
  funds: number;
}

// Player
export interface Player {
  id: string;
  name: string;
  role: RoleId | null;
  isBot?: boolean;
}

// Checklist
export interface Checklist {
  medScene: boolean;
  medUser: boolean;
  devSpec: boolean;
  qaData: boolean;
  qaRisk: boolean;
  bizSales: boolean;
}

// Used abilities
export interface UsedAbilities {
  devStubborn: boolean;
  qaRedCard: boolean;
  qaDoubleCheck: boolean;
  coTrapIdentify: boolean;
  coConditionRelax: boolean;
  coBypassBuffer: boolean;
}

// Priority track declaration (role conflict mechanics)
export type PriorityTrackId = 'fieldUnderstanding' | 'productPower' | 'bizPower' | 'trust';

export const PRIORITY_TRACK_NAMES: Record<PriorityTrackId, string> = {
  fieldUnderstanding: '現場理解',
  productPower: '製品力',
  bizPower: '事業力',
  trust: '信頼',
};

// Log entry
export interface LogEntry {
  message: string;
  timestamp: string;
}

// Game state
export interface GameState {
  roomId: string;
  status: 'lobby' | 'role_select' | 'playing' | 'won' | 'lost';
  players: Player[];
  company: CompanyId | null;
  needsCardId: NeedsId | null;
  phase: 1 | 2 | 3 | 4 | 5 | 6;
  round: number;
  currentPlayerIndex: number;
  tracks: Tracks;
  clueCardDeck: string[];
  effectCardDeck: string[];
  dramaCardDeck: string[];
  clueBoard: string[];
  medicalPrivateClues: string[];
  currentDramaCard: string | null;
  dramaResolved: boolean;
  attributeGuess: { freq: string; severity: string; alt: string; biz: string } | null;
  medicalDeviceCardId: string | null;
  devCost: 1 | 2 | 3 | null;
  salesCost: 1 | 2 | 3 | null;
  totalLoans: number;
  checklist: Checklist;
  salesChannel: string | null;
  finalSales: number | null;
  finalProfit: number | null;
  log: LogEntry[];
  crisisMode: boolean;
  lossReason: string | null;
  hostId: string;
  usedAbilities: UsedAbilities;
  investModeUsedThisRound: boolean;
  currentDrawnEffectCard: string | null;
  awaitingDramaChoice: boolean;
  // track which players have drawn their effect card this round
  effectCardsDrawnThisRound: string[];
  // track whether drama card has been drawn this round
  dramaCardDrawnThisRound: boolean;
  // clue drawn this round (phase 1 only)
  clueDrawnThisRound: boolean;
  // role conflict mechanics: priority track declarations
  priorityDeclarations: Partial<Record<string, PriorityTrackId>>; // playerId → declared track
  priorityDeclarationResolved: boolean;
  roundBonusTrack: PriorityTrackId | null;   // 2+ same → +1 to this track
  roundConflictPenalty: boolean;             // all different → -1 to all tracks
}
