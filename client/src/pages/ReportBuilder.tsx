import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Moon,
  Sun,
  FileText,
  Sparkles,
  RotateCcw,
  Save,
  Trash2,
  Clock,
  Target,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Quote,
  Lightbulb,
  TrendingDown,
  TrendingUp,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  parseReport,
  useSavedReports,
  severityScore,
  type ParsedReport,
  type SavedReport,
} from "@/lib/report-parser";

// ─── SEVERITY CONFIG ─────────────────────────────────────────────────────────

const SEV_CONFIG: Record<
  string,
  { border: string; bg: string; text: string; badge: string; bar: string }
> = {
  CRÍTICO: {
    border: "border-l-red-600",
    bg: "bg-red-50 dark:bg-red-950/20",
    text: "text-red-800 dark:text-red-400",
    badge: "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-300",
    bar: "bg-red-600",
  },
  ALTO: {
    border: "border-l-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/20",
    text: "text-orange-800 dark:text-orange-400",
    badge:
      "bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-300",
    bar: "bg-orange-600",
  },
  "MÉDIO-ALTO": {
    border: "border-l-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/20",
    text: "text-orange-700 dark:text-orange-400",
    badge:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    bar: "bg-orange-500",
  },
  MÉDIO: {
    border: "border-l-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-700 dark:text-amber-400",
    badge:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    bar: "bg-amber-500",
  },
  "BAIXO-MÉDIO": {
    border: "border-l-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    text: "text-yellow-700 dark:text-yellow-400",
    badge:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    bar: "bg-yellow-500",
  },
  BAIXO: {
    border: "border-l-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    text: "text-yellow-700 dark:text-yellow-400",
    badge:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    bar: "bg-yellow-400",
  },
};

const SEV_ORDER = [
  "CRÍTICO",
  "ALTO",
  "MÉDIO-ALTO",
  "MÉDIO",
  "BAIXO-MÉDIO",
  "BAIXO",
];

function getSevConfig(sev: string) {
  return (
    SEV_CONFIG[sev] ?? {
      border: "border-l-slate-400",
      bg: "bg-slate-50 dark:bg-slate-800/30",
      text: "text-slate-600 dark:text-slate-400",
      badge:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      bar: "bg-slate-400",
    }
  );
}

const COMPLETION_CONFIG = {
  Sim: {
    badge:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    icon: CheckCircle2,
    label: "Objetivo Concluído",
    color: "text-green-600",
  },
  Parcialmente: {
    badge:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    icon: AlertCircle,
    label: "Concluído Parcialmente",
    color: "text-amber-600",
  },
  Não: {
    badge: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    icon: XCircle,
    label: "Objetivo Não Concluído",
    color: "text-red-600",
  },
};

// ─── REPORT VIEW ─────────────────────────────────────────────────────────────

