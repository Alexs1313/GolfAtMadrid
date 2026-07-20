import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BackHandler } from 'react-native';

import { QUIZ_QUESTIONS } from '../data/quiz';

import { usePersistedState } from '../hooks/usePersistedState';
import type {
  DictionaryCategory,
  QuizDifficulty,
  QuizQuestion,
} from '../types';
import { useAppNavigation } from './NavigationContext';

type LearnSegment = 'dictionary' | 'saved';

const QUIZ_LENGTH = 8;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export interface ActiveQuiz {
  difficulty: QuizDifficulty;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: (number | null)[];
  isPaused: boolean;
}

export interface QuizResult {
  difficulty: QuizDifficulty;
  correct: number;
  incorrect: number;
  total: number;
  accuracyPct: number;
  bestScore: number;
  isNewBest: boolean;
}

function buildQuiz(difficulty: QuizDifficulty): ActiveQuiz {
  const pool = QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty);
  const questions = shuffle(pool).slice(0, QUIZ_LENGTH);
  return {
    difficulty,
    questions,
    currentIndex: 0,
    answers: new Array(questions.length).fill(null),
    isPaused: false,
  };
}

type LearnContextValue = {
  segment: LearnSegment;
  setSegment: (segment: LearnSegment) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  selectedCategory: 'All' | DictionaryCategory;
  setSelectedCategory: (category: 'All' | DictionaryCategory) => void;

  savedTermIds: Set<string>;
  toggleSavedTerm: (id: string) => void;

  quizDifficulty: QuizDifficulty;
  setQuizDifficulty: (difficulty: QuizDifficulty) => void;
  bestScores: Record<QuizDifficulty, number | null>;

  activeQuiz: ActiveQuiz | null;
  startQuiz: () => void;
  answerCurrentQuestion: (optionIndex: number) => void;
  advanceQuestion: () => void;
  pauseQuiz: () => void;
  resumeQuiz: () => void;
  exitQuiz: () => void;

  quizResult: QuizResult | null;
  retryQuiz: () => void;
  closeQuizResult: () => void;
};

const LearnContext = createContext<LearnContextValue | null>(null);

export function LearnProvider({ children }: { children: React.ReactNode }) {
  const { selectTab } = useAppNavigation();
  const [segment, setSegment] = useState<LearnSegment>('dictionary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | DictionaryCategory
  >('All');
  const [savedTermIdsArray, setSavedTermIdsArray] = usePersistedState<string[]>(
    'learn.savedTermIds',
    [],
  );
  const savedTermIds = useMemo(
    () => new Set(savedTermIdsArray),
    [savedTermIdsArray],
  );
  const [quizDifficulty, setQuizDifficulty] =
    useState<QuizDifficulty>('Medium');
  const [bestScores, setBestScores] = usePersistedState<
    Record<QuizDifficulty, number | null>
  >('learn.bestScores', { Easy: null, Medium: null, Hard: null });
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const toggleSavedTerm = useCallback(
    (id: string) => {
      setSavedTermIdsArray(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
      );
    },
    [setSavedTermIdsArray],
  );

  const startQuiz = useCallback(() => {
    setActiveQuiz(buildQuiz(quizDifficulty));
  }, [quizDifficulty]);

  const retryQuiz = useCallback(() => {
    setQuizResult(prev => {
      if (prev) {
        setActiveQuiz(buildQuiz(prev.difficulty));
      }
      return null;
    });
  }, []);

  const finishQuiz = useCallback((quiz: ActiveQuiz) => {
    const correct = quiz.answers.reduce<number>(
      (sum, answer, i) =>
        sum + (answer === quiz.questions[i].correctIndex ? 1 : 0),
      0,
    );
    const total = quiz.questions.length;
    const incorrect = total - correct;
    const accuracyPct = Math.round((correct / total) * 100);

    setBestScores(prev => {
      const currentBest = prev[quiz.difficulty];
      const isNewBest = currentBest === null || correct > currentBest;
      const bestScore = isNewBest ? correct : currentBest;
      setQuizResult({
        difficulty: quiz.difficulty,
        correct,
        incorrect,
        total,
        accuracyPct,
        bestScore,
        isNewBest,
      });
      return isNewBest ? { ...prev, [quiz.difficulty]: correct } : prev;
    });
    setActiveQuiz(null);
  }, []);

  const answerCurrentQuestion = useCallback((optionIndex: number) => {
    setActiveQuiz(prev => {
      if (!prev || prev.answers[prev.currentIndex] !== null) {
        return prev;
      }
      const answers = [...prev.answers];
      answers[prev.currentIndex] = optionIndex;
      return { ...prev, answers };
    });
  }, []);

  const advanceQuestion = useCallback(() => {
    setActiveQuiz(prev => {
      if (!prev) {
        return prev;
      }
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.questions.length) {
        finishQuiz(prev);
        return prev;
      }
      return { ...prev, currentIndex: nextIndex };
    });
  }, [finishQuiz]);

  const pauseQuiz = useCallback(() => {
    setActiveQuiz(prev => (prev ? { ...prev, isPaused: true } : prev));
  }, []);

  const resumeQuiz = useCallback(() => {
    setActiveQuiz(prev => (prev ? { ...prev, isPaused: false } : prev));
  }, []);

  const exitQuiz = useCallback(() => {
    setActiveQuiz(null);
  }, []);

  const closeQuizResult = useCallback(() => {
    setQuizResult(null);
    setActiveQuiz(null);
    selectTab('Learn');
  }, [selectTab]);

  useEffect(() => {
    if (!activeQuiz && !quizResult) {
      return;
    }
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (quizResult) {
          closeQuizResult();
          return true;
        }
        if (activeQuiz) {
          if (activeQuiz.isPaused) {
            exitQuiz();
          } else {
            pauseQuiz();
          }
          return true;
        }
        return false;
      },
    );
    return () => subscription.remove();
  }, [activeQuiz, quizResult, closeQuizResult, exitQuiz, pauseQuiz]);

  const value = useMemo(
    () => ({
      segment,
      setSegment,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      savedTermIds,
      toggleSavedTerm,
      quizDifficulty,
      setQuizDifficulty,
      bestScores,
      activeQuiz,
      startQuiz,
      answerCurrentQuestion,
      advanceQuestion,
      pauseQuiz,
      resumeQuiz,
      exitQuiz,
      quizResult,
      retryQuiz,
      closeQuizResult,
    }),
    [
      segment,
      searchQuery,
      selectedCategory,
      savedTermIds,
      toggleSavedTerm,
      quizDifficulty,
      bestScores,
      activeQuiz,
      startQuiz,
      answerCurrentQuestion,
      advanceQuestion,
      pauseQuiz,
      resumeQuiz,
      exitQuiz,
      quizResult,
      retryQuiz,
      closeQuizResult,
    ],
  );

  return (
    <LearnContext.Provider value={value}>{children}</LearnContext.Provider>
  );
}

export function useLearnState() {
  const context = useContext(LearnContext);
  if (!context) {
    throw new Error('useLearnState must be used within LearnProvider');
  }
  return context;
}
