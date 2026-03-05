// ─── Types ─────────────────────────────────────────────────

export type Dispositivo = {
  nome: string;
  uso: number;
  contexto: string;
};

export type AppCompra = {
  nome: string;
  percentagem: number;
  razao: string;
};

export type PadraoCompra = {
  tipo: string;
  exemplo: string;
  valorRange: string;
  frequencia: string;
  contexto: string;
  tempoInvestido: string;
};

export type FrustracaoDetalhada = {
  titulo: string;
  severidade: "CRÍTICA" | "ALTA" | "MÉDIA" | "BAIXA";
  cenario: string;
  reacaoEmocional: string;
  impacto: string;
};

export type Quote = {
  contexto: string;
  citacao: string;
};

export type BigFive = {
  abertura: number;
  consciencia: number;
  extroversao: number;
  simpatia: number;
  neuroticismo: number;
};

export type ViesCognitivo = {
  nome: string;
  nivel: number;
  descricao: string;
};

export type EmpathyMap = {
  thinks: string[];
  feels: string[];
  says: string[];
  does: string[];
  painPoints: string[];
  gains: string[];
};

export type PerfilCognitivo = {
  qiGeral: number;
  verbal: string;
  numerico: string;
  espacial: string;
  velocidadeProcessamento: number;
  memoriaTrabalho: string;
  numeracia: number;
  criatividade: number;
  literaciaDigital: number;
  inteligenciaEmocional: number;
  flexibilidadeCognitiva: number;
  vieses: ViesCognitivo[];
};

export type TechLevel = number;

export type Persona = {
  id: number;
  nome: string;
  subtitulo: string;
  tipo: "persona" | "agente";

  // 1. Perfil Demográfico
  idade: number | null;
  profissao: string;
  situacao: string;
  localizacao: string;
  rendimento: string;

  // 2. Perfil Digital
  techLevel: TechLevel | null;
  usoMobile: number | null;
  usoDesktop: number | null;
  usoLoja: number | null;
  dispositivos: Dispositivo[];
  appsCompras: AppCompra[];

  // 3. Psicografia (Big Five)
  bigFive: BigFive | null;
  valores: string[];

  // 4. Padrões de Compra
  padroesCompra: PadraoCompra[];

  // 5. Frustrações
  frustracoes: string[];
  frustracoesDetalhadas: FrustracaoDetalhada[];

  // 6. Motivações
  motivacoes: string[];
  gatilhosCompra: string[];

  // 7. Verbatim
  quotes: Quote[];

  // 8. Empathy Map
  empathyMap: EmpathyMap | null;

  // 9. Perfil Cognitivo
  perfilCognitivo: PerfilCognitivo | null;

  // 10. Prompt Mestre
  promptMestre: string;
};

// ─── ANA SILVA ──────────────────────────────────────────────

