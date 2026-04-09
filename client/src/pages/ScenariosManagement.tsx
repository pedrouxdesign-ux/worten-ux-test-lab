import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Moon,
  Sun,
  Plus,
  Pencil,
  Trash2,
  Target,
  BarChart3,
  ClipboardList,
} from "lucide-react";

import defaultScenarios, { Scenario, TechLevel } from "@/lib/scenario";
import { useScenariosStore } from "@/lib/scenarios-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as Dialog from "@/components/ui/dialog";
import { toast } from "sonner";

const techColors: Record<TechLevel, string> = {
  Alto: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Médio: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Básico: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
};

const categoryColors: Record<string, string> = {
  "Disponibilidade & Stock": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  "Pós-Venda & Suporte": "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "Pesquisa & Descoberta": "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  "Checkout & Conversão": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

export { defaultScenarios };

export default function ScenariosManagement() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();

  const { scenarios, addScenario, updateScenario, removeScenario } = useScenariosStore();
  const categories = [...new Set(scenarios.map(s => s.categoria))];
  const byLevel = (l: TechLevel) => scenarios.filter(s => s.nivelTecnico === l).length;
  const handleCreate = (payload: Omit<Scenario, "id">) => {
    addScenario(payload);
    toast.success("Cenário criado");
  };

  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const handleRemove = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmRemove = () => {
    if (deleteId == null) return;
    removeScenario(deleteId);
    setDeleteId(null);
    setDeleteOpen(false);
    toast.success('Cenário eliminado');
  };

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
              <h1 className="text-2xl font-bold text-foreground">Cenários de Teste</h1>
              <p className="text-sm text-muted-foreground">
                {defaultScenarios.length} cenários disponíveis · {categories.length} categorias
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={toggleTheme} variant="outline" size="icon" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/scenarios/new") }>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cenário
            </Button>
          </div>
        </div>
        <Dialog.Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <Dialog.DialogContent>
            <Dialog.DialogHeader>
              <Dialog.DialogTitle>Eliminar Cenário</Dialog.DialogTitle>
              <Dialog.DialogDescription>Tem a certeza que pretende eliminar este cenário? Esta ação não pode ser desfeita.</Dialog.DialogDescription>
            </Dialog.DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
              <Button className="bg-destructive hover:bg-destructive/90" onClick={confirmRemove}>Eliminar</Button>
            </div>
          </Dialog.DialogContent>
        </Dialog.Dialog>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total de Cenários", value: defaultScenarios.length, color: "text-blue-600", icon: ClipboardList },
            { label: "Nível Alto", value: byLevel("Alto"), color: "text-green-600", icon: BarChart3 },
            { label: "Nível Médio", value: byLevel("Médio"), color: "text-blue-500", icon: BarChart3 },
            { label: "Nível Básico", value: byLevel("Básico"), color: "text-orange-500", icon: BarChart3 },
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

        {/* Scenarios list */}
        <div className="grid grid-cols-1 gap-4">
          {scenarios.map(scenario => (
            <Card key={scenario.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Icon + Content */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Icon */}
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                      <Target className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title + badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-foreground">{scenario.titulo}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${techColors[scenario.nivelTecnico]}`}>
                          Nível {scenario.nivelTecnico}
                        </span>
                        <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[scenario.categoria] ?? "bg-slate-100 text-slate-700"}`}>
                          {scenario.categoria}
                        </span>
                      </div>

                      {/* Objetivo */}
                      <div className="flex gap-2 mb-3">
                        <Target className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{scenario.objetivo}</p>
                      </div>

                      {/* Relatório items */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <ClipboardList className="h-3 w-3 text-blue-500" />
                          <p className="text-xs font-medium text-muted-foreground">Relatório inclui:</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {scenario.estruturaRelatorio.slice(0, 3).map((item, i) => (
                            <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                              {i + 1}. {item.split("?")[0].split(":")[0].substring(0, 40)}{item.length > 40 ? "…" : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button variant="outline" size="icon" className="h-8 w-8" aria-label="Editar" onClick={() => navigate(`/scenarios/${scenario.id}/edit`)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 hover:text-destructive hover:border-destructive"
                      aria-label="Eliminar"
                      onClick={() => handleRemove(scenario.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreateScenarioForm({ onCreate, onCancel }: { onCreate: (s: Omit<Scenario, "id">) => void; onCancel: () => void; }) {
  const [titulo, setTitulo] = React.useState("");
  const [objetivo, setObjetivo] = React.useState("");
  const [nivelTecnico, setNivelTecnico] = React.useState<TechLevel>("Médio");
  const [categoria, setCategoria] = React.useState("");
  const [instrucoes, setInstrucoes] = React.useState("");
  const [frustracoes, setFrustracoes] = React.useState<string[]>([""]);
  const [estrutura, setEstrutura] = React.useState<string[]>([""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !objetivo.trim()) {
      toast.error("Título e objetivo são obrigatórios");
      return;
    }

    const payload: Omit<Scenario, "id"> = {
      titulo: titulo.trim(),
      objetivo: objetivo.trim(),
      nivelTecnico,
      categoria: categoria.trim() || "Geral",
      instrucoes: instrucoes.trim(),
      frustracoesTipicas: frustracoes,
      estruturaRelatorio: estrutura,
    };

    onCreate(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="titulo">Título</Label>
        <Input id="titulo" value={titulo} onChange={e => setTitulo(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="objetivo">Objetivo</Label>
        <Input id="objetivo" value={objetivo} onChange={e => setObjetivo(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="nivel">Nível Técnico</Label>
        <Select onValueChange={(v: TechLevel) => setNivelTecnico(v)}>
          <SelectTrigger>
            <SelectValue placeholder={nivelTecnico} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Alto">Alto</SelectItem>
            <SelectItem value="Médio">Médio</SelectItem>
            <SelectItem value="Básico">Básico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="categoria">Categoria</Label>
        <Input id="categoria" value={categoria} onChange={e => setCategoria(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="instrucoes">Instruções (texto livre)</Label>
        <Textarea id="instrucoes" value={instrucoes} onChange={e => setInstrucoes(e.target.value)} rows={4} />
      </div>

      <div>
        <Label>Frustrações típicas</Label>
        {frustracoes.map((f, i) => (
          <div key={i} className="flex gap-2 items-center mb-2">
            <Input value={f} onChange={e => setFrustracoes(prev => { const u = [...prev]; u[i] = e.target.value; return u; })} placeholder={i === 0 ? "Ex: Informação de stock inconsistente" : "Ex: Outra frustração"} />
            <Button type="button" variant="ghost" size="icon" onClick={() => setFrustracoes(prev => prev.length > 1 ? prev.filter((_, j) => j !== i) : prev)} disabled={i === 0} className="shrink-0 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => setFrustracoes(prev => [...prev, ""]) } className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Adicionar Frustração
        </Button>
      </div>

      <div>
        <Label>Estrutura do relatório</Label>
        <p className="text-sm text-muted-foreground">Adicione as exigências que devem constar no relatório (pelo menos a primeira).</p>
        {estrutura.map((item, i) => (
          <div key={i} className="flex gap-2 items-center mb-2">
            <Input placeholder={i === 0 ? "Ex: Resumo Executivo" : `Ex: Requisito ${i+1}`} value={item} onChange={e => setEstrutura(prev => { const u = [...prev]; u[i] = e.target.value; return u; })} required={i === 0} />
            <Button type="button" variant="ghost" size="icon" onClick={() => setEstrutura(prev => prev.length > 1 ? prev.filter((_, j) => j !== i) : prev)} disabled={i === 0} className="shrink-0 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => setEstrutura(prev => [...prev, ""]) } className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Adicionar Requisito
        </Button>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Criar Cenário</Button>
      </div>
    </form>
  );
}
