/**
 * Footer.tsx — Rodapé global do curso.
 * --------------------------------------------------------------
 * NOTA ACADÊMICA:
 * Centralizar o rodapé num único componente garante consistência
 * e facilita atualizar créditos, links e contatos da pesquisa de IC.
 */
import { Link } from "react-router-dom";
import { BookOpen, Trophy, History, Home } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 border-t border-border bg-card/60">
      <div className="px-6 md:px-16 py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="text-eyebrow text-accent">Iniciação científica</div>
          <h3 className="mt-2 font-display text-2xl text-foreground leading-tight">
            Gerações na Indústria
          </h3>
          <p className="mt-3 text-sm text-foreground/70 max-w-md leading-relaxed">
            Protótipo de curso digital interativo sobre etarismo no chão de fábrica.
            Material desenvolvido em parceria entre engenharia de produção e
            engenharia de software.
          </p>
        </div>

        <nav>
          <div className="text-eyebrow text-muted-foreground mb-3">Navegar</div>
          <ul className="space-y-2 text-sm">
            <li><FooterLink to="/" icon={<Home className="h-3.5 w-3.5" />}>Início</FooterLink></li>
            <li><FooterLink to="/glossario" icon={<BookOpen className="h-3.5 w-3.5" />}>Glossário</FooterLink></li>
            <li><FooterLink to="/mega-quiz" icon={<Trophy className="h-3.5 w-3.5" />}>Mega quiz</FooterLink></li>
            <li><FooterLink to="/historico" icon={<History className="h-3.5 w-3.5" />}>Meu histórico</FooterLink></li>
          </ul>
        </nav>

        <div>
          <div className="text-eyebrow text-muted-foreground mb-3">Apoio</div>
          <p className="text-sm text-foreground/70 leading-relaxed">
            Dúvidas em algum termo? Consulte o{" "}
            <Link to="/glossario" className="text-accent hover:underline">glossário</Link>{" "}
            a qualquer momento durante a leitura.
          </p>
        </div>
      </div>

      <div className="border-t border-border px-6 md:px-16 py-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>© {year} · Projeto acadêmico de iniciação científica.</span>
        <span className="font-mono">Powered By Nature's Perversion (Ogirep) v1 · protótipo</span>
      </div>
    </footer>
  );
}

function FooterLink({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 text-foreground/75 hover:text-accent transition-colors"
    >
      <span className="text-accent/70 group-hover:text-accent transition-colors">{icon}</span>
      <span className="border-b border-transparent group-hover:border-accent transition-colors">{children}</span>
    </Link>
  );
}