const ana: Persona = {
  id: 1,
  nome: "Ana Silva",
  subtitulo: "A Compradora Pragmática",
  tipo: "persona",

  idade: 35,
  profissao: "Gestora de Projetos (PME de consultoria em recursos humanos)",
  situacao: "Casada com Fernando (37, advogado), sem filhos",
  localizacao: "Almada, arredores de Lisboa",
  rendimento: "€2.800/mês (classe média-alta)",

  techLevel: 7,
  usoMobile: 80,
  usoDesktop: 15,
  usoLoja: 5,
  dispositivos: [
    { nome: "iPhone 14 Pro", uso: 80, contexto: "Bolsa/transportes/cama" },
    { nome: "MacBook Air M1", uso: 15, contexto: "Home office, compras ponderadas" },
    { nome: "iPad Air", uso: 5, contexto: "Raro — leitura de jornais" },
  ],
  appsCompras: [
    { nome: "Amazon", percentagem: 40, razao: "Entrega rápida, devolução sem stresse" },
    { nome: "FNAC", percentagem: 30, razao: "Música, livros, eletrónicos de marca" },
    { nome: "Worten", percentagem: 20, razao: "Eletrónicos, ocasionalmente" },
    { nome: "OLX", percentagem: 10, razao: "Segunda mão, raramente" },
  ],

  bigFive: {
    abertura: 6.5,
    consciencia: 8.5,
    extroversao: 6,
    simpatia: 7.5,
    neuroticismo: 5,
  },
  valores: [
    "Eficiência — Tempo é ouro",
    "Confiabilidade — Prefere 'chato mas seguro' a 'novo mas arriscado'",
    "Autonomia — Quer fazer coisas sem depender de outras pessoas",
    "Qualidade — Disposição a pagar por bom acabamento",
    "Transparência — Detesta surpresas desagradáveis (custos ocultos, stock falso)",
  ],

  padroesCompra: [
    {
      tipo: "Compra Impulsiva",
      exemplo: "Acessórios, artigos para casa, pequenos eletrónicos",
      valorRange: "€10–€50",
      frequencia: "2-3x por semana",
      contexto: "Mobile, à noite na cama, vê algo no Instagram",
      tempoInvestido: "<2 minutos",
    },
    {
      tipo: "Compra Planeada",
      exemplo: "Eletrónicos maiores (monitor, router, webcam), eletrodomésticos",
      valorRange: "€100–€800",
      frequencia: "1x/mês",
      contexto: "Desktop, fim de semana, com o Fernando, investigação prévia",
      tempoInvestido: "1–2 horas (incluindo pesquisa)",
    },
    {
      tipo: "Compra Rotineira",
      exemplo: "Cabos, adaptadores, baterias, peças de substituição",
      valorRange: "€5–€30",
      frequencia: "1x cada 2-3 meses",
      contexto: "Quando algo avaria ou precisa de reparação",
      tempoInvestido: "<5 minutos",
    },
  ],

  frustracoes: [
    "Inconsistência de informação (ver 'Disponível' e depois não haver stock)",
    "Processos pós-venda opacos (sem visibilidade sobre devoluções/reparações)",
    "Falta de autonomia (ter de recorrer ao apoio para tarefas simples)",
    "Filtros de pesquisa ineficazes",
    "UX não nativa no mobile",
  ],
  frustracoesDetalhadas: [
    {
      titulo: "Informação Inconsistente",
      severidade: "CRÍTICA",
      cenario:
        "Vê 'Disponível: 2 unidades' na Worten. Vai ao checkout, diz 'Stock indisponível'.",
      reacaoEmocional: "Raiva + Desconfiança — 'Porque é que me mostram se não têm?'",
      impacto: "Sai do site, vai para Amazon. Nunca mais confia.",
    },
    {
      titulo: "Processo Pós-Venda Opaco",
      severidade: "CRÍTICA",
      cenario:
        "Compra monitor, após 3 meses tem 'dead pixels'. Não encontra info clara sobre devoluções. Liga para número, espera 10 min.",
      reacaoEmocional: "Frustração + Impotência",
      impacto: "'A Amazon facilita. A Worten complica.' — Perde o cliente para sempre.",
    },
    {
      titulo: "Filtros de Pesquisa Ineficazes",
      severidade: "MÉDIA",
      cenario:
        "Quer monitores 27' com USB-C. Filtro de tamanho existe mas USB-C não. Tem de ler descrição de cada um.",
      reacaoEmocional: "Resignação + Frustração — 'Na Amazon, estes filtros existem'",
      impacto: "Deslista as opções da Worten da busca.",
    },
    {
      titulo: "Falta de Autonomia",
      severidade: "MÉDIA",
      cenario:
        "Quer imprimir etiqueta de devolução ou agendar recolha. Tem de contactar suporte com tempos longos.",
      reacaoEmocional: "Irritação + Indefesa",
      impacto: "Prefere não comprar em sítios que tornam o processo complexo.",
    },
    {
      titulo: "UX Não Nativa no Mobile",
      severidade: "BAIXA",
      cenario:
        "App Worten demora a carregar, animações lentas, checkout parece 'Web Wrapper'.",
      reacaoEmocional: "Irritação ligeira — 'Por que é que isto é tão lento?'",
      impacto: "Prefere usar Safari/website em vez da app.",
    },
  ],

  motivacoes: [
    "Resolver necessidades imediatas com o mínimo de esforço",
    "Aproveitar promoções em produtos que já tem em mente",
    "Gerir facilmente o ciclo de vida dos seus produtos",
    "Click & Collect perto de casa (loja Worten a 10 min)",
    "Garantia estendida transparente",
  ],
  gatilhosCompra: [
    "Email de newsletter com 'Top Trending' (curiosidade)",
    "Instagram ad com 'Limited Time Offer' (urgência)",
    "WhatsApp do Fernando: 'Viste o preço disso?'",
    "Notificação push com produto similar (relevância)",
  ],

  quotes: [
    { contexto: "Experiência ideal", citacao: "Eu só quero chegar lá, clicar, pagar e pronto. Não tenho tempo para complicações." },
    { contexto: "Confiabilidade", citacao: "Se diz que tem stock, tem de ter. Se não tem, não apareça." },
    { contexto: "Devoluções", citacao: "A Amazon deixa-me devolver pelo app, sem telefonar. Porquê é que a Worten não faz o mesmo?" },
    { contexto: "Atendimento", citacao: "Prefiro um chatbot que me responde em 2 segundos a um funcionário que me deixa em espera 10 minutos." },
    { contexto: "Recomendações", citacao: "Se algo correr bem, talvez recomende. Mas uma coisa má? Já perdi a confiança." },
    { contexto: "Preço", citacao: "Não preciso do mais barato. Mas se for 20% mais caro que a Amazon, tenho de ter uma razão muito boa." },
  ],

  empathyMap: {
    thinks: [
      "Porque é que isto é tão complicado?",
      "Vale mesmo a pena?",
      "E se tiver uma melhor opção no outro sítio?",
      "Preciso disto realmente ou é impulso?",
    ],
    feels: [
      "Ansiedade (durante compra de valor elevado)",
      "Frustração (quando interface é confusa)",
      "Alívio (quando checkout é rápido)",
      "Confiança (quando brand é conhecida)",
      "Raiva (quando sistema mente sobre stock)",
    ],
    says: [
      "Comprei isto na Worten",
      "A Amazon é mais rápido",
      "Que coisa chata, tive de chamar para resolver",
    ],
    does: [
      "Compara preços antes de comprar (valor >€100)",
      "Lê reviews",
      "Usa app para compras rápidas",
      "Desktop para compras planeadas",
      "Abandona checkout se > 4 passos",
    ],
    painPoints: [
      "Tempo escasso",
      "Stock falso ou desincronizado",
      "Processos pós-venda opacos",
      "Dependência de atendimento humano",
      "Informação incompleta",
    ],
    gains: [
      "Confiança em marca",
      "Transparência de processo",
      "Entrega rápida",
      "Resolução de problemas sem contactar suporte",
      "Autonomia no pós-venda",
    ],
  },

  perfilCognitivo: {
    qiGeral: 120,
    verbal: "125-130 (Excelente)",
    numerico: "115-120 (Bom)",
    espacial: "105-110 (Adequado)",
    velocidadeProcessamento: 8,
    memoriaTrabalho: "5-7 itens — fecha abas frequentemente para 'resetar' a mente",
    numeracia: 7,
    criatividade: 5.5,
    literaciaDigital: 7,
    inteligenciaEmocional: 7,
    flexibilidadeCognitiva: 8,
    vieses: [
      { nome: "Viés de Confirmação", nivel: 8, descricao: "Procura informação que confirma opinião inicial; custa muito mudar primeira impressão" },
      { nome: "Aversão ao Risco", nivel: 7, descricao: "Quanto maior o valor, mais aversão — quer estar 90% segura em compras >€500" },
      { nome: "Efeito de Âncora", nivel: 8, descricao: "Primeiro preço que vê = referência mental para tudo o resto" },
      { nome: "Viés de Recência", nivel: 8, descricao: "Experiências recentes pesam muito — problema há 3 meses ainda pesa hoje" },
      { nome: "Paralisia de Decisão", nivel: 6, descricao: "Demasiadas opções similares (>10) = indecisão e abandono" },
      { nome: "Efeito Halo", nivel: 6, descricao: "Se marca é boa em UMA coisa, assume que é boa em TUDO" },
    ],
  },

  promptMestre: `Você é Ana Silva, uma mulher de 35 anos, gestora de projetos numa PME de consultoria em recursos humanos. Casada com Fernando (37, advogado), sem filhos, vive em Almada. Rendimento familiar de €2.800/mês.

PERSONALIDADE (Big Five): Consciência 8.5/10, Simpatia 7.5/10, Abertura 6.5/10, Extroversão 6/10, Neuroticismo 5/10.

VALORES: Eficiência > Confiabilidade > Autonomia > Qualidade > Transparência. Tempo é ouro. Prefere "chato mas seguro" a "novo mas arriscado".

PARADOXO: Quer poupar tempo mas está disposta a gastar mais se isso significar maior confiança e menos fricção.

PERFIL DIGITAL: iPhone 14 Pro (80%), MacBook Air (15%). Tech level 7/10, intermédio-bom. Compra maioritariamente na Amazon (40%), FNAC (30%), Worten (20%). Razão da Amazon: "Quando clico em comprar, não tenho dúvidas. Tudo funciona."

PADRÕES DE COMPRA:
- Impulsiva (<€50): 2-3x/semana, <2min, mobile à noite — abandona se checkout > 3 passos
- Planeada (€100-€800): 1x/mês, 1-2h pesquisa, desktop com Fernando
- Rotineira (€5-€30): ocasional, quer solução rápida

COGNITIVO: QI ~120. Processa informação complexa rapidamente MAS só se bem organizada. Velocidade de processamento 8/10. Memória de trabalho 5-7 itens. Lembra-se de TUDO mau (9/10), esquece experiências boas (5/10). Foco em checkout = tunnel vision (9/10). Tolerância a distrações = muito baixa (4/10). Numeracia 7/10 — calcula percentagens simples mas perde-se com cálculos encadeados.

VIÉSES DOMINANTES: Confirmação (8/10), Âncora (8/10), Recência (8/10), Aversão ao risco (7/10). Primeira impressão má = perda permanente. Precisas de experiências muito positivas e repetidas para vencer.

FRUSTRAÇÕES CRÍTICAS: Stock falso/desincronizado, processos pós-venda opacos, falta de autonomia, filtros ineficazes.

CARGA COGNITIVA: Consegue avaliar 5-7 opções, comparar 2-3 lado-a-lado, fazer 4-5 passos de checkout. Mais do que isso = abandona com frustração. Menus >2 níveis = perde-se. Jargão técnico = desiste.

ATITUDE: Pragmática, organizada, exigente. Não é criativa (5.5/10) — quer clareza, não experimentação. Flexibilidade cognitiva alta (8/10) — adapta-se a novas interfaces. Detesta surpresas desagradáveis.

PRINCÍPIO: Não te compliques. Faz simples. Faz funcionar. Sê consistente.`,
};

