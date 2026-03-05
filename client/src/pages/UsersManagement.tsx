import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Brain,
  ChevronDown,
  ChevronUp,
  Heart,
  MessageSquareQuote,
  Moon,
  Monitor,
  ShoppingCart,
  Smartphone,
  Store,
  Sun,
  Target,
  UserPlus,
} from "lucide-react";
import {
  type Persona,
  type BigFive,
  defaultPersonas,
} from "@/lib/personas-data";

// re-export for backwards compatibility
export type { Persona };
export type TechLevel = number;
export { defaultPersonas };

/* ─── Helpers ─────────────────────────────────────────────── */

function TechLevelBadge({ level }: { level: number }) {
  const color =
    level >= 8
      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
      : level >= 5
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
        : "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
  const label = level >= 8 ? "Especialista" : level >= 5 ? "Intermédio" : "Básico";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
      {label} {level}/10
    </span>
  );
}

function UsageBadges({ mobile, desktop, loja }: { mobile: number | null; desktop: number | null; loja: number | null }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {mobile !== null && mobile > 0 && (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
          <Smartphone className="h-3 w-3" /> {mobile}%
        </span>
      )}
      {desktop !== null && desktop > 0 && (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Monitor className="h-3 w-3" /> {desktop}%
        </span>
      )}
      {loja !== null && loja > 0 && (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
          <Store className="h-3 w-3" /> Loja {loja}%
        </span>
      )}
    </div>
  );
}

function BigFiveBar({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color =
    value >= 7.5 ? "bg-green-500" : value >= 5 ? "bg-blue-500" : "bg-orange-500";
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-foreground w-10 text-right">{value}/10</span>
    </div>
  );
}

function SeverityBadge({ sev }: { sev: string }) {
  const c: Record<string, string> = {
    "CRÍTICA": "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    "ALTA": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    "MÉDIA": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    "BAIXA": "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  };
  return <Badge className={`text-[10px] ${c[sev] ?? "bg-muted text-muted-foreground"}`}>{sev}</Badge>;
}

/* ─── Persona Card (Expandable) ───────────────────────────── */

