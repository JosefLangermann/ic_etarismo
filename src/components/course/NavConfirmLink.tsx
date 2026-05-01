/**
 * NavConfirmLink.tsx
 * --------------------------------------------------------------
 * NOTA ACADÊMICA:
 * Wrapper de navegação que abre um diálogo de confirmação ANTES
 * de sair do módulo atual. Não bloqueia o usuário — apenas o
 * convida a refletir, exibindo uma mensagem contextual gerada
 * por `useModuleProgress` (que considera tempo de leitura, se o
 * quiz foi feito e a pontuação obtida).
 *
 * Uso:
 *   <NavConfirmLink currentSlug="introducao" to="/modulo/geracoes"
 *                   direction="forward">
 *     Avançar
 *   </NavConfirmLink>
 *
 * Pode envolver um <Button asChild> ou conteúdo arbitrário via
 * `asChild`. Compatível com botões de avançar/recuar e com a
 * sidebar (qualquer link que tire o usuário do módulo atual).
 */
import { ReactNode, useState, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { ArrowRight, ArrowLeft, BookOpenCheck } from "lucide-react";

interface Props {
  /** Slug do módulo de ORIGEM — base para avaliar engajamento. */
  currentSlug: string;
  /** Direção da navegação (afeta título e ícone do diálogo). */
  direction: "forward" | "backward" | "jump";
  /** Função que executa a navegação real após confirmação. */
  onConfirm: () => void;
  children: ReactNode;
  /** Renderiza como wrapper transparente (recebe onClick em filho). */
  trigger: ReactNode;
}

export function NavConfirm({ currentSlug, direction, onConfirm, trigger }: Omit<Props, "children">) {
  const [open, setOpen] = useState(false);
  const progress = useModuleProgress(currentSlug);

  function handleTriggerClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  }

  function confirm() {
    setOpen(false);
    // Pequeno delay para a animação de fechar não competir com a navegação.
    setTimeout(onConfirm, 60);
  }

  const title =
    direction === "forward" ? "Avançar para o próximo módulo?"
    : direction === "backward" ? "Voltar ao módulo anterior?"
    : "Trocar de módulo?";

  const Icon = direction === "backward" ? ArrowLeft : direction === "jump" ? BookOpenCheck : ArrowRight;

  return (
    <>
      <span onClickCapture={handleTriggerClick} className="contents">
        {trigger}
      </span>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-accent/40">
          <DialogHeader>
            <div className="flex items-center gap-2 text-eyebrow text-accent">
              <Icon className="h-3.5 w-3.5" />
              {progress.level === "low" ? "Um momento" : "Confirmação"}
            </div>
            <DialogTitle className="font-display text-2xl">{title}</DialogTitle>
            <DialogDescription className="text-foreground/80 text-base leading-relaxed pt-2">
              {progress.message}
            </DialogDescription>
          </DialogHeader>

          {/* Mini-resumo de progresso */}
          <div className="grid grid-cols-3 gap-3 text-center border-y border-border py-3">
            <ProgressStat label="Leitura" value={formatMinutes(progress.timeMs)} />
            <ProgressStat label="Quiz" value={progress.quizDone ? "Feito" : "Pendente"} />
            <ProgressStat
              label="Acertos"
              value={progress.accuracy === null ? "—" : `${Math.round(progress.accuracy * 100)}%`}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {progress.level === "low" ? "Vou revisar" : "Ficar aqui"}
            </Button>
            <Button onClick={confirm} className="gap-2">
              {direction === "backward" ? "Voltar mesmo assim" : "Avançar mesmo assim"}
              <Icon className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProgressStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-eyebrow text-muted-foreground">{label}</div>
      <div className="font-mono text-sm text-foreground mt-1">{value}</div>
    </div>
  );
}

function formatMinutes(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  return `${Math.round(ms / 60_000)} min`;
}

/**
 * Hook utilitário: dispara o diálogo programaticamente.
 * Útil para interceptar cliques em links da sidebar sem precisar
 * envolver cada NavLink com JSX adicional.
 */
export function useNavConfirm(currentSlug: string | null) {
  const navigate = useNavigate();
  const [pending, setPending] = useState<{ to: string; direction: "forward" | "backward" | "jump" } | null>(null);

  function request(to: string, direction: "forward" | "backward" | "jump" = "jump") {
    if (!currentSlug) {
      navigate(to);
      return;
    }
    setPending({ to, direction });
  }

  function clear() { setPending(null); }
  function go() {
    if (!pending) return;
    const to = pending.to;
    setPending(null);
    setTimeout(() => navigate(to), 60);
  }

  return { pending, request, clear, go };
}