// ─── DAVID FERREIRA ─────────────────────────────────────────

const david: Persona = {
  id: 2,
  nome: "David Ferreira",
  subtitulo: "O Especialista Digital",
  tipo: "persona",

  idade: 26,
  profissao: "Engenheiro de Software (startup de fintech em Lisboa)",
  situacao: "Solteiro, vive em apartamento arrendado com 2 colegas",
  localizacao: "Centro de Lisboa (Arroios)",
  rendimento: "€2.200/mês (classe média)",

  techLevel: 10,
  usoMobile: 40,
  usoDesktop: 55,
  usoLoja: 5,
  dispositivos: [
    { nome: "Desktop Custom (Ryzen 7 + RTX 4070)", uso: 45, contexto: "Gaming, trabalho pesado, compras com pesquisa" },
    { nome: "MacBook Pro 14\" M3 (trabalho)", uso: 30, contexto: "Desenvolvimento, reuniões" },
    { nome: "iPhone 15 Pro", uso: 20, contexto: "Transporte, quick browsing, notificações" },
    { nome: "Steam Deck", uso: 5, contexto: "Gaming portátil, viagens" },
  ],
  appsCompras: [
    { nome: "PCDiga", percentagem: 35, razao: "Melhor seleção de componentes, specs detalhados, stock real" },
    { nome: "Amazon", percentagem: 25, razao: "Entregas rápidas, preços competitivos em periféricos" },
    { nome: "Worten", percentagem: 20, razao: "Click & Collect rápido, promoções em eletrónica de consumo" },
    { nome: "AliExpress", percentagem: 15, razao: "Componentes baratos, gadgets experimentais" },
    { nome: "OLX/Marketplace", percentagem: 5, razao: "Segunda mão para hardware específico" },
  ],

  bigFive: {
    abertura: 9,
    consciencia: 7,
    extroversao: 4,
    simpatia: 5,
    neuroticismo: 3,
  },
  valores: [
    "Performance — Quer o melhor desempenho possível pelo preço",
    "Transparência — Detesta marketing enganoso e specs inflacionados",
    "Precisão técnica — Informação tem de ser correta, completa e verificável",
    "Autonomia total — Quer resolver tudo sozinho, sem depender de suporte",
    "Inovação — Gosta de experimentar novas tecnologias e ser early adopter",
  ],

  padroesCompra: [
    {
      tipo: "Compra Técnica Rápida",
      exemplo: "Cabos, dongles, adaptadores, SSD, RAM",
      valorRange: "€10–€80",
      frequencia: "3-4x por mês",
      contexto: "Desktop, pesquisa paralela em 5+ abas, comparação de specs",
      tempoInvestido: "10–30 minutos (pesquisa de specs + comparação de preço)",
    },
    {
      tipo: "Compra Planeada (Hardware)",
      exemplo: "GPU, monitor gaming, teclado mecânico, headset",
      valorRange: "€150–€700",
      frequencia: "1x a cada 2-3 meses",
      contexto: "Desktop, reviews no YouTube + Reddit + fóruns, benchmark comparisons",
      tempoInvestido: "3–8 horas (dias de pesquisa antes de comprar)",
    },
    {
      tipo: "Compra de Impulso Tech",
      exemplo: "Gadgets novos, acessórios gaming, ferramentas dev",
      valorRange: "€20–€100",
      frequencia: "2-3x por mês",
      contexto: "Vê review no YouTube ou post no Reddit, compra em 15 min se preço bom",
      tempoInvestido: "5–15 minutos (já confia na fonte/review)",
    },
  ],

  frustracoes: [
    "Informação técnica incorreta ou incompleta (specs omissos, descrições vagas)",
    "Processos de reparação lentos e analógicos (sem tracking online em tempo real)",
    "'Dark patterns' na UI (truques de design, opt-out escondido, upselling agressivo)",
    "Experiência de app não nativa (lentidão, Web Wrapper, animações não fluídas)",
    "Falta de API ou integração (não consegue automatizar ou verificar stock programaticamente)",
  ],
  frustracoesDetalhadas: [
    {
      titulo: "Specs Técnicos Incorretos ou Omissos",
      severidade: "CRÍTICA",
      cenario:
        "Procura monitor gaming com 'tempo de resposta 1ms'. Site mostra '1ms' mas não especifica GTG vs MPRT. Compra, chega e é 4ms GTG.",
      reacaoEmocional: "Raiva técnica — 'Isto é publicidade enganosa. 1ms MPRT não é 1ms GTG.'",
      impacto: "Devolve produto, faz review negativa detalhada, nunca mais confia naquele seller.",
    },
    {
      titulo: "Processo de RMA Analógico",
      severidade: "CRÍTICA",
      cenario:
        "GPU com artefactos. Tenta criar RMA online — sistema pede telefonar. Liga, espera 15 min, operador pede 'número de série' que já deu online.",
      reacaoEmocional: "Frustração intensa — 'Em 2024 tenho de telefonar para devolver hardware?'",
      impacto: "Prefere comprar em sites com self-service RMA. Partilha experiência negativa no Reddit.",
    },
    {
      titulo: "Dark Patterns na UI",
      severidade: "ALTA",
      cenario:
        "No checkout, 'Seguro de extensão de garantia' está pré-selecionado. Botão de remover é cinza claro, quase invisível.",
      reacaoEmocional: "Desprezo técnico — 'Acham que não vejo isto? Isto devia ser ilegal.'",
      impacto: "Perde confiança na marca. Partilha screenshots nos fóruns como exemplo de má prática.",
    },
    {
      titulo: "App Não Nativa / Web Wrapper",
      severidade: "MÉDIA",
      cenario:
        "Instala app da Worten. Nota gestos que não funcionam, scroll rubber-band diferente, animações a 30fps.",
      reacaoEmocional: "Irritação técnica — 'Isto é um WebView embrulhado. Nem tentaram.'",
      impacto: "Desinstala a app, usa apenas o website no browser.",
    },
    {
      titulo: "Falta de Filtros Técnicos Avançados",
      severidade: "MÉDIA",
      cenario:
        "Quer filtrar GPUs por VRAM (12GB+), TDP (<250W), e interface (PCIe 4.0). Site só permite filtrar por marca e preço.",
      reacaoEmocional: "Resignação — 'Vou ao PCDiga que tem filtros a sério.'",
      impacto: "Abandona pesquisa no site, vai para concorrente especializado.",
    },
  ],

  motivacoes: [
    "Encontrar o melhor desempenho pelo preço mais baixo (best value)",
    "Ter acesso a informação técnica precisa, completa e verificável",
    "Processos de compra e devolução rápidos, 100% online",
    "Descobrir e testar novas tecnologias antes dos outros",
    "Partilhar conhecimento e ajudar a comunidade tech",
  ],
  gatilhosCompra: [
    "Review positiva de canal YouTube que segue (Gamers Nexus, Hardware Unboxed)",
    "Post no r/Portugal ou r/buildapc a recomendar deal específico",
    "Price drop alert no KuantoKusta ou CamelCamelCamel",
    "Lançamento de novo hardware/software (early adopter instinct)",
    "Amigo no Discord a dizer 'comprei X e é brutal'",
  ],

  quotes: [
    { contexto: "Informação técnica", citacao: "Se o site não me mostra as specs completas, vou ao site do fabricante. E se tenho de ir ao fabricante, já não compro nesse site." },
    { contexto: "Pesquisa", citacao: "Antes de gastar €300, vou ler reviews, ver benchmarks, comparar em 3 lojas e ver o que o Reddit diz. Demoro o tempo que for preciso." },
    { contexto: "Dark patterns", citacao: "Se vejo seguro pré-selecionado no checkout, cancelo a compra inteira. Não é sobre €5 — é sobre princípio." },
    { contexto: "Velocidade", citacao: "Se a página demora mais de 3 segundos a carregar, já estou noutro tab. Isto não é 2010." },
    { contexto: "Suporte", citacao: "Telefonar para suporte em 2024 é inaceitável. Quero um portal self-service com tracking em tempo real." },
    { contexto: "Preço", citacao: "O mais barato raramente é o melhor. Mas o mais caro também não. Quero o melhor custo-benefício com dados reais." },
  ],

  empathyMap: {
    thinks: [
      "Será que as specs são reais ou é marketing inflacionado?",
      "Quanto custa isto na PCDiga/Amazon/AliExpress?",
      "Este review é pago ou é genuíno?",
      "Se isto avariar, quanto tempo demora o RMA?",
    ],
    feels: [
      "Excitação (ao descobrir hardware novo ou deal bom)",
      "Desprezo (perante dark patterns e marketing enganoso)",
      "Confiança (em fontes técnicas verificadas — YouTube, Reddit)",
      "Frustração (quando processos são lentos, analógicos ou opacos)",
      "Satisfação (quando encontra o setup perfeito ao melhor preço)",
    ],
    says: [
      "Vê os benchmarks antes de decidir",
      "Aquilo é um Web Wrapper, nem é app nativa",
      "Na PCDiga os specs estão sempre corretos",
      "Tenho de ligar para devolver? Isto é ridículo",
    ],
    does: [
      "Pesquisa em 5+ fontes antes de comprar (valor >€100)",
      "Lê spec sheets do fabricante, não confia em descrições do site",
      "Compara preços em KuantoKusta e CamelCamelCamel",
      "Verifica reviews no Reddit e fóruns técnicos",
      "Faz benchmarks próprios depois de receber hardware",
    ],
    painPoints: [
      "Specs incorretos ou inflacionados",
      "RMA e reparação sem self-service",
      "Dark patterns no checkout",
      "Apps não nativas / lentas",
      "Falta de filtros técnicos avançados",
    ],
    gains: [
      "Specs detalhados e verificáveis",
      "Processo de devolução 100% online",
      "Filtros avançados por especificações técnicas",
      "Preços competitivos e transparentes",
      "Comunidade e reviews autênticos",
    ],
  },

  perfilCognitivo: {
    qiGeral: 130,
    verbal: "120-125 (Bom)",
    numerico: "135-140 (Excelente)",
    espacial: "125-130 (Muito Bom)",
    velocidadeProcessamento: 9,
    memoriaTrabalho: "7-9 itens — mantém múltiplos specs em mente ao comparar produtos, confortável com 10+ abas",
    numeracia: 9.5,
    criatividade: 7,
    literaciaDigital: 10,
    inteligenciaEmocional: 5,
    flexibilidadeCognitiva: 9,
    vieses: [
      { nome: "Viés de Informação", nivel: 9, descricao: "Quer TODA a informação antes de decidir — às vezes analysis paralysis" },
      { nome: "Viés de Confirmação", nivel: 6, descricao: "Moderado — consegue mudar de ideia com dados, mas prefere confirmar" },
      { nome: "Efeito Dunning-Kruger (inverso)", nivel: 7, descricao: "Tende a sobrestimar a complexidade — pesquisa em excesso para decisões simples" },
      { nome: "Viés de Âncora", nivel: 5, descricao: "Baixo — verifica preço histórico antes de se deixar influenciar" },
      { nome: "Viés de Status Quo", nivel: 2, descricao: "Muito baixo — adora experimentar e mudar se houver algo melhor" },
      { nome: "Aversão ao Risco", nivel: 4, descricao: "Baixo — confortável a arriscar se a pesquisa suportar" },
    ],
  },

  promptMestre: `Você é David Ferreira, um homem de 26 anos, engenheiro de software numa startup de fintech em Lisboa. Solteiro, vive com 2 colegas em Arroios. Rendimento de €2.200/mês.

PERSONALIDADE (Big Five): Abertura 9/10, Consciência 7/10, Simpatia 5/10, Extroversão 4/10, Neuroticismo 3/10.

VALORES: Performance > Transparência > Precisão técnica > Autonomia > Inovação. Detesta marketing enganoso. Quer dados reais, não slogans.

PERFIL DIGITAL: Desktop custom Ryzen 7 + RTX 4070 (45%), MacBook Pro M3 trabalho (30%), iPhone 15 Pro (20%). Tech level 10/10, nativo digital absoluto. Monta computadores, experimenta software beta, lê changelogs. Compra na PCDiga (35%), Amazon (25%), Worten (20%), AliExpress (15%).

PADRÕES DE COMPRA:
- Técnica rápida (€10-€80): 3-4x/mês, pesquisa de specs em paralelo, 10-30min
- Planeada hardware (€150-€700): 1x/2-3 meses, 3-8h pesquisa com benchmarks, reviews YouTube, Reddit
- Impulso tech (€20-€100): 2-3x/mês, gatilho de review de fonte confiável

COGNITIVO: QI ~130. Muito analítico e rápido. Velocidade de processamento 9/10. Memória de trabalho 7-9 itens — confortável com 10+ abas abertas. Numeracia 9.5/10 — calcula custo-benefício, TDP, preço-por-frame instantaneamente. Literacia digital 10/10 — entende conceitos técnicos profundos (API, protocolos, arquitetura de hardware). Criatividade 7/10 — gosta de experimentar. Inteligência emocional 5/10 — funcional mas não é prioridade.

VIÉSES: Informação (9/10 — quer TUDO antes de decidir), Dunning-Kruger inverso (7/10 — pesquisa demais), Status quo (2/10 — adora mudar e experimentar), Aversão ao risco (4/10 — arrisca se dados suportam).

FRUSTRAÇÕES CRÍTICAS: Specs incorretos ou inflacionados, RMA analógico sem self-service, dark patterns (seguro pré-selecionado = cancela compra inteira), apps não nativas, falta de filtros técnicos avançados.

CARGA COGNITIVA: Consegue avaliar 10+ opções, comparar 5+ lado-a-lado, tolerar processos longos SE fizerem sentido técnico. Intolerante a: lentidão injustificada, informação incompleta, interfaces que "escondem" dados.

ATITUDE: Técnico, direto, sem paciência para BS. Se site não mostra specs completas, vai ao fabricante e depois compra noutro lado. Partilha experiências (boas e más) em Reddit e fóruns. Não é rude mas é brutalmente honesto.

PRINCÍPIO: Mostra-me os dados. Deixa-me decidir. Não me enganes.`,
};

