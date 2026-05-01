/**
 * course.ts — Estrutura de dados do curso "Gerações na Indústria"
 * --------------------------------------------------------------
 * NOTA ACADÊMICA:
 * Este arquivo concentra TODO o conteúdo textual em estruturas
 * tipadas. Separar dados de apresentação é uma boa prática em
 * engenharia de software (princípio da separação de responsabilidades),
 * permitindo que o conteúdo evolua sem alterar componentes visuais.
 *
 * Cada Módulo possui:
 *   - id, slug, title, eyebrow, theme (classe CSS aplicada na <main>)
 *   - intro: texto curto de abertura do módulo
 *   - chapters: lista de capítulos com blocos heterogêneos (cenas)
 *   - quiz: 5 questões de fixação ao final do módulo
 *
 * Os "blocos" de cada capítulo seguem um padrão tipo CMS headless:
 * cada bloco descreve QUE TIPO de conteúdo renderizar (heading,
 * paragraph, mediaSlot, pull-quote, list, callout). Isso permite
 * que cada capítulo monte sua própria narrativa sem hardcode JSX.
 */

export type Block =
  | { type: "heading"; text: string; level?: 1 | 2 | 3 }
  | { type: "paragraph"; text: string }
  | { type: "lead"; text: string }                       // parágrafo-lead, fonte maior
  | { type: "pullQuote"; text: string; cite?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; tone: "info" | "warn" | "tip"; title: string; text: string }
  | { type: "mediaSlot"; kind: "image" | "video" | "audio"; slotId: string; caption?: string; layout?: "inline" | "full" | "background"; aspect?: string }
  | { type: "divider" };

export interface Chapter {
  id: string;        // estável p/ histórico (não mude depois)
  title: string;
  eyebrow?: string;
  /** Variante visual do capítulo. Cada variante muda layout/CSS internamente. */
  variant?: "editorial" | "split" | "stack" | "fullbleed" | "timeline";
  /** Caminho de imagem de fundo opcional (full-bleed mesclado). */
  backgroundSlotId?: string;
  blocks: Block[];
}

export interface QuizQuestion {
  id: string;
  q: string;
  options: string[];
  answer: number;     // índice correto
  feedback: string;
}

export interface Module {
  id: string;            // ex: "mod-1"
  slug: string;          // p/ rota
  number: number;        // ordem de exibição
  title: string;
  eyebrow: string;
  theme: string;         // classe CSS, ex: "theme-mod-1"
  generation?: "boomers" | "x" | "millennials" | "z"; // se for módulo de geração
  intro: string;
  chapters: Chapter[];
  quiz: QuizQuestion[];
}

/* ---------------------------------------------------------------
 * MÓDULOS — conteúdo BASEADO nos PDFs (G1, G3, G4) mas reescrito
 * com palavras próprias para uso em iniciação científica.
 * Quando faltar texto definitivo, usamos placeholders explícitos
 * para o pesquisador completar.
 * --------------------------------------------------------------- */

