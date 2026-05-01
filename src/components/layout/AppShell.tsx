/**
 * AppShell.tsx — Casca da aplicação: sidebar de navegação retrátil + área de conteúdo.
 * --------------------------------------------------------------
 * NOTA ACADÊMICA:
 * Padrão "shell + outlet" do react-router. A sidebar agora é
 * RETRÁTIL em qualquer dispositivo:
 *  - Desktop: colapsa para uma faixa estreita só com ícones (mini rail).
 *  - Mobile : abre/fecha como gaveta sobre o conteúdo.
 * O estado é persistido em localStorage para respeitar a preferência
 * do usuário (importante para idosos que costumam manter a UI estável).
 */
import { NavLink, Outlet, useLocation, useNavigate, matchPath } from "react-router-dom";
import { MODULES } from "@/data/course";
import { useHistory, generationToSlug } from "@/hooks/useHistory";
import {
  Home, History, Trophy, Sparkles, Menu, X,
  BookOpen, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useEffect, useState, MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavConfirm } from "@/components/course/NavConfirmLink";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, BookOpenCheck } from "lucide-react";

const STORAGE_KEY = "ic-sidebar-collapsed";

export function AppShell() {
  const { state } = useHistory();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });
  const location = useLocation();
  const navigate = useNavigate();
  const myGenSlug = state.generation ? generationToSlug[state.generation] : null;

  // Detecta se estamos dentro de algum módulo (rota /modulo/:slug ou /modulo/:slug/quiz).
  // Quando há um slug atual, qualquer salto para OUTRO módulo passa pelo diálogo de confirmação.
  const moduleMatch = matchPath("/modulo/:slug/*", location.pathname) || matchPath("/modulo/:slug", location.pathname);
  const currentSlug = (moduleMatch?.params as { slug?: string } | undefined)?.slug ?? null;

  const { pending, request, clear, go } = useNavConfirm(currentSlug);

  /**
   * Intercepta cliques em links de navegação. Se o usuário está em um
   * módulo e tenta sair (para outro módulo, mega-quiz ou início),
   * abrimos o diálogo. Caso contrário, navegação livre.
   */
  function intercept(to: string, e: MouseEvent) {
    if (!currentSlug) return; // sem proteção fora de módulos
    // Permite navegar dentro do MESMO módulo (ex: capítulo → quiz)
    if (to === `/modulo/${currentSlug}` || to.startsWith(`/modulo/${currentSlug}/`)) return;
    e.preventDefault();
    // Direção: forward se for um módulo de número maior, backward se menor, jump caso contrário
    const currentNum = MODULES.find((m) => m.slug === currentSlug)?.number ?? 0;
    const targetMatch = to.match(/^\/modulo\/([^/]+)/);
    let dir: "forward" | "backward" | "jump" = "jump";
    if (targetMatch) {
      const targetNum = MODULES.find((m) => m.slug === targetMatch[1])?.number ?? 0;
      dir = targetNum > currentNum ? "forward" : targetNum < currentNum ? "backward" : "jump";
    }
    request(to, dir);
  }

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  // Fecha gaveta mobile ao navegar
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="relative min-h-screen flex w-full bg-background text-foreground">
        {/* Botão hambúrguer mobile */}
        <button
          type="button"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden fixed top-4 left-4 z-50 grid h-11 w-11 place-items-center bg-card border border-border rounded-sm shadow-lg"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed md:sticky top-0 left-0 z-40 h-screen shrink-0 border-r border-border bg-card/85 backdrop-blur transition-[width,transform] duration-300 ease-out",
            collapsed ? "md:w-16" : "md:w-72",
            "w-72",
            mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          )}
        >
          {/* Botão de retrair (desktop) */}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expandir menu" : "Retrair menu"}
            className="hidden md:grid absolute -right-3 top-8 z-10 h-6 w-6 place-items-center bg-background border border-border rounded-full hover:border-accent hover:text-accent transition-colors"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>

          <div className={cn("flex h-full flex-col overflow-y-auto", collapsed ? "px-2 py-6" : "p-6")}>
            <NavLink to="/" className="block group">
              {collapsed ? (
                <div className="grid h-10 w-10 mx-auto place-items-center bg-accent text-accent-foreground font-display text-lg rounded-sm">G</div>
              ) : (
                <>
                  <div className="text-eyebrow text-accent">Curso interativo</div>
                  <h1 className="font-display text-2xl leading-tight mt-1 text-foreground group-hover:text-accent transition-colors">
                    Gerações na<br />Indústria
                  </h1>
                  <div className="mt-3 rule-industrial w-12 opacity-70" />
                </>
              )}
            </NavLink>

            <nav className="mt-8 flex-1">
              {!collapsed && <div className="text-eyebrow text-muted-foreground mb-3">Módulos</div>}
              <ul className="space-y-1">
                {MODULES.map((m) => {
                  const isMine = myGenSlug === m.slug;
                  const active = location.pathname.startsWith(`/modulo/${m.slug}`);
                  const to = `/modulo/${m.slug}`;
                  const link = (
                    <NavLink
                      to={to}
                      onClick={(e) => intercept(to, e)}
                      className={cn(
                        "group flex items-baseline gap-3 px-2 py-2 border-l-2 transition-all",
                        active
                          ? "border-accent bg-accent/5 text-foreground"
                          : "border-transparent text-foreground/70 hover:text-foreground hover:border-accent/50 hover:bg-accent/5",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <span className="font-mono text-[11px] text-muted-foreground w-6 shrink-0 text-center">
                        {String(m.number).padStart(2, "0")}
                      </span>
                      {!collapsed && (
                        <>
                          <span className="font-display text-base leading-tight flex-1">{m.title}</span>
                          {isMine && <Sparkles className="h-3.5 w-3.5 text-accent shrink-0" aria-label="Sua geração" />}
                        </>
                      )}
                    </NavLink>
                  );
                  return (
                    <li key={m.id}>
                      {collapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{link}</TooltipTrigger>
                          <TooltipContent side="right">{m.title}{isMine && " · sua geração"}</TooltipContent>
                        </Tooltip>
                      ) : link}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className={cn("mt-6 space-y-1 border-t border-border pt-4", collapsed && "px-0")}>
              <ShellLink to="/glossario" icon={<BookOpen className="h-4 w-4" />} label="Glossário" collapsed={collapsed} onClick={intercept} />
              <ShellLink to="/mega-quiz" icon={<Trophy className="h-4 w-4" />} label="Mega quiz final" collapsed={collapsed} onClick={intercept} />
              <ShellLink to="/historico" icon={<History className="h-4 w-4" />} label="Meu histórico" collapsed={collapsed} onClick={intercept} />
              <ShellLink to="/" icon={<Home className="h-4 w-4" />} label="Início" collapsed={collapsed} exact onClick={intercept} />
            </div>
          </div>
        </aside>

        {/* Backdrop mobile */}
        {mobileOpen && (
          <div
            className="md:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>

      {/* Diálogo global de confirmação ao sair de um módulo via sidebar */}
      <NavConfirmDialog
        open={!!pending}
        currentSlug={currentSlug}
        direction={pending?.direction ?? "jump"}
        onClose={clear}
        onConfirm={go}
      />
    </TooltipProvider>
  );
}

/**
 * Diálogo controlado (sem trigger) usado quando a navegação é
 * iniciada programaticamente — caso típico de cliques na sidebar.
 */
function NavConfirmDialog({
  open, currentSlug, direction, onClose, onConfirm,
}: {
  open: boolean;
  currentSlug: string | null;
  direction: "forward" | "backward" | "jump";
  onClose: () => void;
  onConfirm: () => void;
}) {
  const progress = useModuleProgress(currentSlug ?? "");
  if (!currentSlug) return null;

  const title =
    direction === "forward" ? "Avançar para o próximo módulo?"
    : direction === "backward" ? "Voltar ao módulo anterior?"
    : "Sair deste módulo?";
  const Icon = direction === "backward" ? ArrowLeft : direction === "jump" ? BookOpenCheck : ArrowRight;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
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

        <div className="grid grid-cols-3 gap-3 text-center border-y border-border py-3">
          <div>
            <div className="text-eyebrow text-muted-foreground">Leitura</div>
            <div className="font-mono text-sm text-foreground mt-1">
              {progress.timeMs < 60_000 ? `${Math.round(progress.timeMs / 1000)}s` : `${Math.round(progress.timeMs / 60_000)} min`}
            </div>
          </div>
          <div>
            <div className="text-eyebrow text-muted-foreground">Quiz</div>
            <div className="font-mono text-sm text-foreground mt-1">{progress.quizDone ? "Feito" : "Pendente"}</div>
          </div>
          <div>
            <div className="text-eyebrow text-muted-foreground">Acertos</div>
            <div className="font-mono text-sm text-foreground mt-1">
              {progress.accuracy === null ? "—" : `${Math.round(progress.accuracy * 100)}%`}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose}>
            {progress.level === "low" ? "Vou revisar" : "Ficar aqui"}
          </Button>
          <Button onClick={onConfirm} className="gap-2">
            {direction === "backward" ? "Voltar mesmo assim" : "Sair mesmo assim"}
            <Icon className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ShellLink({
  to, icon, label, collapsed, exact, onClick,
}: {
  to: string; icon: React.ReactNode; label: string; collapsed: boolean; exact?: boolean;
  onClick?: (to: string, e: MouseEvent) => void;
}) {
  const link = (
    <NavLink
      to={to}
      end={exact}
      onClick={onClick ? (e) => onClick(to, e) : undefined}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-2 py-2 text-sm transition-colors hover:text-accent",
          isActive ? "text-accent" : "text-foreground/80",
          collapsed && "justify-center px-0",
        )
      }
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
