export type LastSessionExercise = {
  exerciseName: string;
  muscleGroup: string;
  load: number;
  reps: number;
  targetRange: string;
  rir?: number;
  execution?: 'excelente' | 'boa' | 'ok' | 'ruim' | string;
};

export type NextSessionSuggestion = {
  exerciseName: string;
  muscleGroup: string;
  nextTarget: string;
  reason: string;
  priority: 'progress' | 'maintain' | 'technique' | 'reduce';
};

function parseRange(range: string) {
  const match = range.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  return { min: Number(match[1]), max: Number(match[2]) };
}

export function suggestNextSession(exercises: LastSessionExercise[]): NextSessionSuggestion[] {
  return exercises.map((exercise) => {
    const range = parseRange(exercise.targetRange);
    const execution = (exercise.execution || '').toLowerCase();
    const executionGood = execution === 'boa' || execution === 'excelente';
    const executionPoor = execution === 'ruim' || execution === 'ok';
    const rirOk = exercise.rir === undefined || exercise.rir <= 2;

    if (!range) {
      return {
        exerciseName: exercise.exerciseName,
        muscleGroup: exercise.muscleGroup,
        nextTarget: 'Manter carga e padronizar range.',
        reason: 'Range alvo não identificado pelo sistema.',
        priority: 'maintain'
      };
    }

    if (exercise.reps >= range.max && executionGood && rirOk) {
      return {
        exerciseName: exercise.exerciseName,
        muscleGroup: exercise.muscleGroup,
        nextTarget: `Subir carga levemente acima de ${exercise.load}kg e buscar ${range.min}-${range.max} reps.`,
        reason: 'Topo do range atingido com execução adequada.',
        priority: 'progress'
      };
    }

    if (exercise.reps >= range.max && executionPoor) {
      return {
        exerciseName: exercise.exerciseName,
        muscleGroup: exercise.muscleGroup,
        nextTarget: `Manter ${exercise.load}kg e melhorar execução antes de subir carga.`,
        reason: 'Carga/reps boas, mas execução ainda precisa consolidar.',
        priority: 'technique'
      };
    }

    if (exercise.reps < range.min) {
      return {
        exerciseName: exercise.exerciseName,
        muscleGroup: exercise.muscleGroup,
        nextTarget: `Reduzir ou manter carga para voltar ao mínimo de ${range.min} reps.`,
        reason: 'Reps abaixo do range alvo indicam carga possivelmente alta ou fadiga.',
        priority: 'reduce'
      };
    }

    return {
      exerciseName: exercise.exerciseName,
      muscleGroup: exercise.muscleGroup,
      nextTarget: `Manter ${exercise.load}kg e buscar mais reps com execução limpa.`,
      reason: 'Dentro do range, mas ainda sem atingir topo para progressão de carga.',
      priority: 'maintain'
    };
  });
}

export function getNextSessionSummary(suggestions: NextSessionSuggestion[]) {
  const progress = suggestions.filter((item) => item.priority === 'progress').length;
  const technique = suggestions.filter((item) => item.priority === 'technique').length;
  const reduce = suggestions.filter((item) => item.priority === 'reduce').length;

  if (reduce > 0) return `${reduce} exercício(s) precisam de ajuste/redução antes de progredir.`;
  if (technique > 0) return `${technique} exercício(s) precisam consolidar execução.`;
  if (progress > 0) return `${progress} exercício(s) prontos para microprogressão.`;
  return 'Próxima sessão focada em manutenção e progressão de reps.';
}
