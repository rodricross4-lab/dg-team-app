export type ProgressionInput = {
  exerciseName: string;
  load: number;
  reps: number;
  targetRange: string;
  rir?: number;
  execution?: string;
};

function parseTopRange(range: string) {
  const match = range.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  return Number(match[2]);
}

export function getProgressionSuggestion(input: ProgressionInput) {
  const topRange = parseTopRange(input.targetRange);
  const executionGood = ['boa', 'excelente'].includes((input.execution || '').toLowerCase());
  const rirOk = input.rir === undefined || input.rir <= 2;

  if (!topRange) {
    return 'Range não identificado. Manter carga e avaliar execução.';
  }

  if (input.reps >= topRange && executionGood && rirOk) {
    return `Subir carga com microloading na próxima sessão em ${input.exerciseName}.`;
  }

  if (input.reps >= topRange && !executionGood) {
    return 'Consolidar execução antes de subir carga.';
  }

  if (input.reps < topRange && rirOk) {
    return 'Manter carga e buscar aumentar repetições dentro do range.';
  }

  return 'Manter carga, ajustar descanso e preservar qualidade técnica.';
}

export function getFatigueAlert(performanceDrop: boolean, sorenessHigh: boolean, sleepPoor: boolean) {
  if (performanceDrop && sorenessHigh) return 'Possível acúmulo de fadiga. Reduzir volume ou considerar deload.';
  if (performanceDrop && sleepPoor) return 'Queda de performance possivelmente ligada à recuperação. Manter carga e aumentar descanso.';
  if (performanceDrop) return 'Monitorar queda de performance. Evitar aumentar volume agora.';
  return 'Recuperação aparentemente adequada.';
}
