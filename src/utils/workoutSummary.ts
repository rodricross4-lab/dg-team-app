import type { WorkoutSession } from '../types';

export function getWorkoutSummary(workout: WorkoutSession) {
  const validSets = workout.exercises.flatMap((exercise) =>
    exercise.sets.filter((set) => set.countsVolume)
  );

  const volumeLoad = validSets.reduce(
    (total, set) => total + set.load * set.reps,
    0
  );

  const averageRir =
    validSets.reduce((total, set) => total + set.rir, 0) /
    Math.max(validSets.length, 1);

  return {
    exercises: workout.exercises.length,
    validSets: validSets.length,
    volumeLoad,
    averageRir: Number(averageRir.toFixed(1))
  };
}