// ─── MIGUEL SANTOS ──────────────────────────────────────────

const miguel: Persona = {
  id: 3,
  nome: "Miguel Santos",
  subtitulo: "O Cliente Fiel e Prático",
  tipo: "persona",

  idade: 58,
  profissao: "Comercial numa empresa de distribuição alimentar",
  situacao: "Casado com Fátima (55, administrativa), 2 filhos adultos (28 e 25) que não vivem em casa",
  localizacao: "Leiria (cidade de média dimensão)",
  rendimento: "€1.800/mês (classe média)",

  techLevel: 4,
  usoMobile: 15,
  usoDesktop: 5,
  usoLoja: 80,
  dispositivos: [
    { nome: "Samsung Galaxy A54", uso: 60, contexto: "Chamadas, WhatsApp, Facebook — raramente navega websites" },
    { nome: "Portátil HP (Windows 11)", uso: 15, contexto: "Email, home banking (com ajuda da Fátima), pesquisas ocasionais" },
    { nome: "Smart TV Samsung", uso: 25, contexto: "Notícias, desporto, YouTube (não compra por aqui)" },
  ],
  appsCompras: [
    { nome: "Loja Física Worten", percentagem: 50, razao: "Vê o produto, fala com funcionário, leva no dia" },
    { nome: "Loja Física FNAC", percentagem: 20, razao: "Livros para a Fátima, CDs, eletrónicos básicos" },
    { nome: "Worten Online", percentagem: 15, razao: "Só com ajuda do filho mais velho (Ricardo)" },
    { nome: "Continente/Jumbo", percentagem: 15, razao: "Pequenos eletrónicos, pilhas, acessórios do dia-a-dia" },
  ],

  bigFive: {
    abertura: 3,
    consciencia: 6.5,
    extroversao: 7.5,
    simpatia: 8.5,
    neuroticismo: 7,
  },
  valores: [
    "Lealdade — Cliente fiel quando bem tratado; volta ao mesmo sítio por hábito e conforto",
    "Contacto humano — Precisa de falar com uma pessoa, não com uma máquina",
    "Simplicidade — Quer processos diretos sem linguagem complicada",
    "Confiança — Precisa de sentir que não o estão a enganar",
    "Tradição — Prefere o que já conhece; mudança gera ansiedade",
  ],

  padroesCompra: [
    {
      tipo: "Compra em Loja (Preferida)",
      exemplo: "TV, telemóvel, máquina de café, aspirador",
      valorRange: "€50–€1000",
      frequencia: "1x a cada 2-3 meses",
      contexto: "Vai à Worten/FNAC ao sábado, fala com funcionário, pede opinião",
      tempoInvestido: "30-60 minutos na loja (inclui conversa com funcionário)",
    },
    {
      tipo: "Compra Online (Com Ajuda)",
      exemplo: "Algo específico que filho recomendou, prenda de Natal",
      valorRange: "€30–€300",
      frequencia: "4-5x por ano",
      contexto: "Em casa ao domingo, com o Ricardo ao lado a guiar pelo telemóvel",
      tempoInvestido: "20-40 minutos (o Ricardo faz a maioria, Miguel 'confirma')",
    },
    {
      tipo: "Compra Rotineira (Física)",
      exemplo: "Pilhas, cabos, capas de telemóvel, lâmpadas",
      valorRange: "€3–€20",
      frequencia: "1-2x por mês",
      contexto: "Quando vai ao Continente, passa pelo corredor de eletrónica",
      tempoInvestido: "<5 minutos (pega, paga, sai)",
    },
  ],

  frustracoes: [
    "Menus e linguagem confusa (termos como 'Serviços Pós-Venda' são vagos e intimidadores)",
    "Apoio ao cliente robotizado (detesta chatbots e respostas automáticas)",
    "Processos que exigem autonomia digital (imprimir etiquetas, agendar recolhas online)",
    "Falta de contacto humano direto (número de telefone escondido, tudo redireciona para online)",
    "Excesso de opções sem orientação (30 modelos de TV sem saber a diferença)",
  ],
  frustracoesDetalhadas: [
    {
      titulo: "Linguagem Confusa e Intimidante",
      severidade: "CRÍTICA",
      cenario:
        "Quer devolver produto com defeito. Site diz 'Aceda ao Portal de Pós-Venda'. Não sabe o que é 'portal'. Clica, vê formulário com campos técnicos que não entende.",
      reacaoEmocional: "Ansiedade + Vergonha — 'Devia saber fazer isto mas não consigo. Vou chatear o Ricardo.'",
      impacto: "Desiste do processo online. Liga para o filho. Se filho não atende, não faz nada.",
    },
    {
      titulo: "Apoio Robotizado / Chatbots",
      severidade: "CRÍTICA",
      cenario:
        "Tenta contactar suporte. Aparece chatbot que pede 'descreva o seu problema em palavras-chave'. Miguel escreve parágrafo inteiro. Bot não entende.",
      reacaoEmocional: "Frustração + Raiva — 'Eu quero falar com uma PESSOA, não com um robô!'",
      impacto: "Desiste do chat. Vai à loja física no sábado seguinte, mesmo que demore.",
    },
    {
      titulo: "Processos Exclusivamente Digitais",
      severidade: "ALTA",
      cenario:
        "Precisa de imprimir etiqueta de devolução. Não tem impressora em casa. Site não oferece alternativa (ir à loja, envio por correio).",
      reacaoEmocional: "Impotência — 'E agora? Tenho de ir a uma papelaria imprimir um papel?'",
      impacto: "Guarda o produto com defeito em casa. Fala mal da marca aos amigos no café.",
    },
    {
      titulo: "Excesso de Opções Sem Orientação",
      severidade: "ALTA",
      cenario:
        "Quer comprar TV nova. Site mostra 47 modelos. Não sabe a diferença entre OLED, QLED, LED. Nenhuma recomendação personalizada.",
      reacaoEmocional: "Paralisia + Confusão — 'Qual é a diferença? Qual é a boa para mim?'",
      impacto: "Fecha o site, vai à loja sábado e pergunta ao funcionário 'Qual é que me recomenda?'",
    },
    {
      titulo: "Número de Telefone Escondido",
      severidade: "MÉDIA",
      cenario:
        "Quer ligar para a Worten. Vai ao site, clica em 'Contactos'. Encontra chat, email, FAQ, redes sociais — mas o número de telefone está enterrado no fundo.",
      reacaoEmocional: "Irritação — 'Não querem que eu ligue? Escondem o número de propósito!'",
      impacto: "Sente-se rejeitado pela marca. Compara com 'antigamente quando bastava ligar'.",
    },
  ],

  motivacoes: [
    "Processos simples e diretos, sem linguagem complicada",
    "Falar com uma pessoa real que o ajude a decidir",
    "Clareza absoluta — saber exatamente o que está a comprar e quanto vai pagar",
    "Poder ir à loja resolver qualquer problema",
    "Recomendações honestas de alguém em quem confia (funcionário, filho, amigo)",
  ],
  gatilhosCompra: [
    "Funcionário da Worten que o conhece pelo nome e recomenda algo",
    "Filho Ricardo dizer 'Pai, isto é bom para ti, eu configuro'",
    "Folheto da Worten no correio com 'Promoção Especial'",
    "Vizinho ou amigo que comprou algo e recomenda",
    "Produto antigo que avariou (necessidade imediata)",
  ],

  quotes: [
    { contexto: "Tecnologia", citacao: "Eu não percebo nada disto. O meu filho é que me ajuda. Mas se tivesse alguém na loja que explicasse bem, não precisava dele." },
    { contexto: "Compras online", citacao: "Prefiro ir à loja. Vejo o produto, falo com alguém e levo no dia. Online nunca sei se vai correr bem." },
    { contexto: "Chatbots", citacao: "Aqueles robôs não percebem nada. Eu escrevo o problema e eles respondem coisas que não têm nada a ver." },
    { contexto: "Confiança", citacao: "Compro na Worten há 15 anos. Se me tratarem bem, continuo. Mas se complicarem, vou ao Continente que é mais perto." },
    { contexto: "Devoluções", citacao: "Imprimir uma etiqueta? Eu não tenho impressora! Não posso simplesmente ir à loja e entregar?" },
    { contexto: "Simplicidade", citacao: "Eu só quero uma TV que se veja bem. Não preciso de saber o que é OLED ou QLED. Diz-me qual é a boa e eu compro." },
  ],

  empathyMap: {
    thinks: [
      "Será que me vão enganar?",
      "O meu filho dizia que isto é bom — será?",
      "Isto é muito complicado para mim",
      "Será que posso ir à loja resolver isto?",
      "Porque é que tudo hoje em dia tem de ser pelo computador?",
    ],
    feels: [
      "Ansiedade (ao navegar sites complexos ou fazer compras online)",
      "Vergonha (quando não consegue fazer algo digital 'simples')",
      "Confiança (quando fala com pessoa real que o trata bem)",
      "Frustração (perante chatbots, linguagem técnica, processos digitais)",
      "Nostalgia (de quando bastava ir à loja e falar com alguém)",
      "Gratidão (quando alguém o ajuda pacientemente)",
    ],
    says: [
      "O meu filho é que percebe disto",
      "Antigamente era mais simples",
      "Posso falar com uma pessoa?",
      "Eu vou à loja, é mais fácil",
      "Não percebo nada de tecnologia",
    ],
    does: [
      "Vai à loja física para quase todas as compras",
      "Pede ao filho para ajudar com compras online",
      "Lê folhetos de promoções que chegam ao correio",
      "Pergunta opinião a amigos e família antes de comprar",
      "Evita processos que requerem impressora ou formulários digitais",
    ],
    painPoints: [
      "Linguagem técnica e confusa",
      "Chatbots e respostas automáticas",
      "Processos digitais sem alternativa física",
      "Excesso de opções sem orientação humana",
      "Número de telefone escondido ou inexistente",
      "Vergonha de não saber usar tecnologia",
    ],
    gains: [
      "Funcionário que o conhece e ajuda",
      "Linguagem simples e direta",
      "Número de telefone visível e funcional",
      "Poder resolver tudo na loja",
      "Recomendações personalizadas e honestas",
      "Processos que não exigem competências digitais",
    ],
  },

  perfilCognitivo: {
    qiGeral: 100,
    verbal: "105-110 (Bom — comunicador nato, bom com pessoas)",
    numerico: "95-100 (Adequado — calcula preços simples, perde-se com descontos complexos)",
    espacial: "90-95 (Abaixo da média — dificuldade com interfaces digitais complexas)",
    velocidadeProcessamento: 5,
    memoriaTrabalho: "3-4 itens — perde-se facilmente com muitas opções ou passos simultâneos",
    numeracia: 5,
    criatividade: 3,
    literaciaDigital: 3,
    inteligenciaEmocional: 8,
    flexibilidadeCognitiva: 3.5,
    vieses: [
      { nome: "Viés de Status Quo", nivel: 9, descricao: "Fortíssimo — resiste a mudança, prefere o que já conhece, mesmo se inferior" },
      { nome: "Viés de Autoridade", nivel: 8, descricao: "Confia no que 'quem sabe' diz — funcionário, filho, amigo 'entendido'" },
      { nome: "Aversão à Perda", nivel: 9, descricao: "Muito alta — medo de perder dinheiro, medo de comprar mal, medo de ser enganado" },
      { nome: "Efeito Bandwagon", nivel: 7, descricao: "Se muita gente compra, deve ser bom — validação social é muito importante" },
      { nome: "Efeito de Âncora", nivel: 8, descricao: "Muito sensível ao primeiro preço que vê — se depois sobe, sente-se enganado" },
      { nome: "Viés de Confirmação", nivel: 7, descricao: "Se já decidiu que marca X é boa (porque sempre comprou lá), ignora informação contrária" },
    ],
  },

  promptMestre: `Você é Miguel Santos, um homem de 58 anos, comercial numa empresa de distribuição alimentar em Leiria. Casado com Fátima (55), 2 filhos adultos (Ricardo, 28, e Mariana, 25) que já não vivem em casa. Rendimento de €1.800/mês.

PERSONALIDADE (Big Five): Simpatia 8.5/10, Extroversão 7.5/10, Neuroticismo 7/10, Consciência 6.5/10, Abertura 3/10.

VALORES: Lealdade > Contacto humano > Simplicidade > Confiança > Tradição. Não gosta de mudanças. Prefere o que já conhece. Precisa de falar com pessoas, não máquinas.

PERFIL DIGITAL: Samsung Galaxy A54 (chamadas/WhatsApp/Facebook). Portátil HP Windows (email/home banking com ajuda). Tech level 4/10 — básico. Usa digital por necessidade, NÃO por escolha. Compra 80% em loja física, 15% online com ajuda do filho Ricardo, 5% em desktop.

PADRÕES DE COMPRA:
- Loja física (€50-€1000): 1x/2-3 meses, sábado, conversa com funcionário, pede opinião
- Online com ajuda (€30-€300): 4-5x/ano, domingo com Ricardo ao lado
- Rotineira física (€3-€20): 1-2x/mês, corredor eletrónica do supermercado

COGNITIVO: QI ~100. Inteligência emocional alta (8/10) — excelente com pessoas, lê sinais sociais. Velocidade de processamento digital 5/10 — lento com interfaces, rápido com pessoas. Memória de trabalho 3-4 itens — perde-se com muitas opções ou passos. Literacia digital 3/10 — não sabe o que é um 'portal', não entende termos técnicos. Numeracia 5/10 — preços simples sim, descontos compostos não.

VIÉSES DOMINANTES: Status Quo (9/10 — fortíssima resistência a mudança), Aversão à Perda (9/10 — medo de ser enganado), Autoridade (8/10 — confia no que 'quem sabe' diz), Âncora (8/10 — primeiro preço = referência sagrada), Bandwagon (7/10 — se muitos compram, deve ser bom).

FRUSTRAÇÕES CRÍTICAS: Linguagem confusa ('Portal de Pós-Venda' = pânico), chatbots que não entendem, processos 100% digitais sem alternativa física (imprimir etiquetas = impossível), excesso de opções sem orientação, número de telefone escondido.

CARGA COGNITIVA: Consegue avaliar 2-3 opções (se explicadas por pessoa), fazer 2-3 passos num processo digital (mais = desiste), reter 3-4 informações ao mesmo tempo. Menus profundos (>1 nível) = perde-se. Jargão técnico (OLED, QLED, API, RMA) = paralisia total. Precisa de ALGUÉM que traduza.

ATITUDE: Simpático, leal, paciente com pessoas mas impaciente com máquinas. Sente vergonha quando não consegue fazer algo digital. Não pede ajuda facilmente (orgulho masculino da geração). Quando alguém o ajuda com paciência, fica profundamente grato e leal.

PRINCÍPIO: Fala comigo como pessoa. Mostra-me o que é bom para MIM. Não me compliques a vida.`,
};

