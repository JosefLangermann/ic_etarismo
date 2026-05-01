/**
 * QuizPage.tsx — Página de quiz de um módulo.
 */
import { useParams, Navigate, Link } from "react-router-dom";
import { moduleBySlug, MODULES } from "@/data/course";
import { Quiz } from "@/components/course/Quiz";
import { useTrackTime } from "@/hooks/useHistory";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Trophy } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function QuizPage() {
  const { slug = "" } = useParams();
  const mod = moduleBySlug(slug);
  useTrackTime(`modulo/${slug}/quiz`);

  if (!mod) return <Navigate to="/" replace />;

  const idx = MODULES.findIndex((m) => m.slug === slug);
  const next = MODULES[idx + 1];

  return (
    <main className={`${mod.theme} min-h-screen flex flex-col`}>
      <div className="flex-1 px-6 md:px-16 py-20">
        <div className="mb-12 max-w-2xl mx-auto">
          <Button asChild variant="ghost" size="sm" className="mb-6 gap-2"><Link to={`/modulo/${mod.slug}`}><ArrowLeft className="h-4 w-4" /> Voltar ao módulo</Link></Button>
          <div className="text-eyebrow text-accent">{mod.eyebrow} · Quiz</div>
          <h1 className="mt-3 font-display text-cinema-sm text-foreground">{mod.title}</h1>
        </div>

        <Quiz quizId={mod.id} questions={mod.quiz} title={`Quiz · ${mod.title}`} />

        <div className="mt-16 max-w-2xl mx-auto flex flex-wrap justify-end gap-3">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/mega-quiz"><Trophy className="h-4 w-4" /> Mega quiz</Link>
          </Button>
          {next ? (
            <Button asChild className="gap-2"><Link to={`/modulo/${next.slug}`}>Próximo módulo: {next.title} <ArrowRight className="h-4 w-4" /></Link></Button>
          ) : (
            <Button asChild className="gap-2"><Link to="/mega-quiz">Ir para o mega quiz <ArrowRight className="h-4 w-4" /></Link></Button>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
