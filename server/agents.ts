import { invokeLLM } from "./_core/llm";
import { getSkillsByAgent } from "./db";

interface PersonaReport {
  personaName: string;
  report: string;
  successfulCompletion: boolean;
  painPoints: string[];
}

interface UxAnalysisResult {
  executiveSummary: string;
  detailedAnalysis: string;
  usabilityDiagnosis: string;
  competitiveBenchmark?: string;
  recommendations: Array<{
    priority: "P1" | "P2" | "P3";
    title: string;
    description: string;
    justification?: string;
  }>;
}

// Load persona prompts
const PERSONAS_PROMPTS = {
  Ana: `Você é Ana, uma mulher de 35 anos, gestora de projetos numa PME. Você é pragmática, organizada e valoriza eficiência acima de tudo. O seu tempo é precioso e não tem paciência para complicações. Você usa a app da Worten em 80% do tempo para pesquisas rápidas, seguir encomendas e compras por impulso. Usa o desktop apenas para compras mais ponderadas e de valor elevado.

Sua confiança nas marcas é conquistada com dificuldade e perdida com facilidade. Uma má experiência é uma quebra de contrato. Você não hesita em mudar para concorrentes como FNAC ou Amazon se sentir que a experiência é mais fiável.

FRUSTRAÇÕES PRINCIPAIS:
- Inconsistência de informação (ver "Disponível" e depois descobrir que não há stock)
- Processos pós-venda obscuros (sem visibilidade clara sobre devoluções/reparações)
- Falta de autonomia (ter de recorrer ao apoio para tarefas simples)
- Filtros de pesquisa ineficazes

MOTIVAÇÕES:
- Resolver necessidades imediatas com o mínimo de esforço
- Aproveitar promoções em produtos que já tem em mente
- Gerir facilmente o ciclo de vida dos seus produtos

Quando avalia uma feature ou ecrã, você pensa como alguém que quer resolver algo rapidamente. Você fica frustrada com menus confusos, informação pouco clara ou processos que a fazem perder tempo. Narração em voz alta: descreva cada clique, cada pensamento, cada hesitação.`,

  David: `Você é David, um homem de 26 anos, especialista em tecnologia. Você é um "nativo digital" e a tecnologia é a sua paixão. Você monta computadores, experimenta software beta e está sempre a par das últimas tendências. Você usa a Worten porque é uma marca estabelecida, mas não tem lealdade. Você mudaria para Globaldata, PCDIGA ou Amazon se o preço fosse melhor ou as especificações estivessem mais claras.

Você é meticuloso e exigente. Antes de fazer qualquer compra de tecnologia, investe horas em pesquisa. Você desconfia de marketing vago e foca-se em especificações técnicas. Uma má experiência não é apenas uma frustração pessoal; é conteúdo potencial para um tweet ou post no Reddit onde você avisa a sua comunidade.

FRUSTRAÇÕES PRINCIPAIS:
- Informação incorreta ou incompleta (descrições vagas, especificações omissas)
- Processos de reparação lentos e analógicos (sem visibilidade online em tempo real)
- "Dark patterns" na UI (truques de design que tentam induzi-lo em erro)
- Experiência de app não nativa (lentidão, animações não fluídas)

MOTIVAÇÕES:
- Encontrar o melhor desempenho pelo preço mais baixo
- Ter acesso a informação técnica precisa e detalhada
- Processos rápidos e transparentes

Quando avalia uma feature, você é crítico e técnico. Você deteta imediatamente se algo está errado. Você espera uma experiência de topo em ambos os canais (desktop e mobile). Narração em voz alta: descreva o que você espera ver, o que realmente vê, e onde detecta problemas de UX ou informação incorreta.`,

  Miguel: `Você é Miguel, um homem de 58 anos, comercial e cliente fiel da Worten há muitos anos. Você pertence à Geração X e adaptou-se ao digital por necessidade, não por paixão. Você conhece as lojas Worten, os funcionários e a marca inspira-lhe confiança construída ao longo de décadas.

Você valoriza a conveniência do online, mas o seu modelo mental ainda está muito ligado à loja física. Se algo corre mal online, a sua primeira reação é "tenho de ir à loja resolver isto". Você não tem paciência para chatbots ou FAQs. Você quer falar com uma pessoa, obter uma resposta direta e resolver o problema.

FRUSTRAÇÕES PRINCIPAIS:
- Menus e linguagem confusa (termos como "Serviços Pós-Venda" são vagos e intimidadores)
- Apoio ao cliente robotizado (detesta falar com robôs)
- Processos que exigem autonomia digital (imprimir etiquetas, agendar recolhas)
- Falta de contacto humano

MOTIVAÇÕES:
- Processos simples e diretos
- Clareza absoluta na linguagem
- Contacto fácil com uma pessoa real
- Conveniência sem complicações

Quando avalia uma feature, você procura por clareza e simplicidade. Você fica perdido com menus complexos ou linguagem técnica. Você espera que as coisas simples sejam... simples. Narração em voz alta: descreva o que você procura, onde fica confuso, e o que gostaria que fosse diferente.`,
};

const UX_AGENT_PROMPT = `Você é um UX Lead Researcher com 15 anos de experiência em e-commerce e retalho. Você tem formação profunda em heurísticas de usabilidade (Nielsen Norman Group) e conhece o ecossistema da Worten, os seus concorrentes (FNAC, Amazon, PCDIGA) e o mercado português.

A sua função é analisar os relatos de teste das personas (Ana, David, Miguel), diagnosticar problemas de UX com base em teoria e dados de mercado, e fornecer um roadmap de recomendações estratégicas, priorizadas e acionáveis.

PROCESSO DE ANÁLISE:
1. Leia os três relatos das personas com atenção
2. Identifique os problemas centrais encontrados
3. Enquadre cada problema com heurísticas de Nielsen
4. Cite dados de mercado e benchmarking competitivo quando relevante
5. Priorize os problemas por severidade (Crítico/Bloqueador, Médio/Fricção, Baixo/Ineficiência)
6. Proponha soluções concretas e acionáveis

Seu tom é profissional, baseado em dados e orientado para a ação. Você não faz suposições; você cita evidências dos relatos e do mercado.`;

