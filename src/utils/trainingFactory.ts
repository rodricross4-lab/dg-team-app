import type { GeneratedWorkout } from '../types';
import { exerciseLibrary, formatRepRange, formatRest } from '../data/exerciseLibrary';

const weeks = Array.from({ length: 8 }, (_, index) => index + 1);
const workoutNames = ['Treino A', 'Treino B', 'Treino C', 'Treino D', 'Treino E', 'Treino F'];

const defaultExerciseIds = [
  'global-supino-inclinado-halteres',
  'global-remada-articulada',
  'global-hack-machine',
  'global-mesa-flexora',
  'global-elevacao-lateral-cabo'
];

const defaultExercises = defaultExerciseIds
  .map((id) => exerciseLibrary.find((exercise) => exercise.id === id))
  .filter((exercise): exercise is NonNullable<typeof exercise> => Boolean(exercise))
  .map((exercise) => ({
    name: exercise.name,
    group: exercise.muscle_group,
    range: formatRepRange(exercise),
    rest: formatRest(exercise)
  }));

export function createEightWeekCycle(frequency: number): GeneratedWorkout[] {
  const selectedWorkouts = workoutNames.slice(0, frequency);

  return weeks.flatMap((week) =>
    selectedWorkouts.map((name, workoutIndex) => ({
      id: `week-${week}-${name}`,
      week,
      name,
      exercises: defaultExercises.map((exercise, exerciseIndex) => ({
        id: `w${week}-${workoutIndex}-${exerciseIndex}`,
        ...exercise,
        sets: [
          {
            id: `warm-${week}-${workoutIndex}-${exerciseIndex}`,
            type: 'aquecimento',
            load: 0,
            reps: 12,
            rir: 5,
            execution: 'boa',
            notes: 'Aquecimento técnico. Não conta volume.',
            countsVolume: false
          },
          {
            id: `valid-1-${week}-${workoutIndex}-${exerciseIndex}`,
            type: 'valida',
            load: 0,
            reps: 0,
            rir: 1,
            execution: 'boa',
            notes: '',
            countsVolume: true
          },
          {
            id: `valid-2-${week}-${workoutIndex}-${exerciseIndex}`,
            type: 'valida',
            load: 0,
            reps: 0,
            rir: 1,
            execution: 'boa',
            notes: '',
            countsVolume: true
          }
        ]
      }))
    }))
  );
}
