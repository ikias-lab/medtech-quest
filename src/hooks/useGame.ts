import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { GameState, RoleId, CompanyId, NeedsId } from '../lib/types';
import {
  createInitialGameState,
  startGame,
  applyEffectCard,
  drawClueCard,
  drawDramaCard,
  applyDramaChoice,
  endRound,
  advancePhase,
  selectMedicalDevice,
  applyFinanceCard,
  toggleChecklist,
  revealMedicalClue,
  setAttributeGuess,
  calculateFinalResult,
  addLog,
} from '../lib/gameLogic';
import { generateRoomCode, getOrCreatePlayerId } from '../lib/utils';

interface UseGameReturn {
  gameState: GameState | null;
  playerId: string;
  roomId: string | null;
  loading: boolean;
  error: string | null;
  // Actions
  createRoom: (playerName: string) => Promise<string>;
  joinRoom: (code: string, playerName: string) => Promise<void>;
  selectRole: (role: RoleId) => Promise<void>;
  startGameAction: (companyId: CompanyId, needsCardId: NeedsId) => Promise<void>;
  drawEffectCardAction: () => Promise<void>;
  drawClueCardAction: (makePublic: boolean) => Promise<void>;
  drawDramaCardAction: () => Promise<void>;
  chooseDramaAction: (choice: 'A' | 'B') => Promise<void>;
  endRoundAction: () => Promise<void>;
  advancePhaseAction: () => Promise<void>;
  selectDeviceAction: (deviceId: string) => Promise<void>;
  applyFinanceAction: (cardId: string) => Promise<void>;
  toggleChecklistAction: (key: keyof GameState['checklist']) => Promise<void>;
  revealClueAction: (clueId: string) => Promise<void>;
  setGuessAction: (guess: GameState['attributeGuess']) => Promise<void>;
  calculateFinalAction: () => Promise<void>;
}

