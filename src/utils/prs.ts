import type { WorkoutSession } from '../types';

export type PersonalRecord = {
  exercise: string;
  type: 'carga' | 'reps' | 'volumeLoad';
  value: number;
  label: string;
};

export function detectPersonalRecords(workouts: WorkoutSession[]): PersonalRecord[] {
  const records: PersonalRecord[] = [];
  const bestByExercise = new Map<string, { load: number; reps: number; volumeLoad: number }>();

  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const currentBest = bestByExercise.get(exercise.name) || {
        load: 0,
        reps: 0,
        volumeLoad: 0
      };

      exercise.sets
        .filter((set) => set.countsVolume)
        .forEach((set) => {
          const volumeLoad = set.load * set.reps;

          if (set.load > currentBest.load) {
            currentBest.load = set.load;
            records.push({ exercise: exercise.name, type: 'carga', value: set.load, label: `Novo PR de carga: ${set.load}kg` });
          }

          if (set.reps > currentBest.reps) {
            currentBest.reps = set.reps;
            records.push({ exercise: exercise.name, type: 'reps', value: set.reps, label: `Novo PR de reps: ${set.reps} reps` });
          }

          if (volumeLoad > currentBest.volumeLoad) {
            currentBest.volumeLoad = volumeLoad;
            records.push({ exercise: exercise.name, type: 'volumeLoad', value: volumeLoad, label: `Novo PR de volume load: ${volumeLoad}kg` });
          }
        });

      bestByExercise.set(exercise.name, currentBest);
    });
  });

  return records;
}
