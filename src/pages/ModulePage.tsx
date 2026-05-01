/**
 * ModulePage.tsx — Página de um módulo.
 * Renderiza intro + todos os capítulos em sequência (cada um com
 * variante visual própria) + AgeGate (no módulo 3) + CTA pro quiz.
 */
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { moduleBySlug, MODULES } from "@/data/course";
import { useTrackTime } from "@/hooks/useHistory";
import { ChapterSection } from "@/components/course/ChapterSection";
import { AgeGate } from "@/components/course/AgeGate";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ClipboardCheck, BookOpen, Trophy } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { NavConfirm } from "@/components/course/NavConfirmLink";
import { useNavigate } from "react-router-dom";

export default function ModulePage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const mod = moduleBySlug(slug);
  // Hook deve ser sempre chamado; se módulo inválido renderiza Navigate depois.
  useTrackTime(`modulo/${slug}`);

  if (!mod) return <Navigate to="/" replace />;

  const idx = MODULES.findIndex((m) => m.slug === slug);
  const prev = MODULES[idx - 1];
  const next = MODULES[idx + 1];

  return (
    <main className={`${mod.theme} relative min-h-screen`}>
      {/* HERO do módulo */}
      <section className="relative overflow-hidden border-b border-border px-6 md:px-16 pt-24 md:pt-32 pb-20">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--accent)/0.2),transparent_60%)]" />
        <div aria-hidden className="absolute inset-0 -z-10 noise" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="text-eyebrow text-accent">{mod.eyebrow}</div>
          <h1 className="mt-4 font-display text-cinema text-foreground max-w-4xl">{mod.title}</h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-foreground/75 leading-relaxed">{mod.intro}</p>
        </motion.div>
        {/* Número gigante decorativo */}
        <div aria-hidden className="pointer-events-none select-none absolute -right-6 -bottom-16 md:-bottom-24 font-display text-[180px] md:text-[320px] leading-none text-accent/5">
          {String(mod.number).padStart(2, "0")}
        </div>
      </section>

      {/* Capítulos */}
      <div className="px-6 md:px-16 py-16 space-y-24">
        {mod.chapters.map((ch, i) => (
          <ChapterSection key={ch.id} chapter={ch} moduleSlug={mod.slug} index={i} />
        ))}

        {/* Age gate no módulo das gerações */}
        {mod.slug === "geracoes" && <AgeGate />}

        {/* Lembrete do glossário — reforça o apoio entre gerações */}
        <aside className="flex flex-col md:flex-row items-start md:items-center gap-4 border border-accent/30 bg-card/30 p-5 rounded-sm hover:border-accent transition-colors">
          <BookOpen className="h-6 w-6 text-accent shrink-0" />
          <div className="flex-1">
            <div className="text-eyebrow text-accent">Tem alguma palavra estranha?</div>
            <p className="mt-1 text-sm md:text-base text-foreground/80">
              Termos técnicos, gírias e siglas estão explicados no glossário do curso. Disponível a qualquer momento.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/glossario"><BookOpen className="h-4 w-4" /> Abrir glossário</Link>
          </Button>
        </aside>

        {/* CTA do quiz */}
        <section className="border border-accent/30 bg-card/40 p-8 md:p-12 rounded-sm">
          <div className="text-eyebrow text-accent">Fixação</div>
          <h2 className="mt-2 font-display text-3xl md:text-5xl text-foreground">Quiz do módulo · 5 questões</h2>
          <p className="mt-3 max-w-xl text-foreground/75">Teste o que ficou. Suas respostas e tempo são salvos no seu histórico.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to={`/modulo/${mod.slug}/quiz`}><ClipboardCheck className="h-4 w-4" /> Fazer o quiz</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/mega-quiz"><Trophy className="h-4 w-4" /> Pular para o mega quiz</Link>
            </Button>
          </div>
        </section>

        {/* Navegação inferior — com confirmação contextual */}
        <nav className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-10">
          {prev ? (
            <NavConfirm
              currentSlug={mod.slug}
              direction="backward"
              onConfirm={() => navigate(`/modulo/${prev.slug}`)}
              trigger={
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> {prev.title}
                </Button>
              }
            />
          ) : <span />}
          {next ? (
            <NavConfirm
              currentSlug={mod.slug}
              direction="forward"
              onConfirm={() => navigate(`/modulo/${next.slug}`)}
              trigger={
                <Button className="gap-2">
                  {next.title} <ArrowRight className="h-4 w-4" />
                </Button>
              }
            />
          ) : (
            <NavConfirm
              currentSlug={mod.slug}
              direction="forward"
              onConfirm={() => navigate("/mega-quiz")}
              trigger={
                <Button className="gap-2">
                  Mega quiz final <ArrowRight className="h-4 w-4" />
                </Button>
              }
            />
          )}
        </nav>
      </div>

      <Footer />
    </main>
  );
}
