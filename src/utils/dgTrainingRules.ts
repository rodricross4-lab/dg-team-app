import type { LogbookSet } from '../types/logbook';

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