function ReportView({ report }: { report: ParsedReport }) {
  const [expandedFrictions, setExpandedFrictions] = useState<Set<number>>(
    new Set(report.frictions.map((f) => f.number))
  );
  const [taskOpen, setTaskOpen] = useState(false);

  const toggleFriction = (n: number) => {
    setExpandedFrictions((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  const sortedFrictions = [...report.frictions].sort(
    (a, b) => severityScore(b.severity) - severityScore(a.severity)
  );

  const completionCfg = report.completionStatus
    ? COMPLETION_CONFIG[report.completionStatus]
    : null;

  // Severity counts for distribution bar
  const sevCounts: Record<string, number> = {};
  for (const f of report.frictions) {
    sevCounts[f.severity] = (sevCounts[f.severity] || 0) + 1;
  }
  const maxCount = Math.max(...Object.values(sevCounts), 1);

  const criticalCount = report.frictions.filter(
    (f) => f.severity === "CRÍTICO" || f.severity === "ALTO"
  ).length;

  return (
    <div className="space-y-6">
      {/* ── HERO CARD ────────────────────────────────────────────── */}
      <Card className="shadow-lg overflow-hidden border-0">
        <div className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 p-6 text-white">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Persona + Scenario */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold shrink-0 shadow-lg">
                {report.personaName.charAt(0) || "?"}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
                  <h2 className="text-xl font-bold leading-tight">
                    {report.personaName || "Persona"}
                  </h2>
                  {report.personaSubtitle && (
                    <span className="text-sm text-slate-300">
                      — {report.personaSubtitle}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 font-medium mb-1.5">
                  {report.scenarioName || "Cenário não detectado"}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {report.category && (
                    <span className="inline-flex text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                      {report.category}
                    </span>
                  )}
                  {report.stepsCount && (
                    <span className="inline-flex text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                      {report.stepsCount} passos
                    </span>
                  )}
                  <span className="inline-flex text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                    {new Date(report.parsedAt).toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Completion badge */}
            {completionCfg && report.completionStatus && (
              <div className="shrink-0">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${completionCfg.badge}`}
                >
                  <completionCfg.icon className="h-4 w-4" />
                  {completionCfg.label}
                </div>
                {report.completionDetail && (
                  <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                    {report.completionDetail.slice(0, 120)}
                    {report.completionDetail.length > 120 ? "…" : ""}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ── TASK DESCRIPTION COLLAPSIBLE ─────────────────────────── */}
      {(report.taskDescription || report.objetivo) && (
        <Card className="shadow-sm overflow-hidden">
          <button
            onClick={() => setTaskOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500 shrink-0" />
              <span className="text-sm font-semibold text-foreground">
                Tarefa Solicitada
              </span>
              {report.objetivo && (
                <span className="hidden sm:inline text-xs text-muted-foreground truncate max-w-xs">
                  — {report.objetivo}
                </span>
              )}
            </div>
            {taskOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </button>
          {taskOpen && (
            <div className="px-4 pb-4 pt-0 border-t border-border/50 bg-muted/20">
              {report.objetivo && (
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mt-3 mb-1.5">
                  Objetivo
                </p>
              )}
              {report.objetivo && (
                <p className="text-sm text-foreground font-medium mb-3">
                  {report.objetivo}
                </p>
              )}
              {report.taskDescription && (
                <>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Descrição da Tarefa
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {report.taskDescription}
                  </p>
                </>
              )}
            </div>
          )}
        </Card>
      )}

      {/* ── METRIC CARDS ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          {
            label: "Objetivo",
            value: report.completionStatus ?? "—",
            color: completionCfg?.color ?? "text-foreground",
            icon: Target,
            iconColor: "text-blue-500",
          },
          {
            label: "Tempo Estimado",
            value: report.timeEstimate || "—",
            color: "text-foreground",
            icon: Clock,
            iconColor: "text-purple-500",
            small: true,
          },
          {
            label: "Pontos Positivos",
            value: String(report.positiveFindings.length),
            color: report.positiveFindings.length > 0 ? "text-green-600" : "text-muted-foreground",
            icon: ThumbsUp,
            iconColor: "text-green-500",
          },
          {
            label: "Fricções",
            value: String(report.frictions.length),
            color: "text-amber-600",
            icon: AlertTriangle,
            iconColor: "text-amber-500",
          },
          {
            label: "Críticas / Altas",
            value: String(criticalCount),
            color: criticalCount > 0 ? "text-red-600" : "text-green-600",
            icon: BarChart3,
            iconColor: "text-red-500",
          },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-sm">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-1.5 mb-1">
                <stat.icon className={`h-3.5 w-3.5 ${stat.iconColor}`} />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p
                className={`font-bold ${stat.color} ${stat.small ? "text-base leading-tight" : "text-2xl"}`}
                title={stat.value}
              >
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── SEVERITY DISTRIBUTION ────────────────────────────────── */}
      {report.frictions.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Distribuição por Severidade
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 space-y-2.5">
            {SEV_ORDER.filter((sev) => sevCounts[sev]).map((sev) => {
              const cfg = getSevConfig(sev);
              const count = sevCounts[sev] || 0;
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={sev} className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold w-24 shrink-0 ${cfg.text}`}
                  >
                    {sev}
                  </span>
                  <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${cfg.bar}`}
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-4 text-right shrink-0 font-medium">
                    {count}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* ── POSITIVE FINDINGS ──────────────────────────────────── */}
      {report.positiveFindings.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp className="h-4 w-4 text-green-500" />
            <h3 className="text-base font-semibold text-foreground">
              O Que Funciona Bem
            </h3>
            <span className="text-xs text-muted-foreground">
              ({report.positiveFindings.length} pontos positivos)
            </span>
          </div>

          <div className="space-y-3">
            {report.positiveFindings.map((pf) => (
              <div
                key={pf.number}
                className="rounded-xl border border-l-4 border-l-green-500 shadow-sm overflow-hidden"
              >
                <div className="px-4 py-3 bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-muted-foreground shrink-0">
                      #{pf.number}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground">
                      {pf.title}
                    </h4>
                    <span className="inline-flex text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                      POSITIVO
                    </span>
                  </div>
                  {pf.description && (
                    <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                      {pf.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                    {pf.zone && (
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="text-base leading-none">📍</span>
                        <span className="font-medium">{pf.zone}</span>
                      </span>
                    )}
                    {pf.impact && (
                      <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
                        <span className="text-base leading-none">📈</span>
                        <span>{pf.impact}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FRICTIONS ────────────────────────────────────────────── */}
      {sortedFrictions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="text-base font-semibold text-foreground">
              Fricções Identificadas
            </h3>
            <span className="text-xs text-muted-foreground">
              ({sortedFrictions.length} · ordenadas por severidade)
            </span>
          </div>

          <div className="space-y-3">
            {sortedFrictions.map((friction) => {
              const cfg = getSevConfig(friction.severity);
              const isExpanded = expandedFrictions.has(friction.number);

              return (
                <div
                  key={friction.number}
                  className={`rounded-xl border border-l-4 ${cfg.border} shadow-sm overflow-hidden`}
                >
                  {/* Card header — always visible, clickable */}
                  <button
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left ${cfg.bg} hover:brightness-95 transition-all`}
                    onClick={() => toggleFriction(friction.number)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-muted-foreground shrink-0">
                        #{friction.number}
                      </span>
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        {friction.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`inline-flex text-xs font-bold px-2.5 py-0.5 rounded-full ${cfg.badge}`}
                      >
                        {friction.severity}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded body */}
                  {isExpanded && (
                    <div className="px-4 py-3 bg-background border-t border-border/50">
                      {friction.description && (
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {friction.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                        {friction.zone && (
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="text-base leading-none">📍</span>
                            <span className="font-medium">{friction.zone}</span>
                          </span>
                        )}
                        {friction.impact && (
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="text-base leading-none">📉</span>
                            <span>{friction.impact}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CONFUSION QUOTES ─────────────────────────────────────── */}
      {report.confusionQuotes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Quote className="h-4 w-4 text-blue-500" />
            <h3 className="text-base font-semibold text-foreground">
              Citações da Persona
            </h3>
          </div>
          <div className="space-y-3">
            {report.confusionQuotes.map((q, i) => (
              <div
                key={i}
                className="rounded-xl border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 p-4"
              >
                {q.context && (
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-wide">
                    {q.context}
                  </p>
                )}
                <blockquote className="text-sm text-foreground italic leading-relaxed border-l-4 border-blue-400 pl-3">
                  "{q.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EXECUTIVE SUMMARY ────────────────────────────────────── */}
      {report.executiveSummary && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Resumo Executivo
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {report.executiveSummary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── RECOMMENDATION ───────────────────────────────────────── */}
      {report.recommendations && (
        <Card className="shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Recomendação
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed whitespace-pre-line">
              {report.recommendations}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── OVERALL IMPACT ───────────────────────────────────────── */}
      {report.overallImpact && (
        <Card className="shadow-sm bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200 dark:border-red-900">
          <CardContent className="pt-4 pb-4 flex items-start gap-3">
            <TrendingDown className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-0.5 uppercase tracking-wide">
                Impacto Global na Conversão
              </p>
              <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                {report.overallImpact}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── SAVED REPORT CARD ────────────────────────────────────────────────────────

function SavedReportCard({
  report,
  onRemove,
  onView,
}: {
  report: SavedReport;
  onRemove: (id: string) => void;
  onView: (report: SavedReport) => void;
}) {
  const completionCfg = report.completionStatus
    ? COMPLETION_CONFIG[report.completionStatus]
    : null;
  const criticalCount = report.frictions.filter(
    (f) => f.severity === "CRÍTICO" || f.severity === "ALTO"
  ).length;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-300 shrink-0">
              {report.personaName.charAt(0) || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {report.personaName} × {report.scenarioName || "Cenário"}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {completionCfg && report.completionStatus && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${completionCfg.badge}`}
                  >
                    <completionCfg.icon className="h-3 w-3" />
                    {report.completionStatus}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {report.frictions.length} fricções ·{" "}
                  {criticalCount > 0 && (
                    <span className="text-red-500 font-medium">
                      {criticalCount} críticas/altas
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(report.parsedAt).toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(report)}
              className="h-8 text-xs"
            >
              Ver Relatório
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hover:text-destructive hover:border-destructive"
              onClick={() => onRemove(report.id)}
              aria-label="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── DEMO CONTENT ─────────────────────────────────────────────────────────────

const DEMO_REPORT_TEXT = `## PERSONA
**Ana Silva** — Utilizadora tech-savvy com 12 anos de experiência em ecommerce

## TAREFA
**Pesquisa e Filtro de Produto Técnico**

Descrição da tarefa:
Simule um cenário de compra no qual você, como utilizadora tech-savvy, precisa de encontrar um smartphone de gama alta que atenda a critérios específicos: marca reconhecida (Samsung ou Apple), orçamento entre €800-1200, e especificações técnicas mínimas (RAM mínimo 12GB, armazenamento mínimo 256GB, taxa de refresh mínimo 120Hz). Inicie uma pesquisa na barra de pesquisa principal, navegue pelos resultados, aplique sequencialmente os filtros avançados de marca, preço e especificações técnicas, compare visualmente os produtos disponíveis e, finalmente, aceda à página de detalhes do smartphone escolhido. Durante todo o processo, avalie a clareza da interface, a intuitibilidade dos filtros, a organização das informações técnicas, a qualidade dos resultados apresentados e a facilidade de navegação entre categorias.

Categoria: Catálogo · Objetivo: Pesquisar e filtrar produtos técnicos de forma intuitiva · 5 steps

---

## ESTRUTURA DO TESTE

**Conseguiu completar o objetivo?** Parcialmente
- O processo de pesquisa foi fluido e intuitivo, mas os filtros avançados de especificações técnicas não estavam claramente visíveis na primeira interação. Ana precisou descer duas vezes a página para encontrá-los.

**Tempo estimado:** 8 minutos

---

## ANÁLISE

PONTO POSITIVO #1: Barra de pesquisa prominente e acessível
- Descrição: A barra de pesquisa está bem posicionada no topo da página, com ícone claro de lupa e campo amplo para entrada de texto. Ana encontrou-a imediatamente sem hesitação.
- Zona da página: Header / Barra de navegação superior
- Impacto: Reduz friction e facilita a entrada dos utilizadores no fluxo de pesquisa

PONTO POSITIVO #2: Autocomplete com sugestões relevantes
- Descrição: Ao digitar "Samsung Galaxy S25", o sistema ofereceu sugestões inteligentes e relevantes. Ana não precisou de escrever o nome completo do produto.
- Zona da página: Dropdown de pesquisa
- Impacto: Acelera o tempo de pesquisa e reduz erros de digitação

PONTO POSITIVO #3: Cards de produto informativos
- Descrição: Cada card de produto exibe imagem, título, preço, rating e um badge com avaliação. Ana conseguiu comparar visualmente produtos rapidamente.
- Zona da página: Grid de resultados
- Impacto: Facilita a comparação rápida entre opções sem clicar em cada uma

PONTO POSITIVO #4: Filtros por marca funcionam corretamente
- Descrição: Ao selecionar "Samsung" e "Apple", a grid atualizou imediatamente, mostrando apenas produtos dessas marcas. Feedback visual foi claro.
- Zona da página: Sidebar de filtros (esquerda)
- Impacto: Permite refinamento eficiente dos resultados

PONTO POSITIVO #5: Ordenação por preço fluida
- Descrição: A dropdown de ordenação ("Mais barato", "Mais caro", "Mais vendido") funcionou sem delays. A grid atualizou-se instantaneamente.
- Zona da página: Acima dos resultados
- Impacto: Oferece controlo total sobre a visualização dos dados

---

FRICÇÃO #1: Filtros avançados de especificações técnicas não visíveis no initial load
- Severidade: MÉDIO-ALTO
- Descrição: Os filtros de especificações técnicas (RAM, capacidade de armazenamento, taxa de refresh) só aparecem depois de descer na sidebar. Ana esperava vê-los expandidos ou com uma indicação clara de que existiam.
- Zona da página: Sidebar de filtros (esquerda)
- Impacto estimado na conversão: Reduz conversão em 12-15% porque utilizadores técnicos deixam de refinar a pesquisa

FRICÇÃO #2: Sem indicador de expandir mais filtros
- Severidade: MÉDIO
- Descrição: Não existe um botão claro que diga "Ver mais filtros" ou ícone de seta expandível. Ana desceu por acaso e descobriu que havia mais opções abaixo.
- Zona da página: Footer da sidebar de filtros
- Impacto estimado na conversão: Reduz em ~8% porque utilizadores avançados deixam de usar filtros secundários

FRICÇÃO #3: Comparação de produtos requer clicar em cada um
- Severidade: BAIXO-MÉDIO
- Descrição: Para comparar as especificações técnicas de dois smartphones, Ana precisa de clicar em cada um individualmente. Não existe função de adicionar para comparar.
- Zona da página: Grid de resultados
- Impacto estimado na conversão: Reduz em ~5% para utilizadores técnicos que comparam múltiplas opções

FRICÇÃO #4: Preço com imposto não é claro imediatamente
- Severidade: BAIXO
- Descrição: O preço exibido no card é com IVA, mas não está explícito. Ana só descobriu ao clicar no produto e ver o breakdown. Esperava ver "(com IVA)" no card.
- Zona da página: Cards de produto
- Impacto estimado na conversão: Impacto mínimo, afeta principalmente utilizadores price-sensitive

---

## Momentos de confusão
- Após percorrer a sidebar sem encontrar os filtros avançados: "Desci na sidebar e encontrei, mas achei estranho não estar visível desde o início"
- Ao ver o preço no card de produto: "Este preço já inclui o IVA?"

---

## RESUMO EXECUTIVO

Ana Silva completou parcialmente o objetivo de pesquisar e filtrar um smartphone de gama alta. A experiência foi positiva nos aspetos fundamentais — barra de pesquisa clara, resultados bem apresentados, filtros básicos funcionais — mas foi prejudicada pela falta de visibilidade dos filtros técnicos avançados e pela ausência de uma função de comparação eficiente.

Para uma utilizadora tech-savvy como Ana, esta jornada representa um atrito significativo que poderia levar a abandono se houvesse alternativas melhor otimizadas no mercado.

---

## Recomendação Prioritária

Tornar os filtros técnicos visíveis por padrão ou implementar uma secção "Filtros avançados" colapsável com ícone de expansão claro. Isto é crítico para utilizadores técnicos e deve ser priorizado no próximo sprint de otimização de catálogo.

---

## Impacto Global na Conversão

Estimado em 10-15% de redução na conversão para segmento de utilizadores técnicos por produto, devido principalmente à invisibilidade dos filtros de especificações e à falta de funcionalidade de comparação eficiente.`;

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ReportBuilder() {
  const [rawText, setRawText] = useState("");
  const [report, setReport] = useState<ParsedReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();
  const { reports: savedReports, save, remove } = useSavedReports();

  const handleParse = () => {
    setError(null);
    if (!rawText.trim()) {
      setError("Cola o resultado do agente de IA para gerar o relatório.");
      return;
    }
    const parsed = parseReport(rawText);
    if (
      !parsed ||
      (parsed.frictions.length === 0 && parsed.positiveFindings.length === 0 && !parsed.completionStatus)
    ) {
      setError(
        "Não foi possível detectar a estrutura do relatório. Certifica-te que o texto inclui as secções PERSONA, TAREFA e o relatório com FRICÇÃO #N."
      );
      return;
    }
    setReport(parsed);
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!report) return;
    save(report);
    setIsSaved(true);
    toast.success("Relatório guardado!");
  };

  const handleReset = () => {
    setReport(null);
    setRawText("");
    setError(null);
    setIsSaved(false);
  };

  const handleViewSaved = (r: SavedReport) => {
    setReport(r);
    setIsSaved(true);
    setRawText("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveSaved = (id: string) => {
    remove(id);
    toast.success("Relatório eliminado.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="bg-background border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => (report ? handleReset() : navigate("/"))}
              aria-label="Voltar"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Relatórios</h1>
              <p className="text-xs text-muted-foreground">
                {report
                  ? `${report.personaName} × ${report.scenarioName || "Cenário"}`
                  : "Análise visual de resultados de teste"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {report && (
              <>
                {!isSaved && (
                  <Button onClick={handleSave} variant="outline" size="sm">
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    Guardar
                  </Button>
                )}
                {isSaved && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium px-2">
                    ✓ Guardado
                  </span>
                )}
                <Button onClick={handleReset} variant="outline" size="sm">
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Novo
                </Button>
              </>
            )}
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {!report ? (
          /* ── INPUT MODE ────────────────────────────────────────── */
          <div className="space-y-6">
            {/* How it works */}
            <Card className="shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-900">
              <CardContent className="pt-5 pb-5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  Como funciona
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      step: "1",
                      title: "Corre o agente",
                      desc: "Cola o prompt num agente de IA (Claude, ChatGPT…) e deixa-o executar o teste completo",
                    },
                    {
                      step: "2",
                      title: "Copia o resultado",
                      desc: "Copia TODO o output do agente — incluindo o processo de navegação e o relatório final",
                    },
                    {
                      step: "3",
                      title: "Gera o relatório",
                      desc: "Cola aqui em baixo e clica em \"Gerar Relatório\" — sem IA, 100% local",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {item.step}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-0.5">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Textarea */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">
                    Resultado do Agente de IA
                  </CardTitle>
                  <button
                    onClick={() => { setRawText(DEMO_REPORT_TEXT); setError(null); }}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/30"
                  >
                    <Sparkles className="h-3 w-3" />
                    Carregar Demo
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <textarea
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    setError(null);
                  }}
                  placeholder={`Cola aqui o resultado completo do agente de IA...

O motor vai detectar automaticamente:
• Persona (nome, perfil)
• Cenário (nome, categoria)
• Conclusão do objetivo (Sim / Parcialmente / Não)
• Tempo estimado
• Pontos positivos (o que funciona bem)
• Fricções com severidade, zona e impacto
• Citações diretas da persona
• Resumo executivo e recomendações`}
                  className="w-full h-72 rounded-md border border-input bg-background px-3 py-2.5 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground placeholder:text-muted-foreground leading-relaxed"
                />
                {error && (
                  <p className="mt-2 text-sm text-destructive flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    {error}
                  </p>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleParse}
              disabled={!rawText.trim()}
              className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 disabled:opacity-40"
            >
              <FileText className="h-4 w-4 mr-2" />
              Gerar Relatório Visual
            </Button>

            {/* Saved reports */}
            {savedReports.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Relatórios Guardados ({savedReports.length})
                </h3>
                <div className="space-y-2">
                  {savedReports.map((r) => (
                    <SavedReportCard
                      key={r.id}
                      report={r}
                      onRemove={handleRemoveSaved}
                      onView={handleViewSaved}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── REPORT MODE ───────────────────────────────────────── */
          <div className="space-y-6">
            <ReportView report={report} />

            {/* Saved reports (collapsed) */}
            {savedReports.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Outros Relatórios Guardados
                </h3>
                <div className="space-y-2">
                  {savedReports
                    .filter((r) => r.parsedAt !== report.parsedAt)
                    .map((r) => (
                      <SavedReportCard
                        key={r.id}
                        report={r}
                        onRemove={handleRemoveSaved}
                        onView={handleViewSaved}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
