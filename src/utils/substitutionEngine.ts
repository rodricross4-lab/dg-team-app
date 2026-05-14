export type ExerciseSubstitution = {
  original: string;
  options: string[];
  reason: string;
};

const substitutions: ExerciseSubstitution[] = [
  {
    original: 'Supino inclinado halteres',
    options: ['Supino inclinado smith', 'Supino inclinado máquina', 'Supino convergente'],
    reason: 'Mesmo padrão de empurrar inclinado com foco em peitoral superior.'
  },
  {
    original: 'Hack machine',
    options: ['Agachamento smith', 'Leg press 45', 'Agachamento frontal'],
    reason: 'Padrão dominante de joelho para quadríceps.'
  },
  {
    original: 'Mesa flexora',
    options: ['Flexora sentada', 'Flexora em pé', 'Nordic curl'],
    reason: 'Flexão de joelho para posteriores.'
  },
  {
    original: 'Elevação lateral cabo',
    options: ['Elevação lateral máquina', 'Elevação lateral halteres', 'Elevação lateral unilateral'],
    reason: 'Abdução de ombro com foco em deltoide lateral.'
  }
];

export function getSubstitutions(exerciseName: string): ExerciseSubstitution {
  return (
    substitutions.find((item) => item.original === exerciseName) || {
      original: exerciseName,
      options: ['Variação em máquina', 'Variação com halteres', 'Variação no cabo'],
      reason: 'Sugestão genérica baseada em mesmo grupamento muscular.'
    }
  );
}
