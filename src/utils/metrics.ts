import type { WorkoutSession } from '../types';

export function countValidSets(workouts: WorkoutSession[]): number {
  return workouts.reduce((total, workout) => {
    return (
      total +
      workout.exercises.reduce((exerciseTotal, exercise) => {
        return (
          exerciseTotal +
          exercise.sets.filter((set) => set.countsVolume).length
        );
      }, 0)
    );
  }, 0);
}

export function calculateWorkoutVolumeLoad(workouts: WorkoutSession[]): number {
  return workouts.reduce((total, workout) => {
    return (
      total +
      workout.exercises.reduce((exerciseTotal, exercise) => {
        return (
          exerciseTotal +
          exercise.sets.reduce((setTotal, set) => {
            if (!set.countsVolume) return setTotal;

            return setTotal + set.load * set.reps;
          }, 0)
        );
      }, 0)
    );
  }, 0);
}

export function getWeeklyFrequency(daysChecked: number, target: number): string {
  const percentage = Math.min(100, Math.round((daysChecked / target) * 100));
  return `${percentage}%`;
}
