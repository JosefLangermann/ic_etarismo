/**
 * AgeGate.tsx — Captura idade e calcula geração do usuário.
 * Aparece após o módulo "As Gerações". A geração resultante é
 * destacada no menu como "primeira sugestão" para o aluno.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { useHistory, generationToSlug } from "@/hooks/useHistory";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const labels: Record<string, string> = {
  boomers: "Baby Boomer",
  x: "Geração X",
  millennials: "Millennial",
  z: "Geração Z",
};

export function AgeGate() {
  const { setAgeAndGeneration, state } = useHistory();
  const [age, setAge] = useState<number | "">("");
  const [result, setResult] = useState<string | null>(state.generation ?? null);
  const navigate = useNavigate();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (typeof age !== "number" || age < 10 || age > 110) return;
    const gen = setAgeAndGeneration(age);
    if (gen) setResult(gen);
  }

  function goToMyGen() {
    if (!result) return;
    navigate(`/modulo/${generationToSlug[result as keyof typeof generationToSlug]}`);
  }

  return (
    <section className="relative my-16 overflow-hidden border border-border bg-card/40 p-8 md:p-14 rounded-sm">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl animate-float-slow" aria-hidden />
      <div className="relative">
        <div className="text-eyebrow text-accent mb-4 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5" /> Personalização
        </div>
        <h3 className="font-display text-3xl md:text-5xl text-foreground leading-tight max-w-xl">
          Qual a sua idade?
        </h3>
        <p className="mt-3 text-foreground/75 max-w-xl">
          Vamos identificar a SUA geração para você se reconhecer antes de estudar as outras. Sua idade fica salva apenas no seu dispositivo.
        </p>

        {!result ? (
          <form onSubmit={submit} className="mt-8 flex flex-wrap items-center gap-3">
            <input
              type="number" min={10} max={110} value={age}
              onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-32 border-b-2 border-accent bg-transparent px-2 py-2 font-display text-3xl text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="00" inputMode="numeric"
              aria-label="Sua idade"
            />
            <Button type="submit" disabled={typeof age !== "number" || age < 10}>Calcular minha geração</Button>
          </form>
        ) : (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <div className="text-eyebrow text-muted-foreground">Sua geração</div>
            <div className="mt-1 font-display text-cinema-sm text-accent">{labels[result]}</div>
            <Button onClick={goToMyGen} className="mt-6 gap-2">Estudar minha geração primeiro →</Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
