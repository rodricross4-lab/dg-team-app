export type DeloadInput = {
  performanceDropWeeks: number;
  highStress: boolean;
  lowSleep: boolean;
  highSoreness: boolean;
  highVolume: boolean;
};

export function shouldRecommendDeload(input: DeloadInput) {
  const riskScore = [
    input.performanceDropWeeks >= 2,
    input.highStress,
    input.lowSleep,
    input.highSoreness,
    input.highVolume
  ].filter(Boolean).length;

  if (riskScore >= 3) {
    return {
      recommend: true,
      message: 'Sinais fortes de fadiga acumulada. Recomendar deload ou redução estratégica de volume.'
    };
  }

  if (input.performanceDropWeeks >= 2) {
    return {
      recommend: true,
      message: 'Performance caiu por 2 semanas. Manter carga, aumentar descanso e reduzir 1-2 séries válidas.'
    };
  }

  return {
    recommend: false,
    message: 'Sem indicação clara de deload. Manter progressão controlada.'
  };
}
