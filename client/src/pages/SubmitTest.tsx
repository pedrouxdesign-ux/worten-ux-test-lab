import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function SubmitTest() {
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const { user: authUser } = useAuth();
  const user = authUser || { id: 1, name: "Utilizador Demo", email: "demo@worten.pt", role: "user" as const };
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    featureName: "",
    userTask: "",
    context: "",
  });

  const createTestMutation = trpc.tests.create.useMutation();
  const executeTestMutation = trpc.testExecution.execute.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.featureName.trim() || !formData.userTask.trim()) {
      toast.error("Por favor, preencha os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    setIsExecuting(true);
    try {
      const result = await createTestMutation.mutateAsync({
        title: formData.title,
        description: formData.description || undefined,
        featureName: formData.featureName,
        userTask: formData.userTask,
        context: formData.context || undefined,
      });

      toast.success("Teste criado com sucesso! Iniciando processamento...");
      
      // Iniciar execução do teste em background
      await executeTestMutation.mutateAsync({ testId: result });
      
      navigate(`/test/${result}`);
    } catch (error) {
      toast.error("Erro ao criar o teste. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Novo Teste de Usabilidade</h1>
          <p className="text-slate-600">Submeta uma feature ou problema para análise automática com as nossas protopersonas</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle>Detalhes do Teste</CardTitle>
            <CardDescription>Forneça informações sobre a feature que deseja testar</CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title" className="font-semibold">
                  Título do Teste *
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: Teste do Menu da Área de Conta"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isSubmitting || isExecuting}
                  className="border-slate-200"
                />
                <p className="text-xs text-slate-500">Um nome descritivo para este teste</p>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold">
                  Descrição (Opcional)
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Contexto adicional sobre o problema ou feature..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isSubmitting || isExecuting}
                  rows={3}
                  className="border-slate-200 resize-none"
                />
              </div>

              {/* Feature Name */}
              <div className="space-y-2">
                <Label htmlFor="featureName" className="font-semibold">
                  Nome da Feature/Ecrã *
                </Label>
                <Input
                  id="featureName"
                  name="featureName"
                  placeholder="Ex: Menu da Área de Conta da App"
                  value={formData.featureName}
                  onChange={handleChange}
                  disabled={isSubmitting || isExecuting}
                  className="border-slate-200"
                />
                <p className="text-xs text-slate-500">Qual é a feature ou ecrã a ser testado?</p>
              </div>

              {/* User Task */}
              <div className="space-y-2">
                <Label htmlFor="userTask" className="font-semibold">
                  Tarefa do Utilizador *
                </Label>
                <Textarea
                  id="userTask"
                  name="userTask"
                  placeholder="Ex: Encontre a sua última fatura de compra e acione a garantia de um produto"
                  value={formData.userTask}
                  onChange={handleChange}
                  disabled={isSubmitting || isExecuting}
                  rows={3}
                  className="border-slate-200 resize-none"
                />
                <p className="text-xs text-slate-500">Descreva o que o utilizador deve tentar fazer. Seja específico.</p>
              </div>

              {/* Context */}
              <div className="space-y-2">
                <Label htmlFor="context" className="font-semibold">
                  Contexto Adicional (Opcional)
                </Label>
                <Textarea
                  id="context"
                  name="context"
                  placeholder="Ex: O utilizador está com pressa. Tem 2 minutos para completar a tarefa."
                  value={formData.context}
                  onChange={handleChange}
                  disabled={isSubmitting || isExecuting}
                  rows={2}
                  className="border-slate-200 resize-none"
                />
                <p className="text-xs text-slate-500">Informações sobre o cenário ou restrições</p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || isExecuting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting || isExecuting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isExecuting ? "A processar teste..." : "A submeter..."}
                    </>
                  ) : (
                    "Submeter Teste"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  disabled={isSubmitting || isExecuting}
                >
                  Cancelar
                </Button>
              </div>

              <p className="text-xs text-slate-500 text-center">
                O teste será processado pelas 3 protopersonas e analisado pelo UX Agent
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
