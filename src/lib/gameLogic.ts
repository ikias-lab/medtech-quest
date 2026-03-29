import type { GameState, Tracks, RoleId, CompanyId, NeedsId, LogEntry, Player, Checklist, PriorityTrackId, RoundEffectEntry } from './types';
import { ROLE_NAMES, PRIORITY_TRACK_NAMES } from './types';
import {
  CLUE_CARDS,
  ROLE_EFFECT_CARDS,
  DRAMA_CARDS,
  MEDICAL_DEVICE_CARDS,
  getCompanyCard,
  getRoleEffectCard,
  getDramaCard,
} from '../data/cards';
import { shuffle, clamp } from './utils';

const TRACK_MAX: Record<keyof Tracks, number> = {
  fieldUnderstanding: 8,
  productPower: 8,
  bizPower: 8,
  trust: 6,
  risk: 6,
  funds: 12,
};

const TRACK_MIN: Record<keyof Tracks, number> = {
  fieldUnderstanding: 0,
  productPower: 0,
  bizPower: 0,
  trust: 0,
  risk: 0,
  funds: -5,
};

export function clampTracks(tracks: Tracks): Tracks {
  const result = { ...tracks };
  (Object.keys(result) as (keyof Tracks)[]).forEach((k) => {
    result[k] = clamp(result[k], TRACK_MIN[k], TRACK_MAX[k]);
  });
  return result;
}

export function addLog(state: GameState, message: string): GameState {
  const entry: LogEntry = { message, timestamp: new Date().toISOString() };
  const log = [...state.log, entry].slice(-30);
  return { ...state, log };
}

// Create initial game state for a new room
export function createInitialGameState(roomId: string, hostId: string): GameState {
  return {
    roomId,
    status: 'lobby',
    players: [],
    company: null,
    needsCardId: null,
    phase: 1,
    round: 1,
    currentPlayerIndex: 0,
    tracks: {
      fieldUnderstanding: 0,
      productPower: 0,
      bizPower: 0,
      trust: 0,
      risk: 0,
      funds: 0,
    },
    clueCardDeck: [],
    effectCardDeck: [],
    dramaCardDeck: [],
    clueBoard: [],
    medicalPrivateClues: [],
    currentDramaCard: null,
    dramaResolved: false,
    attributeGuess: null,
    medicalDeviceCardId: null,
    devCost: null,
    salesCost: null,
    totalLoans: 0,
    checklist: {
      medScene: false,
      medUser: false,
      devSpec: false,
      qaData: false,
      qaRisk: false,
      bizSales: false,
    },
    salesChannel: null,
    finalSales: null,
    finalProfit: null,
    log: [],
    crisisMode: false,
    lossReason: null,
    hostId,
    usedAbilities: {
      devStubborn: false,
      qaRedCard: false,
      qaDoubleCheck: false,
      coTrapIdentify: false,
      coConditionRelax: false,
      coBypassBuffer: false,
    },
    investModeUsedThisRound: false,
    currentDrawnEffectCard: null,
    awaitingDramaChoice: false,
    effectCardsDrawnThisRound: [],
    dramaCardDrawnThisRound: false,
    clueDrawnThisRound: false,
    priorityDeclarations: {},
    priorityDeclarationResolved: false,
    roundBonusTrack: null,
    roundConflictPenalty: false,
    roundEffectHistory: [],
  };
}

