import type { WorkoutSession } from '../types';

export function calculateVolumePerMuscle(workouts: WorkoutSession[]) {
  const volume: Record<string, number> = {};

  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const validSets = exercise.sets.filter((set) => set.countsVolume).length;

      if (!volume[exercise.group]) {
        volume[exercise.group] = 0;
      }

      volume[exercise.group] += validSets;
    });
  });

  return volume;
}

export function detectLowVolumeMuscles(volume: Record<string, number>) {
  return Object.entries(volume)
    .filter(([, sets]) => sets < 6)
    .map(([muscle]) => muscle);
}

export function detectHighVolumeMuscles(volume: Record<string, number>) {
  return Object.entries(volume)
    .filter(([, sets]) => sets > 20)
    .map(([muscle]) => muscle);
}
