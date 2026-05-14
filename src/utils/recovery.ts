export type RecoveryMetrics = {
  sleepHours: number;
  soreness: number;
  stress: number;
  motivation: number;
};

export function analyzeRecovery(metrics: RecoveryMetrics): string[] {
  const insights: string[] = [];

  if (metrics.sleepHours < 6) {
    insights.push('Sono abaixo do ideal. Avaliar recuperação e intensidade.');
  }

  if (metrics.soreness > 8) {
    insights.push('Dor muscular elevada. Possível excesso de fadiga acumulada.');
  }

  if (metrics.stress > 8) {
    insights.push('Estresse elevado. Considerar redução de volume ou deload.');
  }

  if (metrics.motivation < 4) {
    insights.push('Baixa motivação detectada. Monitorar aderência e recuperação.');
  }

  if (insights.length === 0) {
    insights.push('Recuperação dentro do esperado para progressão sustentável.');
  }

  return insights;
}
