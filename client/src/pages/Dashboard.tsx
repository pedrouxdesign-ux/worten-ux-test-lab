import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import { Check, ChevronRight, ClipboardList, Copy, FileText, ListChecks, Moon, Sun, UserPlus, UsersRound } from "lucide-react";
import { useState } from "react";
import { defaultPersonas } from "./UsersManagement";
import { defaultScenarios } from "./ScenariosManagement";
import { useTestsStore, generatePrompt, copyToClipboard } from "@/lib/tests-store";

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();

  // Mock user para desenvolvimento
  const user = authUser || { id: 1, name: "Utilizador Demo", email: "demo@worten.pt", role: "user" as const };

  const { tests, addTest } = useTestsStore();
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(null);
  const [btnState, setBtnState] = useState<"idle" | "copied" | "saved">("idle");

  const personas = defaultPersonas.filter(p => p.tipo === "persona");
  const selectedPersona = personas.find(p => p.id === selectedPersonaId) ?? null;
  const selectedScenario = defaultScenarios.find(s => s.id === selectedScenarioId) ?? null;

  const handleCreateTest = async () => {
    if (!selectedPersona || !selectedScenario) return;

    const prompt = generatePrompt(selectedPersona, selectedScenario);

    addTest({ personaId: selectedPersona.id, scenarioId: selectedScenario.id, prompt });

    const copied = await copyToClipboard(prompt);
    setBtnState(copied ? "copied" : "saved");
    setTimeout(() => {
      setBtnState("idle");
      setSelectedPersonaId(null);
      setSelectedScenarioId(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Worten UX Persona Lab</h1>
            <p className="text-sm text-muted-foreground">Testes de usabilidade automatizados com IA</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden xl:inline">
              Bem-vindo, <span className="font-semibold text-foreground">{user?.name || "Utilizador"}</span>
            </span>
            <Button onClick={() => navigate("/users")} variant="outline" size="sm">
              <UsersRound className="mr-2 h-4 w-4" />
              Utilizadores
            </Button>
            <Button onClick={() => navigate("/scenarios")} variant="outline" size="sm">
              <ClipboardList className="mr-2 h-4 w-4" />
              Cenários
            </Button>
            <Button onClick={() => navigate("/tests")} variant="outline" size="sm">
              <ListChecks className="mr-2 h-4 w-4" />
              Testes
            </Button>
            <Button onClick={() => navigate("/reports")} variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Relatórios
            </Button>
            <Button onClick={toggleTheme} variant="outline" size="icon" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Testes Criados</p>
                  <p className="text-3xl font-bold text-foreground">{tests.length}</p>
                </div>
                <ListChecks className="h-8 w-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Personas</p>
                  <p className="text-3xl font-bold text-foreground">{personas.length}</p>
                </div>
                <UsersRound className="h-8 w-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cenários</p>
                  <p className="text-3xl font-bold text-foreground">{defaultScenarios.length}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Criar Persona */}
            <button
              onClick={() => navigate("/add-persona")}
              className="group flex items-center gap-4 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 hover:border-purple-400 dark:hover:border-purple-700 hover:shadow-md transition-all text-left"
            >
              <div className="h-11 w-11 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-purple-900 dark:text-purple-200">Criar Persona</p>
                <p className="text-xs text-purple-700 dark:text-purple-400 leading-tight mt-0.5">Adiciona um novo perfil de utilizador</p>
              </div>
              <ChevronRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </button>

            {/* Gerir Cenários */}
            <button
              onClick={() => navigate("/scenarios")}
              className="group flex items-center gap-4 p-4 rounded-xl border-2 border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 hover:border-green-400 dark:hover:border-green-700 hover:shadow-md transition-all text-left"
            >
              <div className="h-11 w-11 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <ClipboardList className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-green-900 dark:text-green-200">Gerir Cenários</p>
                <p className="text-xs text-green-700 dark:text-green-400 leading-tight mt-0.5">Cria e edita cenários de teste</p>
              </div>
              <ChevronRight className="h-4 w-4 text-green-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </button>

            {/* Analisar Relatório */}
            <button
              onClick={() => navigate("/reports")}
              className="group flex items-center gap-4 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-md transition-all text-left"
            >
              <div className="h-11 w-11 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-blue-900 dark:text-blue-200">Analisar Relatório</p>
                <p className="text-xs text-blue-700 dark:text-blue-400 leading-tight mt-0.5">Converte o output do agente em relatório visual</p>
              </div>
              <ChevronRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </button>

          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Como Funciona */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="text-lg">Como Funciona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold mb-1 text-foreground">1. Seleciona a Persona</p>
                  <p className="text-xs">Escolhe quem vai simular o teste: Ana, David ou Miguel</p>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-foreground">2. Seleciona o Cenário</p>
                  <p className="text-xs">Escolhe a tarefa de usabilidade que queres avaliar</p>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-foreground">3. Cria e Copia o Prompt</p>
                  <p className="text-xs">O prompt completo é gerado e copiado automaticamente para o clipboard</p>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-foreground">4. Cola no Agente de IA</p>
                  <p className="text-xs">Cola o prompt no Claude, ChatGPT ou outro agente e obtém o relatório de UX</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Test Builder */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b">
                <CardTitle>Criar Novo Teste</CardTitle>
                <CardDescription>Seleciona uma persona e um cenário para gerar o prompt de IA</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">

                {/* Step 1: Persona picker */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    1. Seleciona a Persona
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {personas.map(persona => (
                      <button
                        key={persona.id}
                        onClick={() =>
                          setSelectedPersonaId(
                            persona.id === selectedPersonaId ? null : persona.id
                          )
                        }
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedPersonaId === persona.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
                            : "border-border hover:border-blue-300 hover:bg-muted/40"
                        }`}
                      >
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            selectedPersonaId === persona.id
                              ? "bg-blue-500 text-white"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          }`}
                        >
                          {persona.nome.charAt(0)}
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-foreground">{persona.nome}</p>
                          <p className="text-xs text-muted-foreground leading-tight">{persona.subtitulo}</p>
                        </div>
                        {selectedPersonaId === persona.id && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Scenario dropdown */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    2. Seleciona o Cenário
                  </p>
                  <select
                    value={selectedScenarioId ?? ""}
                    onChange={e =>
                      setSelectedScenarioId(e.target.value ? Number(e.target.value) : null)
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Seleciona um cenário...</option>
                    {defaultScenarios.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.titulo} — {s.categoria}
                      </option>
                    ))}
                  </select>
                  {selectedScenario && (
                    <p className="mt-2 text-xs text-muted-foreground pl-1 italic">
                      {selectedScenario.objetivo}
                    </p>
                  )}
                </div>

                {/* Create button */}
                <div className="flex flex-col gap-3 pt-1">
                  <Button
                    onClick={handleCreateTest}
                    disabled={!selectedPersona || !selectedScenario || btnState !== "idle"}
                    className={`w-full h-11 text-base transition-all duration-300 ${
                      btnState === "copied"
                        ? "bg-green-600 hover:bg-green-600 text-white"
                        : btnState === "saved"
                        ? "bg-amber-500 hover:bg-amber-500 text-white"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {btnState === "copied" ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Teste Criado · Prompt Copiado!
                      </>
                    ) : btnState === "saved" ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Teste Guardado · Copia em Testes
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Criar Teste e Copiar Prompt
                      </>
                    )}
                  </Button>

                  <button
                    onClick={() => navigate("/tests")}
                    className="text-xs text-center text-muted-foreground hover:text-blue-600 hover:underline underline-offset-2 transition-colors"
                  >
                    Ver todos os testes criados ({tests.length}) →
                  </button>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-900 shadow-md">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-2">Dica: Maximize o Valor dos Seus Testes</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Cada combinação Persona × Cenário gera um prompt diferente. Experimenta o mesmo cenário com as 3 personas para obteres perspectivas complementares sobre o mesmo problema.
            </p>
            <p className="text-xs text-muted-foreground">
              💡 O prompt gerado inclui o perfil completo da persona, as suas frustrações típicas, a tarefa e a estrutura do relatório — pronto a usar num agente de IA.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
