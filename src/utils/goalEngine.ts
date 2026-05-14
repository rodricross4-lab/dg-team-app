export type GoalType =
  | 'Hipertrofia'
  | 'Emagrecimento'
  | 'Recomposição'
  | 'Força';

export function getGoalStrategy(goal: GoalType) {
  switch (goal) {
    case 'Hipertrofia':
      return {
        intensity: 'Alta',
        volume: 'Moderado/alto recuperável',
        focus: 'Tensão mecânica e progressão'
      };

    case 'Emagrecimento':
      return {
        intensity: 'Alta',
        volume: 'Moderado',
        focus: 'Manter performance e massa magra'
      };

    case 'Força':
      return {
        intensity: 'Muito alta',
        volume: 'Moderado',
        focus: 'Performance e sobrecarga progressiva'
      };

    default:
      return {
        intensity: 'Moderada/alta',
        volume: 'Moderado',
        focus: 'Equilíbrio entre composição e performance'
      };
  }
}
