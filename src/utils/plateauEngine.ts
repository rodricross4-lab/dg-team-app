export type PlateauInput = {
  lastLoads: number[];
  lastReps: number[];
  sorenessHigh?: boolean;
  sleepPoor?: boolean;
  performanceDrop?: boolean;
};

export function detectPlateau(input: PlateauInput) {
  const loadsStable = input.lastLoads.length >= 3 && input.lastLoads.every((load) => load === input.lastLoads[0]);
  const repsStable = input.lastReps.length >= 3 && input.lastReps.every((reps) => reps === input.lastReps[0]);

  return loadsStable && repsStable;
}

export function getDeloadSuggestion(input: PlateauInput) {
  const plateau = detectPlateau(input);
  const recoveryIssue = input.sorenessHigh || input.sleepPoor || input.performanceDrop;

  if (plateau && recoveryIssue) {
    return 'Platô com sinais de fadiga. Sugestão: reduzir volume por 1 semana, manter técnica e preservar carga quando possível.';
  }

  if (plateau) {
    return 'Platô detectado. Sugestão: manter carga e buscar progressão de reps ou qualidade antes de aumentar volume.';
  }

  if (recoveryIssue) {
    return 'Possível recuperação insuficiente. Sugestão: aumentar descanso, controlar volume e evitar técnicas intensificadoras.';
  }

  return 'Sem platô relevante. Manter progressão sustentável.';
}

export function getVolumeAdjustmentSuggestion(validSets: number, executionQuality: number) {
  if (executionQuality < 70) return 'Não aumentar volume. Priorizar execução, estabilidade e amplitude eficiente.';
  if (validSets < 4) return 'Volume baixo. Pode adicionar séries válidas se recuperação estiver boa.';
  if (validSets > 16) return 'Volume alto. Monitorar MRV e sinais de queda de performance.';
  return 'Volume em zona controlada. Manter progressão.';
}
