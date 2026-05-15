export type AutoAdjustmentInput = {
  muscleGroup: string;
  weeklyValidSets: number;
  executionQuality: number;
  performanceTrend: 'up' | 'stable' | 'down';
  recovery: 'good' | 'ok' | 'poor';
  phase?: 'cutting' | 'maintenance' | 'bulking';
};

export type AutoAdjustment = {
  type: 'volume' | 'load' | 'reps' | 'deload' | 'technique' | 'maintain';
  title: string;
  recommendation: string;
  reason: string;
};

export function getAutoAdjustment(input: AutoAdjustmentInput): AutoAdjustment {
  const isLowVolume = input.weeklyValidSets < 6;
  const isHighVolume = input.weeklyValidSets > 14;
  const executionLow = input.executionQuality > 0 && input.executionQuality < 75;

  if (executionLow) {
    return {
      type: 'technique',
      title: 'Consolidar execução',
      recommendation: `Manter carga em ${input.muscleGroup} e priorizar estabilidade, amplitude eficiente e controle.`,
      reason: 'A qualidade de execução está abaixo do padrão mínimo para progredir carga com segurança.'
    };
  }

  if (input.performanceTrend === 'down' && input.recovery === 'poor') {
    return {
      type: 'deload',
      title: 'Reduzir fadiga',
      recommendation: `Reduzir 1-2 séries válidas de ${input.muscleGroup} por 1 semana.`,
      reason: 'Queda de performance com recuperação ruim sugere acúmulo de fadiga.'
    };
  }

  if (isHighVolume && input.performanceTrend !== 'up') {
    return {
      type: 'volume',
      title: 'Volume alto sem retorno claro',
      recommendation: `Manter ou reduzir volume de ${input.muscleGroup}, evitando adicionar séries agora.`,
      reason: 'Volume alto sem melhora de performance pode aumentar custo de recuperação.'
    };
  }

  if (isLowVolume && input.recovery === 'good' && input.phase !== 'cutting') {
    return {
      type: 'volume',
      title: 'Possível espaço para volume',
      recommendation: `Adicionar +1 série válida para ${input.muscleGroup}, se a execução seguir boa.`,
      reason: 'Volume baixo com boa recuperação pode permitir progressão gradual.'
    };
  }

  if (input.performanceTrend === 'up' && input.executionQuality >= 85) {
    return {
      type: 'load',
      title: 'Zona segura de progressão',
      recommendation: `Aplicar microloading em ${input.muscleGroup} quando bater o topo do range.`,
      reason: 'Performance subindo com boa execução indica boa tolerância ao estímulo.'
    };
  }

  return {
    type: 'maintain',
    title: 'Manter estratégia atual',
    recommendation: `Manter volume e buscar progressão de reps ou qualidade em ${input.muscleGroup}.`,
    reason: 'O cenário atual não exige alteração agressiva.'
  };
}
