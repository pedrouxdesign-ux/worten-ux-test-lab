import { useState } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type Friction = {
  number: number;
  title: string;
  description: string;
  zone: string;
  severity: string;
  impact: string;
};

export type ConfusionQuote = {
  context: string;
  quote: string;
};

export type ParsedReport = {
  personaName: string;
  personaSubtitle: string;
  scenarioName: string;
  category: string;
  objetivo: string;
  stepsCount: number | null;
  parsedAt: string;
  completionStatus: "Sim" | "Parcialmente" | "Não" | null;
  completionDetail: string;
  timeEstimate: string;
  frictions: Friction[];
  confusionQuotes: ConfusionQuote[];
  executiveSummary: string;
  recommendations: string;
  overallImpact: string;
};

export type SavedReport = ParsedReport & { id: string };

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Score severity for sorting (higher = more critical) */
export function severityScore(sev: string): number {
  const s = sev.toUpperCase();
  if (s.includes("CRÍTICO") || s.includes("CRITICO")) return 6;
  if (s.includes("MÉDIO-ALTO") || s.includes("MEDIO-ALTO")) return 4;
  if (s.includes("ALTO")) return 5;
  if (s.includes("BAIXO-MÉDIO") || s.includes("BAIXO-MEDIO")) return 2;
  if (s.includes("MÉDIO") || s.includes("MEDIO")) return 3;
  if (s.includes("BAIXO")) return 1;
  return 0;
}

function normalizeSeverity(raw: string): string {
  const up = raw.toUpperCase().trim();
  if (up.includes("CRÍTICO") || up.includes("CRITICO")) return "CRÍTICO";
  if (up.includes("MÉDIO-ALTO") || up.includes("MEDIO-ALTO")) return "MÉDIO-ALTO";
  if (up.includes("ALTO")) return "ALTO";
  if (up.includes("BAIXO-MÉDIO") || up.includes("BAIXO-MEDIO")) return "BAIXO-MÉDIO";
  if (up.includes("MÉDIO") || up.includes("MEDIO")) return "MÉDIO";
  if (up.includes("BAIXO")) return "BAIXO";
  return raw.trim();
}

/** Extract a named field from a block of bullet-point text */
function extractField(block: string, names: string[]): string {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match: "* Field: value" or "- Field: value" or "Field: value"
    const regex = new RegExp(
      `(?:^|[*\\-•]\\s*)${escaped}[:\\s]+([^\\n]{3,}(?:\\n(?![*\\-•]\\s*\\S)[^\\n]+)*)`,
      "im"
    );
    const match = block.match(regex);
    if (match?.[1]?.trim()) {
      return match[1].replace(/\n/g, " ").trim();
    }
  }
  return "";
}

// ─── MAIN PARSER ──────────────────────────────────────────────────────────────