// Start game: set company, needs card, shuffle decks, set starting tracks
export function startGame(
  state: GameState,
  companyId: CompanyId,
  needsCardId: NeedsId
): GameState {
  const company = getCompanyCard(companyId);
  if (!company) throw new Error('Invalid company');

  // Build layer-ordered effect deck: shuffle within each layer, then concat
  const layer1 = shuffle(ROLE_EFFECT_CARDS.filter((c) => c.layer === 1).map((c) => c.id));
  const layer2 = shuffle(ROLE_EFFECT_CARDS.filter((c) => c.layer === 2).map((c) => c.id));
  const layer3 = shuffle(ROLE_EFFECT_CARDS.filter((c) => c.layer === 3).map((c) => c.id));

  // Clue deck: all clues for the selected needs card, shuffled
  const clues = shuffle(CLUE_CARDS.filter((c) => c.needsId === needsCardId).map((c) => c.id));

  // Drama deck: all shuffled
  const dramas = shuffle(DRAMA_CARDS.map((c) => c.id));

  const newState: GameState = {
    ...state,
    status: 'playing',
    company: companyId,
    needsCardId,
    phase: 1,
    round: 1,
    currentPlayerIndex: 0,
    tracks: {
      fieldUnderstanding: 0,
      productPower: 0,
      bizPower: 0,
      trust: company.trust,
      risk: 0,
      funds: company.funds,
    },
    clueCardDeck: clues,
    effectCardDeck: [...layer1, ...layer2, ...layer3],
    dramaCardDeck: dramas,
    clueBoard: [],
    medicalPrivateClues: [],
    currentDramaCard: null,
    dramaResolved: false,
    effectCardsDrawnThisRound: [],
    dramaCardDrawnThisRound: false,
    clueDrawnThisRound: false,
    lossReason: null,
    crisisMode: false,
    priorityDeclarations: {},
    priorityDeclarationResolved: false,
    roundBonusTrack: null,
    roundConflictPenalty: false,
    roundEffectHistory: [],
  };

  const withBots = fillBotsForMissingRoles({ ...newState });
  return addLog(withBots, `ゲーム開始！会社: ${company.name}、ニーズカード: ${needsCardId}`);
}

// Apply role effect card to tracks
export function applyEffectCard(
  state: GameState,
  cardId: string,
  playerId: string
): GameState {
  const card = getRoleEffectCard(cardId);
  if (!card) return state;

  const player = state.players.find((p) => p.id === playerId);
  if (!player || !player.role) return state;

  const effects = card.effects[player.role];

  // perf + quality + usability → productPower
  // cost → funds (positive cost = savings = funds increase)
  // bizCost → bizPower
  const productPowerDelta = effects.perf + effects.quality + effects.usability;
  const fundsDelta = effects.cost;
  const bizPowerDelta = effects.bizCost;

  const newTracks = clampTracks({
    ...state.tracks,
    productPower: state.tracks.productPower + productPowerDelta,
    funds: state.tracks.funds + fundsDelta,
    bizPower: state.tracks.bizPower + bizPowerDelta,
  });

  // Remove card from deck
  const effectCardDeck = state.effectCardDeck.filter((id) => id !== cardId);
  const effectCardsDrawnThisRound = [...state.effectCardsDrawnThisRound, playerId];

  const historyEntry: RoundEffectEntry = {
    playerId,
    playerName: player.name,
    role: player.role,
    cardId,
    cardName: card.name,
    productPowerDelta,
    bizPowerDelta,
    fundsDelta,
  };

  let newState: GameState = {
    ...state,
    tracks: newTracks,
    effectCardDeck,
    effectCardsDrawnThisRound,
    currentDrawnEffectCard: cardId,
    roundEffectHistory: [...state.roundEffectHistory, historyEntry],
  };

  newState = addLog(
    newState,
    `${player.name}（${player.role}）が「${card.name}」を引いた。製品力+${productPowerDelta}, 資金+${fundsDelta}, 事業力+${bizPowerDelta}`
  );

  return checkInstantLoss(newState);
}

// Draw clue card (medical player only)
export function drawClueCard(state: GameState, makePublic: boolean): GameState {
  if (state.clueCardDeck.length === 0) return state;

  const [cardId, ...rest] = state.clueCardDeck;
  let newState = { ...state, clueCardDeck: rest, clueDrawnThisRound: true };

  if (makePublic) {
    newState = { ...newState, clueBoard: [...newState.clueBoard, cardId] };
    newState = addLog(newState, `医療者がクルーカード「${cardId}」を公開した`);
  } else {
    newState = { ...newState, medicalPrivateClues: [...newState.medicalPrivateClues, cardId] };
    newState = addLog(newState, `医療者がクルーカード「${cardId}」を非公開で引いた`);
  }

  return newState;
}

// Draw drama card
export function drawDramaCard(state: GameState): GameState {
  if (state.dramaCardDeck.length === 0) return state;

  const [cardId, ...rest] = state.dramaCardDeck;
  const card = getDramaCard(cardId);

  return addLog(
    {
      ...state,
      dramaCardDeck: rest,
      currentDramaCard: cardId,
      dramaResolved: false,
      dramaCardDrawnThisRound: true,
      awaitingDramaChoice: true,
    },
    `ドラマカード「${card?.title ?? cardId}」が引かれた`
  );
}

