import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function TestFlow() {
  const [, navigate] = useLocation();
  const [testId, setTestId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<string>("idle");

  const createTestMutation = trpc.tests.create.useMutation();
  const executeTestMutation = trpc.testExecution.execute.useMutation();
  const { data: test } = trpc.tests.getById.useQuery(
    { testId: testId || 0 },
    { enabled: !!testId }
  );
  const { data: results } = trpc.testResults.getByTestId.useQuery(
    { testId: testId || 0 },
    { enabled: !!testId }
  );
  const { data: analysis } = trpc.uxAnalysis.getByTestId.useQuery(
    { testId: testId || 0 },
    { enabled: !!testId }
  );

  const handleCreateTest = async () => {
    setIsLoading(true);
    setTestStatus("creating");
    try {
      const result = await createTestMutation.mutateAsync({
        title: "Teste do Menu da Área de Conta",
        description: "Teste simples para validar o fluxo",
        featureName: "Menu da Área de Conta",
        userTask: "Encontre a sua última fatura e acione a garantia de um produto",
        context: "O utilizador está com pressa",
      });

      setTestId(result);
      setTestStatus("created");
      toast.success("Teste criado com sucesso!");

      // Iniciar execução
      setTestStatus("executing");
      await executeTestMutation.mutateAsync({ testId: result });
      setTestStatus("executed");
      toast.success("Teste iniciado!");
    } catch (error) {
      toast.error("Erro ao criar teste");
      console.error(error);
      setTestStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Teste do Fluxo Completo</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            Voltar ao Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Criar Teste */}
          <Card>
            <CardHeader>
              <CardTitle>1. Criar Teste</CardTitle>
              <CardDescription>Submeter um novo teste</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleCreateTest}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Criar Teste de Exemplo"
                )}
              </Button>
              <p className="text-sm text-slate-600 mt-4">
                Status: <span className="font-semibold">{testStatus}</span>
              </p>
              {testId && <p className="text-sm text-slate-600 mt-2">ID do Teste: {testId}</p>}
            </CardContent>
          </Card>

          {/* Detalhes do Teste */}
          <Card>
            <CardHeader>
              <CardTitle>2. Detalhes do Teste</CardTitle>
              <CardDescription>Informações do teste criado</CardDescription>
            </CardHeader>
            <CardContent>
              {test ? (
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Título:</span> {test.title}
                  </p>
                  <p>
                    <span className="font-semibold">Feature:</span> {test.featureName}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {test.status}
                  </p>
                  <p>
                    <span className="font-semibold">Criado em:</span>{" "}
                    {new Date(test.createdAt).toLocaleString("pt-PT")}
                  </p>
                </div>
              ) : (
                <p className="text-slate-500">Nenhum teste criado ainda</p>
              )}
            </CardContent>
          </Card>

          {/* Resultados das Personas */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>3. Relatos das Personas</CardTitle>
              <CardDescription>Simulações das 3 personas</CardDescription>
            </CardHeader>
            <CardContent>
              {results && results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result) => (
                    <div key={result.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="font-semibold text-slate-900">{result.personaName}</p>
                      <p className="text-sm text-slate-600">
                        Sucesso: {result.successfulCompletion ? "Sim" : "Não"}
                      </p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-3">{result.report}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">Aguardando resultados das personas...</p>
              )}
            </CardContent>
          </Card>

          {/* Análise do UX Agent */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>4. Análise do UX Agent</CardTitle>
              <CardDescription>Recomendações priorizadas</CardDescription>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-slate-900 mb-2">Sumário Executivo</p>
                    <p className="text-sm text-slate-700">{analysis.executiveSummary}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-2">Diagnóstico</p>
                    <p className="text-sm text-slate-700">{analysis.usabilityDiagnosis}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">Aguardando análise do UX Agent...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
