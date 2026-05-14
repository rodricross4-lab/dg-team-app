export type ProgressionInput = {
  previousLoad: number;
  currentLoad: number;
  previousReps: number;
  currentReps: number;
  rangeMin: number;
  rangeMax: number;
  execution: 'ruim' | 'ok' | 'boa' | 'excelente';
};

export function getNextLoadSuggestion(input: ProgressionInput) {
  const hitTopRange = input.currentReps >= input.rangeMax;
  const executionOk = input.execution === 'boa' || input.execution === 'excelente';
  const droppedBelowRange = input.currentReps < input.rangeMin;

  if (hitTopRange && executionOk) {
    return {
      action: 'aumentar_carga',
      message: 'Topo do range com execução boa. Aumentar carga levemente na próxima sessão.',
      suggestedLoad: Math.round((input.currentLoad * 1.025) * 10) / 10
    };
  }

  if (droppedBelowRange || input.execution === 'ruim') {
    return {
      action: 'reduzir_ou_consolidar',
      message: 'Performance abaixo do mínimo ou execução ruim. Consolidar técnica antes de progredir.',
      suggestedLoad: input.currentLoad
    };
  }

  if (input.currentReps > input.previousReps && input.currentLoad >= input.previousLoad) {
    return {
      action: 'manter_e_buscar_reps',
      message: 'Progressão de reps detectada. Manter carga e buscar topo do range.',
      suggestedLoad: input.currentLoad
    };
  }

  return {
    action: 'manter_carga',
    message: 'Manter carga, consolidar execução e buscar progressão sustentável.',
    suggestedLoad: input.currentLoad
  };
}
