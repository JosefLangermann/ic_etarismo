/**
 * useHistory.ts — Hook de histórico do usuário (localStorage).
 * --------------------------------------------------------------
 * NOTA ACADÊMICA:
 * Implementação propositalmente abstraída atrás de uma interface
 * simples (track, getHistory, reset). Isso permite, no futuro,
 * trocar a camada de persistência (localStorage → Lovable Cloud)
 * sem alterar componentes consumidores — aplicação do princípio
 * de inversão de dependência (SOLID/D).
 *
 * O histórico registra:
 *   - tempo gasto por slug de página (ex: módulo, capítulo)
 *   - respostas de quizzes (acerto/erro/tempo)
 *   - idade informada (quando o usuário preenche o age gate)
 */

import { useEffect, useRef, useState, useCallback } from "react";

const STORAGE_KEY = "geracoes-historico-v1";

export interface QuizAttempt {
  quizId: string;       // ex: "mod-2" ou "mega"
  questionId: string;
  chosen: number;
  correct: boolean;
  timeMs: number;       // tempo gasto na questão
  at: number;           // timestamp
}

export interface HistoryState {
  /** Tempo acumulado por slug (em ms). */
  timeBySlug: Record<string, number>;
  /** Última visita por slug. */
  lastVisitBySlug: Record<string, number>;
  /** Tentativas de quiz, em ordem cronológica. */
  attempts: QuizAttempt[];
  /** Idade informada pelo usuário (após módulo 3). */
  age?: number;
  /** Geração calculada a partir da idade. */
  generation?: "boomers" | "x" | "millennials" | "z";
}

const empty: HistoryState = {
  timeBySlug: {},
  lastVisitBySlug: {},
  attempts: [],
};

function loadFromStorage(): HistoryState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

function saveToStorage(s: HistoryState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* quota cheia, ignora */ }
}

/**
 * Hook que mede tempo de permanência em uma "página" lógica (slug).
 * Use em cada página de módulo/capítulo: `useTrackTime("mod-2/cap-1")`.
 */
export function useTrackTime(slug: string) {
  const startRef = useRef<number>(Date.now());
  useEffect(() => {
    startRef.current = Date.now();
    const onUnload = () => {
      const elapsed = Date.now() - startRef.current;
      const s = loadFromStorage();
      s.timeBySlug[slug] = (s.timeBySlug[slug] || 0) + elapsed;
      s.lastVisitBySlug[slug] = Date.now();
      saveToStorage(s);
    };
    window.addEventListener("beforeunload", onUnload);
    return () => {
      onUnload(); // ao desmontar (ex: troca de rota), também grava
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [slug]);
}

/** Hook geral para ler/escrever histórico. */
export function useHistory() {
  const [state, setState] = useState<HistoryState>(() => loadFromStorage());

  const refresh = useCallback(() => setState(loadFromStorage()), []);

  const recordAttempt = useCallback((a: Omit<QuizAttempt, "at">) => {
    const s = loadFromStorage();
    s.attempts.push({ ...a, at: Date.now() });
    saveToStorage(s);
    setState(s);
  }, []);

  const setAgeAndGeneration = useCallback((age: number) => {
    const generation = computeGeneration(age);
    const s = loadFromStorage();
    s.age = age;
    s.generation = generation;
    saveToStorage(s);
    setState(s);
    return generation;
  }, []);

  const reset = useCallback(() => {
    saveToStorage(empty);
    setState(empty);
  }, []);

  return { state, refresh, recordAttempt, setAgeAndGeneration, reset };
}

/**
 * Calcula a geração a partir da idade (assumindo o ano corrente).
 * Recortes: ver MÓDULO 3.
 */
export function computeGeneration(age: number): HistoryState["generation"] {
  const year = new Date().getFullYear();
  const birthYear = year - age;
  if (birthYear <= 1964) return "boomers";
  if (birthYear <= 1980) return "x";
  if (birthYear <= 1996) return "millennials";
  return "z";
}

export const generationToSlug: Record<NonNullable<HistoryState["generation"]>, string> = {
  boomers: "boomers",
  x: "geracao-x",
  millennials: "millennials",
  z: "geracao-z",
};
