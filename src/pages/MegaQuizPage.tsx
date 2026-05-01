/**
 * MegaQuizPage.tsx — Avaliação final, 30 questões.
 */
import { Link } from "react-router-dom";
import { MEGA_QUIZ } from "@/data/course";
import { Quiz } from "@/components/course/Quiz";
import { useTrackTime } from "@/hooks/useHistory";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function MegaQuizPage() {
  useTrackTime("mega-quiz");
  return (
    <main className="theme-mod-1 min-h-screen flex flex-col">
      <div className="flex-1 px-6 md:px-16 py-20">
        <div className="mb-12 max-w-2xl mx-auto">
          <Button asChild variant="ghost" size="sm" className="mb-6 gap-2"><Link to="/"><ArrowLeft className="h-4 w-4" /> Início</Link></Button>
          <div className="flex items-center gap-2 text-eyebrow text-accent">
            <Trophy className="h-3.5 w-3.5" /> Avaliação final
          </div>
          <h1 className="mt-3 font-display text-cinema-sm text-foreground">Mega quiz · 30 questões</h1>
          <p className="mt-3 text-foreground/75">Cobertura de todos os módulos. Reserve cerca de 15–20 minutos.</p>
        </div>
        <Quiz quizId="mega" questions={MEGA_QUIZ} />
      </div>
      <Footer />
    </main>
  );
}
