import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import { ArrowLeft, Moon, Sun, UserPlus, Pencil, Trash2, Monitor, Smartphone, Store } from "lucide-react";

type Persona = {
  id: number;
  nome: string;
  subtitulo: string;
  idade: number | null;
  profissao: string;
  situacao: string;
  localizacao: string;
  techLevel: number | null;
  usoMobile: number | null;
  usoDesktop: number | null;
  usoLoja: number | null;
  frustracoes: string[];
  motivacoes: string[];
  promptMestre: string;
  tipo: "persona" | "agente";
};

const defaultPersonas: Persona[] = [
  {
    id: 1,
    nome: "Ana",
    subtitulo: "A Compradora Pragmática",
    idade: 35,
    profissao: "Gestora de Projetos numa PME",
    situacao: "Vive com parceiro, sem filhos",
    localizacao: "Arredores de grande centro urbano",
    techLevel: 7,
    usoMobile: 80,
    usoDesktop: 20,
    usoLoja: null,
    frustracoes: [
      "Inconsistência de informação (ver 'Disponível' e depois descobrir que não há stock)",
      "Processos pós-venda obscuros (sem visibilidade clara sobre devoluções/reparações)",
      "Falta de autonomia (ter de recorrer ao apoio para tarefas simples)",
      "Filtros de pesquisa ineficazes",
    ],
    motivacoes: [
      "Resolver necessidades imediatas com o mínimo de esforço",
      "Aproveitar promoções em produtos que já tem em mente",
      "Gerir facilmente o ciclo de vida dos seus produtos",
    ],
    promptMestre:
      "Você é Ana, uma mulher de 35 anos, gestora de projetos numa PME. Você é pragmática, organizada e valoriza eficiência acima de tudo. O seu tempo é precioso e não tem paciência para complicações.",
    tipo: "persona",
  },
  {
    id: 2,
    nome: "David",
    subtitulo: "O Especialista Digital",
    idade: 26,
    profissao: "Especialista em Tecnologia / Tech Enthusiast",
    situacao: "Solteiro, vive em apartamento arrendado com amigos",
    localizacao: "Centro de Lisboa",
    techLevel: 10,
    usoMobile: 50,
    usoDesktop: 50,
    usoLoja: null,
    frustracoes: [
      "Informação incorreta ou incompleta (descrições vagas, especificações omissas)",
      "Processos de reparação lentos e analógicos (sem visibilidade online em tempo real)",
      "'Dark patterns' na UI (truques de design que tentam induzi-lo em erro)",
      "Experiência de app não nativa (lentidão, animações não fluídas)",
    ],
    motivacoes: [
      "Encontrar o melhor desempenho pelo preço mais baixo",
      "Ter acesso a informação técnica precisa e detalhada",
      "Processos rápidos e transparentes",
    ],
    promptMestre:
      "Você é David, um homem de 26 anos, especialista em tecnologia. Você é um 'nativo digital' e a tecnologia é a sua paixão. Você monta computadores, experimenta software beta e está sempre a par das últimas tendências.",
    tipo: "persona",
  },
  {
    id: 3,
    nome: "Miguel",
    subtitulo: "O Cliente Fiel e Prático",
    idade: 58,
    profissao: "Comercial numa empresa de distribuição",
    situacao: "Casado, 2 filhos adultos que não vivem em casa",
    localizacao: "Cidade de média dimensão",
    techLevel: 4,
    usoMobile: null,
    usoDesktop: 20,
    usoLoja: 80,
    frustracoes: [
      "Menus e linguagem confusa (termos como 'Serviços Pós-Venda' são vagos e intimidadores)",
      "Apoio ao cliente robotizado (detesta falar com robôs)",
      "Processos que exigem autonomia digital (imprimir etiquetas, agendar recolhas)",
      "Falta de contacto humano",
    ],
    motivacoes: [
      "Processos simples e diretos",
      "Clareza absoluta na linguagem",
      "Contacto fácil com uma pessoa real",
      "Conveniência sem complicações",
    ],
    promptMestre:
      "Você é Miguel, um homem de 58 anos, comercial e cliente fiel da Worten há muitos anos. Você pertence à Geração X e adaptou-se ao digital por necessidade, não por paixão.",
    tipo: "persona",
  },
  {
    id: 4,
    nome: "UX Agent",
    subtitulo: "O Especialista de Análise",
    idade: null,
    profissao: "Lead UX Researcher & Analyst",
    situacao: "15+ anos em e-commerce e retalho",
    localizacao: "–",
    techLevel: null,
    usoMobile: null,
    usoDesktop: null,
    usoLoja: null,
    frustracoes: [],
    motivacoes: [
      "Diagnosticar problemas de UX com base em teoria e dados de mercado",
      "Fornecer um roadmap de recomendações estratégicas, priorizadas e acionáveis",
    ],
    promptMestre:
      "Você é um UX Lead Researcher com 15 anos de experiência em e-commerce e retalho. Tem formação em heurísticas de usabilidade (Nielsen Norman Group) e conhece o ecossistema da Worten, concorrentes e o mercado português.",
    tipo: "agente",
  },
];

