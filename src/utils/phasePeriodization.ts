export type TrainingPhase = 'Cutting' | 'Bulking' | 'Manutenção';

export function getPhaseRecommendations(phase: TrainingPhase) {
  switch (phase) {
    case 'Cutting':
      return {
        priority: 'Manter performance e massa muscular',
        intensity: 'Alta',
        volume: 'Moderado',
        cardio: 'Progressivo'
      };

    case 'Bulking':
      return {
        priority: 'Construção muscular',
        intensity: 'Alta',
        volume: 'Moderado/alto recuperável',
        cardio: 'Controlado'
      };

    default:
      return {
        priority: 'Equilíbrio e recuperação',
        intensity: 'Moderada/alta',
        volume: 'Moderado',
        cardio: 'Manutenção'
      };
  }
}
