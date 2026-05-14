export type WeeklyMetrics = {
  validSets: number;
  volumeLoad: number;
  adherence: number;
  prs: number;
};

export function generateWeeklyReport(metrics: WeeklyMetrics) {
  const observations: string[] = [];

  if (metrics.adherence >= 85) {
    observations.push('Excelente aderência semanal.');
  }

  if (metrics.volumeLoad > 0) {
    observations.push(`Volume load total: ${metrics.volumeLoad}kg.`);
  }

  if (metrics.prs > 0) {
    observations.push(`${metrics.prs} PRs registrados durante a semana.`);
  }

  if (metrics.validSets < 10) {
    observations.push('Volume semanal relativamente baixo para hipertrofia.');
  }

  return {
    title: 'Relatório semanal DG TEAM',
    generatedAt: new Date().toISOString(),
    observations
  };
}
