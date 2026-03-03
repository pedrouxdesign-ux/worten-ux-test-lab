import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, AlertCircle, CheckCircle, Clock, Download } from "lucide-react";
import { Streamdown } from "streamdown";
import { useAuth } from "@/_core/hooks/useAuth";

export default function TestResults() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { user: authUser } = useAuth();
  const user = authUser || { id: 1, name: "Utilizador Demo", email: "demo@worten.pt", role: "user" as const };
  const testId = parseInt(params?.id as string);

  const { data: test, isLoading: testLoading } = trpc.tests.getById.useQuery(
    { testId },
    { enabled: !!testId }
  );

  const { data: results, isLoading: resultsLoading } = trpc.testResults.getByTestId.useQuery(
    { testId },
    { enabled: !!testId }
  );

  const { data: analysis, isLoading: analysisLoading } = trpc.uxAnalysis.getByTestId.useQuery(
    { testId },
    { enabled: !!testId }
  );

  if (testLoading || resultsLoading || analysisLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">A carregar resultados do teste...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">Teste não encontrado</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600">Concluído</Badge>;
      case "running":
        return <Badge className="bg-blue-600">Em Processamento</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Pendente</Badge>;
      case "failed":
        return <Badge className="bg-red-600">Erro</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const parseRecommendations = (recText: string) => {
    try {
      return JSON.parse(recText);
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{test.title}</h1>
              <p className="text-slate-600 mb-4">Feature: <span className="font-semibold">{test.featureName}</span></p>
              <div className="flex items-center gap-2">
                {getStatusBadge(test.status)}
                <span className="text-sm text-slate-500">
                  Criado em {new Date(test.createdAt).toLocaleDateString("pt-PT")}
                </span>
              </div>
            </div>
            {test.status === "completed" && (
              <Button onClick={() => navigate(`/export/${testId}`)} className="bg-green-600 hover:bg-green-700">
                <Download className="mr-2 h-4 w-4" />
                Exportar Relatório
              </Button>
            )}
          </div>
        </div>

        {/* Test Details */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg">Detalhes do Teste</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-2">Tarefa do Utilizador</p>
                <p className="text-slate-900">{test.userTask}</p>
              </div>
              {test.description && (
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-2">Descrição</p>
                  <p className="text-slate-900">{test.description}</p>
                </div>
              )}
              {test.context && (
                <div className="md:col-span-2">
                  <p className="text-sm font-semibold text-slate-600 mb-2">Contexto</p>
                  <p className="text-slate-900">{test.context}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Results and Analysis */}
        <Tabs defaultValue="personas" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personas">Relatos das Personas</TabsTrigger>
            <TabsTrigger value="analysis">Análise do UX Agent</TabsTrigger>
          </TabsList>

          {/* Personas Reports Tab */}
          <TabsContent value="personas" className="space-y-4">
            {!results || results.length === 0 ? (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Clock className="h-5 w-5" />
                    <p>O teste ainda está em processamento. Os relatos das personas aparecerão aqui em breve.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              results.map((result) => (
                <Card key={result.id} className="shadow-md">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{result.personaName}</CardTitle>
                      {result.successfulCompletion ? (
                        <Badge className="bg-green-600">Sucesso</Badge>
                      ) : (
                        <Badge className="bg-red-600">Dificuldades</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose prose-sm max-w-none">
                      <Streamdown>{result.report}</Streamdown>
                    </div>
                    
                    {result.painPoints && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Pontos de Fricção Identificados</p>
                        <div className="space-y-2">
                          {JSON.parse(result.painPoints).map((point: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                              <AlertCircle className="h-4 w-4 mt-0.5 text-orange-500 flex-shrink-0" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            {!analysis ? (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Clock className="h-5 w-5" />
                    <p>A análise do UX Agent está em processamento. Aparecerá aqui em breve.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Executive Summary */}
                <Card className="shadow-lg border-blue-200 bg-blue-50">
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      Sumário Executivo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose prose-sm max-w-none">
                      <Streamdown>{analysis.executiveSummary}</Streamdown>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Analysis */}
                <Card className="shadow-md">
                  <CardHeader className="bg-slate-50 border-b">
                    <CardTitle className="text-lg">Análise Detalhada</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose prose-sm max-w-none">
                      <Streamdown>{analysis.detailedAnalysis}</Streamdown>
                    </div>
                  </CardContent>
                </Card>

                {/* Usability Diagnosis */}
                <Card className="shadow-md">
                  <CardHeader className="bg-slate-50 border-b">
                    <CardTitle className="text-lg">Diagnóstico de Usabilidade</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose prose-sm max-w-none">
                      <Streamdown>{analysis.usabilityDiagnosis}</Streamdown>
                    </div>
                  </CardContent>
                </Card>

                {/* Competitive Benchmark */}
                {analysis.competitiveBenchmark && (
                  <Card className="shadow-md">
                    <CardHeader className="bg-slate-50 border-b">
                      <CardTitle className="text-lg">Benchmarking Competitivo</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="prose prose-sm max-w-none">
                        <Streamdown>{analysis.competitiveBenchmark}</Streamdown>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                <Card className="shadow-lg border-green-200 bg-green-50">
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg">Roadmap de Recomendações</CardTitle>
                    <CardDescription>Ações priorizadas para melhorar a experiência</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {parseRecommendations(analysis.recommendations).map((rec: any, idx: number) => (
                        <div key={idx} className="border-l-4 border-green-600 pl-4 py-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={
                              rec.priority === "P1" ? "bg-red-600" :
                              rec.priority === "P2" ? "bg-yellow-600" :
                              "bg-blue-600"
                            }>
                              {rec.priority}
                            </Badge>
                            <h4 className="font-semibold text-slate-900">{rec.title}</h4>
                          </div>
                          <p className="text-sm text-slate-700 mb-2">{rec.description}</p>
                          {rec.justification && (
                            <p className="text-xs text-slate-600 italic">Justificação: {rec.justification}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
