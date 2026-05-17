export type SetKind = 'warmup' | 'feeder' | 'working' | 'backoff';

export type LogbookSet = {
  kind: SetKind;
  load: number;
  reps: number;
  minReps: number;
  maxReps: number;
  rir?: number;
  quality?: 'low' | 'ok' | 'high';
};

export type ProgressionDecision = {
  action: 'increase_load' | 'increase_reps' | 'maintain' | 'consolidate' | 'deload';
  reason: string;
};

export function isWorkingSet(set: LogbookSet) {
  return set.kind === 'working' || set.kind === 'backoff';
}

export function calculateEffectiveVolume(sets: LogbookSet[]) {
  return sets.filter(isWorkingSet).length;
}

export function calculateVolumeLoad(sets: LogbookSet[]) {
  return sets.filter(isWorkingSet).reduce((total, set) => total + set.load * set.reps, 0);
}

export function detectTopRange(set: LogbookSet) {
  return isWorkingSet(set) && set.reps >= set.maxReps;
}

export function detectPerformanceDrop(current: LogbookSet, previous?: LogbookSet) {
  if (!previous) return false;
  if (!isWorkingSet(current) || !isWorkingSet(previous)) return false;
  return current.load <= previous.load && current.reps <= previous.reps - 2;
}

export function suggestProgression(current: LogbookSet, previous?: LogbookSet): ProgressionDecision {
  if (!isWorkingSet(current)) {
    return { action: 'maintain', reason: 'Aquecimento e feeder não contam para decisão de progressão.' };
  }

  if (detectPerformanceDrop(current, previous)) {
    return { action: 'deload', reason: 'Queda de performance detectada em série válida.' };
  }

  if (detectTopRange(current) && (current.quality === 'high' || current.rir === 0 || current.rir === 1)) {
    return { action: 'increase_load', reason: 'Topo do range atingido com boa proximidade da falha.' };
  }

  if (current.reps < current.maxReps && current.reps >= current.minReps) {
    return { action: 'increase_reps', reason: 'Carga dentro do range. Buscar progressão por reps.' };
  }

  if (current.quality === 'low') {
    return { action: 'consolidate', reason: 'Qualidade baixa. Consolidar execução antes de subir carga.' };
  }

  return { action: 'maintain', reason: 'Manter carga e buscar estabilidade na próxima sessão.' };
}