// Apply drama card choice
export function applyDramaChoice(state: GameState, choice: 'A' | 'B'): GameState {
  if (!state.currentDramaCard) return state;

  const card = getDramaCard(state.currentDramaCard);
  if (!card) return state;

  const option = choice === 'A' ? card.optionA : card.optionB;
  const allEffects: Record<string, number> = {};

  const applyEffect = (effects: Record<string, number | undefined>) => {
    Object.entries(effects).forEach(([k, v]) => {
      if (v !== undefined && k !== 'actionEffect') {
        allEffects[k] = (allEffects[k] ?? 0) + v;
      }
    });
  };

  applyEffect(option.benefits as Record<string, number>);
  applyEffect(option.costs as Record<string, number>);

  const newTracks = clampTracks({
    ...state.tracks,
    fieldUnderstanding: state.tracks.fieldUnderstanding + (allEffects.fieldUnderstanding ?? 0),
    productPower: state.tracks.productPower + (allEffects.productPower ?? 0),
    bizPower: state.tracks.bizPower + (allEffects.bizPower ?? 0),
    trust: state.tracks.trust + (allEffects.trust ?? 0),
    risk: state.tracks.risk + (allEffects.risk ?? 0),
    funds: state.tracks.funds + (allEffects.funds ?? 0),
  });

  let newState: GameState = {
    ...state,
    tracks: newTracks,
    dramaResolved: true,
    awaitingDramaChoice: false,
  };

  newState = addLog(
    newState,
    `ドラマ「${card.title}」→ 選択${choice}「${option.label}」`
  );

  return checkInstantLoss(newState);
}

// Apply drama's actionEffect (fieldUnderstanding bonus) — called after resolution if applicable
// For PoC, actionEffect means fieldUnderstanding+1
export function applyActionEffect(state: GameState): GameState {
  const newTracks = clampTracks({
    ...state.tracks,
    fieldUnderstanding: state.tracks.fieldUnderstanding + 1,
  });
  return addLog({ ...state, tracks: newTracks }, 'アクション効果: 現場理解+1');
}

// End of round: funds-1, crisis check, instant loss check
export function endRound(state: GameState): GameState {
  const newFunds = state.tracks.funds - 1;
  const newTracks = clampTracks({ ...state.tracks, funds: newFunds });

  const crisisMode = newTracks.risk >= 3;

  let newState: GameState = {
    ...state,
    tracks: newTracks,
    crisisMode,
    round: state.round + 1,
    currentPlayerIndex: 0,
    effectCardsDrawnThisRound: [],
    dramaCardDrawnThisRound: false,
    clueDrawnThisRound: false,
    currentDrawnEffectCard: null,
    awaitingDramaChoice: false,
    investModeUsedThisRound: false,
    priorityDeclarations: {},
    priorityDeclarationResolved: false,
    roundBonusTrack: null,
    roundConflictPenalty: false,
    roundEffectHistory: [],
  };

  // Large maker C: funds-1 on phase transitions (handled in checkPhaseTransition)
  newState = addLog(newState, `ラウンド${state.round}終了。資金-1 → ${newFunds}`);

  // Check if round 8 just ended without Ph.6
  if (state.round >= 8 && state.phase < 6) {
    newState = { ...newState, status: 'lost', lossReason: 'ラウンド8終了時にフェーズ6未到達' };
  }

  return checkInstantLoss(newState);
}

