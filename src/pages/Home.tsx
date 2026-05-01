/**
 * Home.tsx — Capa do curso. Estética cinematográfica.
 */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MODULES } from "@/data/course";
import { useHistory, generationToSlug } from "@/hooks/useHistory";
import { Button } from "@/components/ui/button";
import { ArrowRight, History, Sparkles, Trophy, BookOpen } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  const { state } = useHistory();
  const firstSlug = state.generation ? generationToSlug[state.generation] : MODULES[0].slug;

  return (
    <main className="theme-mod-1 relative min-h-screen overflow-hidden">
      {/* Fundo cinematográfico */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--accent)/0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--signal-2)/0.08),transparent_60%)]" />
        <div className="noise absolute inset-0" />
      </div>

      {/* HERO */}
      <section className="relative px-6 md:px-16 pt-20 md:pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="text-eyebrow text-accent">Iniciação científica · Engenharia</div>
          <h1 className="mt-6 font-display text-cinema text-foreground">
            Gerações<br/>
            <span className="text-accent italic">na INDÚSTRIA.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg md:text-xl text-foreground/75 leading-relaxed">
            Um curso digital sobre como diferentes idades convivem, colaboram e se complementam no chão de fábrica — e por que o etarismo custa caro a todos.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-12 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="gap-2 text-base">
            <Link to={`/modulo/${state.generation ? firstSlug : MODULES[0].slug}`}>
              {state.generation ? "Continuar pela minha geração" : "Começar curso"} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/glossario"><BookOpen className="h-4 w-4" /> Glossário</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/mega-quiz"><Trophy className="h-4 w-4" /> Mega quiz</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="gap-2">
            <Link to="/historico"><History className="h-4 w-4" /> Histórico</Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
          {[
            ["09", "módulos"],
            ["27", "capítulos"],
            ["09", "quizzes"],
            ["30", "questões finais"],
          ].map(([n, l]) => (
            <div key={l} className="border-l border-border pl-4">
              <div className="font-display text-5xl text-foreground">{n}</div>
              <div className="text-eyebrow text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Ticker industrial */}
      <div className="relative border-y border-border bg-card/40 overflow-hidden py-4">
        <div className="flex whitespace-nowrap animate-ticker font-display text-3xl md:text-5xl text-foreground/40">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="px-8">BOOMERS · GERAÇÃO X · MILLENNIALS · GERAÇÃO Z · CONVIVÊNCIA · CONHECIMENTO ·</span>
          ))}
        </div>
      </div>

      {/* Lista de módulos */}
      <section className="relative px-6 md:px-16 py-20">
        <div className="text-eyebrow text-accent">Trilha do curso</div>
        <h2 className="mt-3 font-display text-cinema-sm text-foreground">Nove paradas.</h2>

        <div className="mt-10 divide-y divide-border border-y border-border">
          {MODULES.map((m) => {
            const isMine = state.generation && generationToSlug[state.generation] === m.slug;
            return (
              <Link
                key={m.id}
                to={`/modulo/${m.slug}`}
                className="group flex items-center gap-6 py-6 md:py-8 transition-all hover:pl-4"
              >
                <span className="font-mono text-sm text-muted-foreground w-12 shrink-0">{String(m.number).padStart(2, "0")}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-eyebrow text-muted-foreground">{m.eyebrow}</div>
                  <div className="mt-1 font-display text-2xl md:text-4xl text-foreground group-hover:text-accent transition-colors">
                    {m.title}
                  </div>
                </div>
                {isMine && (
                  <span className="hidden md:inline-flex items-center gap-2 text-eyebrow text-accent">
                    <Sparkles className="h-3.5 w-3.5" /> Sua geração
                  </span>
                )}
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-2 transition-all" />
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
