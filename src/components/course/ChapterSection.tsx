/**
 * ChapterSection.tsx — Renderiza um capítulo aplicando a variante visual.
 * --------------------------------------------------------------
 * NOTA ACADÊMICA:
 * Cada variante é uma "linguagem visual" diferente. Manter a lógica
 * num componente dedicado evita explosão de condicionais nas páginas
 * e permite que novas variantes sejam adicionadas isoladamente.
 *
 * Variantes:
 *  - editorial:  título grande à esquerda, blocos largos; bg opcional.
 *  - split:      duas colunas em md+, blocos alternados.
 *  - stack:      blocos centralizados em coluna estreita (leitura).
 *  - fullbleed:  primeira mídia full-bleed, demais blocos abaixo.
 *  - timeline:   índice numerado lateral + blocos.
 */
import type { Chapter } from "@/data/course";
import { BlockRenderer } from "./BlockRenderer";
import { MediaSlot } from "./MediaSlot";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTrackTime } from "@/hooks/useHistory";

interface Props { chapter: Chapter; moduleSlug: string; index: number }

export function ChapterSection({ chapter, moduleSlug, index }: Props) {
  // Tracking por capítulo (para o histórico mostrar tempo por capítulo).
  useTrackTime(`modulo/${moduleSlug}/${chapter.id}`);
  const variant = chapter.variant ?? "stack";

  return (
    <article
      id={chapter.id}
      className={cn(
        "relative scroll-mt-24",
        variant === "editorial" && "py-8",
      )}
    >
      {/* Background opcional do capítulo (full-bleed mesclado) */}
      {chapter.backgroundSlotId && (
        <MediaSlot slotId={chapter.backgroundSlotId} kind="image" layout="background" />
      )}

      {/* Cabeçalho do capítulo */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-8 max-w-4xl"
      >
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
          <div className="h-[2px] w-10 bg-accent" />
          <span className="text-eyebrow text-muted-foreground">{chapter.eyebrow ?? "Capítulo"}</span>
        </div>
        <h2 className="mt-3 font-display text-4xl md:text-6xl text-foreground leading-tight">
          {chapter.title}
        </h2>
      </motion.header>

      {/* Layout por variante */}
      {variant === "split" ? (
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-2 max-w-6xl">
          {chapter.blocks.map((b, i) => (
            <div key={i} className={cn(b.type === "mediaSlot" && "md:row-span-2")}>
              <BlockRenderer block={b} />
            </div>
          ))}
        </div>
      ) : variant === "timeline" ? (
        <div className="grid md:grid-cols-[120px_1fr] gap-8 max-w-5xl">
          <div aria-hidden className="hidden md:block sticky top-24 self-start">
            <div className="font-display text-[120px] leading-none text-accent/20">{String(index + 1).padStart(2, "0")}</div>
            <div className="mt-4 h-32 w-px bg-gradient-to-b from-accent/60 to-transparent ml-4" />
          </div>
          <div>
            {chapter.blocks.map((b, i) => <BlockRenderer key={i} block={b} />)}
          </div>
        </div>
      ) : variant === "fullbleed" ? (
        <div className="space-y-2">
          {chapter.blocks.map((b, i) => <BlockRenderer key={i} block={b} />)}
        </div>
      ) : variant === "editorial" ? (
        <div className="grid md:grid-cols-12 gap-8 max-w-6xl">
          <div className="md:col-span-8">
            {chapter.blocks.map((b, i) => <BlockRenderer key={i} block={b} />)}
          </div>
          <aside className="md:col-span-3 md:col-start-10 hidden md:block">
            <div className="sticky top-24">
              <div className="text-eyebrow text-muted-foreground">Capítulo</div>
              <div className="mt-2 font-display text-xl text-foreground/80 leading-snug">{chapter.title}</div>
              <div className="mt-4 rule-industrial w-12 opacity-60" />
            </div>
          </aside>
        </div>
      ) : (
        // stack
        <div className="max-w-2xl mx-auto">
          {chapter.blocks.map((b, i) => <BlockRenderer key={i} block={b} />)}
        </div>
      )}
    </article>
  );
}
