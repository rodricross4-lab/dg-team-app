export type PeriodizationInput = {
  studentId: number | string;
  goal: string;
  phase: 'cutting' | 'maintenance' | 'bulking' | string;
  frequency: number;
  priorityMuscles: string[];
  recovery: 'good' | 'ok' | 'poor';
  experience: 'beginner' | 'intermediate' | 'advanced';
};

export type PeriodizationWeekPlan = {
  week: number;
  focus: string;
  intensity: string;
  volume: string;
  deload: boolean;
  notes: string;
};

export function generateEightWeekPeriodization(input: PeriodizationInput): PeriodizationWeekPlan[] {
  const cutting = input.phase.toLowerCase().includes('cut');
  const recoveryPoor = input.recovery === 'poor';
  const advanced = input.experience === 'advanced';

  return Array.from({ length: 8 }, (_, index) => {
    const week = index + 1;

    if (week === 8 || (recoveryPoor && week === 4)) {
      return {
        week,
        focus: 'Deload estratégico e recuperação',
        intensity: 'Moderada',
        volume: 'Reduzido',
        deload: true,
        notes: 'Reduzir volume, manter técnica, preservar padrões de movimento e preparar próximo bloco.'
      };
    }

    if (week <= 2) {
      return {
        week,
        focus: 'Base técnica e consolidação',
        intensity: cutting ? 'Alta controlada' : 'Alta',
        volume: recoveryPoor ? 'Baixo/moderado' : 'Moderado',
        deload: false,
        notes: 'Padronizar execução, RIR e amplitude. Buscar progressão de qualidade antes de volume.'
      };
    }

    if (week <= 5) {
      return {
        week,
        focus: 'Progressão de performance',
        intensity: 'Alta',
        volume: advanced && !cutting && !recoveryPoor ? 'Moderado/alto recuperável' : 'Moderado',
        deload: false,
        notes: `Priorizar ${input.priorityMuscles.join(', ') || 'músculos alvo'} com progressão sustentável.`
      };
    }

    return {
      week,
      focus: 'Intensificação e consolidação de carga',
      intensity: 'Alta controlada',
      volume: cutting || recoveryPoor ? 'Moderado controlado' : 'Moderado/alto recuperável',
      deload: false,
      notes: 'Consolidar cargas, evitar junk volume e monitorar queda de performance.'
    };
  });
}

export function getPeriodizationSummary(plan: PeriodizationWeekPlan[]) {
  const deloadWeeks = plan.filter((week) => week.deload).map((week) => week.week);
  return deloadWeeks.length
    ? `Ciclo com deload planejado na(s) semana(s): ${deloadWeeks.join(', ')}.`
    : 'Ciclo sem deload fixo. Monitorar fadiga pelo logbook.';
}