// Check phase transition conditions
export function checkPhaseTransition(state: GameState): { canAdvance: boolean; reason: string } {
  const { phase, tracks, medicalDeviceCardId } = state;

  switch (phase) {
    case 1:
      if (tracks.fieldUnderstanding >= 3) return { canAdvance: true, reason: '現場理解≥3' };
      return { canAdvance: false, reason: `現場理解が${tracks.fieldUnderstanding}/3` };
    case 2:
      if (tracks.productPower >= 1 && medicalDeviceCardId)
        return { canAdvance: true, reason: '製品力≥1かつデバイスカード選択済み' };
      if (tracks.productPower < 1) return { canAdvance: false, reason: `製品力が${tracks.productPower}/1` };
      return { canAdvance: false, reason: 'デバイスカードが未選択' };
    case 3:
      if (tracks.productPower >= 4) return { canAdvance: true, reason: '製品力≥4' };
      return { canAdvance: false, reason: `製品力が${tracks.productPower}/4` };
    case 4:
      if (tracks.productPower >= 5 && tracks.trust >= 2)
        return { canAdvance: true, reason: '製品力≥5かつ信頼≥2' };
      if (tracks.productPower < 5) return { canAdvance: false, reason: `製品力が${tracks.productPower}/5` };
      return { canAdvance: false, reason: `信頼が${tracks.trust}/2` };
    case 5:
      if (tracks.bizPower >= 3 && tracks.risk <= 3)
        return { canAdvance: true, reason: '事業力≥3かつリスク≤3' };
      if (tracks.bizPower < 3) return { canAdvance: false, reason: `事業力が${tracks.bizPower}/3` };
      return { canAdvance: false, reason: `リスクが${tracks.risk} (≤3必要)` };
    case 6:
      return { canAdvance: false, reason: '最終フェーズ' };
    default:
      return { canAdvance: false, reason: '不明なフェーズ' };
  }
}

// Advance phase
export function advancePhase(state: GameState): GameState {
  const { canAdvance, reason } = checkPhaseTransition(state);
  if (!canAdvance) return addLog(state, `フェーズ移行不可: ${reason}`);

  const newPhase = (state.phase + 1) as 1 | 2 | 3 | 4 | 5 | 6;
  let newState: GameState = { ...state, phase: newPhase };

  // Large maker C: funds-1 on every phase transition
  if (state.company === 'maker_c') {
    const newFunds = clamp(state.tracks.funds - 1, TRACK_MIN.funds, TRACK_MAX.funds);
    newState = { ...newState, tracks: { ...newState.tracks, funds: newFunds } };
    newState = addLog(newState, '大手メーカーC社特殊効果: フェーズ移行 資金-1');
  }

  // Medium maker B: bizPower+1 on sales phase (Ph.5→Ph.6)
  if (state.company === 'maker_b' && newPhase === 6) {
    const newBiz = clamp(state.tracks.bizPower + 1, 0, 8);
    newState = { ...newState, tracks: { ...newState.tracks, bizPower: newBiz } };
    newState = addLog(newState, '中堅メーカーB社特殊効果: 販売フェーズ移行 事業力+1');
  }

  newState = addLog(newState, `フェーズ${state.phase}→フェーズ${newPhase}に移行`);
  return checkInstantLoss(newState);
}

// Calculate final result (Ph.6 completion)
export function calculateFinalResult(state: GameState): GameState {
  const company = getCompanyCard(state.company ?? '');
  if (!company) return state;

  // Simple formula for PoC:
  // finalSales = bizPower * 2 - (devCost ?? 1) - (salesCost ?? 1)
  // finalProfit = finalSales - totalLoans
  const devCostVal = state.devCost ?? 1;
  const salesCostVal = state.salesCost ?? 1;
  const sales = state.tracks.bizPower * 2 - devCostVal - salesCostVal;
  const profit = sales - state.totalLoans;

  let newState: GameState = {
    ...state,
    finalSales: sales,
    finalProfit: profit,
  };

  // Win conditions
  const won =
    profit >= 0 &&
    profit >= company.targetProfit &&
    state.tracks.risk <= 3 &&
    state.phase >= 6;

  if (won) {
    newState = { ...newState, status: 'won' };
    newState = addLog(newState, `ゲームクリア！最終利益: ${profit}（目標: ${company.targetProfit}）`);
  } else {
    let reason = '';
    if (profit < 0) reason = `最終利益が負（${profit}）`;
    else if (profit < company.targetProfit) reason = `目標利益未達（${profit}/${company.targetProfit}）`;
    else if (state.tracks.risk > 3) reason = `リスクが高すぎる（${state.tracks.risk}）`;
    else if (state.phase < 6) reason = 'フェーズ6未到達';
    newState = { ...newState, status: 'lost', lossReason: reason };
    newState = addLog(newState, `ゲームオーバー: ${reason}`);
  }

  return newState;
}

