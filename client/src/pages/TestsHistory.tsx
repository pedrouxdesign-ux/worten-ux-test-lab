import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Moon,
  Sun,
  Copy,
  Trash2,
  ListChecks,
  Users,
  ClipboardList,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useTestsStore } from "@/lib/tests-store";
import { defaultPersonas } from "./UsersManagement";
import { defaultScenarios } from "./ScenariosManagement";
import type { TechLevel } from "./ScenariosManagement";

const categoryColors: Record<string, string> = {
  "Disponibilidade & Stock": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  "Pós-Venda & Suporte": "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "Pesquisa & Descoberta": "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  "Checkout & Conversão": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

const techColors: Record<TechLevel, string> = {
  Alto: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Médio: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Básico: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
};

export default function TestsHistory() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { tests, removeTest } = useTestsStore();

  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success("Prompt copiado!", {
        description: "O prompt foi copiado para o clipboard.",
      });
    } catch {
      toast.error("Não foi possível copiar", {
        description: "Tenta copiar manualmente na consola do browser.",
      });
    }
  };

  const handleDelete = (id: string) => {
    removeTest(id);
    toast.success("Teste eliminado.");
  };

  const uniquePersonas = [...new Set(tests.map(t => t.personaId))].length;
  const uniqueScenarios = [...new Set(tests.map(t => t.scenarioId))].length;

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
              <h1 className="text-2xl font-bold text-foreground">Testes Criados</h1>
              <p className="text-sm text-muted-foreground">
                {tests.length} {tests.length === 1 ? "teste guardado" : "testes guardados"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={toggleTheme} variant="outline" size="icon" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Teste
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total de Testes", value: tests.length, color: "text-blue-600", icon: ListChecks },
            { label: "Personas Usadas", value: uniquePersonas, color: "text-purple-600", icon: Users },
            { label: "Cenários Usados", value: uniqueScenarios, color: "text-green-600", icon: ClipboardList },
          ].map(stat => (
            <Card key={stat.label} className="shadow-sm">
              <CardContent className="pt-5 pb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-6 w-6 opacity-20 ${stat.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tests list or empty state */}
        {tests.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="py-16 text-center">
              <ListChecks className="h-12 w-12 text-muted-foreground opacity-30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-2 font-medium">Ainda não criaste nenhum teste</p>
              <p className="text-sm text-muted-foreground mb-6">
                Vai ao Dashboard, seleciona uma persona e um cenário para criar o teu primeiro prompt.
              </p>
              <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar o Primeiro Teste
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tests.map((test, index) => {
              const persona = defaultPersonas.find(p => p.id === test.personaId);
              const scenario = defaultScenarios.find(s => s.id === test.scenarioId);
              if (!persona || !scenario) return null;

              return (
                <Card key={test.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">

                        {/* Index badge */}
                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-500 dark:text-slate-400 shrink-0">
                          #{tests.length - index}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Persona × Scenario */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {/* Persona avatar + name */}
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                              <span className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300 shrink-0">
                                {persona.nome.charAt(0)}
                              </span>
                              {persona.nome}
                            </span>
                            <span className="text-muted-foreground text-sm font-light">×</span>
                            <span className="text-sm font-semibold text-foreground truncate">
                              {scenario.titulo}
                            </span>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${techColors[scenario.nivelTecnico]}`}>
                              Nível {scenario.nivelTecnico}
                            </span>
                            <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[scenario.categoria] ?? "bg-slate-100 text-slate-700"}`}>
                              {scenario.categoria}
                            </span>
                            <span className="inline-flex text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              {persona.subtitulo}
                            </span>
                          </div>

                          {/* Objective snippet */}
                          <p className="text-xs text-muted-foreground mb-2 italic line-clamp-1">
                            {scenario.objetivo}
                          </p>

                          {/* Date */}
                          <p className="text-xs text-muted-foreground">
                            Criado em{" "}
                            {new Date(test.createdAt).toLocaleDateString("pt-PT", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyPrompt(test.prompt)}
                          className="h-8 text-xs gap-1.5"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copiar Prompt
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive hover:border-destructive"
                          aria-label="Eliminar"
                          onClick={() => handleDelete(test.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
