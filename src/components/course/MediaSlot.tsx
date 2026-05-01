/**
 * MediaSlot.tsx — Espaço reservado para mídia (imagem, vídeo, áudio).
 * --------------------------------------------------------------
 * NOTA ACADÊMICA:
 * Permite que o pesquisador insira mídias depois SEM tocar no
 * código de conteúdo. Cada slot é identificado por `slotId` e
 * pode receber `src` posteriormente via `mediaMap` (ver mediaMap.ts).
 *
 * Layouts suportados:
 *  - inline:     mídia dentro do fluxo, com aspect ratio.
 *  - full:       full-bleed, atravessa toda a largura da tela.
 *  - background: usado como BG mesclado com o tema (mix-blend).
 */

import { mediaMap } from "@/data/mediaMap";
import { Image as ImageIcon, Film, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  slotId: string;
  kind: "image" | "video" | "audio";
  layout?: "inline" | "full" | "background";
  aspect?: string; // ex "16/9"
  caption?: string;
  className?: string;
}

export function MediaSlot({ slotId, kind, layout = "inline", aspect = "16/9", caption, className }: Props) {
  // mediaMap entrega URL real quando o pesquisador anexar a mídia.
  const src = mediaMap[slotId] ?? undefined;

  if (layout === "background") {
    // Camada de fundo, mesclada com o tema. Não ocupa espaço no fluxo.
    return (
      <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover blend-cinema mask-vignette" />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,hsl(var(--accent)/0.15),transparent_70%)]" />
        )}
        <div className="absolute inset-0 bg-[var(--grad-vignette)]" />
      </div>
    );
  }

  const Wrapper: React.ElementType = "figure";
  return (
    <Wrapper
      className={cn(
        layout === "full" ? "relative w-screen left-1/2 -translate-x-1/2" : "relative",
        "my-8 group",
        className,
      )}
    >
      <div
        className="relative overflow-hidden rounded-sm border border-border/60 bg-card"
        style={{ aspectRatio: aspect }}
      >
        {src ? (
          kind === "image" ? (
            <img src={src} alt={caption || ""} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
          ) : kind === "video" ? (
            <video src={src} controls className="h-full w-full object-cover" preload="metadata" />
          ) : (
            <audio src={src} controls className="absolute bottom-4 left-4 right-4" />
          )
        ) : (
          // Placeholder didático — facilita ao pesquisador identificar onde colocar a mídia.
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,hsl(var(--card))_0%,hsl(var(--secondary))_100%)] text-muted-foreground">
            {kind === "image" ? <ImageIcon className="h-10 w-10 opacity-50" /> : kind === "video" ? <Film className="h-10 w-10 opacity-50" /> : <Music className="h-10 w-10 opacity-50" />}
            <div className="text-center px-6">
              <div className="font-mono text-[11px] uppercase tracking-widest opacity-70">slot · {kind}</div>
              <div className="mt-1 font-mono text-xs">{slotId}</div>
              {caption && <div className="mt-3 max-w-md text-xs italic opacity-80">{caption}</div>}
            </div>
            {/* Linha decorativa industrial */}
            <div className="rule-industrial absolute bottom-0 left-0 right-0 opacity-60" />
          </div>
        )}
      </div>
      {caption && src && (
        <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{caption}</figcaption>
      )}
    </Wrapper>
  );
}