export const MODULES: Module[] = [
  {
    id: "mod-1",
    slug: "introducao",
    number: 1,
    title: "Introdução",
    eyebrow: "Módulo 01 · Ponto de partida",
    theme: "theme-mod-1",
    intro:
      "Antes de falar de gerações ou de etarismo, precisamos olhar para o chão de fábrica como ele realmente é: um espaço onde idades, histórias e formas de aprender convivem ao mesmo tempo.",
    chapters: [
      {
        id: "mod-1-cap-1",
        title: "Por que esse curso existe",
        eyebrow: "Capítulo 01",
        variant: "editorial",
        backgroundSlotId: "mod1-cap1-bg",
        blocks: [
          { type: "lead", text: "A indústria brasileira reúne, em um mesmo turno, pessoas que cresceram com cartão perfurado e pessoas que aprenderam a ler antes do primeiro smartphone." },
          { type: "paragraph", text: "Essa convivência é uma das maiores forças do setor — e, ao mesmo tempo, uma das suas maiores fontes de atrito. Este curso parte da hipótese de que reconhecer e nomear as diferenças geracionais é o primeiro passo para transformá-las em vantagem produtiva." },
          { type: "mediaSlot", kind: "image", slotId: "mod1-cap1-img1", layout: "inline", aspect: "16/9", caption: "" },
          { type: "heading", text: "O que você vai encontrar aqui", level: 2 },
          { type: "list", items: [
            "Uma definição clara do que é etarismo e como ele aparece no dia a dia industrial.",
            "Um mapa das quatro gerações ativas no mercado hoje.",
            "Práticas concretas de comunicação e convivência entre faixas etárias.",
            "Quizzes de fixação após cada módulo e um mega quiz final.",
          ]},
          { type: "callout", tone: "tip", title: "Como estudar", text: "Cada módulo termina com um quiz curto. Ao final, há um teste-síntese de 30 questões. Seu histórico de tempo e acertos fica salvo no próprio dispositivo." },
        ],
      },
      {
        id: "mod-1-cap-2",
        title: "Quem está estudando e por quê",
        eyebrow: "Capítulo 02",
        variant: "split",
        blocks: [
          { type: "paragraph", text: "Este material foi pensado para dois públicos que raramente leem o mesmo texto: o jovem trabalhador que acabou de entrar na indústria e o profissional experiente que viu o setor mudar várias vezes." },
          { type: "mediaSlot", kind: "image", slotId: "mod1-cap2-img1", layout: "inline", aspect: "4/5", caption: "" },
          { type: "pullQuote", text: "Toda geração acha que inventou o trabalho. E toda geração, em algum momento, descobre que herdou mais do que imaginava." },
          { type: "paragraph", text: "Por isso o curso evita um tom único: alterna textos curtos, comparações visuais e exemplos práticos. Você vai poder voltar, repetir e medir seu próprio avanço." },
        ],
      },
      {
        id: "mod-1-cap-3",
        title: "Como o curso está organizado",
        eyebrow: "Capítulo 03",
        variant: "stack",
        blocks: [
          { type: "list", ordered: true, items: [
            "Introdução (você está aqui).",
            "O que é etarismo.",
            "As gerações do mercado.",
            "Mergulho em cada geração — Boomers, X, Millennials, Z.",
            "Comunicação intergeracional.",
            "Boas práticas no chão de fábrica.",
            "Mega quiz final e finalização.",
          ]},
          { type: "callout", tone: "info", title: "Personalização", text: "Após o módulo das gerações, você informa sua idade. O curso então destaca primeiro o módulo da SUA geração, para você se reconhecer antes de estudar as outras." },
        ],
      },
    ],
    quiz: [
      { id: "q-m1-1", q: "Qual é o objetivo central deste curso?", options: [
        "Defender que apenas uma geração está certa.",
        "Apresentar gerações e etarismo na indústria de forma aplicada.",
        "Substituir treinamentos técnicos de segurança.",
        "Avaliar desempenho individual de operadores.",
      ], answer: 1, feedback: "O curso é introdutório e conceitual: contextualiza gerações e etarismo no ambiente industrial, sem substituir treinamentos técnicos." },
      { id: "q-m1-2", q: "Por que reconhecer diferenças geracionais é importante na indústria?", options: [
        "Para separar trabalhadores por idade.",
        "Para transformar diferenças em complementaridade produtiva.",
        "Para padronizar todos no mesmo comportamento.",
        "Para acelerar aposentadorias.",
      ], answer: 1, feedback: "A diversidade geracional, quando reconhecida, vira vantagem: cada faixa traz repertórios diferentes que se completam." },
      { id: "q-m1-3", q: "O curso é destinado a:", options: [
        "Apenas jovens recém-contratados.",
        "Apenas profissionais experientes.",
        "Pessoas de diferentes idades que convivem na indústria.",
        "Estudantes de ensino médio fora do setor.",
      ], answer: 2, feedback: "O material foi desenhado para dialogar com jovens e veteranos simultaneamente." },
      { id: "q-m1-4", q: "Como o curso está estruturado?", options: [
        "Um único bloco contínuo de leitura.",
        "Módulos com capítulos e quizzes de fixação.",
        "Vídeos longos sem texto.",
        "Apenas avaliações, sem conteúdo.",
      ], answer: 1, feedback: "A divisão em módulos + capítulos + quiz facilita o estudo em pequenas sessões, mais adequado a um ambiente industrial." },
      { id: "q-m1-5", q: "O que acontece após o módulo das gerações?", options: [
        "O curso termina automaticamente.",
        "O usuário informa a idade e o sistema destaca a sua geração primeiro.",
        "O usuário escolhe outra trilha sem relação com gerações.",
        "Não há qualquer personalização.",
      ], answer: 1, feedback: "A personalização por idade é um dos diferenciais didáticos: o aluno se reconhece antes de estudar as demais gerações." },
    ],
  },

  /* -------------------- MÓDULO 2: ETARISMO -------------------- */
  {
    id: "mod-2",
    slug: "etarismo",
    number: 2,
    title: "O que é etarismo?",
    eyebrow: "Módulo 02 · Preconceito de idade",
    theme: "theme-mod-2",
    intro: "Etarismo é o preconceito ou discriminação baseado na idade. Na indústria ele aparece de formas sutis — e, com frequência, invisíveis para quem o pratica.",
    chapters: [
      {
        id: "mod-2-cap-1",
        title: "Definição e origem do termo",
        eyebrow: "Capítulo 01",
        variant: "editorial",
        backgroundSlotId: "mod2-cap1-bg",
        blocks: [
          { type: "lead", text: "Etarismo (do inglês ageism) é qualquer estereótipo, preconceito ou discriminação dirigido a uma pessoa em razão da sua idade." },
          { type: "paragraph", text: "O termo nasce nos anos 1960, mas só nas últimas décadas ganhou tração no debate corporativo. Ele afeta tanto trabalhadores mais velhos — frequentemente excluídos de projetos de inovação — quanto jovens, descartados como inexperientes antes mesmo de mostrarem trabalho." },
          { type: "mediaSlot", kind: "image", slotId: "mod2-cap1-img1", layout: "full", aspect: "21/9", caption: "" },
          { type: "callout", tone: "warn", title: "Sinal de alerta", text: "Frases como 'isso é coisa de velho' ou 'esse moleque não aguenta o ritmo' são manifestações cotidianas de etarismo, mesmo quando ditas em tom de brincadeira." },
        ],
      },
      {
        id: "mod-2-cap-2",
        title: "Como o etarismo aparece no chão de fábrica",
        eyebrow: "Capítulo 02",
        variant: "stack",
        blocks: [
          { type: "list", items: [
            "Excluir veteranos de treinamentos sobre novas tecnologias.",
            "Atribuir tarefas repetitivas a jovens 'até eles aprenderem'.",
            "Ignorar sugestões com base em 'tempo de casa'.",
            "Criar escalas separadas por faixa etária sem justificativa técnica.",
          ]},
          { type: "mediaSlot", kind: "image", slotId: "mod2-cap2-img1", layout: "inline", aspect: "16/9" },
          { type: "paragraph", text: "Cada um desses comportamentos custa caro: aumenta turnover, reduz transferência de conhecimento e mina o clima organizacional." },
        ],
      },
      {
        id: "mod-2-cap-3",
        title: "Por que é errado — e por que é caro",
        eyebrow: "Capítulo 03",
        variant: "split",
        blocks: [
          { type: "paragraph", text: "Eticamente, o etarismo viola o princípio da igualdade de tratamento. Legalmente, no Brasil, a CLT e a Constituição vedam discriminação por idade em processos seletivos e relações de trabalho." },
          { type: "pullQuote", text: "O problema não é a idade do trabalhador — é a forma como a empresa decide enxergá-la." },
          { type: "callout", tone: "info", title: "Impacto produtivo", text: "Estudos da OIT indicam que equipes etariamente diversas têm desempenho superior em tarefas que exigem decisão sob incerteza — exatamente o tipo de problema comum em manufatura." },
        ],
      },
    ],
    quiz: [
      { id: "q-m2-1", q: "Etarismo é, em uma frase:", options: [
        "Conflito entre setores da empresa.",
        "Preconceito ou discriminação baseado em idade.",
        "Resistência à mudança de processos.",
        "Falta de comunicação entre turnos.",
      ], answer: 1, feedback: "Etarismo é, por definição, discriminação por idade — atinge tanto idosos quanto jovens." },
      { id: "q-m2-2", q: "Qual destas situações NÃO é exemplo de etarismo?", options: [
        "Excluir um veterano de um treinamento digital.",
        "Não promover alguém só por ser jovem.",
        "Avaliar desempenho a partir de indicadores claros.",
        "Brincar que 'velho não acompanha ritmo'.",
      ], answer: 2, feedback: "Avaliação por indicadores objetivos é justamente o oposto do etarismo." },
      { id: "q-m2-3", q: "Etarismo afeta:", options: [
        "Apenas pessoas idosas.",
        "Apenas pessoas jovens.",
        "Pessoas de qualquer idade.",
        "Apenas gestores.",
      ], answer: 2, feedback: "Tanto jovens quanto veteranos podem ser alvo de etarismo, em formatos diferentes." },
      { id: "q-m2-4", q: "No Brasil, a discriminação por idade no trabalho é:", options: [
        "Permitida desde que informal.",
        "Vedada pela Constituição e pela CLT.",
        "Decidida caso a caso pela empresa.",
        "Indiferente à legislação trabalhista.",
      ], answer: 1, feedback: "A legislação brasileira proíbe expressamente discriminação por idade em relações de trabalho." },
      { id: "q-m2-5", q: "Equipes etariamente diversas tendem a ter:", options: [
        "Pior desempenho em geral.",
        "Desempenho equivalente, sem diferença.",
        "Melhor desempenho em decisões sob incerteza.",
        "Mais conflitos sem nenhum ganho.",
      ], answer: 2, feedback: "A literatura aponta ganho de desempenho em problemas complexos, típicos do ambiente industrial." },
    ],
  },

  /* -------------------- MÓDULO 3: AS GERAÇÕES -------------------- */
  {
    id: "mod-3",
    slug: "geracoes",
    number: 3,
    title: "As gerações do mercado",
    eyebrow: "Módulo 03 · Mapa geracional",
    theme: "theme-mod-3",
    intro: "Quatro gerações dividem hoje o mesmo crachá. Conhecer cada uma evita generalizações apressadas e ajuda a entender de onde vêm certos comportamentos.",
    chapters: [
      {
        id: "mod-3-cap-1",
        title: "Como definimos uma geração",
        eyebrow: "Capítulo 01",
        variant: "editorial",
        backgroundSlotId: "mod3-cap1-bg",
        blocks: [
          { type: "lead", text: "Geração é um recorte sociológico: agrupa pessoas nascidas em um intervalo de tempo que viveram, em fases formativas semelhantes, os mesmos eventos históricos." },
          { type: "paragraph", text: "Os intervalos não são leis físicas. Variam conforme o autor e o país. O que importa é o que cada coorte viveu enquanto se formava como adulto e como trabalhador." },
          { type: "mediaSlot", kind: "image", slotId: "mod3-cap1-img1", layout: "inline", aspect: "16/9" },
        ],
      },
      {
        id: "mod-3-cap-2",
        title: "Linha do tempo das quatro gerações",
        eyebrow: "Capítulo 02",
        variant: "timeline",
        blocks: [
          { type: "list", items: [
            "Baby Boomers — nascidos entre 1946 e 1964.",
            "Geração X — nascidos entre 1965 e 1980.",
            "Millennials (Y) — nascidos entre 1981 e 1996.",
            "Geração Z — nascidos entre 1997 e 2012.",
          ]},
          { type: "callout", tone: "tip", title: "Atenção", text: "Estes recortes são referências, não rótulos. Uma pessoa nascida em 1996 pode se reconhecer mais como Z do que como millennial — e vice-versa." },
        ],
      },
      {
        id: "mod-3-cap-3",
        title: "O risco do estereótipo",
        eyebrow: "Capítulo 03",
        variant: "split",
        blocks: [
          { type: "paragraph", text: "Mapear gerações ajuda. Reduzir pessoas a rótulos atrapalha. O objetivo aqui é dar contexto para que cada profissional seja visto como indivíduo dentro de uma história coletiva." },
          { type: "pullQuote", text: "Geração é pano de fundo, não destino." },
        ],
      },
    ],
    quiz: [
      { id: "q-m3-1", q: "Quais são as quatro gerações ativas hoje no mercado?", options: [
        "Boomers, X, Millennials e Z.",
        "Silenciosa, Boomers, X e Millennials.",
        "X, Millennials, Z e Alpha.",
        "Boomers, Y, Z e Alpha.",
      ], answer: 0, feedback: "As quatro gerações economicamente ativas em maior volume hoje são Boomers, X, Millennials e Z." },
      { id: "q-m3-2", q: "O que define uma geração, sociologicamente?", options: [
        "Apenas o ano de nascimento.",
        "Eventos históricos vividos em fases formativas comuns.",
        "O cargo ocupado na empresa.",
        "A região do país onde nasceu.",
      ], answer: 1, feedback: "Geração é um recorte de coorte: pessoas que viveram juntas momentos históricos formativos." },
      { id: "q-m3-3", q: "Os intervalos de anos de cada geração são:", options: [
        "Leis fixas e universais.",
        "Referências aproximadas que variam por autor.",
        "Definidos pelo IBGE oficialmente.",
        "Iguais em todos os países.",
      ], answer: 1, feedback: "Os recortes geracionais são convenções aproximadas, úteis como referência, não como lei." },
      { id: "q-m3-4", q: "O principal risco ao estudar gerações é:", options: [
        "Aprender pouco sobre a história do trabalho.",
        "Reduzir indivíduos a estereótipos.",
        "Confundir geração com cargo.",
        "Esquecer datas importantes.",
      ], answer: 1, feedback: "Tratar geração como rótulo individual é uma forma de etarismo — exatamente o que o curso busca evitar." },
      { id: "q-m3-5", q: "Millennials nasceram entre:", options: [
        "1946 e 1964.", "1965 e 1980.", "1981 e 1996.", "1997 e 2012.",
      ], answer: 2, feedback: "Millennials, ou Geração Y, são, em geral, os nascidos entre 1981 e 1996." },
    ],
  },

  /* -------------------- MÓDULOS 4–7: GERAÇÕES -------------------- */
  buildGenerationModule({
    id: "mod-4", slug: "boomers", number: 4, theme: "theme-mod-4", generation: "boomers",
    title: "Baby Boomers", eyebrow: "Módulo 04 · 1946–1964",
    intro: "Construíram carreira na lógica do emprego longo, da hierarquia e da lealdade institucional. Trazem, hoje, a memória prática do setor.",
    traits: ["Lealdade institucional", "Carreiras longas em poucas empresas", "Respeito à hierarquia", "Aprendizado por observação"],
    strengths: "Repertório operacional, leitura fina de processos e capacidade de mentoria técnica.",
    challenges: "Adaptação a interfaces digitais e a estruturas mais horizontais de decisão.",
    pullQuote: "A experiência constrói eficiência — e a repetição constrói domínio.",
  }),
  buildGenerationModule({
    id: "mod-5", slug: "geracao-x", number: 5, theme: "theme-mod-5", generation: "x",
    title: "Geração X", eyebrow: "Módulo 05 · 1965–1980",
    intro: "Cresceram entre o analógico e o digital. São a 'ponte' natural entre veteranos e novos profissionais.",
    traits: ["Pragmatismo", "Independência", "Equilíbrio entre vida pessoal e profissional", "Ceticismo saudável"],
    strengths: "Tradução entre linguagens — falam com Boomers e com mais novos sem grande atrito.",
    challenges: "Sobrecarga: frequentemente acumulam papel de gestor e mediador.",
    pullQuote: "Aprenderam a se adaptar sem perder estabilidade no caminho.",
  }),
  buildGenerationModule({
    id: "mod-6", slug: "millennials", number: 6, theme: "theme-mod-6", generation: "millennials",
    title: "Millennials", eyebrow: "Módulo 06 · 1981–1996",
    intro: "Primeira geração formada já com internet popular. Buscam propósito, feedback frequente e ambiente de trabalho com sentido.",
    traits: ["Busca de propósito", "Colaboração em rede", "Feedback contínuo", "Mobilidade entre empresas"],
    strengths: "Leitura rápida de tendências, fluência digital aplicada e aptidão para times multidisciplinares.",
    challenges: "Frustração quando o ambiente não evolui no mesmo ritmo das suas expectativas.",
    pullQuote: "Procuram propósito em cada camada do trabalho.",
  }),
  buildGenerationModule({
    id: "mod-7", slug: "geracao-z", number: 7, theme: "theme-mod-7", generation: "z",
    title: "Geração Z", eyebrow: "Módulo 07 · 1997–2012",
    intro: "Nativos digitais. Não conheceram o mundo sem internet. Trazem novas formas de aprender, comunicar e cobrar coerência.",
    traits: ["Nativos digitais", "Aprendizado por vídeo e tutorial", "Forte senso de causa", "Comunicação direta"],
    strengths: "Velocidade de aprendizado em ferramentas digitais, abertura a novos métodos e leitura crítica de processos.",
    challenges: "Impaciência com processos lentos e expectativa alta de transparência das lideranças.",
    pullQuote: "Questionam processos antes mesmo de aceitá-los como padrão.",
  }),

  /* -------------------- MÓDULO 8: COMUNICAÇÃO -------------------- */
  {
    id: "mod-8",
    slug: "comunicacao",
    number: 8,
    title: "Comunicação intergeracional",
    eyebrow: "Módulo 08 · Pontes de linguagem",
    theme: "theme-mod-8",
    intro: "Cada geração tem seu canal preferido. Mais importante do que escolher um único canal é entender por que cada grupo prefere o seu.",
    chapters: [
      {
        id: "mod-8-cap-1",
        title: "Canais e ritmos diferentes",
        eyebrow: "Capítulo 01",
        variant: "editorial",
        backgroundSlotId: "mod8-cap1-bg",
        blocks: [
          { type: "lead", text: "O e-mail formal, o quadro de avisos, o grupo de WhatsApp e o painel digital convivem hoje no mesmo turno. Cada um carrega expectativas distintas de tempo de resposta." },
          { type: "mediaSlot", kind: "image", slotId: "mod8-cap1-img1", layout: "inline", aspect: "16/9" },
          { type: "paragraph", text: "Negociar canais é parte do trabalho. Definir qual mensagem vai por qual canal evita ruído e desgaste." },
        ],
      },
      {
        id: "mod-8-cap-2",
        title: "Mentoria reversa",
        eyebrow: "Capítulo 02",
        variant: "split",
        blocks: [
          { type: "paragraph", text: "Na mentoria reversa, jovens compartilham conhecimento digital com veteranos e, no mesmo encontro, recebem em troca leitura de processo, repertório histórico e cultura organizacional." },
          { type: "callout", tone: "tip", title: "Aplicação prática", text: "Comece pequeno: duplas fixas por 30 dias, agendas curtas e um tema por encontro." },
        ],
      },
      {
        id: "mod-8-cap-3",
        title: "Erros comuns de comunicação",
        eyebrow: "Capítulo 03",
        variant: "stack",
        blocks: [
          { type: "list", items: [
            "Assumir que todos leem o mesmo grupo de mensagens.",
            "Misturar avisos críticos com avisos rotineiros no mesmo canal.",
            "Usar gírias ou siglas restritas a uma geração.",
            "Confundir 'silêncio digital' com 'desinteresse'.",
          ]},
        ],
      },
    ],
    quiz: [
      { id: "q-m8-1", q: "Mentoria reversa é:", options: [
        "Veteranos ensinando hierarquia aos jovens.", "Jovens ensinando tecnologia enquanto recebem experiência.", "Programa só para aposentadoria.", "Troca de função entre departamentos.",
      ], answer: 1, feedback: "É uma via dupla: ferramenta digital de um lado, repertório de processo do outro." },
      { id: "q-m8-2", q: "O melhor canal de comunicação é:", options: [
        "Sempre o WhatsApp.", "Sempre o e-mail.", "Depende da mensagem e do público.", "Sempre a reunião presencial.",
      ], answer: 2, feedback: "Não existe canal universalmente melhor — existe o canal certo para cada tipo de mensagem." },
      { id: "q-m8-3", q: "'Silêncio digital' significa, geralmente:", options: [
        "Falta de respeito.", "Desinteresse pelo trabalho.", "Pode significar simplesmente foco em outra tarefa.", "Insubordinação.",
      ], answer: 2, feedback: "Interpretar silêncio como desinteresse costuma gerar conflito desnecessário entre gerações." },
      { id: "q-m8-4", q: "Misturar avisos críticos com rotineiros num mesmo canal:", options: [
        "Aumenta a clareza.", "Dilui a importância dos críticos.", "Não tem efeito.", "Substitui treinamentos.",
      ], answer: 1, feedback: "Quando tudo é urgente, nada é urgente." },
      { id: "q-m8-5", q: "Negociar canais com a equipe é responsabilidade:", options: [
        "Apenas do RH.", "Apenas dos jovens.", "Coletiva, de todos os envolvidos.", "Apenas dos gestores seniores.",
      ], answer: 2, feedback: "A definição de canais funciona melhor quando construída em conjunto pelo time." },
    ],
  },

  /* -------------------- MÓDULO 9: BOAS PRÁTICAS -------------------- */
  {
    id: "mod-9",
    slug: "boas-praticas",
    number: 9,
    title: "Boas práticas no chão de fábrica",
    eyebrow: "Módulo 09 · Aplicação",
    theme: "theme-mod-9",
    intro: "Práticas concretas, baratas e replicáveis para reduzir atrito geracional e ampliar a transferência de conhecimento.",
    chapters: [
      {
        id: "mod-9-cap-1",
        title: "Escalas mistas e duplas de aprendizado",
        eyebrow: "Capítulo 01",
        variant: "editorial",
        backgroundSlotId: "mod9-cap1-bg",
        blocks: [
          { type: "lead", text: "Escalas que combinam idades diferentes naturalmente espalham conhecimento — sem precisar de um programa formal." },
          { type: "mediaSlot", kind: "image", slotId: "mod9-cap1-img1", layout: "full", aspect: "21/9" },
        ],
      },
      {
        id: "mod-9-cap-2",
        title: "Reconhecimento e linguagem inclusiva",
        eyebrow: "Capítulo 02",
        variant: "split",
        blocks: [
          { type: "paragraph", text: "Reconhecer publicamente contribuições de todas as faixas etárias reduz o efeito 'invisibilidade' que costuma atingir os extremos: o muito jovem e o muito veterano." },
          { type: "callout", tone: "info", title: "Linguagem", text: "Evite expressões etaristas, mesmo em tom de brincadeira: elas normalizam exclusões maiores no longo prazo." },
        ],
      },
      {
        id: "mod-9-cap-3",
        title: "Indicadores que importam",
        eyebrow: "Capítulo 03",
        variant: "stack",
        blocks: [
          { type: "list", items: [
            "Tempo médio para um novo operador atingir produtividade.",
            "Turnover por faixa etária.",
            "Participação em treinamentos por idade.",
            "Reincidência de incidentes — segmentada por experiência.",
          ]},
          { type: "paragraph", text: "Indicadores tornam o tema palpável e tiram a discussão do campo do 'achismo'." },
        ],
      },
    ],
    quiz: [
      { id: "q-m9-1", q: "Qual prática reduz, na média, conflitos geracionais?", options: [
        "Separar equipes por idade.", "Escalas mistas com duplas de aprendizado.", "Ignorar as diferenças.", "Centralizar tudo no gestor.",
      ], answer: 1, feedback: "Misturar gerações em escala é a prática mais barata e eficiente." },
      { id: "q-m9-2", q: "Reconhecer publicamente contribuições ajuda a:", options: [
        "Aumentar invisibilidade.", "Reduzir invisibilidade dos extremos etários.", "Substituir indicadores objetivos.", "Eliminar treinamentos.",
      ], answer: 1, feedback: "Reconhecimento combate diretamente o 'apagamento' dos muito jovens e dos muito veteranos." },
      { id: "q-m9-3", q: "Brincadeiras etaristas, no longo prazo:", options: [
        "São inofensivas.", "Normalizam exclusões maiores.", "Aumentam a produtividade.", "Substituem políticas formais.",
      ], answer: 1, feedback: "O humor etarista cria terreno fértil para decisões discriminatórias maiores." },
      { id: "q-m9-4", q: "Qual destes indicadores é útil para acompanhar diversidade etária?", options: [
        "Apenas faturamento.", "Turnover por faixa etária.", "Apenas idade média.", "Nenhum, é tema subjetivo.",
      ], answer: 1, feedback: "Turnover segmentado por idade revela onde a empresa está perdendo gente — e por quê." },
      { id: "q-m9-5", q: "Boas práticas geracionais devem ser:", options: [
        "Caras e centralizadas.", "Concretas, baratas e replicáveis.", "Exclusivas do RH.", "Aplicadas só uma vez por ano.",
      ], answer: 1, feedback: "Práticas simples e replicáveis vencem grandes programas pontuais." },
    ],
  },
];