// Check instant loss conditions
export function checkInstantLoss(state: GameState): GameState {
  if (state.status === 'won' || state.status === 'lost') return state;

  if (state.tracks.funds <= -2) {
    return addLog(
      { ...state, status: 'lost', lossReason: '資金が-2以下になった' },
      '即時敗北: 資金が尽きた'
    );
  }

  if (state.tracks.risk >= 4) {
    return addLog(
      { ...state, status: 'lost', lossReason: 'リスクが4以上になった' },
      '即時敗北: リスクが限界を超えた'
    );
  }

  return state;
}

// Select medical device card (Ph.2)
export function selectMedicalDevice(state: GameState, deviceId: string): GameState {
  let newState: GameState = { ...state, medicalDeviceCardId: deviceId };
  newState = addLog(newState, `医療デバイスカード「${deviceId}」を選択`);
  return newState;
}

// Apply finance card
export function applyFinanceCard(state: GameState, cardId: string): GameState {
  let newTracks = { ...state.tracks };
  let note = '';

  // Startup A: max 1 finance card
  if (state.company === 'startup_a' && state.totalLoans >= 1) {
    return addLog(state, 'スタートアップA社: ファイナンスカードは1枚まで（使用不可）');
  }

  switch (cardId) {
    case 'F-01':
      newTracks.bizPower = clamp(newTracks.bizPower + 2, 0, 8);
      note = '銀行融資: 事業力+2';
      break;
    case 'F-02':
      if (state.tracks.trust < 2) {
        return addLog(state, 'VC投資: 信頼が2未満のため使用不可');
      }
      newTracks.bizPower = clamp(newTracks.bizPower + 3, 0, 8);
      note = 'VC投資: 事業力+3';
      break;
    case 'F-03':
      newTracks.bizPower = clamp(newTracks.bizPower + 2, 0, 8);
      newTracks.trust = clamp(newTracks.trust + 1, 0, 6);
      note = '補助金採択: 事業力+2、信頼+1';
      break;
    case 'F-04':
      newTracks.bizPower = clamp(newTracks.bizPower + 1, 0, 8);
      note = '緊急つなぎ融資: 事業力+1';
      break;
    case 'F-05':
      newTracks.bizPower = newTracks.trust;
      note = `クラウドファンディング: 事業力=${newTracks.trust}（信頼値）`;
      break;
    default:
      return state;
  }

  let newState: GameState = {
    ...state,
    tracks: newTracks,
    totalLoans: state.totalLoans + 1,
  };
  newState = addLog(newState, note);
  return checkInstantLoss(newState);
}

// Toggle checklist item
export function toggleChecklist(
  state: GameState,
  key: keyof GameState['checklist']
): GameState {
  return {
    ...state,
    checklist: { ...state.checklist, [key]: !state.checklist[key] },
  };
}

// Get phase name
export function getPhaseName(phase: number): string {
  const names: Record<number, string> = {
    1: 'Ph.1 ニーズ探索',
    2: 'Ph.2 コンセプト決定',
    3: 'Ph.3 試作開発',
    4: 'Ph.4 評価・改善',
    5: 'Ph.5 届出準備',
    6: 'Ph.6 販売拡大',
  };
  return names[phase] ?? `フェーズ${phase}`;
}

// Get phase rounds
export function getPhaseRounds(phase: number): string {
  const rounds: Record<number, string> = {
    1: 'R1-2',
    2: 'R3',
    3: 'R4-5',
    4: 'R6',
    5: 'R7',
    6: 'R8',
  };
  return rounds[phase] ?? '';
}

// Count players with a given role
export function getPlayerByRole(state: GameState, role: RoleId) {
  return state.players.find((p) => p.role === role) ?? null;
}

// Check if all effect cards for current round have been drawn
export function allEffectCardsDrawn(state: GameState): boolean {
  return state.players.every((p) => state.effectCardsDrawnThisRound.includes(p.id));
}

// Reveal medical clue publicly
export function revealMedicalClue(state: GameState, clueId: string): GameState {
  const newPrivate = state.medicalPrivateClues.filter((id) => id !== clueId);
  const newBoard = [...state.clueBoard, clueId];
  return addLog(
    { ...state, medicalPrivateClues: newPrivate, clueBoard: newBoard },
    `医療者がクルー「${clueId}」を公開した`
  );
}

