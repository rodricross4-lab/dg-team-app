import type { LogbookSet } from '../types/logbook';

export type ProgressionDecision = {
  status: 'increase_load' | 'consolidate' | 'maintain' | 'performance_drop' | 'insufficient_data';
  label: string;
  message: string;
  priority: 'success' | 'info' | 'warning' | 'danger';
};

export function isValidSet(set: LogbookSet): boolean {
  return set.set_type === 'valid';
}

export function calculateValidVolume(sets: LogbookSet[]): number {
  return sets.filter(isValidSet).length;
}

export function calculateVolumeLoad(sets: LogbookSet[]): number {
  return sets
    .filter(isValidSet)
    .reduce((acc, set) => {
      const weight = set.weight_kg || 0;
      const reps = set.reps || 0;
      return acc + weight * reps;
    }, 0);
}

export function shouldIncreaseLoad(params: {
  reps: number;
  targetMax: number;
  rir?: number;
  executionQuality?: number;
}): boolean {
  const { reps, targetMax, rir = 99, executionQuality = 0 } = params;

  return (
    reps >= targetMax &&
    rir <= 2 &&
    executionQuality >= 4
  );
}

export function shouldMaintainLoad(params: {
  reps: number;
  targetMin: number;
  targetMax: number;
}): boolean {
  const { reps, targetMin, targetMax } = params;

  return reps >= targetMin && reps <= targetMax;
}

export function detectPerformanceDrop(history: number[]): boolean {
  if (history.length < 2) return false;

  const last = history[history.length - 1];
  const previous = history[history.length - 2];

  return last < previous;
}

export function detectConsecutivePerformanceDrop(history: number[]): boolean {
  if (history.length < 3) return false;

  const current = history[history.length - 1];
  const previous = history[history.length - 2];
  const beforePrevious = history[history.length - 3];

  return current < previous && previous < beforePrevious;
}

export function detectQualityProgression(params: {
  currentExecutionQuality?: number;
  previousExecutionQuality?: number;
  currentLoad?: number;
  previousLoad?: number;
  currentReps?: number;
  previousReps?: number;
}): boolean {
  const {
    currentExecutionQuality = 0,
    previousExecutionQuality = 0,
    currentLoad = 0,
    previousLoad = 0,
    currentReps = 0,
    previousReps = 0,
  } = params;

  return (
    currentExecutionQuality > previousExecutionQuality &&
    currentLoad === previousLoad &&
    currentReps === previousReps
  );
}

export function getBestValidSet(sets: LogbookSet[]): LogbookSet | null {
  const validSets = sets.filter(isValidSet);

  if (!validSets.length) return null;

  return validSets.reduce((best, current) => {
    const bestScore = (best.weight_kg || 0) * (best.reps || 0);
    const currentScore = (current.weight_kg || 0) * (current.reps || 0);
    return currentScore > bestScore ? current : best;
  }, validSets[0]);
}

export function analyzeProgression(params: {
  currentSets: LogbookSet[];
  previousSets?: LogbookSet[];
  targetMin: number;
  targetMax: number;
}): ProgressionDecision {
  const { currentSets, previousSets = [], targetMin, targetMax } = params;
  const currentBest = getBestValidSet(currentSets);
  const previousBest = getBestValidSet(previousSets);

  if (!currentBest) {
    return {
      status: 'insufficient_data',
      label: 'Sem dados suficientes',
      message: 'Registre pelo menos uma série válida para gerar decisão DG Team.',
      priority: 'info',
    };
  }

  const currentLoad = currentBest.weight_kg || 0;
  const currentReps = currentBest.reps || 0;
  const currentRir = currentBest.rir ?? 99;
  const currentQuality = currentBest.execution_quality || 0;

  if (previousBest) {
    const previousLoad = previousBest.weight_kg || 0;
    const previousReps = previousBest.reps || 0;
    const previousQuality = previousBest.execution_quality || 0;

    const currentScore = currentLoad * currentReps;
    const previousScore = previousLoad * previousReps;

    if (currentScore < previousScore && currentReps < previousReps) {
      return {
        status: 'performance_drop',
        label: 'Queda de performance',
        message: 'Performance caiu em relação à sessão anterior. Avaliar sono, recuperação, volume e proximidade da falha antes de subir carga.',
        priority: 'danger',
      };
    }

    if (detectQualityProgression({
      currentExecutionQuality: currentQuality,
      previousExecutionQuality: previousQuality,
      currentLoad,
      previousLoad,
      currentReps,
      previousReps,
    })) {
      return {
        status: 'maintain',
        label: 'Progressão de qualidade',
        message: 'Mesma carga e reps com execução melhor. Manter estratégia e consolidar antes de novo salto.',
        priority: 'success',
      };
    }
  }

  if (shouldIncreaseLoad({
    reps: currentReps,
    targetMax,
    rir: currentRir,
    executionQuality: currentQuality,
  })) {
    return {
      status: 'increase_load',
      label: 'Subir carga',
      message: 'Bateu topo do range com boa execução e RIR adequado. Sugerir microloading na próxima sessão.',
      priority: 'success',
    };
  }

  if (shouldMaintainLoad({ reps: currentReps, targetMin, targetMax })) {
    return {
      status: 'consolidate',
      label: 'Consolidar carga',
      message: 'Está dentro do range. Manter carga e buscar mais reps ou mais qualidade antes de progredir.',
      priority: 'info',
    };
  }

  return {
    status: 'maintain',
    label: 'Manter e ajustar execução',
    message: 'Ainda abaixo do range alvo. Priorizar execução, estabilidade e recuperação antes de aumentar carga.',
    priority: 'warning',
  };
}
