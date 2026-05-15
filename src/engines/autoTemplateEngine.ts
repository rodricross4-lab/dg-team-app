export type TemplateInput = {
  goal: string;
  frequency: number;
  sex?: 'male' | 'female' | 'other';
  priorityMuscles?: string[];
  experience?: 'beginner' | 'intermediate' | 'advanced';
};

export type WorkoutTemplateSuggestion = {
  split: string;
  weeklyStructure: string[];
  reason: string;
  notes: string[];
};

export function suggestWorkoutTemplate(input: TemplateInput): WorkoutTemplateSuggestion {
  const priorities = input.priorityMuscles || [];
  const femaleGluteFocus = input.sex === 'female' && priorities.some((item) => item.toLowerCase().includes('glúteo') || item.toLowerCase().includes('glute'));

  if (femaleGluteFocus && input.frequency >= 5) {
    return {
      split: 'Feminino DG Team 5x',
      weeklyStructure: ['Lower Glúteos/Posterior', 'Upper Dorsal/Ombros', 'Lower Quadríceps/Adutores', 'Upper Completo', 'Lower Glúteos isolado'],
      reason: 'Alta prioridade em glúteos com frequência suficiente para 3 estímulos inferiores.',
      notes: ['Distribuir fadiga de inferiores.', 'Evitar excesso de hinge pesado.', 'Usar abduções e hip thrust com progressão controlada.']
    };
  }

  if (input.frequency <= 3) {
    return {
      split: 'Full Body DG Team',
      weeklyStructure: ['Full Body A', 'Full Body B', 'Full Body C'],
      reason: 'Frequência baixa pede maior distribuição dos grupamentos por sessão.',
      notes: ['Manter volume moderado.', 'Priorizar compostos estáveis.', 'Evitar excesso de técnicas avançadas.']
    };
  }

  if (input.frequency === 4) {
    return {
      split: 'Upper/Lower 4x',
      weeklyStructure: ['Upper A', 'Lower A', 'Upper B', 'Lower B'],
      reason: 'Estrutura equilibrada, alta eficiência e fácil controle de volume.',
      notes: ['Frequência 2x por grupamento.', 'Boa base para hipertrofia.', 'Progressão fácil de monitorar.']
    };
  }

  if (input.frequency === 5) {
    return {
      split: 'Upper/Lower 5x DG Team',
      weeklyStructure: ['Upper A', 'Lower A', 'Upper B', 'Lower B', 'Upper C ou ponto fraco'],
      reason: 'Permite frequência alta com especialização controlada.',
      notes: ['Usar o quinto dia para ponto fraco.', 'Controlar fadiga de ombros/costas.', 'Manter séries válidas recuperáveis.']
    };
  }

  return {
    split: 'PPL DG Team 6x',
    weeklyStructure: ['Push A', 'Pull A', 'Legs A', 'Push B', 'Pull B', 'Legs B'],
    reason: 'Frequência alta e flexível para alunos avançados com boa recuperação.',
    notes: ['Monitorar fadiga sistêmica.', 'Evitar redundância de padrões.', 'Distribuir volume por 2 estímulos semanais.']
  };
}
