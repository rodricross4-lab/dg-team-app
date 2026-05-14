export type PhysicalEvaluation = {
  week: 1 | 4 | 8;
  weight: number;
  bodyFat?: number;
  leanMass?: number;
  waist?: number;
  chest?: number;
  arm?: number;
  thigh?: number;
};

export function compareEvaluations(
  initial: PhysicalEvaluation,
  current: PhysicalEvaluation
) {
  return {
    weightDifference: current.weight - initial.weight,
    bodyFatDifference:
      (current.bodyFat || 0) - (initial.bodyFat || 0),
    leanMassDifference:
      (current.leanMass || 0) - (initial.leanMass || 0)
  };
}