function PersonaCard({ persona }: { persona: Persona }) {
  const [expanded, setExpanded] = useState(false);
  const isAgent = persona.tipo === "agente";
  const avatarColors = isAgent
    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-5 pb-5">
        {/* Compact Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left flex items-start justify-between gap-4"
        >
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${avatarColors}`}>
              {persona.nome.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-foreground">{persona.nome}</h3>
                <span className="text-sm text-muted-foreground">— {persona.subtitulo}</span>
                <Badge className={`text-xs ${isAgent ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 hover:bg-green-100" : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-100"}`}>
                  {isAgent ? "Agente" : "Persona"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {persona.idade ? `${persona.idade} anos · ` : ""}{persona.profissao}
                {persona.localizacao !== "–" ? ` · ${persona.localizacao}` : ""}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {persona.techLevel !== null && <TechLevelBadge level={persona.techLevel} />}
                <UsageBadges mobile={persona.usoMobile} desktop={persona.usoDesktop} loja={persona.usoLoja} />
              </div>
            </div>
          </div>
          <div className="shrink-0 mt-1 text-muted-foreground">
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </button>

        {/* Expanded Detail */}
        {expanded && !isAgent && (
          <div className="mt-6 space-y-6 border-t pt-6">
            {/* Row 1: Perfil + Psicografia */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Perfil */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" /> Perfil Demográfico
                </h4>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p><span className="font-medium text-foreground">Situação:</span> {persona.situacao}</p>
                  <p><span className="font-medium text-foreground">Rendimento:</span> {persona.rendimento}</p>
                  {persona.dispositivos.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-foreground mb-1">Dispositivos:</p>
                      {persona.dispositivos.map((d, i) => (
                        <p key={i} className="pl-3">• {d.nome} ({d.uso}%) — {d.contexto}</p>
                      ))}
                    </div>
                  )}
                  {persona.appsCompras.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-foreground mb-1">Apps de Compras:</p>
                      {persona.appsCompras.map((a, i) => (
                        <p key={i} className="pl-3">• {a.nome} ({a.percentagem}%) — {a.razao}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Big Five */}
              {persona.bigFive && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" /> Psicografia (Big Five)
                  </h4>
                  <div className="space-y-2">
                    <BigFiveBar label="Abertura" value={persona.bigFive.abertura} />
                    <BigFiveBar label="Consciência" value={persona.bigFive.consciencia} />
                    <BigFiveBar label="Extroversão" value={persona.bigFive.extroversao} />
                    <BigFiveBar label="Simpatia" value={persona.bigFive.simpatia} />
                    <BigFiveBar label="Neuroticismo" value={persona.bigFive.neuroticismo} />
                  </div>
                  {persona.valores.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-foreground mb-1">Valores:</p>
                      {persona.valores.map((v, i) => (
                        <p key={i} className="text-xs text-muted-foreground pl-3">
                          {i + 1}. {v}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Row 2: Padrões de Compra */}
            {persona.padroesCompra.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-green-500" /> Padrões de Compra
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {persona.padroesCompra.map((p, i) => (
                    <div key={i} className="rounded-lg border p-3 space-y-1">
                      <p className="text-xs font-bold text-foreground">{p.tipo}</p>
                      <p className="text-[11px] text-muted-foreground">{p.exemplo}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline" className="text-[10px]">{p.valorRange}</Badge>
                        <Badge variant="outline" className="text-[10px]">{p.frequencia}</Badge>
                        <Badge variant="outline" className="text-[10px]">{p.tempoInvestido}</Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground italic mt-1">{p.contexto}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Row 3: Frustrações Detalhadas */}
            {persona.frustracoesDetalhadas.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" /> Frustrações (Pain Points)
                </h4>
                <div className="space-y-3">
                  {persona.frustracoesDetalhadas.map((f, i) => (
                    <div key={i} className="rounded-lg border-l-4 border-l-red-400 dark:border-l-red-600 bg-muted/30 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-bold text-foreground">{f.titulo}</p>
                        <SeverityBadge sev={f.severidade} />
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-1"><span className="font-medium">Cenário:</span> {f.cenario}</p>
                      <p className="text-[11px] text-muted-foreground mb-1"><span className="font-medium">Reação:</span> {f.reacaoEmocional}</p>
                      <p className="text-[11px] text-muted-foreground"><span className="font-medium">Impacto:</span> {f.impacto}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Row 4: Quotes */}
            {persona.quotes.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MessageSquareQuote className="h-4 w-4 text-blue-500" /> Verbatim (Citações)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {persona.quotes.map((q, i) => (
                    <div key={i} className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-3">
                      <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400 uppercase mb-1">{q.contexto}</p>
                      <p className="text-xs text-foreground italic">"{q.citacao}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Row 5: Perfil Cognitivo */}
            {persona.perfilCognitivo && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-indigo-500" /> Perfil Cognitivo
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Metrics */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "QI Geral", value: persona.perfilCognitivo.qiGeral.toString() },
                        { label: "Velocidade", value: `${persona.perfilCognitivo.velocidadeProcessamento}/10` },
                        { label: "Numeracia", value: `${persona.perfilCognitivo.numeracia}/10` },
                        { label: "Literacia Digital", value: `${persona.perfilCognitivo.literaciaDigital}/10` },
                        { label: "Criatividade", value: `${persona.perfilCognitivo.criatividade}/10` },
                        { label: "Inteligência Emocional", value: `${persona.perfilCognitivo.inteligenciaEmocional}/10` },
                        { label: "Flexibilidade Cognitiva", value: `${persona.perfilCognitivo.flexibilidadeCognitiva}/10` },
                      ].map(m => (
                        <div key={m.label} className="text-xs">
                          <span className="text-muted-foreground">{m.label}: </span>
                          <span className="font-semibold text-foreground">{m.value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      <span className="font-medium">Memória de trabalho:</span> {persona.perfilCognitivo.memoriaTrabalho}
                    </p>
                  </div>

                  {/* Vieses */}
                  {persona.perfilCognitivo.vieses.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-foreground mb-2">Viéses Cognitivos:</p>
                      <div className="space-y-1.5">
                        {persona.perfilCognitivo.vieses.map((v, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground w-40 shrink-0 truncate" title={v.nome}>{v.nome}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${v.nivel >= 7 ? "bg-red-500" : v.nivel >= 5 ? "bg-amber-500" : "bg-green-500"}`}
                                style={{ width: `${(v.nivel / 10) * 100}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-medium text-foreground w-7 text-right">{v.nivel}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Row 6: Empathy Map */}
            {persona.empathyMap && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Empathy Map</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { title: "Thinks", items: persona.empathyMap.thinks, color: "border-indigo-300 dark:border-indigo-800" },
                    { title: "Feels", items: persona.empathyMap.feels, color: "border-pink-300 dark:border-pink-800" },
                    { title: "Says", items: persona.empathyMap.says, color: "border-green-300 dark:border-green-800" },
                    { title: "Does", items: persona.empathyMap.does, color: "border-blue-300 dark:border-blue-800" },
                    { title: "Pain Points", items: persona.empathyMap.painPoints, color: "border-red-300 dark:border-red-800" },
                    { title: "Gains", items: persona.empathyMap.gains, color: "border-emerald-300 dark:border-emerald-800" },
                  ].map(section => (
                    <div key={section.title} className={`rounded-lg border-2 ${section.color} p-3`}>
                      <p className="text-[10px] font-bold text-foreground uppercase mb-1.5">{section.title}</p>
                      {section.items.map((item, i) => (
                        <p key={i} className="text-[11px] text-muted-foreground leading-tight mb-1">• {item}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Agent simplified expanded */}
        {expanded && isAgent && (
          <div className="mt-6 border-t pt-4">
            <p className="text-xs text-muted-foreground italic whitespace-pre-line">{persona.promptMestre}</p>
            {persona.motivacoes.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-foreground mb-1">Objetivos:</p>
                {persona.motivacoes.map((m, i) => (
                  <p key={i} className="text-xs text-muted-foreground pl-3">• {m}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */

export default function UsersManagement() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();

  const personas = defaultPersonas.filter(p => p.tipo === "persona");
  const agentes = defaultPersonas.filter(p => p.tipo === "agente");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Voltar">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gestão de Utilizadores</h1>
              <p className="text-sm text-muted-foreground">
                {defaultPersonas.length} perfis carregados — clica numa persona para expandir
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={toggleTheme} variant="outline" size="icon" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button onClick={() => navigate("/add-persona")} className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Persona
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total de Perfis", value: defaultPersonas.length, color: "text-blue-600" },
            { label: "Personas", value: personas.length, color: "text-purple-600" },
            { label: "Agentes", value: agentes.length, color: "text-green-600" },
            {
              label: "Nível Tech Médio",
              value: `${(personas.reduce((a, b) => a + (b.techLevel ?? 0), 0) / (personas.filter(p => p.techLevel).length || 1)).toFixed(1)}/10`,
              color: "text-orange-600",
            },
          ].map(stat => (
            <Card key={stat.label} className="shadow-sm">
              <CardContent className="pt-5 pb-4">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personas */}
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Personas</h2>
        <div className="grid grid-cols-1 gap-4 mb-8">
          {personas.map(p => <PersonaCard key={p.id} persona={p} />)}
        </div>

        {/* Agentes */}
        {agentes.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Agentes</h2>
            <div className="grid grid-cols-1 gap-4">
              {agentes.map(p => <PersonaCard key={p.id} persona={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