/* ---------------------------------------------------------------
 * Helper: monta um módulo de geração a partir de campos curtos.
 * Evita repetição de boilerplate para os 4 módulos de geração.
 * --------------------------------------------------------------- */
interface GenModuleArgs {
  id: string; slug: string; number: number; theme: string;
  generation: "boomers" | "x" | "millennials" | "z";
  title: string; eyebrow: string; intro: string;
  traits: string[]; strengths: string; challenges: string;
  pullQuote: string; 
}

function buildGenerationModule(a: GenModuleArgs): Module {
  const baseId = a.id;
  return {
    id: a.id, slug: a.slug, number: a.number, theme: a.theme, generation: a.generation,
    title: a.title, eyebrow: a.eyebrow, intro: a.intro,
    chapters: [
      {
        id: `${baseId}-cap-1`,
        title: "Quem são, em poucas linhas",
        eyebrow: "Capítulo 01",
        variant: "editorial",
        backgroundSlotId: `${baseId}-cap1-bg`,
        blocks: [
          { type: "lead", text: a.intro },
          { type: "mediaSlot", kind: "image", slotId: `${baseId}-cap1-img1`, layout: "inline", aspect: "16/9", caption: undefined },
          { type: "heading", text: "Traços marcantes", level: 2 },
          { type: "list", items: a.traits },
        ],
      },
      {
        id: `${baseId}-cap-2`,
        title: "Forças no ambiente industrial",
        eyebrow: "Capítulo 02",
        variant: "split",
        blocks: [
          { type: "paragraph", text: a.strengths },
          { type: "pullQuote", text: a.pullQuote },
        ],
      },
      {
        id: `${baseId}-cap-3`,
        title: "Desafios e cuidados",
        eyebrow: "Capítulo 03",
        variant: "stack",
        blocks: [
          { type: "paragraph", text: a.challenges },
          { type: "callout", tone: "warn", title: "Atenção", text: "Atribuir esses desafios a todos os indivíduos da geração é, em si, uma forma de etarismo. Use a descrição como pano de fundo, não como rótulo pessoal." },
        ],
      },
    ],
    quiz: buildGenerationQuiz(a),
  };
}

