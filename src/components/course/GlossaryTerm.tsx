/**
 * GlossaryTerm.tsx — Inline term with tooltip and link to glossary.
 * --------------------------------------------------------------
 * NOTA ACADÊMICA:
 * Componente didático que destaca um termo no texto corrido,
 * exibe definição curta em tooltip e leva o usuário ao glossário
 * completo. Reforça o letramento entre gerações.
 */
import { Link } from "react-router-dom";
import { findEntry } from "@/data/glossary";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BookOpen } from "lucide-react";

interface Props {
  term: string;            // id ou termo do glossário
  children?: React.ReactNode; // texto exibido (default = entry.term)
}

export function GlossaryTerm({ term, children }: Props) {
  const entry = findEntry(term);
  if (!entry) return <span>{children ?? term}</span>;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={`/glossario#${entry.id}`}
            className="group inline-flex items-baseline gap-0.5 border-b border-dashed border-accent/60 text-accent hover:text-accent hover:border-accent transition-colors"
          >
            <span>{children ?? entry.term}</span>
            <BookOpen className="h-3 w-3 translate-y-0.5 opacity-60 group-hover:opacity-100" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="text-eyebrow text-accent mb-1">Glossário</div>
          <div className="font-display text-base">{entry.term}</div>
          <p className="text-xs text-foreground/80 mt-1">{entry.short}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
