import type { WorkoutSession } from '../types';

const weeks = Array.from({ length: 8 }, (_, index) => index + 1);
const workoutNames = ['Treino A', 'Treino B', 'Treino C', 'Treino D', 'Treino E', 'Treino F'];

const defaultExercises = [
  { name: 'Supino inclinado halteres', group: 'Peitoral', range: '5-10', rest: '2-4 min' },
  { name: 'Remada articulada', group: 'Costas', range: '5-10', rest: '2-4 min' },
  { name: 'Hack machine', group: 'Quadríceps', range: '5-10', rest: '2-4 min' },
  { name: 'Mesa flexora', group: 'Posteriores', range: '8-15', rest: '60-120s' },
  { name: 'Elevação lateral cabo', group: 'Deltoide lateral', range: '10-20', rest: '60-90s' }
];

export function createEightWeekCycle(frequency: number): WorkoutSession[] {
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