function buildGenerationQuiz(a: GenModuleArgs): QuizQuestion[] {
  return [
    { id: `q-${a.id}-1`, q: `A geração ${a.title} é, em geral, descrita como:`, options: [
      a.traits[0], "Sem traços comuns identificáveis.", "Apenas pelo cargo ocupado.", "Apenas pelo salário recebido.",
    ], answer: 0, feedback: `${a.traits[0]} é um dos traços frequentemente associados à geração ${a.title}.` },
    { id: `q-${a.id}-2`, q: `Uma força típica de ${a.title} no chão de fábrica é:`, options: [
      "Não há forças específicas.", a.strengths.split(",")[0] || a.strengths, "Apenas longevidade.", "Apenas idade.",
    ], answer: 1, feedback: a.strengths },
    { id: `q-${a.id}-3`, q: `Um desafio frequente para ${a.title} é:`, options: [
      "Não existe desafio típico.", a.challenges.split(".")[0], "Excesso de produtividade.", "Não saber ler.",
    ], answer: 1, feedback: a.challenges },
    { id: `q-${a.id}-4`, q: `Atribuir TODOS os traços de ${a.title} a UM indivíduo da geração é:`, options: [
      "Boa prática.", "Forma de etarismo.", "Política de RH.", "Indicador de desempenho.",
    ], answer: 1, feedback: "Usar traços geracionais como rótulo individual é justamente uma forma de etarismo." },
    { id: `q-${a.id}-5`, q: `O propósito de estudar ${a.title} é:`, options: [
      "Separar a geração das demais.", "Dar contexto para entender comportamentos.", "Padronizar a geração.", "Aposentar a geração.",
    ], answer: 1, feedback: "Estudar gerações é dar contexto, nunca rotular." },
  ];
}

