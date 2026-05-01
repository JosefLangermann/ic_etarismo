/**
 * mediaMap.ts — Tabela slotId → URL.
 * Quando o pesquisador quiser anexar uma imagem/vídeo/áudio,
 * basta adicionar uma entrada aqui. Nenhum componente precisa mudar.
 *
 * Ex.: import bg from "@/assets/img/mod1-cap1.jpg";
 *      export const mediaMap = { "mod1-cap1-bg": bg, ... };
 */
export const mediaMap: Record<string, string> = {
  "mod1-cap1-img1": "/images/equipe.jpg",
  "mod1-cap2-img1": "/images/maquina.jpg",
  "mod2-cap1-img1": "/images/idade.jpg",
  "mod2-cap2-img1": "/images/descaso.jpg",
  "mod3-cap1-img1": "/images/geracao.jpg",
  "mod-4-cap1-img1": "/images/bb.webp",
  "mod-5-cap1-img1": "/images/x.jpg",
  "mod-6-cap1-img1": "/images/m.jpeg",
  "mod-7-cap1-img1": "/images/z.png",
  "mod8-cap1-img1": "/images/comunicacao.webp",
  "mod9-cap1-img1": "/images/boaspraticas1.png",
};
