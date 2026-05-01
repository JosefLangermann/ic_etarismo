/**
 * GlossaryPage.tsx — Página completa do glossário.
 * Lista termos com filtro por categoria e busca textual.
 */
import { useMemo, useState } from "react";
import { GLOSSARY, TAG_LABEL, type GlossaryTag } from "@/data/glossary";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, BookOpen } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const TAG_COLOR: Record<GlossaryTag, string> = {
  etarismo: "border-destructive/50 text-destructive",
  geracao: "border-accent/60 text-accent",
  industria: "border-foreground/30 text-foreground/80",
  tecnologia: "border-accent/60 text-accent",
  social: "border-foreground/30 text-foreground/80",
};

export default function GlossaryPage() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<GlossaryTag | "all">("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GLOSSARY.filter((e) => {
      if (tag !== "all" && e.tag !== tag) return false;
      if (!needle) return true;
      return (
        e.term.toLowerCase().includes(needle) ||
        e.short.toLowerCase().includes(needle) ||
        e.aliases?.some((a) => a.toLowerCase().includes(needle))
      );
    }).sort((a, b) => a.term.localeCompare(b.term, "pt-BR"));
  }, [q, tag]);

  return (
    <main className="theme-mod-1 relative min-h-screen flex flex-col">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.12),transparent_60%)]" />
        <div className="noise absolute inset-0" />
      </div>

      <section className="px-6 md:px-16 pt-24 md:pt-28 pb-10 flex-1">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-eyebrow text-accent flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5" /> Apoio à leitura
          </div>
          <h1 className="mt-4 font-display text-cinema text-foreground">Glossário.</h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/75 leading-relaxed">
            Termos técnicos da indústria, conceitos de etarismo e expressões usadas no curso. Disponível em qualquer momento — basta procurar pelo ícone de livro.
          </p>
        </motion.div>

        {/* Busca + filtros */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar termo…"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterChip label="Todos" active={tag === "all"} onClick={() => setTag("all")} />
            {(Object.keys(TAG_LABEL) as GlossaryTag[]).map((t) => (
              <FilterChip key={t} label={TAG_LABEL[t]} active={tag === t} onClick={() => setTag(t)} />
            ))}
          </div>
        </div>

        {/* Lista */}
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e, i) => (
            <motion.article
              key={e.id}
              id={e.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              className="group border border-border bg-card/40 p-5 rounded-sm hover:border-accent hover:bg-card transition-all hover-lift scroll-mt-24"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={cn("text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 border rounded-sm", TAG_COLOR[e.tag])}>
                  {TAG_LABEL[e.tag]}
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl text-foreground group-hover:text-accent transition-colors">{e.term}</h2>
              <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{e.short}</p>
              {e.long && <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{e.long}</p>}
            </motion.article>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-muted-foreground">Nenhum termo encontrado.</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="h-8 text-xs"
    >
      {label}
    </Button>
  );
}
