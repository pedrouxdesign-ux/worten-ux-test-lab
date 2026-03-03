import { describe, it, expect, vi, beforeEach } from "vitest";
import { simulatePersonaTest, analyzeWithUxAgent } from "./agents";

// Mock do invokeLLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(async (params) => {
    // Simular resposta do LLM para testes
    return {
      choices: [
        {
          message: {
            content: JSON.stringify({
              executiveSummary: "Teste de sumário",
              detailedAnalysis: "Análise detalhada",
              usabilityDiagnosis: "Diagnóstico",
              recommendations: [
                {
                  priority: "P1",
                  title: "Problema crítico",
                  description: "Descrição do problema",
                  justification: "Justificação",
                },
              ],
            }),
          },
        },
      ],
    };
  }),
}));

describe("Agents", () => {
  describe("simulatePersonaTest", () => {
    it("deve simular teste com persona Ana", async () => {
      const report = await simulatePersonaTest(
        "Ana",
        "Menu da Área de Conta",
        "Encontre a sua última fatura"
      );

      expect(report.personaName).toBe("Ana");
      expect(report.report).toBeDefined();
      expect(typeof report.successfulCompletion).toBe("boolean");
      expect(Array.isArray(report.painPoints)).toBe(true);
    });

    it("deve simular teste com persona David", async () => {
      const report = await simulatePersonaTest(
        "David",
        "Página de Especificações Técnicas",
        "Encontre as especificações de um produto"
      );

      expect(report.personaName).toBe("David");
      expect(report.report).toBeDefined();
    });

    it("deve simular teste com persona Miguel", async () => {
      const report = await simulatePersonaTest(
        "Miguel",
        "Processo de Devolução",
        "Inicie uma devolução de um produto"
      );

      expect(report.personaName).toBe("Miguel");
      expect(report.report).toBeDefined();
    });

    it("deve incluir contexto na simulação quando fornecido", async () => {
      const context = "O utilizador está com pressa";
      const report = await simulatePersonaTest(
        "Ana",
        "Menu",
        "Tarefa",
        context
      );

      expect(report).toBeDefined();
      expect(report.personaName).toBe("Ana");
    });
  });

  describe("analyzeWithUxAgent", () => {
    it("deve analisar relatos das personas", async () => {
      const personaReports = [
        {
          personaName: "Ana",
          report: "Encontrei dificuldade no menu",
          successfulCompletion: false,
          painPoints: ["Menu confuso"],
        },
        {
          personaName: "David",
          report: "Interface não responsiva",
          successfulCompletion: false,
          painPoints: ["Performance lenta"],
        },
        {
          personaName: "Miguel",
          report: "Muito complicado",
          successfulCompletion: false,
          painPoints: ["Linguagem técnica"],
        },
      ];

      const analysis = await analyzeWithUxAgent(
        "Menu da Conta",
        "Encontre a sua fatura",
        personaReports
      );

      expect(analysis.executiveSummary).toBeDefined();
      expect(analysis.detailedAnalysis).toBeDefined();
      expect(analysis.usabilityDiagnosis).toBeDefined();
      expect(Array.isArray(analysis.recommendations)).toBe(true);
    });

    it("deve gerar recomendações priorizadas", async () => {
      const personaReports = [
        {
          personaName: "Ana",
          report: "Menu confuso",
          successfulCompletion: false,
          painPoints: ["Não encontro a opção"],
        },
        {
          personaName: "David",
          report: "Falta informação técnica",
          successfulCompletion: false,
          painPoints: ["Especificações incompletas"],
        },
        {
          personaName: "Miguel",
          report: "Muito complicado",
          successfulCompletion: false,
          painPoints: ["Linguagem confusa"],
        },
      ];

      const analysis = await analyzeWithUxAgent(
        "Feature",
        "Tarefa",
        personaReports
      );

      // Verificar que existem recomendações
      expect(analysis.recommendations.length).toBeGreaterThan(0);

      // Verificar que cada recomendação tem os campos necessários
      analysis.recommendations.forEach((rec) => {
        expect(["P1", "P2", "P3"]).toContain(rec.priority);
        expect(rec.title).toBeDefined();
        expect(rec.description).toBeDefined();
      });
    });

    it("deve incluir benchmarking competitivo quando disponível", async () => {
      const personaReports = [
        {
          personaName: "Ana",
          report: "Teste",
          successfulCompletion: true,
          painPoints: [],
        },
        {
          personaName: "David",
          report: "Teste",
          successfulCompletion: true,
          painPoints: [],
        },
        {
          personaName: "Miguel",
          report: "Teste",
          successfulCompletion: true,
          painPoints: [],
        },
      ];

      const analysis = await analyzeWithUxAgent(
        "Feature",
        "Tarefa",
        personaReports
      );

      // O benchmarking pode ser opcional
      if (analysis.competitiveBenchmark) {
        expect(typeof analysis.competitiveBenchmark).toBe("string");
      }
    });
  });
});