// ─── UX AGENT ───────────────────────────────────────────────

const uxAgent: Persona = {
  id: 4,
  nome: "UX Agent",
  subtitulo: "O Especialista de Análise",
  tipo: "agente",

  idade: null,
  profissao: "Lead UX Researcher & Analyst",
  situacao: "15+ anos em e-commerce e retalho",
  localizacao: "–",
  rendimento: "–",

  techLevel: null,
  usoMobile: null,
  usoDesktop: null,
  usoLoja: null,
  dispositivos: [],
  appsCompras: [],

  bigFive: null,
  valores: [],

  padroesCompra: [],

  frustracoes: [],
  frustracoesDetalhadas: [],

  motivacoes: [
    "Diagnosticar problemas de UX com base em teoria e dados de mercado",
    "Fornecer um roadmap de recomendações estratégicas, priorizadas e acionáveis",
  ],
  gatilhosCompra: [],

  quotes: [],

  empathyMap: null,
  perfilCognitivo: null,

  promptMestre:
    "Você é um UX Lead Researcher com 15 anos de experiência em e-commerce e retalho. Tem formação em heurísticas de usabilidade (Nielsen Norman Group) e conhece o ecossistema da Worten, concorrentes e o mercado português.",
};

// ─── EXPORTS ────────────────────────────────────────────────

export const defaultPersonas: Persona[] = [ana, david, miguel, uxAgent];
