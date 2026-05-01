/**
 * BlockRenderer.tsx — Renderiza um Block do conteúdo do curso.
 * Mantém JSX centralizado, permitindo evoluir layout sem mexer em dados.
 */
import type { Block } from "@/data/course";
import { MediaSlot } from "./MediaSlot";
import { motion, type Variants } from "framer-motion";
import { Info, AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

// `as const` garante que o array seja inferido como tupla cubic-bezier (Easing).
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.6, ease: EASE },
};

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      const Tag = (`h${block.level ?? 2}`) as "h1" | "h2" | "h3";
      return (
        <motion.div {...fadeUp}>
          <Tag
            className={cn(
              "font-display font-bold text-foreground mt-12 mb-4 group/heading leading-[0.95] tracking-tight transition-colors duration-300 hover:text-accent",
              block.level === 1 && "text-cinema",
              (!block.level || block.level === 2) && "text-fluid-h2",
              block.level === 3 && "text-fluid-h3",
            )}
          >
            {/* Pequeno traço de acento à esquerda — reforça hierarquia visual */}
            <span className="inline-block align-middle h-[0.6em] w-1 bg-accent mr-3 -translate-y-1 transition-all duration-300 group-hover/heading:w-4 group-hover/heading:h-[0.7em]" />
            {block.text}
          </Tag>
        </motion.div>
      );
    }
    case "lead":
      return (
        <motion.p
          {...fadeUp}
          className="font-display text-fluid-lead leading-[1.05] text-foreground max-w-3xl my-6 md:my-8 transition-colors duration-300 hover:text-accent/95"
        >
          {/* Lead ganha destaque com aspas coloridas */}
          <span className="text-accent">“</span>
          {block.text}
          <span className="text-accent">”</span>
        </motion.p>
      );
    case "paragraph":
      return (
        <motion.p
          {...fadeUp}
          className="text-fluid-body leading-[1.7] text-foreground/80 max-w-2xl my-4 md:my-5 transition-colors duration-300 hover:text-foreground"
        >
          {block.text}
        </motion.p>
      );
    case "pullQuote":
      return (
        <motion.blockquote
          {...fadeUp}
          className="my-12 md:my-16 border-l-4 border-accent pl-6 md:pl-10 transition-all duration-500 hover:border-l-[8px] hover:pl-7 md:hover:pl-12"
        >
          <p className="font-display text-fluid-quote leading-[1.02] text-foreground italic transition-colors duration-300 hover:text-accent">
            “{block.text}”
          </p>
          {block.cite && <cite className="mt-4 block font-mono text-xs md:text-sm uppercase tracking-widest text-accent/80">— {block.cite}</cite>}
        </motion.blockquote>
      );
    case "list":
      return (
        <motion.div {...fadeUp} className="my-6 md:my-8 max-w-2xl">
          {block.ordered ? (
            <ol className="space-y-4">
              {block.items.map((it, i) => (
                <li
                  key={i}
                  className="group flex gap-4 text-fluid-body leading-[1.6] text-foreground/80 transition-colors duration-300 hover:text-foreground"
                >
                  <span className="font-display text-3xl md:text-4xl text-accent leading-none mt-0.5 transition-all duration-300 group-hover:scale-110 group-hover:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{it}</span>
                </li>
              ))}
            </ol>
          ) : (
            <ul className="space-y-4">
              {block.items.map((it, i) => (
                <li
                  key={i}
                  className="group flex gap-3 text-fluid-body leading-[1.6] text-foreground/80 transition-colors duration-300 hover:text-foreground"
                >
                  <span className="mt-[0.7em] h-[2px] w-4 shrink-0 bg-accent transition-all duration-300 group-hover:w-8 group-hover:h-[3px]" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      );
    case "callout": {
      const Icon = block.tone === "warn" ? AlertTriangle : block.tone === "tip" ? Lightbulb : Info;
      return (
        <motion.aside {...fadeUp} className={cn(
          "my-8 border-l-2 p-5 md:p-6 rounded-sm bg-card/60 backdrop-blur",
          block.tone === "warn" && "border-destructive",
          block.tone === "tip" && "border-accent",
          block.tone === "info" && "border-steel-2",
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Icon className={cn("h-4 w-4", block.tone === "warn" ? "text-destructive" : block.tone === "tip" ? "text-accent" : "text-muted-foreground")} />
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-foreground/90">{block.title}</h4>
          </div>
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed">{block.text}</p>
        </motion.aside>
      );
    }
    case "mediaSlot":
      return <MediaSlot slotId={block.slotId} kind={block.kind} layout={block.layout} aspect={block.aspect} caption={block.caption} />;
    case "divider":
      return <div className="my-12 rule-industrial opacity-50" />;
  }
}
