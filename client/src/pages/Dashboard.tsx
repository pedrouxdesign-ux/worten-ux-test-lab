import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, Moon, Plus, Sun, TrendingUp, Users, Zap } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();
  
  // Mock user para desenvolvimento
  const user = authUser || { id: 1, name: "Utilizador Demo", email: "demo@worten.pt", role: "user" as const };
  
  const { data: tests, isLoading: testsLoading } = trpc.tests.list.useQuery(undefined, {
    retry: false,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído";
      case "running":
        return "Em Processamento";
      case "pending":
        return "Pendente";
      case "failed":
        return "Erro";
      default:
        return status;
    }
  };

  const completedTests = tests?.filter(t => t.status === "completed").length || 0;
  const runningTests = tests?.filter(t => t.status === "running").length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Worten UX Persona Lab</h1>
            <p className="text-sm text-muted-foreground">Testes de usabilidade automatizados com IA</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Bem-vindo, <span className="font-semibold text-foreground">{user?.name || "Utilizador"}</span></span>
            <Button onClick={() => navigate("/skills")} variant="outline">
              Gestão de Skills
            </Button>
            <Button onClick={() => navigate("/test-flow")} variant="outline">
              Teste do Fluxo
            </Button>
            <Button onClick={toggleTheme} variant="outline" size="icon" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button onClick={() => navigate("/submit")} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Novo Teste
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
                  <p className="text-sm text-muted-foreground mb-1">Testes Concluídos</p>
                  <p className="text-3xl font-bold text-foreground">{completedTests}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Em Processamento</p>
                  <p className="text-3xl font-bold text-foreground">{runningTests}</p>
                </div>
                <Zap className="h-8 w-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Testes</p>
                  <p className="text-3xl font-bold text-foreground">{tests?.length || 0}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Welcome Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="text-lg">Como Funciona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold mb-1">1. Submeta um Teste</p>
                  <p className="text-xs">Descreva a feature ou problema que deseja testar</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">2. Simulação com Personas</p>
                  <p className="text-xs">Ana, David e Miguel testam a tarefa e narram o seu processo</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">3. Análise do UX Agent</p>
                  <p className="text-xs">Especialista analisa os relatos e gera recomendações priorizadas</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">4. Relatório Completo</p>
                  <p className="text-xs">Receba insights acionáveis e um roadmap de melhorias</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tests List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b">
                <CardTitle>Histórico de Testes</CardTitle>
                <CardDescription>Todos os testes que você submeteu</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {testsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : !tests || tests.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">Ainda não tem testes submetidos</p>
                    <Button onClick={() => navigate("/submit")} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Criar o Primeiro Teste
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">Nota: Funcionalidade de testes requer autenticação</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tests.map((test) => (
                      <div
                        key={test.id}
                        onClick={() => navigate(`/test/${test.id}`)}
                        className="p-4 border rounded-lg hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{test.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">Feature: {test.featureName}</p>
                          </div>
                          <Badge className={getStatusColor(test.status)}>
                            {getStatusLabel(test.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Criado em {new Date(test.createdAt).toLocaleDateString("pt-PT")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-900 shadow-md">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-2">Dica: Maximize o Valor dos Seus Testes</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Para obter análises mais precisas, forneça contexto claro sobre a tarefa do utilizador. Quanto mais específico for, melhor será a simulação das personas.
            </p>
            <p className="text-xs text-muted-foreground">
              💡 Exemplo: Em vez de "Testar o menu", diga "Encontre a sua última fatura e acione a garantia de um produto comprado há 6 meses"
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
