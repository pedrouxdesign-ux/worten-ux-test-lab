import { simulatePersonaTest, analyzeWithUxAgent } from "./agents";
import {
  createTestResult,
  createUxAnalysis,
  updateTestStatus,
  getTestById,
} from "./db";

/**
 * Executa um teste completo: simula com as 3 personas e analisa com o UX Agent
 */
export async function executeFullTest(testId: number): Promise<void> {
  try {
    // 1. Atualizar status para "running"
    await updateTestStatus(testId, "running");

    // 2. Obter detalhes do teste
    const test = await getTestById(testId);
    if (!test) {
      throw new Error(`Teste ${testId} não encontrado`);
    }

    // 3. Simular com as 3 personas
    console.log(`[Test ${testId}] Iniciando simulação com personas...`);

    const anaReport = await simulatePersonaTest(
      "Ana",
      test.featureName,
      test.userTask,
      test.context || undefined
    );

    const davidReport = await simulatePersonaTest(
      "David",
      test.featureName,
      test.userTask,
      test.context || undefined
    );

    const miguelReport = await simulatePersonaTest(
      "Miguel",
      test.featureName,
      test.userTask,
      test.context || undefined
    );

    console.log(`[Test ${testId}] Personas completaram simulação`);

    // 4. Salvar relatos das personas
    await createTestResult({
      testId,
      personaName: "Ana",
      report: anaReport.report,
      successfulCompletion: anaReport.successfulCompletion ? 1 : 0,
      painPoints: JSON.stringify(anaReport.painPoints),
    });

    await createTestResult({
      testId,
      personaName: "David",
      report: davidReport.report,
      successfulCompletion: davidReport.successfulCompletion ? 1 : 0,
      painPoints: JSON.stringify(davidReport.painPoints),
    });

    await createTestResult({
      testId,
      personaName: "Miguel",
      report: miguelReport.report,
      successfulCompletion: miguelReport.successfulCompletion ? 1 : 0,
      painPoints: JSON.stringify(miguelReport.painPoints),
    });

    console.log(`[Test ${testId}] Relatos salvos. Iniciando análise do UX Agent...`);

    // 5. Analisar com UX Agent
    const analysis = await analyzeWithUxAgent(test.featureName, test.userTask, [
      anaReport,
      davidReport,
      miguelReport,
    ]);

    console.log(`[Test ${testId}] Análise do UX Agent concluída`);

    // 6. Salvar análise
    await createUxAnalysis({
      testId,
      executiveSummary: analysis.executiveSummary,
      detailedAnalysis: analysis.detailedAnalysis,
      usabilityDiagnosis: analysis.usabilityDiagnosis,
      competitiveBenchmark: analysis.competitiveBenchmark,
      recommendations: JSON.stringify(analysis.recommendations),
    });

    // 7. Atualizar status para "completed"
    await updateTestStatus(testId, "completed");

    console.log(`[Test ${testId}] Teste concluído com sucesso`);
  } catch (error) {
    console.error(`[Test ${testId}] Erro ao executar teste:`, error);
    await updateTestStatus(testId, "failed");
    throw error;
  }
}
