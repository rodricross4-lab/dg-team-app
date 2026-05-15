export type RetentionInput = {
  studentId: number | string;
  studentName?: string;
  attendanceRate?: number;
  daysSinceLastWorkout?: number;
  daysSinceLastCheckin?: number;
  performanceTrend?: 'up' | 'stable' | 'down';
  mood?: 'good' | 'ok' | 'bad';
  recovery?: 'good' | 'ok' | 'poor';
};

export type RetentionRiskResult = {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  coachActions: string[];
};

export function calculateRetentionRisk(input: RetentionInput): RetentionRiskResult {
  let score = 0;
  const reasons: string[] = [];
  const coachActions: string[] = [];

  if ((input.attendanceRate || 100) < 60) {
    score += 30;
    reasons.push('Frequência abaixo do mínimo esperado.');
    coachActions.push('Conversar sobre rotina e ajustar meta semanal realista.');
  }

  if ((input.daysSinceLastWorkout || 0) >= 7) {
    score += 25;
    reasons.push('Aluno sem treino registrado recentemente.');
    coachActions.push('Enviar mensagem curta de reativação e facilitar retorno ao treino.');
  }

  if ((input.daysSinceLastCheckin || 0) >= 10) {
    score += 20;
    reasons.push('Check-in atrasado.');
    coachActions.push('Solicitar atualização rápida: peso, fotos, sono, fome e feedback.');
  }

  if (input.performanceTrend === 'down') {
    score += 15;
    reasons.push('Tendência de performance em queda.');
    coachActions.push('Revisar fadiga, recuperação e volume do treino.');
  }

  if (input.mood === 'bad') {
    score += 10;
    reasons.push('Sinal de motivação/humor baixo.');
    coachActions.push('Reforçar progresso, simplificar meta da semana e reduzir fricção.');
  }

  if (input.recovery === 'poor') {
    score += 10;
    reasons.push('Recuperação ruim informada.');
    coachActions.push('Controlar intensidade/volume e revisar sono/descanso.');
  }

  const cappedScore = Math.min(score, 100);
  const level = cappedScore >= 80 ? 'critical' : cappedScore >= 55 ? 'high' : cappedScore >= 30 ? 'medium' : 'low';

  if (coachActions.length === 0) {
    coachActions.push('Manter acompanhamento normal e reforçar consistência.');
  }

  if (reasons.length === 0) {
    reasons.push('Aluno sem sinais relevantes de risco no momento.');
  }

  return {
    score: cappedScore,
    level,
    reasons,
    coachActions
  };
}

export function getRetentionSummary(result: RetentionRiskResult) {
  if (result.level === 'critical') return 'Risco crítico de abandono. Ação do coach necessária.';
  if (result.level === 'high') return 'Risco alto. Aluno precisa de atenção nesta semana.';
  if (result.level === 'medium') return 'Risco moderado. Monitorar consistência e check-in.';
  return 'Risco baixo. Manter acompanhamento normal.';
}
