/**
 * HistoryPage.tsx — Mostra ao usuário seu próprio percurso.
 * Tempo por página, acertos/erros por quiz, idade e geração.
 */
import { useHistory } from "@/hooks/useHistory";
import { MODULES, MEGA_QUIZ } from "@/data/course";
import { Button } from "@/components/ui/button";
import { Trash2, Clock, Target } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

function fmtTime(ms: number) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  if (m < 60) return `${m}min ${rs}s`;
  return `${Math.floor(m / 60)}h ${m % 60}min`;
}

export default function HistoryPage() {
  const { state, reset } = useHistory();

  const totalTime = Object.values(state.timeBySlug).reduce((a, b) => a + b, 0);
  const totalAttempts = state.attempts.length;
  const totalCorrect = state.attempts.filter((a) => a.correct).length;
  const accuracy = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <main className="theme-mod-1 min-h-screen flex flex-col">
      <div className="flex-1 px-6 md:px-16 py-20">
      <div className="max-w-5xl">
        <div className="text-eyebrow text-accent">Seu percurso</div>
        <h1 className="mt-3 font-display text-cinema text-foreground">Histórico</h1>
        <p className="mt-4 max-w-xl text-foreground/75">
          Tudo aqui é salvo localmente no seu navegador. Use esses dados para identificar onde dedicar mais atenção.
        </p>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat label="Tempo total" value={fmtTime(totalTime)} icon={<Clock className="h-4 w-4" />} />
          <Stat label="Tentativas" value={String(totalAttempts)} icon={<Target className="h-4 w-4" />} />
          <Stat label="Acerto médio" value={`${accuracy}%`} />
          <Stat label="Sua geração" value={state.generation ? labels[state.generation] : "—"} />
        </div>

        {/* Por módulo */}
        <section className="mt-16">
          <h2 className="font-display text-3xl text-foreground">Tempo por módulo</h2>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {MODULES.map((m) => {
              const t = state.timeBySlug[`modulo/${m.slug}`] || 0;
              const chapters = m.chapters.map((c) => ({
                id: c.id, title: c.title,
                time: state.timeBySlug[`modulo/${m.slug}/${c.id}`] || 0,
              }));
              const quizTime = state.timeBySlug[`modulo/${m.slug}/quiz`] || 0;
              const quizAttempts = state.attempts.filter((a) => a.quizId === m.id);
              const quizScore = quizAttempts.filter((a) => a.correct).length;
              return (
                <details key={m.id} className="group py-5">
                  <summary className="flex cursor-pointer items-center gap-6 list-none">
                    <span className="font-mono text-xs text-muted-foreground w-8">{String(m.number).padStart(2, "0")}</span>
                    <span className="flex-1 font-display text-xl md:text-2xl text-foreground">{m.title}</span>
                    <span className="font-mono text-xs text-muted-foreground">{fmtTime(t)}</span>
                    {quizAttempts.length > 0 && (
                      <span className="font-mono text-xs text-accent">{quizScore}/{m.quiz.length}</span>
                    )}
                    <span className="text-muted-foreground text-xs group-open:rotate-90 transition-transform">▶</span>
                  </summary>
                  <div className="mt-4 ml-14 space-y-2 text-sm">
                    {chapters.map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-foreground/70">
                        <span>· {c.title}</span>
                        <span className="font-mono text-xs">{fmtTime(c.time)}</span>
                      </div>
                    ))}
                    {quizTime > 0 && (
                      <div className="flex items-center justify-between text-accent/90 pt-2 border-t border-border/40">
                        <span>· Quiz do módulo</span>
                        <span className="font-mono text-xs">{fmtTime(quizTime)}</span>
                      </div>
                    )}
                    {/* Erros */}
                    {quizAttempts.filter((a) => !a.correct).length > 0 && (
                      <div className="mt-3 text-xs text-destructive/90">
                        Errou {quizAttempts.filter((a) => !a.correct).length} questão(ões) deste módulo. Vale revisar.
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {/* Mega quiz */}
        <section className="mt-12">
          <h2 className="font-display text-3xl text-foreground">Mega quiz</h2>
          {(() => {
            const att = state.attempts.filter((a) => a.quizId === "mega");
            if (!att.length) return <p className="mt-3 text-muted-foreground">Você ainda não fez o mega quiz.</p>;
            const ok = att.filter((a) => a.correct).length;
            return (
              <div className="mt-3 text-foreground/80">
                <span className="font-display text-3xl text-accent">{ok}</span> / {MEGA_QUIZ.length} corretas em {att.length} tentativas registradas.
              </div>
            );
          })()}
        </section>

        <div className="mt-16">
          <Button variant="outline" onClick={() => { if (confirm("Apagar todo o histórico?")) reset(); }} className="gap-2">
            <Trash2 className="h-4 w-4" /> Limpar histórico
          </Button>
        </div>
      </div>
      </div>
      <Footer />
    </main>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="border border-border bg-card/40 p-5 rounded-sm">
      <div className="flex items-center gap-2 text-eyebrow text-muted-foreground">{icon}{label}</div>
      <div className="mt-2 font-display text-3xl text-foreground">{value}</div>
    </div>
  );
}

const labels: Record<string, string> = {
  boomers: "Baby Boomer",
  x: "Geração X",
  millennials: "Millennial",
  z: "Geração Z",
};
