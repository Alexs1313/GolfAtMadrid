import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { HOLES } from '../data/holes';

import { usePersistedState } from '../hooks/usePersistedState';
import type {
  GameParticipant,
  HoleScore,
  RoundSummary,
  SavedGame,
} from '../types';

type ScoreSegment = 'current' | 'stats';

function freshHoleScores(): HoleScore[] {
  return HOLES.map(hole => ({ strokes: hole.par, putts: 2 }));
}

type ScoreContextValue = {
  segment: ScoreSegment;
  setSegment: (segment: ScoreSegment) => void;

  holeIndex: number;
  holeScores: HoleScore[];
  updateCurrentHole: (field: 'strokes' | 'putts', delta: number) => void;
  goToHole: (delta: 1 | -1) => void;
  jumpToHole: (index: number) => void;

  participants: GameParticipant[];
  addParticipant: (name: string) => void;
  adjustParticipant: (id: string, delta: number) => void;
  removeParticipant: (id: string) => void;

  cumulativeScoreToPar: number;

  roundComplete: RoundSummary | null;
  finishGame: () => void;
  saveGame: () => void;
  startNewGame: () => void;
  viewStatistics: () => void;

  previousGames: SavedGame[];

  isPaused: boolean;
  pauseGame: () => void;
  resumeGame: () => void;
};

const ScoreContext = createContext<ScoreContextValue | null>(null);

export function ScoreProvider({ children }: { children: React.ReactNode }) {
  const [segment, setSegment] = useState<ScoreSegment>('current');
  const [holeIndex, setHoleIndex] = useState(0);
  const [holeScores, setHoleScores] = useState<HoleScore[]>(freshHoleScores);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [startedAt] = useState(() => Date.now());
  const [roundComplete, setRoundComplete] = useState<RoundSummary | null>(null);
  const [previousGames, setPreviousGames] = usePersistedState<SavedGame[]>(
    'score.previousGames',
    [],
  );
  const [isPaused, setIsPaused] = useState(false);

  const updateCurrentHole = useCallback(
    (field: 'strokes' | 'putts', delta: number) => {
      setHoleScores(prev => {
        const next = [...prev];
        const current = next[holeIndex];
        const min = field === 'strokes' ? 1 : 0;
        next[holeIndex] = {
          ...current,
          [field]: Math.max(min, current[field] + delta),
        };
        return next;
      });
    },
    [holeIndex],
  );

  const goToHole = useCallback((delta: 1 | -1) => {
    setHoleIndex(prev => Math.min(HOLES.length - 1, Math.max(0, prev + delta)));
  }, []);

  const jumpToHole = useCallback((index: number) => {
    setHoleIndex(Math.min(HOLES.length - 1, Math.max(0, index)));
    setSegment('current');
  }, []);

  const addParticipant = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    setParticipants(prev => [
      ...prev,
      { id: `${Date.now()}`, name: trimmed, scoreToPar: 0 },
    ]);
  }, []);

  const adjustParticipant = useCallback((id: string, delta: number) => {
    setParticipants(prev =>
      prev.map(p =>
        p.id === id ? { ...p, scoreToPar: p.scoreToPar + delta } : p,
      ),
    );
  }, []);

  const removeParticipant = useCallback((id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  }, []);

  const cumulativeScoreToPar = useMemo(
    () =>
      holeScores.reduce(
        (sum, score, i) => sum + (score.strokes - HOLES[i].par),
        0,
      ),
    [holeScores],
  );

  const finishGame = useCallback(() => {
    const finalStrokes = holeScores.reduce((sum, s) => sum + s.strokes, 0);
    const totalPutts = holeScores.reduce((sum, s) => sum + s.putts, 0);

    let bestHole = 1;
    let toughestHole = 1;
    let bestDiff = Infinity;
    let worstDiff = -Infinity;
    let fairwayEligible = 0;
    let fairwaysHit = 0;
    let greensInReg = 0;

    holeScores.forEach((score, i) => {
      const par = HOLES[i].par;
      const diff = score.strokes - par;
      if (diff < bestDiff) {
        bestDiff = diff;
        bestHole = i + 1;
      }
      if (diff > worstDiff) {
        worstDiff = diff;
        toughestHole = i + 1;
      }
      if (par >= 4) {
        fairwayEligible += 1;
        if (score.strokes <= par) {
          fairwaysHit += 1;
        }
      }
      if (score.strokes - score.putts <= par - 2) {
        greensInReg += 1;
      }
    });

    const durationMin = Math.max(
      1,
      Math.round((Date.now() - startedAt) / 60000),
    );

    setRoundComplete({
      finalStrokes,
      scoreToPar: finalStrokes - HOLES.reduce((sum, h) => sum + h.par, 0),
      totalPutts,
      bestHole,
      toughestHole,
      fairwaysHitPct:
        fairwayEligible > 0
          ? Math.round((fairwaysHit / fairwayEligible) * 100)
          : 0,
      greensInRegPct: Math.round((greensInReg / HOLES.length) * 100),
      durationMin,
    });
  }, [holeScores, startedAt]);

  const saveGame = useCallback(() => {
    if (!roundComplete) {
      return;
    }
    const dateLabel = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    setPreviousGames(prev => [
      {
        id: `${Date.now()}`,
        dateLabel,
        timestamp: Date.now(),
        summary: roundComplete,
      },
      ...prev,
    ]);
  }, [roundComplete]);

  const startNewGame = useCallback(() => {
    setHoleScores(freshHoleScores());
    setHoleIndex(0);
    setParticipants([]);
    setRoundComplete(null);
  }, []);

  const viewStatistics = useCallback(() => {
    setRoundComplete(null);
    setSegment('stats');
  }, []);

  const pauseGame = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeGame = useCallback(() => {
    setIsPaused(false);
  }, []);

  const value = useMemo(
    () => ({
      segment,
      setSegment,
      holeIndex,
      holeScores,
      updateCurrentHole,
      goToHole,
      jumpToHole,
      participants,
      addParticipant,
      adjustParticipant,
      removeParticipant,
      cumulativeScoreToPar,
      roundComplete,
      finishGame,
      saveGame,
      startNewGame,
      viewStatistics,
      previousGames,
      isPaused,
      pauseGame,
      resumeGame,
    }),
    [
      segment,
      holeIndex,
      holeScores,
      updateCurrentHole,
      goToHole,
      jumpToHole,
      participants,
      addParticipant,
      adjustParticipant,
      removeParticipant,
      cumulativeScoreToPar,
      roundComplete,
      finishGame,
      saveGame,
      startNewGame,
      viewStatistics,
      previousGames,
      isPaused,
      pauseGame,
      resumeGame,
    ],
  );

  return (
    <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>
  );
}

export function useScoreState() {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScoreState must be used within ScoreProvider');
  }
  return context;
}
