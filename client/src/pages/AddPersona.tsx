import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import { ArrowLeft, Moon, Plus, Sun, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function AddPersona() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    profissao: "",
    situacao: "",
    localizacao: "",
    techLevel: [5],
    usoMobile: "",
    usoDesktop: "",
    promptMestre: "",
  });

  const [frustracoes, setFrustracoes] = useState<string[]>([""]);
  const [motivacoes, setMotivacoes] = useState<string[]>([""]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addItem = (list: string[], setList: (v: string[]) => void) => {
    setList([...list, ""]);
  };

  const updateItem = (list: string[], setList: (v: string[]) => void, index: number, value: string) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  const removeItem = (list: string[], setList: (v: string[]) => void, index: number) => {
    if (list.length === 1) return;
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.profissao.trim() || !formData.promptMestre.trim()) {
      toast.error("Por favor, preencha os campos obrigatórios (Nome, Profissão e Prompt-Mestre)");
      return;
    }

    // For now, log the persona data (backend integration can be added later)
    const persona = {
      ...formData,
      techLevel: formData.techLevel[0],
      frustracoes: frustracoes.filter(f => f.trim()),
      motivacoes: motivacoes.filter(m => m.trim()),
    };

    console.log("Nova persona criada:", persona);
    toast.success(`Persona "${formData.nome}" adicionada com sucesso!`);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              aria-label="Voltar"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Adicionar Persona</h1>
              <p className="text-sm text-muted-foreground">Crie um novo perfil de agente de teste</p>
            </div>
          </div>
          <Button onClick={toggleTheme} variant="outline" size="icon" aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Perfil Básico */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Perfil Básico</CardTitle>
              <CardDescription>Informação demográfica e de contexto da persona</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome <span className="text-destructive">*</span></Label>
                  <Input
                    id="nome"
                    name="nome"
                    placeholder="Ex: Ana"
                    value={formData.nome}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idade">Idade</Label>
                  <Input
                    id="idade"
                    name="idade"
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Ex: 35"
                    value={formData.idade}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profissao">Profissão <span className="text-destructive">*</span></Label>
                <Input
                  id="profissao"
                  name="profissao"
                  placeholder="Ex: Gestora de Projetos numa PME"
                  value={formData.profissao}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="situacao">Situação Pessoal</Label>
                <Input
                  id="situacao"
                  name="situacao"
                  placeholder="Ex: Vive com parceiro, sem filhos"
                  value={formData.situacao}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização</Label>
                <Input
                  id="localizacao"
                  name="localizacao"
                  placeholder="Ex: Arredores de grande centro urbano"
                  value={formData.localizacao}
                  onChange={handleChange}
                />
              </div>

              {/* Tech Level Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Nível de Familiaridade com Tecnologia</Label>
                  <span className="text-sm font-semibold text-foreground bg-muted px-2 py-0.5 rounded">
                    {formData.techLevel[0]}/10
                  </span>
                </div>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={formData.techLevel}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, techLevel: value }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Básico (1)</span>
                  <span>Intermédio (5)</span>
                  <span>Especialista (10)</span>
                </div>
              </div>

              {/* Distribuição de Uso */}
              <div className="space-y-2">
                <Label>Distribuição de Uso</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="usoMobile" className="text-xs text-muted-foreground">
                      📱 Mobile (App) %
                    </Label>
                    <Input
                      id="usoMobile"
                      name="usoMobile"
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Ex: 80"
                      value={formData.usoMobile}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="usoDesktop" className="text-xs text-muted-foreground">
                      🖥️ Desktop %
                    </Label>
                    <Input
                      id="usoDesktop"
                      name="usoDesktop"
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Ex: 20"
                      value={formData.usoDesktop}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Frustrações */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Frustrações Principais</CardTitle>
              <CardDescription>O que frustra esta persona na experiência digital</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {frustracoes.map((f, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    placeholder={`Ex: Inconsistência de informação`}
                    value={f}
                    onChange={e => updateItem(frustracoes, setFrustracoes, i, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(frustracoes, setFrustracoes, i)}
                    disabled={frustracoes.length === 1}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem(frustracoes, setFrustracoes)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Frustração
              </Button>
            </CardContent>
          </Card>

          {/* Motivações */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Motivações</CardTitle>
              <CardDescription>O que motiva e impulsiona esta persona</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {motivacoes.map((m, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    placeholder={`Ex: Resolver necessidades imediatas com o mínimo de esforço`}
                    value={m}
                    onChange={e => updateItem(motivacoes, setMotivacoes, i, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(motivacoes, setMotivacoes, i)}
                    disabled={motivacoes.length === 1}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem(motivacoes, setMotivacoes)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Motivação
              </Button>
            </CardContent>
          </Card>

          {/* Prompt-Mestre */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Prompt-Mestre <span className="text-destructive">*</span></CardTitle>
              <CardDescription>
                Instruções detalhadas que definem o comportamento e personalidade desta persona durante os testes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                name="promptMestre"
                placeholder="Escreva aqui o prompt completo que define a personalidade, comportamentos, frustrações e motivações desta persona em detalhe..."
                value={formData.promptMestre}
                onChange={handleChange}
                rows={10}
                className="resize-y font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Persona
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
