/**
 * Quiz.tsx — Componente de quiz reutilizável.
 * Recebe perguntas e dispara callback ao concluir.
 * Registra no histórico via useHistory.
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion } from "@/data/course";
import { useHistory } from "@/hooks/useHistory";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  quizId: string;        // ex "mod-1" ou "mega"
  questions: QuizQuestion[];
  title?: string;
  onComplete?: (score: number, total: number) => void;
}

/**
 * shuffleIndices — Fisher–Yates.
 * NOTA ACADÊMICA: gera uma permutação uniforme dos índices [0..n-1].
 * Retornamos a PERMUTAÇÃO (mapa "posiçãoExibida → índiceOriginal"),
 * o que preserva `q.answer` (índice na fonte de dados) intacto e
 * evita viés de posição (ex.: respostas concentradas em "B").
 */
function shuffleIndices(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Quiz({ quizId, questions, title, onComplete }: Props) {
  const { recordAttempt } = useHistory();
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null); // índice EXIBIDO escolhido
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const startRef = useMemo(() => ({ t: Date.now() }), [idx]); // reseta a cada questão

  const q = questions[idx];
  const total = questions.length;

  // Permutação por questão. Recalculada quando muda `idx` ou `quizId`,
  // garantindo ordem nova a cada nova tentativa do quiz.
  const order = useMemo(() => shuffleIndices(q.options.length), [idx, quizId, q.id]);

  function pick(displayedIdx: number) {
    if (chosen !== null) return;
    const originalIdx = order[displayedIdx];        // mapeia para índice da fonte
    const correct = originalIdx === q.answer;
    setChosen(displayedIdx);
    if (correct) setScore((s) => s + 1);
    recordAttempt({ quizId, questionId: q.id, chosen: originalIdx, correct, timeMs: Date.now() - startRef.t });
  }

  function next() {
    if (idx + 1 >= total) {
      setDone(true);
      onComplete?.(score, total); // `score` já foi atualizado em pick()
      return;
    }
    setIdx(idx + 1);
    setChosen(null);
  }

  if (done) {
    const pct = Math.round((score / total) * 100);
    /**
     * NOTA ACADÊMICA — feedback motivacional:
     * Mensagens calibradas para reforço positivo SEM humilhação.
     * Em pesquisas com público intergeracional (especialmente idosos
     * em ambientes digitais), a sensação de "ser julgado" é uma das
     * principais barreiras de engajamento. Por isso, mesmo no pior
     * cenário, validamos a tentativa e convidamos à repetição.
     */
    let headline = "";
    let body = "";
    let tone: "success" | "accent" | "warn" = "accent";
    if (score === total) {
      headline = "Excelente! Gabarito completo 🎉";
      body = "Você dominou o conteúdo deste módulo. Parabéns pela dedicação!";
      tone = "success";
    } else if (pct >= 80) {
      headline = "Muito bem!";
      body = "Você compreendeu a maior parte do conteúdo. Vale revisar os pontos que escaparam para fixar de vez.";
      tone = "success";
    } else if (pct >= 60) {
      headline = "Bom resultado, mas dá pra ir além";
      body = "Você está no caminho certo. Que tal revisar o módulo e tentar de novo? Errar faz parte do aprendizado.";
      tone = "accent";
    } else if (pct > 0) {
      headline = "Que tal mais uma rodada?";
      body = "Não desanime — é normal precisar de mais de uma leitura. Volte ao módulo, releia com calma e tente novamente. Cada tentativa conta.";
      tone = "warn";
    } else {
      headline = "Sem problema, vamos do começo";
      body = "Ninguém aprende tudo de primeira. Volte ao módulo, leia no seu ritmo e refaça o quiz quando se sentir pronto.";
      tone = "warn";
    }
    const toneClass =
      tone === "success" ? "text-success"
      : tone === "warn" ? "text-error"
      : "text-accent";

    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-2xl text-center py-12">
        <Award className={cn("mx-auto h-14 w-14", toneClass)} />
        <div className="mt-4 text-eyebrow text-muted-foreground">Resultado</div>
        <h3 className="mt-2 font-display text-cinema-sm">{score}/{total}</h3>
        <p className="mt-2 text-lg text-foreground/80">{pct}% de acerto</p>
        <div className={cn("mt-8 mx-auto max-w-md border-t-2 pt-6", tone === "success" ? "border-success" : tone === "warn" ? "border-error" : "border-accent")}>
          <h4 className={cn("font-display text-2xl", toneClass)}>{headline}</h4>
          <p className="mt-3 text-base text-foreground/85 leading-relaxed">{body}</p>
        </div>
        <p className="mt-6 max-w-md mx-auto text-sm text-muted-foreground">
          Suas respostas foram salvas no seu histórico. Você pode revê-las a qualquer momento.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      {title && <div className="text-eyebrow text-accent mb-2">{title}</div>}
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-xs text-muted-foreground">QUESTÃO {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <span className="font-mono text-xs text-muted-foreground">ACERTOS · {score}</span>
      </div>

      {/* Barra de progresso */}
      <div className="mb-8 h-[2px] w-full bg-border overflow-hidden">
        <motion.div className="h-full bg-accent" initial={{ width: 0 }} animate={{ width: `${((idx) / total) * 100}%` }} transition={{ duration: 0.5 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <h3 className="font-display text-2xl md:text-4xl text-foreground leading-tight">{q.q}</h3>
          <div className="mt-8 space-y-3">
            {/*
              Renderizamos as opções na ORDEM EMBARALHADA (`order`).
              `displayedIdx` = posição visual; `originalIdx` = índice na fonte.
              Acerto/erro são determinados comparando `originalIdx` com `q.answer`.
            */}
            {order.map((originalIdx, displayedIdx) => {
              const opt = q.options[originalIdx];
              const isChosen = chosen === displayedIdx;
              const isCorrect = originalIdx === q.answer;
              const reveal = chosen !== null;
              return (
                <button
                  key={originalIdx}
                  onClick={() => pick(displayedIdx)}
                  disabled={reveal}
                  className={cn(
                    "group flex w-full items-center gap-4 border-2 bg-card/50 p-4 text-left transition-all rounded-sm",
                    !reveal && "border-border hover:border-accent hover:bg-card hover:translate-x-1",
                    reveal && isCorrect && "border-success bg-success/15",
                    reveal && isChosen && !isCorrect && "border-error bg-error/15",
                    reveal && !isChosen && !isCorrect && "border-border opacity-60",
                  )}
                >
                  <span className="font-mono text-xs text-muted-foreground w-6">{String.fromCharCode(65 + displayedIdx)}</span>
                  <span className="flex-1 text-foreground/90">{opt}</span>
                  {reveal && isCorrect && <Check className="h-5 w-5 text-success" />}
                  {reveal && isChosen && !isCorrect && <X className="h-5 w-5 text-error" />}
                </button>
              );
            })}
          </div>

          {chosen !== null && (() => {
            const userCorrect = order[chosen] === q.answer;
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "mt-6 border-l-4 bg-card/40 p-4 rounded-sm",
                  userCorrect ? "border-success" : "border-error",
                )}
              >
                <div className={cn("text-eyebrow mb-1", userCorrect ? "text-success" : "text-error")}>
                  {userCorrect ? "✓ Você acertou" : "✕ Resposta incorreta"}
                </div>
                <p className="text-sm md:text-base text-foreground/85">{q.feedback}</p>
                <div className="mt-4 flex justify-end">
                  <Button onClick={next} className="gap-2">
                    {idx + 1 >= total ? "Ver resultado" : "Próxima"} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