export function parseReport(rawText: string): ParsedReport | null {
  if (!rawText || rawText.trim().length < 100) return null;

  // Normalize line endings
  const text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

  // ─── 1. PERSONA ─────────────────────────────────────────────────
  let personaName = "";
  let personaSubtitle = "";

  const personaSection = text.match(
    /#{0,3}\s*PERSONA\s*\n([\s\S]*?)(?:---|#{0,3}\s*TAREFA)/i
  );
  if (personaSection) {
    const firstLine = personaSection[1].trim().split("\n")[0];
    // Try "**Name** — Subtitle" or "Name — Subtitle"
    const nameMatch = firstLine.match(/\*{0,2}([^*—\-]+?)\*{0,2}\s*[—\-]{1,2}\s*(.+)/);
    if (nameMatch) {
      personaName = nameMatch[1].replace(/\*/g, "").trim();
      personaSubtitle = nameMatch[2].replace(/\*/g, "").trim();
    }
  }

  // ─── 2. SCENARIO ────────────────────────────────────────────────
  let scenarioName = "";
  let category = "";
  let objetivo = "";

  const tarefaSection = text.match(
    /#{0,3}\s*TAREFA\s*\n([\s\S]*?)(?:---|#{0,3}\s*ESTRUTURA)/i
  );
  if (tarefaSection) {
    const body = tarefaSection[1].trim();
    scenarioName = body.split("\n")[0].replace(/\*\*/g, "").trim();
    const catMatch = body.match(/Categoria:\s*([^·•\n]+)/i);
    if (catMatch) category = catMatch[1].trim();
    const objMatch = body.match(/Objetivo:\s*([^\n]+)/i);
    if (objMatch) objetivo = objMatch[1].replace(/\*\*/g, "").trim();
  }

  // ─── 3. STEPS COUNT ─────────────────────────────────────────────
  const stepsMatches = [...text.matchAll(/(\d+)\s*steps/gi)];
  const stepsCount =
    stepsMatches.length > 0
      ? parseInt(stepsMatches[stepsMatches.length - 1][1])
      : null;

  // ─── 4. FIND REPORT SECTION (last/most complete) ────────────────
  let reportText = text;

  // Prefer text after <turn_answer_start> if present
  const answerIdx = text.lastIndexOf("<turn_answer_start>");
  if (answerIdx !== -1) {
    reportText = text.slice(answerIdx);
  } else {
    // Find last RELATÓRIO section
    const allRelatorio = [...text.matchAll(/RELATÓRIO/gi)];
    if (allRelatorio.length > 0) {
      const lastIdx = allRelatorio[allRelatorio.length - 1].index ?? 0;
      reportText = text.slice(Math.max(0, lastIdx - 30));
    }
  }

  // ─── 5. COMPLETION STATUS ───────────────────────────────────────
  let completionStatus: "Sim" | "Parcialmente" | "Não" | null = null;
  let completionDetail = "";

  const statusArea = reportText.slice(0, 2500);
  if (/Parcialmente/i.test(statusArea)) {
    completionStatus = "Parcialmente";
  } else if (/\bSim\b/i.test(statusArea)) {
    completionStatus = "Sim";
  } else if (/\bNão\b/i.test(statusArea)) {
    completionStatus = "Não";
  }

  const detailMatch = reportText.match(
    /Conseguiu completar[^\n]*\n?([\s\S]*?)(?=\n\s*\d+\.\s*Tempo|\n\s*\d+\.\s*Fricç|\nTempo|\nFricç|$)/i
  );
  if (detailMatch) {
    completionDetail = detailMatch[1]
      .replace(/^[*\-•\s]+/gm, "")
      .trim()
      .slice(0, 350);
  }

  // ─── 6. TIME ESTIMATE ───────────────────────────────────────────
  let timeEstimate = "";
  const timeMatch = reportText.match(
    /Tempo estimado[^:\n]*:?\s*\n?([^\n]{5,100})/i
  );
  if (timeMatch) {
    timeEstimate = timeMatch[1].replace(/^[*\-•\s~]+/, "").trim();
  }

  // ─── 7. FRICTIONS ───────────────────────────────────────────────
  const frictions: Friction[] = [];

  // Split text on FRICÇÃO markers
  const frictionBlocks = reportText
    .split(/(?=FRICÇÃO\s*#?\d+)/i)
    .filter((b) => /^FRICÇÃO\s*#?\d+/i.test(b.trim()));

  for (const block of frictionBlocks) {
    const headerMatch = block.match(/^FRICÇÃO\s*#?(\d+)[:\s*]+([^\n]+)/i);
    if (!headerMatch) continue;

    const number = parseInt(headerMatch[1]);
    const title = headerMatch[2]
      .replace(/[*_]/g, "")
      .trim();
    const body = block.slice(headerMatch[0].length);

    const description = extractField(body, [
      "Descrição",
      "Descricao",
      "Descriçao",
    ]);
    const zone = extractField(body, [
      "Zona da página",
      "Zona da pagina",
      "Zona",
    ]);
    const severityRaw = extractField(body, ["Severidade"]);
    const impact = extractField(body, [
      "Impacto estimado na conversão",
      "Impacto estimado na conversao",
      "Impacto estimado",
      "Impacto",
    ]);

    if (title) {
      frictions.push({
        number,
        title,
        description,
        zone,
        severity: normalizeSeverity(severityRaw || ""),
        impact,
      });
    }
  }

  // ─── 8. CONFUSION QUOTES ────────────────────────────────────────
  const confusionQuotes: ConfusionQuote[] = [];

  const confusionMatch = reportText.match(
    /Momentos de confus[ãa]o[\s\S]*?(?=RESUMO|Impacto global|\n#{1,3}|$)/i
  );
  if (confusionMatch) {
    const section = confusionMatch[0];
    // Pattern: "Context text:" then "quote text" (handles line breaks between them)
    const pattern =
      /([A-Za-záàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ][^:\n"]{5,100}):?\s*\n?"([^"]{20,700})"/g;
    let m;
    while ((m = pattern.exec(section)) !== null) {
      const context = (m[1] || "").trim().replace(/^[*\-•]\s*/, "");
      const quote = m[2].trim();
      // Avoid extracting field labels as quotes
      if (!context.match(/^(Descrição|Zona|Severidade|Impacto)/i)) {
        confusionQuotes.push({ context, quote });
      }
    }

    // Fallback: naked quotes > 40 chars if nothing found
    if (confusionQuotes.length === 0) {
      const naked = [...section.matchAll(/"([^"]{40,700})"/g)];
      for (const nq of naked) {
        confusionQuotes.push({ context: "", quote: nq[1].trim() });
      }
    }
  }

  // ─── 9. EXECUTIVE SUMMARY & RECOMMENDATIONS ─────────────────────
  let executiveSummary = "";
  let recommendations = "";
  let overallImpact = "";

  const resumoMatch = reportText.match(
    /RESUMO EXECUTIVO\s*\n([\s\S]*?)(?=Recomenda|Impacto global|$)/i
  );
  if (resumoMatch) {
    executiveSummary = resumoMatch[1].trim().slice(0, 1500);
  }

  const recMatch = reportText.match(
    /Recomenda[çc][aã]o[^\n]*\n?([\s\S]*?)(?=Impacto|$)/i
  );
  if (recMatch) {
    recommendations = recMatch[1].trim().slice(0, 600);
  }

  const impactMatch = reportText.match(
    /Impacto global[^\n]*\n?([^\n]{10,250})/i
  );
  if (impactMatch) {
    overallImpact = impactMatch[1].trim();
  }

  return {
    personaName,
    personaSubtitle,
    scenarioName,
    category,
    objetivo,
    stepsCount,
    parsedAt: new Date().toISOString(),
    completionStatus,
    completionDetail,
    timeEstimate,
    frictions,
    confusionQuotes,
    executiveSummary,
    recommendations,
    overallImpact,
  };
}

// ─── SAVED REPORTS STORE ──────────────────────────────────────────────────────

const REPORTS_KEY = "worten-ux-reports";

function loadReports(): SavedReport[] {
  try {
    return JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useSavedReports() {
  const [reports, setReports] = useState<SavedReport[]>(loadReports);

  const save = (report: ParsedReport): SavedReport => {
    const saved: SavedReport = { ...report, id: crypto.randomUUID() };
    const updated = [saved, ...reports];
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    setReports(updated);
    return saved;
  };

  const remove = (id: string) => {
    const updated = reports.filter((r) => r.id !== id);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    setReports(updated);
  };

  return { reports, save, remove };
}
