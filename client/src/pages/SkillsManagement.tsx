import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Upload } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

const AGENTS = ["Ana", "David", "Miguel", "UX Agent"];

export default function SkillsManagement() {
  const [, navigate] = useLocation();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");
  const { user: authUser } = useAuth();
  const user = authUser || { id: 1, name: "Utilizador Demo", email: "demo@worten.pt", role: "user" as const };
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    content: "",
  });

  const { data: skills, isLoading: skillsLoading, refetch: refetchSkills } = trpc.skills.list.useQuery();
  const createSkillMutation = trpc.skills.create.useMutation();
  const assignSkillMutation = trpc.skills.assign.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.content.trim()) {
      toast.error("Preencha o nome e conteúdo do skill");
      return;
    }

    setIsCreating(true);
    try {
      await createSkillMutation.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        content: formData.content,
      });

      toast.success("Skill criado com sucesso!");
      setFormData({ name: "", description: "", content: "" });
      refetchSkills();
    } catch (error) {
      toast.error("Erro ao criar skill");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAssignSkill = async (skillId: number) => {
    if (!selectedAgent) {
      toast.error("Selecione um agente");
      return;
    }

    try {
      await assignSkillMutation.mutateAsync({
        skillId,
        agentName: selectedAgent,
      });

      toast.success(`Skill atribuído a ${selectedAgent}`);
      refetchSkills();
    } catch (error) {
      toast.error("Erro ao atribuir skill");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestão de Skills</h1>
            <p className="text-slate-600">Carregue documentos de conhecimento e atribua-os aos agentes para enriquecer as análises</p>
          </div>
          <Button onClick={() => navigate("/")} variant="outline">
            Voltar ao Dashboard
          </Button>
        </div>

        <Tabs defaultValue="create" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Criar Novo Skill</TabsTrigger>
            <TabsTrigger value="manage">Meus Skills</TabsTrigger>
          </TabsList>

          {/* Create Tab */}
          <TabsContent value="create" className="space-y-4">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle>Criar Novo Skill</CardTitle>
                <CardDescription>Carregue um documento ou informação para enriquecer os agentes</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <form onSubmit={handleCreateSkill} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-semibold">
                      Nome do Skill *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ex: Análise de Concorrentes 2024"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isCreating}
                      className="border-slate-200"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-semibold">
                      Descrição (Opcional)
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="Breve descrição do conteúdo"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={isCreating}
                      className="border-slate-200"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content" className="font-semibold">
                      Conteúdo do Skill *
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Cole aqui o conteúdo do documento, análise ou informação..."
                      value={formData.content}
                      onChange={handleChange}
                      disabled={isCreating}
                      rows={8}
                      className="border-slate-200 resize-none font-mono text-sm"
                    />
                    <p className="text-xs text-slate-500">Máximo 50,000 caracteres</p>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        A criar...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Criar Skill
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage" className="space-y-4">
            {skillsLoading ? (
              <Card>
                <CardContent className="pt-6 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </CardContent>
              </Card>
            ) : !skills || skills.length === 0 ? (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <p className="text-yellow-800">Ainda não tem skills criados. Crie um novo skill para começar.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {skills.map((skill) => (
                  <Card key={skill.id} className="shadow-md">
                    <CardHeader className="bg-slate-50 border-b pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{skill.name}</CardTitle>
                          {skill.description && (
                            <CardDescription>{skill.description}</CardDescription>
                          )}
                        </div>
                        <Badge className="bg-blue-600">v{skill.version}</Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <p className="text-sm text-slate-600 mb-2">Conteúdo:</p>
                        <div className="bg-slate-100 p-3 rounded text-sm text-slate-700 max-h-32 overflow-y-auto font-mono">
                          {skill.content.substring(0, 200)}...
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-slate-600">Atribuir a Agente:</p>
                        <div className="flex gap-2">
                          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Selecione um agente" />
                            </SelectTrigger>
                            <SelectContent>
                              {AGENTS.map((agent) => (
                                <SelectItem key={agent} value={agent}>
                                  {agent}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() => handleAssignSkill(skill.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Atribuir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-md">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-slate-900 mb-2">Dicas para Criar Bons Skills</h3>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• <strong>Análises Competitivas:</strong> Inclua dados sobre como concorrentes (FNAC, Amazon, PCDIGA) lidam com UX</li>
              <li>• <strong>Feedback de Clientes:</strong> Relatórios de pesquisa com problemas reais identificados</li>
              <li>• <strong>Guias de Estilo:</strong> Padrões de design e heurísticas específicas da Worten</li>
              <li>• <strong>Dados de Mercado:</strong> Tendências de e-commerce e comportamento de utilizadores portugueses</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