/* --------------------------------------------------------------
 * MEGA QUIZ — 30 questões cobrindo todo o curso.
 * Estratégia: 5 questões 'globais' + as 5 do módulo 2 + 5 do
 * módulo 3 + 1 de cada quiz de geração + perguntas de comunicação
 * e boas práticas. Garante 30 itens, mantendo coerência.
 * -------------------------------------------------------------- */
export const MEGA_QUIZ: QuizQuestion[] = [
  ...MODULES.find((m) => m.id === "mod-1")!.quiz,
  ...MODULES.find((m) => m.id === "mod-2")!.quiz,
  ...MODULES.find((m) => m.id === "mod-3")!.quiz,
  ...MODULES.find((m) => m.id === "mod-4")!.quiz.slice(0, 3),
  ...MODULES.find((m) => m.id === "mod-5")!.quiz.slice(0, 3),
  ...MODULES.find((m) => m.id === "mod-6")!.quiz.slice(0, 3),
  ...MODULES.find((m) => m.id === "mod-7")!.quiz.slice(0, 3),
  ...MODULES.find((m) => m.id === "mod-8")!.quiz.slice(0, 3),
].map((q, i) => ({ ...q, id: `mega-${i + 1}-${q.id}` }));

/** Lookup por slug — usado nas rotas. */
export const moduleBySlug = (slug: string) => MODULES.find((m) => m.slug === slug);
