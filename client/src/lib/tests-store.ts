import { useState } from "react";
import type { Persona } from "@/pages/UsersManagement";
import type { Scenario } from "@/pages/ScenariosManagement";

export type StoredTest = {
  id: string;
  personaId: number;
  scenarioId: number;
  prompt: string;
  createdAt: string;
};

const STORAGE_KEY = "worten-ux-tests";

function loadTests(): StoredTest[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useTestsStore() {
  const [tests, setTests] = useState<StoredTest[]>(loadTests);

  const saveTests = (newTests: StoredTest[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTests));
    setTests(newTests);
  };

  const addTest = (test: Omit<StoredTest, "id" | "createdAt">) => {
    const newTest: StoredTest = {
      ...test,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newTest, ...tests];
    saveTests(updated);
    return newTest;
  };

  const removeTest = (id: string) => {
    saveTests(tests.filter(t => t.id !== id));
  };

  return { tests, addTest, removeTest };
}

/**
 * Copies text to clipboard using the modern API with a textarea fallback.
 * Works in HTTP contexts (localhost, iframes) where navigator.clipboard may be unavailable.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Modern async clipboard API (requires HTTPS or localhost with permissions)
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to execCommand fallback
    }
  }

  // Legacy fallback: create a hidden textarea, select it, execCommand('copy')
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

export function generatePrompt(persona: Persona, scenario: Scenario): string {
  const lines: string[] = [];

  lines.push("# PERSONA");
  lines.push(`**${persona.nome}** — ${persona.subtitulo}`);
  lines.push("");
  lines.push(persona.promptMestre);
  lines.push("");

  const details: string[] = [];
  if (persona.techLevel !== null) details.push(`Nível técnico: ${persona.techLevel}/10`);

  const channels: string[] = [];
  if (persona.usoMobile) channels.push(`Mobile ${persona.usoMobile}%`);
  if (persona.usoDesktop) channels.push(`Desktop ${persona.usoDesktop}%`);
  if (persona.usoLoja) channels.push(`Loja física ${persona.usoLoja}%`);
  if (channels.length) details.push(`Canal preferido: ${channels.join(" · ")}`);

  if (details.length) lines.push(details.join(" · "));

  if (persona.frustracoes.length > 0) {
    lines.push("");
    lines.push("Padrões comportamentais de frustração desta persona (gatilhos genéricos, NÃO cenários específicos):");
    persona.frustracoes.forEach(f => lines.push(`- ${f}`));
  }

  if (persona.motivacoes.length > 0) {
    lines.push("");
    lines.push("Motivações:");
    persona.motivacoes.forEach(m => lines.push(`- ${m}`));
  }

  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("# TAREFA");
  lines.push(`**${scenario.titulo}**`);
  lines.push(`*Categoria: ${scenario.categoria} · Nível Técnico: ${scenario.nivelTecnico}*`);
  lines.push("");
  lines.push(`**Objetivo:** ${scenario.objetivo}`);
  lines.push("");
  lines.push("**Instruções para a simulação:**");
  lines.push(scenario.instrucoes);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("# ESTRUTURA DO RELATÓRIO");
  lines.push("");
  lines.push("IMPORTANTE: O relatório deve ser EQUILIBRADO — documenta tanto o que funciona BEM como o que precisa de melhorar. Não te foques apenas nos problemas.");
  lines.push("");
  lines.push("Após completares a simulação, estrutura o teu relatório com TODAS as seguintes secções:");
  lines.push("");
  lines.push("## 1. Conclusão do Objetivo");
  lines.push("Conseguiu completar o objetivo? (Sim / Parcialmente / Não)");
  lines.push("Justificação breve.");
  lines.push("");
  lines.push("## 2. Tempo Estimado");
  lines.push("Tempo total estimado desde o início até à conclusão (ou abandono).");
  lines.push("");
  lines.push("## 3. Pontos Positivos (O Que Funciona Bem)");
  lines.push("Para CADA aspecto positivo da experiência, documenta como:");
  lines.push("");
  lines.push("PONTO POSITIVO #1: [título curto e descritivo]");
  lines.push("* Descrição: [o que funcionou bem e porquê]");
  lines.push("* Zona da página: [onde na interface este ponto positivo se manifesta]");
  lines.push("* Impacto: [como beneficia o utilizador — confiança, rapidez, clareza, etc.]");
  lines.push("");
  lines.push("(Documenta TODOS os pontos positivos, incluindo: navegação intuitiva, informação clara, feedback adequado, design visual agradável, fluxos simples, linguagem compreensível, etc.)");
  lines.push("");
  lines.push("## 4. Fricções Identificadas");
  lines.push("Para cada problema encontrado, documenta como:");
  lines.push("");
  lines.push("FRICÇÃO #1: [título curto e descritivo]");
  lines.push("* Descrição: [o que aconteceu e o contexto]");
  lines.push("* Zona da página: [onde na interface o problema ocorre]");
  lines.push("* Severidade: Crítico / Alto / Médio-Alto / Médio / Baixo-Médio / Baixo");
  lines.push("* Impacto estimado na conversão: [como afeta a experiência e a probabilidade de conversão]");
  lines.push("");
  lines.push("## 5. Momentos de Confusão");
  lines.push("Citações diretas da persona em momentos de hesitação ou confusão.");
  lines.push("Formato:");
  lines.push("Contexto da situação: \"citação exata da persona entre aspas\"");
  lines.push("");
  lines.push("## 6. RESUMO EXECUTIVO");
  lines.push("Visão geral EQUILIBRADA da experiência:");
  lines.push("- O que a experiência faz BEM (pontos fortes)");
  lines.push("- O que precisa de melhorar (pontos fracos)");
  lines.push("- Balanço geral da qualidade da experiência");
  lines.push("");
  lines.push("## 7. Recomendação prioritária");
  lines.push("A ação mais importante a tomar, com justificação clara.");
  lines.push("");
  lines.push("## 8. Impacto global na conversão");
  lines.push("Resumo de uma frase sobre o impacto total na experiência do utilizador e conversão.");

  // Append scenario-specific points if they add value
  if (scenario.estruturaRelatorio.length > 0) {
    lines.push("");
    lines.push("## 9. Pontos específicos deste cenário");
    lines.push("Inclui também análise sobre:");
    scenario.estruturaRelatorio.forEach((item, i) => {
      lines.push(`${i + 1}. ${item}`);
    });
  }

  return lines.join("\n");
}