export function useGame(): UseGameReturn {
  const playerId = getOrCreatePlayerId();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Subscribe to realtime updates for a room
  const subscribeToRoom = useCallback((code: string) => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    const channel = supabase
      .channel(`room:${code}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${code}`,
        },
        (payload) => {
          const row = payload.new as { id: string; game_state: GameState };
          if (row && row.game_state) {
            setGameState(row.game_state);
          }
        }
      )
      .subscribe();

    subscriptionRef.current = channel;
  }, []);

  // Save game state to Supabase
  const saveState = useCallback(async (code: string, state: GameState) => {
    const { error: err } = await supabase
      .from('rooms')
      .update({ game_state: state, updated_at: new Date().toISOString() })
      .eq('id', code);

    if (err) throw new Error(err.message);
  }, []);

  // Mutate state: fetch current, apply transform, save
  const mutate = useCallback(
    async (transform: (s: GameState) => GameState) => {
      if (!roomId) return;
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchErr } = await supabase
          .from('rooms')
          .select('game_state')
          .eq('id', roomId)
          .single();

        if (fetchErr) throw new Error(fetchErr.message);
        const current = data.game_state as GameState;
        const next = transform(current);
        await saveState(roomId, next);
        setGameState(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    },
    [roomId, saveState]
  );

  // Create a new room
  const createRoom = useCallback(
    async (playerName: string): Promise<string> => {
      setLoading(true);
      setError(null);
      try {
        const code = generateRoomCode();
        const initialState = createInitialGameState(code, playerId);
        const stateWithHost: GameState = {
          ...initialState,
          players: [{ id: playerId, name: playerName, role: null }],
        };

        const { error: err } = await supabase.from('rooms').insert({
          id: code,
          game_state: stateWithHost,
        });

        if (err) throw new Error(err.message);

        setRoomId(code);
        setGameState(stateWithHost);
        subscribeToRoom(code);
        return code;
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [playerId, subscribeToRoom]
  );

  // Join an existing room
  const joinRoom = useCallback(
    async (code: string, playerName: string) => {
      setLoading(true);
      setError(null);
      try {
        const upper = code.toUpperCase();
        const { data, error: fetchErr } = await supabase
          .from('rooms')
          .select('game_state')
          .eq('id', upper)
          .single();

        if (fetchErr) throw new Error('ルームが見つかりません');

        const current = data.game_state as GameState;

        // Check if player already in room
        const existing = current.players.find((p) => p.id === playerId);
        if (!existing) {
          if (current.players.length >= 5) throw new Error('ルームが満員です');

          const updated: GameState = {
            ...current,
            players: [...current.players, { id: playerId, name: playerName, role: null }],
          };
          await saveState(upper, updated);
          setGameState(updated);
        } else {
          setGameState(current);
        }

        setRoomId(upper);
        subscribeToRoom(upper);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [playerId, saveState, subscribeToRoom]
  );

  // Select role
  const selectRole = useCallback(
    async (role: RoleId) => {
      await mutate((state) => {
        const players = state.players.map((p) =>
          p.id === playerId ? { ...p, role } : p
        );
        const updated = addLog({ ...state, players }, `${players.find((p) => p.id === playerId)?.name} が ${role} を選択`);
        return updated;
      });
    },
    [mutate, playerId]
  );

  // Start game
  const startGameAction = useCallback(
    async (companyId: CompanyId, needsCardId: NeedsId) => {
      await mutate((state) => {
        let next = startGame(state, companyId, needsCardId);
        next = { ...next, status: 'playing' };
        return next;
      });
    },
    [mutate]
  );

  // Draw effect card for current player
  const drawEffectCardAction = useCallback(async () => {
    await mutate((state) => {
      if (state.effectCardDeck.length === 0) return state;
      const cardId = state.effectCardDeck[0];
      return applyEffectCard(state, cardId, playerId);
    });
  }, [mutate, playerId]);

  // Draw clue card
  const drawClueCardAction = useCallback(
    async (makePublic: boolean) => {
      await mutate((state) => drawClueCard(state, makePublic));
    },
    [mutate]
  );

  // Draw drama card
  const drawDramaCardAction = useCallback(async () => {
    await mutate((state) => drawDramaCard(state));
  }, [mutate]);

  // Choose drama option
  const chooseDramaAction = useCallback(
    async (choice: 'A' | 'B') => {
      await mutate((state) => applyDramaChoice(state, choice));
    },
    [mutate]
  );

  // End round
  const endRoundAction = useCallback(async () => {
    await mutate((state) => endRound(state));
  }, [mutate]);

  // Advance phase
  const advancePhaseAction = useCallback(async () => {
    await mutate((state) => advancePhase(state));
  }, [mutate]);

  // Select medical device
  const selectDeviceAction = useCallback(
    async (deviceId: string) => {
      await mutate((state) => selectMedicalDevice(state, deviceId));
    },
    [mutate]
  );

  // Apply finance card
  const applyFinanceAction = useCallback(
    async (cardId: string) => {
      await mutate((state) => applyFinanceCard(state, cardId));
    },
    [mutate]
  );

  // Toggle checklist
  const toggleChecklistAction = useCallback(
    async (key: keyof GameState['checklist']) => {
      await mutate((state) => toggleChecklist(state, key));
    },
    [mutate]
  );

  // Reveal clue
  const revealClueAction = useCallback(
    async (clueId: string) => {
      await mutate((state) => revealMedicalClue(state, clueId));
    },
    [mutate]
  );

  // Set attribute guess
  const setGuessAction = useCallback(
    async (guess: GameState['attributeGuess']) => {
      await mutate((state) => setAttributeGuess(state, guess));
    },
    [mutate]
  );

  // Calculate final result
  const calculateFinalAction = useCallback(async () => {
    await mutate((state) => calculateFinalResult(state));
  }, [mutate]);

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, []);

  return {
    gameState,
    playerId,
    roomId,
    loading,
    error,
    createRoom,
    joinRoom,
    selectRole,
    startGameAction,
    drawEffectCardAction,
    drawClueCardAction,
    drawDramaCardAction,
    chooseDramaAction,
    endRoundAction,
    advancePhaseAction,
    selectDeviceAction,
    applyFinanceAction,
    toggleChecklistAction,
    revealClueAction,
    setGuessAction,
    calculateFinalAction,
  };
}
