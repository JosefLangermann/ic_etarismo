/**
 * useModuleProgress.ts
 * --------------------------------------------------------------
 * NOTA ACADÊMICA:
 * Avalia o "engajamento" do usuário com um módulo combinando três
 * sinais comportamentais simples:
 *   1. Tempo de permanência (em ms) na rota do módulo
 *   2. Se o quiz do módulo foi tentado
 *   3. Acurácia (% de acertos) na ÚLTIMA tentativa do quiz
 *
 * O resultado classifica o usuário em três níveis:
 *   - "low"     : pouco tempo OU quiz não feito OU acurácia < 60%
 *   - "medium"  : leu razoavelmente, acertos entre 60–80%
 *   - "high"    : leu bem e acertou ≥ 80%
 *
 * Esses limiares são heurísticos e podem (devem) ser calibrados
 * com base nos dados reais coletados pela pesquisa.
 */
import { useMemo } from "react";
import { useHistory } from "@/hooks/useHistory";
import { MODULES } from "@/data/course";

export type EngagementLevel = "low" | "medium" | "high";

export interface ModuleProgress {
  level: EngagementLevel;
  timeMs: number;
  quizDone: boolean;
  accuracy: number | null; // 0..1, null se sem tentativa
  totalQuestions: number;
  message: string;          // mensagem amigável para diálogo de confirmação
}

const MIN_READ_MS = 45_000; // 45s — limiar bem permissivo de leitura mínima

export function useModuleProgress(slug: string): ModuleProgress {
  const { state } = useHistory();

  return useMemo(() => {
    const mod = MODULES.find((m) => m.slug === slug);
    const totalQuestions = mod?.quiz.length ?? 0;

    // Tempo total no módulo = página principal + capítulos + quiz
    const prefix = `modulo/${slug}`;
    const timeMs = Object.entries(state.timeBySlug)
      .filter(([k]) => k === prefix || k.startsWith(`${prefix}/`))
      .reduce((acc, [, v]) => acc + v, 0);

    // Tentativas do quiz desse módulo
    const quizId = mod?.id ?? "";
    const attempts = state.attempts.filter((a) => a.quizId === quizId);
    const quizDone = attempts.length >= totalQuestions && totalQuestions > 0;

    let accuracy: number | null = null;
    if (quizDone && totalQuestions > 0) {
      // Pega as últimas N tentativas (N = totalQuestions) — última passagem
      const lastRun = attempts.slice(-totalQuestions);
      const correct = lastRun.filter((a) => a.correct).length;
      accuracy = correct / totalQuestions;
    }

    let level: EngagementLevel = "high";
    if (!quizDone || timeMs < MIN_READ_MS || (accuracy !== null && accuracy < 0.6)) {
      level = "low";
    } else if (accuracy !== null && accuracy < 0.8) {
      level = "medium";
    }

    let message = "";
    if (level === "low") {
      const reasons: string[] = [];
      if (timeMs < MIN_READ_MS) reasons.push("você passou pouco tempo lendo este módulo");
      if (!quizDone) reasons.push("você ainda não terminou o quiz");
      else if (accuracy !== null && accuracy < 0.6) reasons.push(`sua última pontuação foi de ${Math.round(accuracy * 100)}%`);
      message = `Antes de seguir: ${reasons.join(" e ")}. Que tal revisar antes de avançar? Sem pressão — você pode continuar mesmo assim.`;
    } else if (level === "medium") {
      message = `Você foi bem (${Math.round((accuracy ?? 0) * 100)}% no quiz). Quer revisar algum trecho antes de avançar ou seguir em frente?`;
    } else {
      message = "Tudo certo por aqui! Deseja mesmo avançar para o próximo módulo?";
    }

    return { level, timeMs, quizDone, accuracy, totalQuestions, message };
  }, [slug, state]);
}
