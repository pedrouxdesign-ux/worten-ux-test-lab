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

/* ─── List helpers ────────────────────────────────────────── */

function DynamicList({
  label,
  description,
  items,
  setItems,
  placeholder,
  addLabel,
}: {
  label: string;
  description: string;
  items: string[];
  setItems: (v: string[]) => void;
  placeholder: string;
  addLabel: string;
}) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              placeholder={placeholder}
              value={item}
              onChange={e => {
                const u = [...items];
                u[i] = e.target.value;
                setItems(u);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => items.length > 1 && setItems(items.filter((_, j) => j !== i))}
              disabled={items.length === 1}
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => setItems([...items, ""])} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> {addLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

/* ─── Frustração row ──────────────────────────────────────── */

type FrustRow = { titulo: string; severidade: string; cenario: string; impacto: string };
const emptyFrust = (): FrustRow => ({ titulo: "", severidade: "MÉDIA", cenario: "", impacto: "" });

function FrustracaoList({ items, setItems }: { items: FrustRow[]; setItems: (v: FrustRow[]) => void }) {
  const update = (i: number, key: keyof FrustRow, val: string) => {
    const u = [...items];
    u[i] = { ...u[i], [key]: val };
    setItems(u);
  };
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-base">Frustrações Detalhadas</CardTitle>
        <CardDescription>Pain points com severidade, cenário e impacto</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((f, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3 relative">
            <div className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <Input placeholder="Título (ex: Informação Inconsistente)" value={f.titulo} onChange={e => update(i, "titulo", e.target.value)} />
                <div className="flex gap-2">
                  <select
                    value={f.severidade}
                    onChange={e => update(i, "severidade", e.target.value)}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground w-32"
                  >
                    <option value="CRÍTICA">CRÍTICA</option>
                    <option value="ALTA">ALTA</option>
                    <option value="MÉDIA">MÉDIA</option>
                    <option value="BAIXA">BAIXA</option>
                  </select>
                  <Input placeholder="Impacto (ex: Sai do site, vai para Amazon)" value={f.impacto} onChange={e => update(i, "impacto", e.target.value)} className="flex-1" />
                </div>
                <Textarea placeholder="Cenário concreto..." value={f.cenario} onChange={e => update(i, "cenario", e.target.value)} rows={2} className="text-sm" />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => items.length > 1 && setItems(items.filter((_, j) => j !== i))} disabled={items.length === 1} className="shrink-0 text-muted-foreground hover:text-destructive mt-1">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => setItems([...items, emptyFrust()])} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Adicionar Frustração
        </Button>
      </CardContent>
    </Card>
  );
}

/* ─── Quote row ───────────────────────────────────────────── */

type QuoteRow = { contexto: string; citacao: string };

function QuoteList({ items, setItems }: { items: QuoteRow[]; setItems: (v: QuoteRow[]) => void }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-base">Citações (Verbatim)</CardTitle>
        <CardDescription>Frases que esta persona diria em contexto real</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((q, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              placeholder="Contexto (ex: Devoluções)"
              value={q.contexto}
              onChange={e => {
                const u = [...items];
                u[i] = { ...u[i], contexto: e.target.value };
                setItems(u);
              }}
              className="w-36 shrink-0"
            />
            <Input
              placeholder="Citação (ex: 'A Amazon deixa-me devolver pelo app...')"
              value={q.citacao}
              onChange={e => {
                const u = [...items];
                u[i] = { ...u[i], citacao: e.target.value };
                setItems(u);
              }}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => items.length > 1 && setItems(items.filter((_, j) => j !== i))} disabled={items.length === 1} className="shrink-0 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => setItems([...items, { contexto: "", citacao: "" }])} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Adicionar Citação
        </Button>
      </CardContent>
    </Card>
  );
}

/* ─── Big Five Slider ─────────────────────────────────────── */

