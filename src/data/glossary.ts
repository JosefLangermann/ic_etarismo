/**
 * glossary.ts — Glossário de termos do curso.
 * --------------------------------------------------------------
 * NOTA ACADÊMICA:
 * Concentramos aqui termos técnicos, gírias e conceitos relacionados
 * ao etarismo e ao chão de fábrica. A ideia é dupla:
 *  - apoiar pessoas mais velhas frente a jargões digitais/novos;
 *  - apoiar pessoas mais jovens frente a termos técnicos da indústria.
 *
 * Cada termo tem um "tag" (categoria) usado para filtrar/colorir.
 * O componente <GlossaryTerm> permite citar um termo dentro do texto
 * com tooltip + link para o glossário completo.
 */
export type GlossaryTag = "etarismo" | "geracao" | "industria" | "tecnologia" | "social";

export interface GlossaryEntry {
  id: string;          // chave estável (kebab-case)
  term: string;        // palavra/expressão exibida
  short: string;       // definição curta (tooltip)
  long?: string;       // definição estendida (página do glossário)
  tag: GlossaryTag;
  aliases?: string[];  // sinônimos para busca
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: "etarismo",
    term: "Etarismo",
    short: "Preconceito ou discriminação contra alguém em razão da idade.",
    long: "Também chamado de ageísmo (ageism), é o preconceito baseado na idade. Pode atingir tanto pessoas mais velhas quanto mais jovens, e na indústria aparece em escalas, promoções, treinamentos e na divisão de tarefas.",
    tag: "etarismo",
    aliases: ["ageísmo", "ageism", "idadismo"],
  },
  {
    id: "geracao",
    term: "Geração",
    short: "Grupo de pessoas nascidas em um mesmo intervalo de tempo, marcadas por contextos históricos comuns.",
    long: "É um recorte sociológico, não uma regra rígida. As datas variam entre autores, mas costumam ser: Boomers (1946–1964), Geração X (1965–1980), Millennials (1981–1996) e Geração Z (1997–2012).",
    tag: "geracao",
  },
  {
    id: "boomers",
    term: "Boomers",
    short: "Geração nascida no pós-Segunda Guerra (1946–1964).",
    long: "Cresceram no boom industrial e veem o trabalho como espaço de estabilidade e identidade. Hoje são a base de conhecimento técnico em muitas fábricas.",
    tag: "geracao",
    aliases: ["baby boomers"],
  },
  {
    id: "gen-x",
    term: "Geração X",
    short: "Nascidos entre 1965 e 1980. Ponte entre o analógico e o digital.",
    long: "Viveram a transição do trabalho mecânico para o informatizado. Costumam ocupar cargos de média gerência e fazem a tradução entre Boomers e Millennials.",
    tag: "geracao",
  },
  {
    id: "millennials",
    term: "Millennials",
    short: "Nascidos entre 1981 e 1996. Primeira geração nativa da internet.",
    long: "Também chamados de Geração Y. Valorizam propósito, feedback frequente e flexibilidade.",
    tag: "geracao",
    aliases: ["geração y"],
  },
  {
    id: "gen-z",
    term: "Geração Z",
    short: "Nascidos entre 1997 e 2012. Crescidos com smartphones e redes sociais.",
    long: "Aprendem por vídeo curto, esperam interfaces simples e tendem a questionar hierarquias rígidas.",
    tag: "geracao",
  },
  {
    id: "chao-de-fabrica",
    term: "Chão de fábrica",
    short: "Área produtiva da indústria onde o trabalho operacional acontece.",
    long: "Termo usado para diferenciar a operação direta (linha, montagem, manutenção) das áreas administrativas. É o espaço onde o etarismo costuma aparecer com mais força.",
    tag: "industria",
  },
  {
    id: "linha-de-producao",
    term: "Linha de produção",
    short: "Sequência organizada de postos de trabalho que montam um produto em etapas.",
    tag: "industria",
  },
  {
    id: "turno",
    term: "Turno",
    short: "Período fixo de trabalho dentro do dia (ex.: manhã, tarde, noite).",
    long: "A escala de turnos é um ponto sensível: idosos costumam ter mais dificuldade no turno noturno, jovens podem ter restrições legais. Discriminar com base nisso é etarismo.",
    tag: "industria",
  },
  {
    id: "epi",
    term: "EPI",
    short: "Equipamento de Proteção Individual (capacete, luva, óculos, etc.).",
    tag: "industria",
    aliases: ["equipamento de proteção"],
  },
  {
    id: "ergonomia",
    term: "Ergonomia",
    short: "Estudo da adaptação do trabalho ao trabalhador, evitando lesões e fadiga.",
    long: "Ergonomia bem aplicada beneficia todas as idades, mas é frequentemente discutida pensando apenas em trabalhadores mais velhos — o que reforça estigmas.",
    tag: "industria",
  },
  {
    id: "turnover",
    term: "Turnover",
    short: "Taxa de rotatividade de funcionários em uma empresa ou setor.",
    long: "Turnover mede a frequência com que pessoas entram e saem de uma organização em um período. No contexto industrial, um turnover alto pode indicar problemas como clima organizacional ruim, falta de retenção, desalinhamento entre gerações ou condições de trabalho inadequadas. Já um turnover baixo pode indicar estabilidade, mas também possível estagnação se não houver renovação de talentos.",
    tag: "industria",
    aliases: ["rotatividade", "taxa de rotatividade"]
  },
  {
    id: "soft-skills",
    term: "Soft skills",
    short: "Habilidades comportamentais (comunicação, empatia, trabalho em equipe).",
    tag: "social",
  },
  {
    id: "hard-skills",
    term: "Hard skills",
    short: "Habilidades técnicas mensuráveis (operar uma máquina, ler um desenho técnico).",
    tag: "social",
  },
  {
    id: "mentoria-reversa",
    term: "Mentoria reversa",
    short: "Quando o profissional mais jovem ensina o mais experiente — geralmente em temas digitais.",
    long: "Prática recomendada como antídoto ao etarismo: troca de conhecimento em duas vias, valorizando ambas as gerações.",
    tag: "social",
  },
  {
    id: "estereotipo",
    term: "Estereótipo",
    short: "Crença generalizada e simplificada sobre um grupo de pessoas.",
    long: "“Idoso não aprende tecnologia” ou “jovem não tem compromisso” são estereótipos etários. Mesmo quando soam neutros, sustentam o etarismo.",
    tag: "etarismo",
  },
  {
    id: "viés-inconsciente",
    term: "Viés inconsciente",
    short: "Preferência ou rejeição automática que influencia decisões sem percebermos.",
    long: "Recrutadores podem descartar currículos por idade sem notar. Reconhecer o viés é o primeiro passo para combatê-lo.",
    tag: "etarismo",
    aliases: ["viés implícito"],
  },
  {
    id: "diversidade-etaria",
    term: "Diversidade etária",
    short: "Convivência produtiva de várias gerações no mesmo ambiente de trabalho.",
    tag: "social",
  },
  {
    id: "obsolescencia-profissional",
    term: "Obsolescência profissional",
    short: "Mito de que o trabalhador mais velho “ficou para trás” diante de novas tecnologias.",
    long: "É um dos argumentos mais usados para justificar etarismo. Estudos mostram que adaptação depende de treinamento, não de idade.",
    tag: "etarismo",
  },
  {
    id: "letramento-digital",
    term: "Letramento digital",
    short: "Capacidade de usar ferramentas digitais com autonomia e crítica.",
    tag: "tecnologia",
  },
  {
    id: "interface",
    term: "Interface",
    short: "Ponto de contato entre o usuário e um sistema (tela, botão, painel).",
    tag: "tecnologia",
  },
];

export function findEntry(idOrTerm: string): GlossaryEntry | undefined {
  const k = idOrTerm.toLowerCase();
  return GLOSSARY.find(
    (e) =>
      e.id === k ||
      e.term.toLowerCase() === k ||
      e.aliases?.some((a) => a.toLowerCase() === k),
  );
}

export const TAG_LABEL: Record<GlossaryTag, string> = {
  etarismo: "Etarismo",
  geracao: "Gerações",
  industria: "Indústria",
  tecnologia: "Tecnologia",
  social: "Social",
};