// Set attribute guess
export function setAttributeGuess(
  state: GameState,
  guess: GameState['attributeGuess']
): GameState {
  return addLog(
    { ...state, attributeGuess: guess },
    `ニーズ属性予測: 頻度=${guess?.freq}, 深刻度=${guess?.severity}, 代替=${guess?.alt}, 事業性=${guess?.biz}`
  );
}

// ─────────────────────────────────────────────
// Bot (CPU player) functions
// ─────────────────────────────────────────────

const REQUIRED_ROLES: RoleId[] = ['medical', 'dev', 'qa', 'biz'];

// Fill missing mandatory roles with CPU players
export function fillBotsForMissingRoles(state: GameState): GameState {
  const takenRoles = state.players.map((p) => p.role).filter(Boolean) as RoleId[];
  const missing = REQUIRED_ROLES.filter((r) => !takenRoles.includes(r));
  if (missing.length === 0) return state;

  const bots: Player[] = missing.map((role) => ({
    id: `bot_${role}`,
    name: `CPU(${ROLE_NAMES[role]})`,
    role,
    isBot: true,
  }));

  const botNames = bots.map((b) => b.name).join('、');
  return addLog(
    { ...state, players: [...state.players, ...bots] },
    `CPUプレイヤーが参加: ${botNames}`
  );
}

// Check if there are any pending bot actions this round
export function hasPendingBotActions(state: GameState): boolean {
  return state.players.some(
    (p) => p.isBot && !state.effectCardsDrawnThisRound.includes(p.id)
  );
}

// Execute effect card draw for one bot (first pending bot)
export function executeBotEffectCard(state: GameState): GameState {
  const bot = state.players.find(
    (p) => p.isBot && !state.effectCardsDrawnThisRound.includes(p.id)
  );
  if (!bot || state.effectCardDeck.length === 0) return state;
  return applyEffectCard(state, state.effectCardDeck[0], bot.id);
}

// Ph.1: medical bot draws clue publicly
export function executeBotClueAction(state: GameState): GameState {
  const medBot = state.players.find((p) => p.role === 'medical' && p.isBot);
  if (!medBot || state.clueDrawnThisRound || state.clueCardDeck.length === 0) return state;
  return drawClueCard(state, true);
}

// Ph.2: medical bot submits attribute guess (neutral values)
export function executeBotAttributeGuess(state: GameState): GameState {
  const medBot = state.players.find((p) => p.role === 'medical' && p.isBot);
  if (!medBot || state.attributeGuess) return state;
  return setAttributeGuess(state, { freq: '中', severity: '中', alt: 'ややあり', biz: '中' });
}

// Ph.2: auto-select medical device if only bots remain (pick first non-trap card)
export function executeBotDeviceSelect(state: GameState): GameState {
  if (state.medicalDeviceCardId) return state;
  const nonTrap = MEDICAL_DEVICE_CARDS.find((c) => !c.isTrap);
  if (!nonTrap) return state;
  return addLog(
    { ...state, medicalDeviceCardId: nonTrap.id },
    `CPU: 医療デバイス「${nonTrap.name}」を自動選択`
  );
}

// Ph.5: auto-complete checklist items owned by bot roles
const CHECKLIST_BY_ROLE: Partial<Record<RoleId, (keyof Checklist)[]>> = {
  medical: ['medScene', 'medUser'],
  dev: ['devSpec'],
  qa: ['qaData', 'qaRisk'],
  biz: ['bizSales'],
};

export function executeBotChecklist(state: GameState): GameState {
  let newState = { ...state };
  let changed = false;
  state.players.forEach((p) => {
    if (!p.isBot || !p.role) return;
    const keys = CHECKLIST_BY_ROLE[p.role] ?? [];
    keys.forEach((key) => {
      if (!newState.checklist[key]) {
        newState = { ...newState, checklist: { ...newState.checklist, [key]: true } };
        newState = addLog(newState, `CPU(${ROLE_NAMES[p.role!]}): チェック「${key}」完了`);
        changed = true;
      }
    });
  });
  return changed ? newState : state;
}

// ─────────────────────────────────────────────
// Role Conflict Mechanics (Section 17)
// ─────────────────────────────────────────────

// Default priority track per role (used by bots and as UI suggestion)
export const ROLE_DEFAULT_PRIORITY: Record<RoleId, PriorityTrackId> = {
  medical: 'fieldUnderstanding',
  dev: 'productPower',
  qa: 'trust',
  biz: 'bizPower',
  coordinator: 'fieldUnderstanding',
};