function TechLevelBadge({ level }: { level: number }) {
  const color =
    level >= 8
      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
      : level >= 5
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
        : "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
  const label = level >= 8 ? "Especialista" : level >= 5 ? "Intermédio" : "Básico";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
      {label} {level}/10
    </span>
  );
}

function UsageBadges({
  mobile,
  desktop,
  loja,
}: {
  mobile: number | null;
  desktop: number | null;
  loja: number | null;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {mobile !== null && (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
          <Smartphone className="h-3 w-3" /> {mobile}%
        </span>
      )}
      {desktop !== null && (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Monitor className="h-3 w-3" /> {desktop}%
        </span>
      )}
      {loja !== null && (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
          <Store className="h-3 w-3" /> Loja {loja}%
        </span>
      )}
    </div>
  );
}

export default function UsersManagement() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();

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
              <h1 className="text-2xl font-bold text-foreground">Gestão de Utilizadores</h1>
              <p className="text-sm text-muted-foreground">
                {defaultPersonas.length} perfis carregados
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={toggleTheme} variant="outline" size="icon" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button onClick={() => navigate("/add-persona")} className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Persona
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total de Perfis", value: defaultPersonas.length, color: "text-blue-600" },
            { label: "Personas", value: defaultPersonas.filter(p => p.tipo === "persona").length, color: "text-purple-600" },
            { label: "Agentes", value: defaultPersonas.filter(p => p.tipo === "agente").length, color: "text-green-600" },
            { label: "Nível Tech Médio", value: `${(defaultPersonas.filter(p => p.techLevel).reduce((a, b) => a + (b.techLevel ?? 0), 0) / defaultPersonas.filter(p => p.techLevel).length).toFixed(1)}/10`, color: "text-orange-600" },
          ].map(stat => (
            <Card key={stat.label} className="shadow-sm">
              <CardContent className="pt-5 pb-4">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personas list */}
        <div className="grid grid-cols-1 gap-4">
          {defaultPersonas.map(persona => (
            <Card key={persona.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Avatar + Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${
                      persona.tipo === "agente"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    }`}>
                      {persona.nome.charAt(0)}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-foreground">{persona.nome}</h3>
                        <span className="text-sm text-muted-foreground">— {persona.subtitulo}</span>
                        <Badge
                          className={`text-xs ${
                            persona.tipo === "agente"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 hover:bg-green-100"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-100"
                          }`}
                        >
                          {persona.tipo === "agente" ? "Agente" : "Persona"}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {persona.idade ? `${persona.idade} anos · ` : ""}{persona.profissao}
                        {persona.localizacao !== "–" ? ` · ${persona.localizacao}` : ""}
                      </p>

                      {/* Tech + Usage */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        {persona.techLevel !== null && (
                          <TechLevelBadge level={persona.techLevel} />
                        )}
                        <UsageBadges
                          mobile={persona.usoMobile}
                          desktop={persona.usoDesktop}
                          loja={persona.usoLoja}
                        />
                      </div>

                      {/* Frustrações */}
                      {persona.frustracoes.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Frustrações principais:</p>
                          <ul className="space-y-0.5">
                            {persona.frustracoes.slice(0, 2).map((f, i) => (
                              <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                                <span className="text-destructive shrink-0">•</span>
                                <span>{f}</span>
                              </li>
                            ))}
                            {persona.frustracoes.length > 2 && (
                              <li className="text-xs text-muted-foreground italic">
                                +{persona.frustracoes.length - 2} mais...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Prompt preview */}
                      <p className="text-xs text-muted-foreground italic line-clamp-1 mt-1">
                        "{persona.promptMestre.substring(0, 120)}..."
                      </p>
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
