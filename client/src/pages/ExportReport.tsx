import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, FileText } from "lucide-react";
import { Streamdown } from "streamdown";

export default function ExportReport() {
  const params = useParams();
  const testId = parseInt(params?.id as string);

  const { data: test, isLoading: testLoading } = trpc.tests.getById.useQuery(
    { testId },
    { enabled: !!testId }
  );

  const { data: results } = trpc.testResults.getByTestId.useQuery(
    { testId },
    { enabled: !!testId }
  );

  const { data: analysis } = trpc.uxAnalysis.getByTestId.useQuery(
    { testId },
    { enabled: !!testId }
  );

  const handleExportPDF = async () => {
    if (!test || !analysis) return;

    try {
      // Criar conteúdo HTML para PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${test.title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 20px; }
            h1 { color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 10px; }
            h2 { color: #1e40af; margin-top: 30px; }
            .header { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .persona { background: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; margin: 15px 0; }
            .recommendation { background: #f0fdf4; padding: 15px; border-left: 4px solid #22c55e; margin: 15px 0; }
            .p1 { border-left-color: #dc2626; }
            .p2 { border-left-color: #f59e0b; }
            .p3 { border-left-color: #3b82f6; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #f0f9ff; font-weight: bold; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${test.title}</h1>
            <p><strong>Feature:</strong> ${test.featureName}</p>
            <p><strong>Tarefa:</strong> ${test.userTask}</p>
            <p><strong>Data:</strong> ${new Date(test.createdAt).toLocaleDateString("pt-PT")}</p>
          </div>

          <h2>Sumário Executivo</h2>
          <div class="section">
            ${analysis.executiveSummary}
          </div>

          <h2>Relatos das Personas</h2>
          ${results?.map(r => `
            <div class="persona">
              <h3>${r.personaName} - ${r.successfulCompletion ? "✓ Sucesso" : "✗ Dificuldades"}</h3>
              <p>${r.report.substring(0, 500)}...</p>
            </div>
          `).join("")}

          <h2>Análise Detalhada</h2>
          <div class="section">
            ${analysis.detailedAnalysis}
          </div>

          <h2>Diagnóstico de Usabilidade</h2>
          <div class="section">
            ${analysis.usabilityDiagnosis}
          </div>

          ${analysis.competitiveBenchmark ? `
            <h2>Benchmarking Competitivo</h2>
            <div class="section">
              ${analysis.competitiveBenchmark}
            </div>
          ` : ""}

          <h2>Recomendações Priorizadas</h2>
          <div class="section">
            ${JSON.parse(analysis.recommendations).map((rec: any) => `
              <div class="recommendation p${rec.priority.substring(1)}">
                <strong>${rec.priority} - ${rec.title}</strong>
                <p>${rec.description}</p>
                ${rec.justification ? `<p><em>Justificação: ${rec.justification}</em></p>` : ""}
              </div>
            `).join("")}
          </div>

          <div class="footer">
            <p>Relatório gerado pelo Worten UX Persona Lab</p>
            <p>© 2026 Worten. Todos os direitos reservados.</p>
          </div>
        </body>
        </html>
      `;

      // Enviar para API de conversão (usando manus-md-to-pdf ou similar)
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${test.title.replace(/\s+/g, "_")}_${testId}.html`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
    }
  };

  if (testLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!test || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">Relatório não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Exportar Relatório
            </CardTitle>
            <CardDescription>{test.title}</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Opções de Exportação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleExportPDF}
                    className="bg-red-600 hover:bg-red-700 h-24 flex flex-col items-center justify-center"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    <span>Exportar como PDF</span>
                  </Button>

                  <Button
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 h-24 flex flex-col items-center justify-center"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    <span>Imprimir Relatório</span>
                  </Button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">Conteúdo do Relatório</h3>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>✓ Sumário Executivo</li>
                  <li>✓ Relatos das 3 Personas (Ana, David, Miguel)</li>
                  <li>✓ Análise Detalhada</li>
                  <li>✓ Diagnóstico de Usabilidade</li>
                  <li>✓ Benchmarking Competitivo</li>
                  <li>✓ Recomendações Priorizadas (P1/P2/P3)</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Dica:</strong> O relatório pode ser partilhado com PMs e stakeholders para discussão de prioridades e roadmap de melhorias.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
