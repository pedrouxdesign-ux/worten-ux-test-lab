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
    lines.push("Frustrações típicas desta persona:");
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
  lines.push("Após completares a simulação, estrutura o teu relatório com os seguintes pontos:");
  lines.push("");
  scenario.estruturaRelatorio.forEach((item, i) => {
    lines.push(`${i + 1}. ${item}`);
  });

  return lines.join("\n");
}
