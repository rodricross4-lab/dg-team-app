export type CheckinInput = {
  studentId: number | string;
  studentName?: string;
  daysSinceLastCheckin?: number;
  attendanceRate?: number;
  performanceTrend?: 'up' | 'stable' | 'down';
  recovery?: 'good' | 'ok' | 'poor';
  mood?: 'good' | 'ok' | 'bad';
};

export type CheckinAction = {
  severity: 'positive' | 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  coachAction: string;
};

export function generateCheckinActions(input: CheckinInput): CheckinAction[] {
  const actions: CheckinAction[] = [];

  if ((input.daysSinceLastCheckin || 0) >= 7) {
    actions.push({
      severity: 'warning',
      title: 'Check-in atrasado',
      message: 'Aluno está sem atualização recente.',
      coachAction: 'Solicitar peso, fotos, frequência, sono, fome e feedback do treino.'
    });
  }

  if ((input.attendanceRate || 100) < 60) {
    actions.push({
      severity: 'critical',
      title: 'Baixa frequência',
      message: 'Frequência abaixo do mínimo para evolução consistente.',
      coachAction: 'Conversar sobre rotina, barreiras e ajustar frequência realista.'
    });
  }

  if (input.performanceTrend === 'down' && input.recovery === 'poor') {
    actions.push({
      severity: 'critical',
      title: 'Performance e recuperação ruins',
      message: 'Sinal forte de fadiga ou baixa adesão à recuperação.',
      coachAction: 'Reduzir volume, revisar sono, descanso e dieta antes de progredir carga.'
    });
  }

  if (input.mood === 'bad') {
    actions.push({
      severity: 'info',
      title: 'Humor/motivação baixo',
      message: 'Aluno pode estar com baixa motivação ou estresse alto.',
      coachAction: 'Enviar feedback curto, reforçar progresso e simplificar metas da semana.'
    });
  }

  if ((input.attendanceRate || 0) >= 85 && input.performanceTrend === 'up') {
    actions.push({
      severity: 'positive',
      title: 'Alta consistência',
      message: 'Aluno está consistente e evoluindo.',
      coachAction: 'Manter estratégia atual e reforçar positivamente o progresso.'
    });
  }

  return actions;
}

export function getCheckinSummary(actions: CheckinAction[]) {
  const critical = actions.filter((action) => action.severity === 'critical').length;
  const warning = actions.filter((action) => action.severity === 'warning').length;
  const positive = actions.filter((action) => action.severity === 'positive').length;

  if (critical > 0) return `${critical} ponto(s) crítico(s) no check-in.`;
  if (warning > 0) return `${warning} ponto(s) precisam atenção.`;
  if (positive > 0) return 'Check-in em zona positiva de consistência.';
  return 'Check-in sem alerta relevante.';
}
