/**
 * ScrollToTop.tsx
 * --------------------------------------------------------------
 * NOTA ACADÊMICA:
 * Em SPAs (Single Page Applications) com react-router, a troca de
 * rota NÃO reseta a posição de scroll do navegador — diferente de
 * navegações tradicionais. Isso prejudica a leitura, pois o usuário
 * inicia o novo conteúdo no meio da página. Aqui forçamos o scroll
 * ao topo a cada mudança de `pathname`, respeitando `prefers-reduced-motion`.
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // Tenta scrollar no #root ao invés do window
    const root = document.getElementById("root");
    if (root) {
      root.scrollTo({ top: 0, left: 0, behavior: reduce ? "auto" : "smooth" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: reduce ? "auto" : "smooth" });
    }
  }, [pathname]);

  return null;
}
