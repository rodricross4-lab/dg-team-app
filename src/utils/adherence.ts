export type AdherenceMetrics = {
  training: number;
  diet: number;
  cardio: number;
  hydration: number;
  sleep: number;
};

export function calculateOverallAdherence(metrics: AdherenceMetrics): number {
  const values = Object.values(metrics);
  const total = values.reduce((sum, value) => sum + value, 0);

  return Math.round(total / values.length);
}

export function getAdherenceFeedback(score: number): string {
  if (score >= 90) {
    return 'Aderência excelente. Ambiente ideal para progressão consistente.';
  }

  if (score >= 75) {
    return 'Boa aderência. Pequenos ajustes podem melhorar a consistência.';
  }

  if (score >= 60) {
    return 'Aderência moderada. Revisar rotina, recuperação e organização.';
  }

  return 'Baixa aderência detectada. Priorizar constância antes de aumentar volume/intensidade.';
}