// Declare priority track for a player; auto-resolve when all have declared
export function declarePriorityTrack(
  state: GameState,
  playerId: string,
  track: PriorityTrackId
): GameState {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return state;
  if (state.priorityDeclarationResolved) return state;

  const newDeclarations = { ...state.priorityDeclarations, [playerId]: track };
  let newState: GameState = { ...state, priorityDeclarations: newDeclarations };

  // Resolve when all players have declared
  const allDeclared = state.players.every((p) => newDeclarations[p.id] !== undefined);
  if (allDeclared) {
    newState = resolvePriorityDeclarations({ ...newState, priorityDeclarations: newDeclarations });
  }

  return newState;
}

// Resolve declarations: compute bonus/penalty and apply immediately
export function resolvePriorityDeclarations(state: GameState): GameState {
  const declarations = Object.values(state.priorityDeclarations) as PriorityTrackId[];
  const playerCount = state.players.length;

  // Count per track
  const counts: Partial<Record<PriorityTrackId, number>> = {};
  for (const t of declarations) {
    counts[t] = (counts[t] ?? 0) + 1;
  }

  // Bonus: 2+ players declared same track
  const bonusTrack = (Object.entries(counts) as [PriorityTrackId, number][])
    .find(([, count]) => count >= 2)?.[0] ?? null;

  // Penalty: all declarations are different (unique count === player count)
  const uniqueCount = Object.keys(counts).length;
  const conflictPenalty = uniqueCount === playerCount;

  // Apply effects to tracks
  let newTracks = { ...state.tracks };

  if (bonusTrack) {
    newTracks[bonusTrack] = clamp(
      newTracks[bonusTrack] + 1,
      TRACK_MIN[bonusTrack],
      TRACK_MAX[bonusTrack]
    );
  }

  if (conflictPenalty) {
    newTracks = clampTracks({
      fieldUnderstanding: newTracks.fieldUnderstanding - 1,
      productPower: newTracks.productPower - 1,
      bizPower: newTracks.bizPower - 1,
      trust: newTracks.trust - 1,
      risk: newTracks.risk,
      funds: newTracks.funds,
    });
  }

  // Build log message
  const declSummary = state.players
    .map((p) => `${p.name}→${PRIORITY_TRACK_NAMES[state.priorityDeclarations[p.id]!]}`)
    .join('、');

  let resultMsg = '';
  if (bonusTrack) {
    resultMsg = `連携ボーナス: ${PRIORITY_TRACK_NAMES[bonusTrack]}+1`;
  } else if (conflictPenalty) {
    resultMsg = '衝突ペナルティ: 全トラック-1';
  } else {
    resultMsg = '効果なし（特定トラックへの連携なし）';
  }

  let newState: GameState = {
    ...state,
    tracks: newTracks,
    priorityDeclarationResolved: true,
    roundBonusTrack: bonusTrack,
    roundConflictPenalty: conflictPenalty,
  };

  newState = addLog(newState, `【優先宣言】${declSummary} → ${resultMsg}`);
  return checkInstantLoss(newState);
}

// Bot: declare priority track based on role tendency
export function executeBotPriorityDeclaration(state: GameState): GameState {
  if (state.priorityDeclarationResolved) return state;

  let newState = { ...state };
  let declared = false;

  state.players.forEach((p) => {
    if (!p.isBot || !p.role || newState.priorityDeclarations[p.id] !== undefined) return;
    const track = ROLE_DEFAULT_PRIORITY[p.role];
    newState = { ...newState, priorityDeclarations: { ...newState.priorityDeclarations, [p.id]: track } };
    declared = true;
  });

  if (!declared) return state;

  // Resolve if all players (including humans) have now declared
  const allDeclared = newState.players.every((p) => newState.priorityDeclarations[p.id] !== undefined);
  if (allDeclared) {
    newState = resolvePriorityDeclarations(newState);
  }

  return newState;
}

// Check if declaration phase is active (playing but not yet resolved)
export function needsPriorityDeclaration(state: GameState): boolean {
  return (
    state.status === 'playing' &&
    !state.priorityDeclarationResolved &&
    state.effectCardsDrawnThisRound.length === 0 &&
    !state.dramaCardDrawnThisRound
  );
}