/**
 * Simula o teste com uma persona específica
 */
export async function simulatePersonaTest(
  personaName: "Ana" | "David" | "Miguel",
  featureName: string,
  userTask: string,
  context?: string
): Promise<PersonaReport> {
  const personaPrompt = PERSONAS_PROMPTS[personaName];

  const systemMessage = `${personaPrompt}

TAREFA DE TESTE:
Feature: ${featureName}
Tarefa: ${userTask}
${context ? `Contexto: ${context}` : ""}

Você vai simular o teste desta feature/ecrã. Narração em voz alta: descreva cada passo que você tentaria fazer, cada clique, cada pensamento, cada hesitação. Descreva o que vê, o que espera ver, e onde encontra dificuldades.

Ao final, indique se conseguiu completar a tarefa com sucesso ou se encontrou dificuldades significativas.`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: `Simule o teste desta feature. Narração completa em voz alta, pensando em voz alta como se estivesse num teste de usabilidade real.`,
      },
    ],
  });

  const reportContent = response.choices[0]?.message.content;
  const report = typeof reportContent === "string" ? reportContent : "";

  // Extrair se completou com sucesso (heurística simples)
  const successKeywords = [
    "consegui",
    "sucesso",
    "completei",
    "conseguiu",
    "completou",
  ];
  const failureKeywords = [
    "dificuldade",
    "não consegui",
    "confuso",
    "perdido",
    "não encontrei",
    "frustrado",
  ];

  const reportLower = report.toLowerCase();
  const successCount = successKeywords.filter((k) =>
    reportLower.includes(k)
  ).length;
  const failureCount = failureKeywords.filter((k) =>
    reportLower.includes(k)
  ).length;

  const successfulCompletion = successCount > failureCount;

  // Extrair pain points (linhas que começam com "-" ou "•")
  const painPoints = report
    .split("\n")
    .filter(
      (line) =>
        line.trim().startsWith("-") ||
        line.trim().startsWith("•") ||
        line.trim().startsWith("*")
    )
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter((line) => line.length > 0)
    .slice(0, 5); // Top 5 pain points

  return {
    personaName,
    report,
    successfulCompletion,
    painPoints,
  };
}

/**
 * Analisa os relatos das personas e gera recomendações do UX Agent
 */
export async function analyzeWithUxAgent(
  featureName: string,
  userTask: string,
  personaReports: PersonaReport[]
): Promise<UxAnalysisResult> {
  const reportsText = personaReports
    .map(
      (r) =>
        `## ${r.personaName} (Sucesso: ${r.successfulCompletion ? "Sim" : "Não"})
${r.report}`
    )
    .join("\n\n---\n\n");

  const systemMessage = `${UX_AGENT_PROMPT}

CONTEXTO DO TESTE:
Feature: ${featureName}
Tarefa: ${userTask}

RELATOS DAS PERSONAS:
${reportsText}

Agora, analise estes relatos e forneça:
1. Sumário Executivo (2-3 problemas mais críticos)
2. Análise Detalhada por Persona
3. Diagnóstico de Usabilidade (com referências a heurísticas de Nielsen)
4. Benchmarking Competitivo (como concorrentes lidam com isto)
5. Roadmap de Recomendações Priorizado (P1, P2, P3)

Forneça a resposta em formato JSON com a seguinte estrutura:
{
  "executiveSummary": "...",
  "detailedAnalysis": "...",
  "usabilityDiagnosis": "...",
  "competitiveBenchmark": "...",
  "recommendations": [
    {
      "priority": "P1",
      "title": "...",
      "description": "...",
      "justification": "..."
    }
  ]
}`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content:
          "Analise os relatos das personas e forneça o roadmap de recomendações em JSON.",
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "ux_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            executiveSummary: {
              type: "string",
              description: "Sumário executivo dos principais problemas",
            },
            detailedAnalysis: {
              type: "string",
              description: "Análise detalhada por persona",
            },
            usabilityDiagnosis: {
              type: "string",
              description: "Diagnóstico de usabilidade com heurísticas",
            },
            competitiveBenchmark: {
              type: "string",
              description: "Análise competitiva",
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  priority: {
                    type: "string",
                    enum: ["P1", "P2", "P3"],
                    description: "Prioridade da recomendação",
                  },
                  title: {
                    type: "string",
                    description: "Título da recomendação",
                  },
                  description: {
                    type: "string",
                    description: "Descrição detalhada",
                  },
                  justification: {
                    type: "string",
                    description: "Justificação baseada em dados",
                  },
                },
                required: ["priority", "title", "description"],
                additionalProperties: false,
              },
              description: "Lista de recomendações priorizadas",
            },
          },
          required: [
            "executiveSummary",
            "detailedAnalysis",
            "usabilityDiagnosis",
            "recommendations",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  try {
    const responseContent = response.choices[0]?.message.content;
    const content = typeof responseContent === "string" ? responseContent : "{}";
    const analysis = JSON.parse(content);
    return analysis as UxAnalysisResult;
  } catch (error) {
    console.error("Erro ao fazer parse da análise do UX Agent:", error);
    return {
      executiveSummary: "Erro ao processar análise",
      detailedAnalysis: "",
      usabilityDiagnosis: "",
      recommendations: [],
    };
  }
}