function BigFiveSliders({ values, onChange }: { values: Record<string, number[]>; onChange: (key: string, val: number[]) => void }) {
  const traits = [
    { key: "abertura", label: "Abertura à Experiência", low: "Convencional", high: "Explorador" },
    { key: "consciencia", label: "Consciência", low: "Flexível", high: "Organizado" },
    { key: "extroversao", label: "Extroversão", low: "Introvertido", high: "Extrovertido" },
    { key: "simpatia", label: "Simpatia", low: "Direto", high: "Empático" },
    { key: "neuroticismo", label: "Neuroticismo", low: "Calmo", high: "Ansioso" },
  ];
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-base">Psicografia (Big Five)</CardTitle>
        <CardDescription>Traços de personalidade que definem como a persona pensa e age</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {traits.map(t => (
          <div key={t.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">{t.label}</Label>
              <span className="text-sm font-semibold text-foreground bg-muted px-2 py-0.5 rounded">{values[t.key][0]}/10</span>
            </div>
            <Slider min={1} max={10} step={0.5} value={values[t.key]} onValueChange={v => onChange(t.key, v)} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t.low} (1)</span>
              <span>{t.high} (10)</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ─── Main Component ──────────────────────────────────────── */

export default function AddPersona() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();

  /* --- Basic fields --- */
  const [formData, setFormData] = useState({
    nome: "",
    subtitulo: "",
    idade: "",
    profissao: "",
    situacao: "",
    localizacao: "",
    rendimento: "",
    techLevel: [5],
    usoMobile: "",
    usoDesktop: "",
    usoLoja: "",
  });

  /* --- Big Five --- */
  const [bigFive, setBigFive] = useState<Record<string, number[]>>({
    abertura: [5],
    consciencia: [5],
    extroversao: [5],
    simpatia: [5],
    neuroticismo: [5],
  });
  const updateBigFive = (key: string, val: number[]) => setBigFive(prev => ({ ...prev, [key]: val }));

  /* --- Dynamic lists --- */
  const [valores, setValores] = useState<string[]>([""]);
  const [frustracoes, setFrustracoes] = useState<FrustRow[]>([emptyFrust()]);
  const [motivacoes, setMotivacoes] = useState<string[]>([""]);
  const [gatilhos, setGatilhos] = useState<string[]>([""]);
  const [quotes, setQuotes] = useState<QuoteRow[]>([{ contexto: "", citacao: "" }]);

  /* --- Cognitivo --- */
  const [cognitivo, setCognitivo] = useState({
    qiGeral: "",
    velocidade: [5],
    numeracia: [5],
    literaciaDigital: [5],
    criatividade: [5],
    inteligenciaEmocional: [5],
    flexibilidade: [5],
    memoriaTrabalho: "",
  });

  /* --- Prompt --- */
  const [promptMestre, setPromptMestre] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCognitivo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim() || !formData.profissao.trim() || !promptMestre.trim()) {
      toast.error("Campos obrigatórios: Nome, Profissão e Prompt-Mestre");
      return;
    }

    const persona = {
      ...formData,
      techLevel: formData.techLevel[0],
      bigFive: {
        abertura: bigFive.abertura[0],
        consciencia: bigFive.consciencia[0],
        extroversao: bigFive.extroversao[0],
        simpatia: bigFive.simpatia[0],
        neuroticismo: bigFive.neuroticismo[0],
      },
      valores: valores.filter(v => v.trim()),
      frustracoes: frustracoes.filter(f => f.titulo.trim()),
      motivacoes: motivacoes.filter(m => m.trim()),
      gatilhosCompra: gatilhos.filter(g => g.trim()),
      quotes: quotes.filter(q => q.citacao.trim()),
      perfilCognitivo: {
        qiGeral: cognitivo.qiGeral ? Number(cognitivo.qiGeral) : null,
        velocidadeProcessamento: cognitivo.velocidade[0],
        numeracia: cognitivo.numeracia[0],
        literaciaDigital: cognitivo.literaciaDigital[0],
        criatividade: cognitivo.criatividade[0],
        inteligenciaEmocional: cognitivo.inteligenciaEmocional[0],
        flexibilidadeCognitiva: cognitivo.flexibilidade[0],
        memoriaTrabalho: cognitivo.memoriaTrabalho,
      },
      promptMestre,
    };

    console.log("Nova persona criada:", persona);
    toast.success(`Persona "${formData.nome}" adicionada com sucesso!`);
    navigate("/users");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/users")} aria-label="Voltar">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Adicionar Persona</h1>
              <p className="text-sm text-muted-foreground">Crie um novo perfil detalhado de utilizador</p>
            </div>
          </div>
          <Button onClick={toggleTheme} variant="outline" size="icon" aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ─── 1. Perfil Básico ──────────────────────────── */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Perfil Básico</CardTitle>
              <CardDescription>Informação demográfica e de contexto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome <span className="text-destructive">*</span></Label>
                  <Input id="nome" name="nome" placeholder="Ex: Ana Silva" value={formData.nome} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitulo">Subtítulo</Label>
                  <Input id="subtitulo" name="subtitulo" placeholder="Ex: A Compradora Pragmática" value={formData.subtitulo} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="idade">Idade</Label>
                  <Input id="idade" name="idade" type="number" min={1} max={100} placeholder="Ex: 35" value={formData.idade} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rendimento">Rendimento</Label>
                  <Input id="rendimento" name="rendimento" placeholder="Ex: €2.800/mês" value={formData.rendimento} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profissao">Profissão <span className="text-destructive">*</span></Label>
                <Input id="profissao" name="profissao" placeholder="Ex: Gestora de Projetos (PME)" value={formData.profissao} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="situacao">Situação Pessoal</Label>
                <Input id="situacao" name="situacao" placeholder="Ex: Casada com Fernando, sem filhos" value={formData.situacao} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização</Label>
                <Input id="localizacao" name="localizacao" placeholder="Ex: Almada, arredores de Lisboa" value={formData.localizacao} onChange={handleChange} />
              </div>

              {/* Tech Level */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Nível Tecnológico</Label>
                  <span className="text-sm font-semibold text-foreground bg-muted px-2 py-0.5 rounded">{formData.techLevel[0]}/10</span>
                </div>
                <Slider min={1} max={10} step={1} value={formData.techLevel} onValueChange={v => setFormData(prev => ({ ...prev, techLevel: v }))} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Básico (1)</span>
                  <span>Intermédio (5)</span>
                  <span>Especialista (10)</span>
                </div>
              </div>

              {/* Usage Distribution */}
              <div className="space-y-2">
                <Label>Distribuição de Uso (%)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Mobile</Label>
                    <Input name="usoMobile" type="number" min={0} max={100} placeholder="80" value={formData.usoMobile} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Desktop</Label>
                    <Input name="usoDesktop" type="number" min={0} max={100} placeholder="15" value={formData.usoDesktop} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Loja Física</Label>
                    <Input name="usoLoja" type="number" min={0} max={100} placeholder="5" value={formData.usoLoja} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ─── 2. Big Five ───────────────────────────────── */}
          <BigFiveSliders values={bigFive} onChange={updateBigFive} />

          {/* ─── 3. Valores ────────────────────────────────── */}
          <DynamicList
            label="Valores Pessoais"
            description="Os princípios que guiam as decisões desta persona (por ordem de importância)"
            items={valores}
            setItems={setValores}
            placeholder="Ex: Eficiência — Tempo é ouro"
            addLabel="Adicionar Valor"
          />

          {/* ─── 4. Frustrações ────────────────────────────── */}
          <FrustracaoList items={frustracoes} setItems={setFrustracoes} />

          {/* ─── 5. Motivações ─────────────────────────────── */}
          <DynamicList
            label="Motivações"
            description="O que motiva e impulsiona esta persona a comprar"
            items={motivacoes}
            setItems={setMotivacoes}
            placeholder="Ex: Resolver necessidades imediatas com o mínimo de esforço"
            addLabel="Adicionar Motivação"
          />

          {/* ─── 6. Gatilhos de Compra ─────────────────────── */}
          <DynamicList
            label="Gatilhos de Compra"
            description="O que desencadeia uma compra impulsiva ou planeada"
            items={gatilhos}
            setItems={setGatilhos}
            placeholder="Ex: Email de newsletter com 'Top Trending'"
            addLabel="Adicionar Gatilho"
          />

          {/* ─── 7. Citações ───────────────────────────────── */}
          <QuoteList items={quotes} setItems={setQuotes} />

          {/* ─── 8. Perfil Cognitivo ───────────────────────── */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Perfil Cognitivo</CardTitle>
              <CardDescription>Capacidades de processamento, memória e viéses dominantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="qiGeral">QI Geral (estimado)</Label>
                  <Input id="qiGeral" name="qiGeral" type="number" min={70} max={160} placeholder="Ex: 120" value={cognitivo.qiGeral} onChange={handleCogChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memoriaTrabalho">Memória de Trabalho</Label>
                  <Input id="memoriaTrabalho" name="memoriaTrabalho" placeholder="Ex: 5-7 itens" value={cognitivo.memoriaTrabalho} onChange={handleCogChange} />
                </div>
              </div>

              {[
                { key: "velocidade", label: "Velocidade de Processamento" },
                { key: "numeracia", label: "Numeracia" },
                { key: "literaciaDigital", label: "Literacia Digital" },
                { key: "criatividade", label: "Criatividade" },
                { key: "inteligenciaEmocional", label: "Inteligência Emocional" },
                { key: "flexibilidade", label: "Flexibilidade Cognitiva" },
              ].map(s => (
                <div key={s.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{s.label}</Label>
                    <span className="text-sm font-semibold text-foreground bg-muted px-2 py-0.5 rounded">
                      {(cognitivo as Record<string, unknown>)[s.key] as number[]
                        ? ((cognitivo as Record<string, unknown>)[s.key] as number[])[0]
                        : 5}/10
                    </span>
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={0.5}
                    value={(cognitivo as Record<string, unknown>)[s.key] as number[]}
                    onValueChange={v => setCognitivo(prev => ({ ...prev, [s.key]: v }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ─── 9. Prompt-Mestre ──────────────────────────── */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Prompt-Mestre <span className="text-destructive">*</span></CardTitle>
              <CardDescription>
                Instruções completas que definem o comportamento e personalidade desta persona durante os testes de IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Escreva aqui o prompt completo: personalidade, comportamentos, frustrações, motivações, perfil cognitivo, viéses..."
                value={promptMestre}
                onChange={e => setPromptMestre(e.target.value)}
                rows={14}
                className="resize-y font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* ─── Actions ───────────────────────────────────── */}
          <div className="flex gap-3 justify-end pb-8">
            <Button type="button" variant="outline" onClick={() => navigate("/users")}>
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
