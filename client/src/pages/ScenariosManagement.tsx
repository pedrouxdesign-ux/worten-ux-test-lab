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

export type TechLevel = "Alto" | "Médio" | "Básico";

export type Scenario = {
  id: number;
  titulo: string;
  objetivo: string;
  nivelTecnico: TechLevel;
  frustracoesTipicas: string[];
  instrucoes: string;
  estruturaRelatorio: string[];
  categoria: string;
};

const defaultScenarios: Scenario[] = [
  {
    id: 1,
    titulo: "Verificar Stock em Loja Física na PDP",
    objetivo:
      "Aceder à PDP do produto e confirmar se está disponível em stock numa loja física — sem sair da página.",
    nivelTecnico: "Alto",
    frustracoesTipicas: [
      "Stock implícito (ex: 'Disponível' sem indicar onde)",
      "CTAs ambíguos ('Ver disponibilidade' vs 'Reservar')",
      "Pop-ups intrusivos que interrompem a navegação",
      "Preços inconsistentes entre variantes do produto",
    ],
    instrucoes: `Acede à página do produto indicado e tenta completar a tarefa.
- Pensa em voz alta durante toda a navegação — descreve o que vês e o que fazes
- Navega como farias normalmente, sem preocupações em "acertar"
- Se não souberes o que fazer a seguir, diz em voz alta e continua a explorar`,
    estruturaRelatorio: [
      "Conseguiu completar o objetivo? (Sim / Parcialmente / Não)",
      "Tempo estimado até encontrar a informação de stock em loja",
      "Cada fricção encontrada: descrição, zona da página, severidade (Crítico/Alto/Médio/Baixo), impacto estimado na conversão",
      "Momentos de confusão com citação direta da persona",
    ],
    categoria: "Disponibilidade & Stock",
  },
  {
    id: 2,
    titulo: "Processo de Devolução Online",
    objetivo:
      "Iniciar e completar um pedido de devolução de um produto comprado há 10 dias, sem contactar o apoio ao cliente.",
    nivelTecnico: "Médio",
    frustracoesTipicas: [
      "Processo de devolução escondido em menus secundários",
      "Linguagem técnica e jurídica confusa",
      "Necessidade de imprimir etiqueta sem impressora disponível",
      "Falta de feedback sobre o estado da devolução",
    ],
    instrucoes: `Acede à tua área de cliente e tenta completar a tarefa.
- Pensa em voz alta durante toda a navegação — descreve o que vês e o que fazes
- Navega como farias normalmente, sem preocupações em "acertar"
- Se não souberes o que fazer a seguir, diz em voz alta e continua a explorar`,
    estruturaRelatorio: [
      "Conseguiu iniciar a devolução? (Sim / Parcialmente / Não)",
      "Número de passos necessários vs esperados",
      "Pontos de abandono potencial com justificação",
      "Clareza da linguagem usada: rating 1-5 com exemplos",
      "Sugestões de simplificação do fluxo",
    ],
    categoria: "Pós-Venda & Suporte",
  },
  {
    id: 3,
    titulo: "Pesquisa e Filtro de Produto Técnico",
    objetivo:
      "Encontrar um portátil com especificações técnicas precisas (RAM ≥ 16GB, GPU dedicada, ecrã ≥ 15\") usando apenas a pesquisa e filtros do site.",
    nivelTecnico: "Alto",
    frustracoesTipicas: [
      "Filtros insuficientes ou com categorias erradas",
      "Resultados que não correspondem aos filtros aplicados",
      "Especificações técnicas incompletas ou vagas nas fichas",
      "Falta de comparação lado a lado de produtos",
    ],
    instrucoes: `Começa na página inicial do site e tenta completar a tarefa.
- Pensa em voz alta durante toda a navegação — descreve o que vês e o que fazes
- Navega como farias normalmente, sem preocupações em "acertar"
- Se não souberes o que fazer a seguir, diz em voz alta e continua a explorar`,
    estruturaRelatorio: [
      "Conseguiu encontrar produto que cumpre os requisitos? (Sim / Parcialmente / Não)",
      "Filtros utilizados vs filtros desejados que não existiam",
      "Qualidade das especificações técnicas: rating 1-5 por campo",
      "Tempo total de pesquisa até decisão",
      "Comparação com experiência equivalente em concorrente (ex: PCDiga, Amazon)",
    ],
    categoria: "Pesquisa & Descoberta",
  },
  {
    id: 4,
    titulo: "Checkout e Finalização de Compra",
    objetivo:
      "Completar uma compra de um produto já no carrinho, usando um método de pagamento guardado, com entrega ao domicílio.",
    nivelTecnico: "Básico",
    frustracoesTipicas: [
      "Campos de formulário confusos ou mal validados",
      "Surpresas de custo no final (portes, taxas ocultas)",
      "Múltiplos redirects ou janelas de confirmação desnecessárias",
      "Falta de confirmação clara após compra concluída",
    ],
    instrucoes: `Parte do carrinho já preenchido com o produto e tenta completar a tarefa.
- Pensa em voz alta durante toda a navegação — descreve o que vês e o que fazes
- Navega como farias normalmente, sem preocupações em "acertar"
- Se não souberes o que fazer a seguir, diz em voz alta e continua a explorar`,
    estruturaRelatorio: [
      "Conseguiu completar a compra? (Sim / Parcialmente / Não)",
      "Número de ecrãs/passos no checkout",
      "Momentos de hesitação com descrição e zona da página",
      "Transparência dos custos: foi surpresa ou estava claro?",
      "Confiança na confirmação de compra: rating 1-5",
    ],
    categoria: "Checkout & Conversão",
  },
  {
    id: 5,
    titulo: "Ativação de Garantia e Serviço Pós-Venda",
    objetivo:
      "Encontrar e acionar a garantia de um produto comprado há 6 meses que apresenta defeito, sem ir à loja física.",
    nivelTecnico: "Básico",
    frustracoesTipicas: [
      "Terminologia confusa ('Serviços Pós-Venda', 'RMA', 'Reparação')",
      "Falta de visibilidade do estado de reparação em tempo real",
      "Necessidade de documentos físicos (fatura em papel)",
      "Chatbots que não resolvem e não oferecem escalada para humano",
    ],
    instrucoes: `Começa na página inicial do site e tenta completar a tarefa.
- Pensa em voz alta durante toda a navegação — descreve o que vês e o que fazes
- Navega como farias normalmente, sem preocupações em "acertar"
- Se não souberes o que fazer a seguir, diz em voz alta e continua a explorar`,
    estruturaRelatorio: [
      "Conseguiu acionar a garantia online? (Sim / Parcialmente / Não)",
      "Número de cliques até chegar ao formulário de garantia",
      "Clareza da linguagem: termos confusos encontrados com alternativas sugeridas",
      "Momentos de vontade de abandonar o processo digital",
      "Avaliação da confiança no processo: sentiu que o pedido ia ser tratado?",
    ],
    categoria: "Pós-Venda & Suporte",
  },
];

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

  const categories = [...new Set(defaultScenarios.map(s => s.categoria))];
  const byLevel = (l: TechLevel) => defaultScenarios.filter(s => s.nivelTecnico === l).length;

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
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cenário
            </Button>
          </div>
        </div>
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
          {defaultScenarios.map(scenario => (
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
                    <Button variant="outline" size="icon" className="h-8 w-8" aria-label="Editar">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 hover:text-destructive hover:border-destructive"
                      aria-label="Eliminar"
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
