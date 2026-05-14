import type { WorkoutSession } from '../types';

export function generateDGInsights(workouts: WorkoutSession[]) {
  const insights: string[] = [];

  const validSets = workouts.flatMap((workout) =>
    workout.exercises.flatMap((exercise) =>
      exercise.sets.filter((set) => set.countsVolume)
    )
  );

  const averageRir =
    validSets.reduce((sum, set) => sum + set.rir, 0) /
    Math.max(validSets.length, 1);

  if (averageRir > 3) {
    insights.push(
      'RIR médio elevado. Sugestão: aproximar mais das séries válidas próximas da falha.'
    );
  }

  const lowPerformance = validSets.some(
    (set) => set.reps < 5 && set.execution === 'ruim'
  );

  if (lowPerformance) {
    insights.push(
      'Queda de performance detectada. Avaliar fadiga, descanso e volume semanal.'
    );
  }

  if (validSets.length < 10) {
    insights.push(
      'Volume semanal baixo para hipertrofia. Revisar frequência e quantidade de séries válidas.'
    );
  }

  if (insights.length === 0) {
    insights.push(
      'Boa distribuição de volume e intensidade. Manter progressão sustentável.'
    );
  }

  return insights;
}
