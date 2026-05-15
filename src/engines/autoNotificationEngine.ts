export type NotificationInput = {
  studentId: number | string;
  studentName?: string;
  retentionLevel?: 'low' | 'medium' | 'high' | 'critical';
  checkinLate?: boolean;
  performanceDrop?: boolean;
  newPr?: boolean;
  assessmentPending?: boolean;
};

export type CoachNotification = {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionLabel: string;
};

export function generateCoachNotifications(input: NotificationInput): CoachNotification[] {
  const name = input.studentName || 'Aluno';
  const notifications: CoachNotification[] = [];

  if (input.retentionLevel === 'critical' || input.retentionLevel === 'high') {
    notifications.push({
      id: `retention-${input.studentId}`,
      title: `${name} em risco de abandono`,
      message: 'Sinais de baixa adesão ou afastamento foram detectados.',
      priority: input.retentionLevel,
      actionLabel: 'Abrir plano de retenção'
    });
  }

  if (input.checkinLate) {
    notifications.push({
      id: `checkin-${input.studentId}`,
      title: `Check-in atrasado de ${name}`,
      message: 'Solicite atualização rápida de peso, fotos, sono, fome e feedback.',
      priority: 'medium',
      actionLabel: 'Solicitar check-in'
    });
  }

  if (input.performanceDrop) {
    notifications.push({
      id: `performance-${input.studentId}`,
      title: `Queda de performance em ${name}`,
      message: 'Revisar recuperação, volume, sono e proximidade da falha.',
      priority: 'high',
      actionLabel: 'Revisar treino'
    });
  }

  if (input.assessmentPending) {
    notifications.push({
      id: `assessment-${input.studentId}`,
      title: `Avaliação pendente de ${name}`,
      message: 'Atualizar medidas, fotos e observações do ciclo.',
      priority: 'medium',
      actionLabel: 'Abrir avaliação'
    });
  }

  if (input.newPr) {
    notifications.push({
      id: `pr-${input.studentId}`,
      title: `${name} bateu novo PR`,
      message: 'Registrar evolução e avaliar próxima microprogressão.',
      priority: 'low',
      actionLabel: 'Ver PR'
    });
  }

  return notifications;
}

export function sortNotifications(notifications: CoachNotification[]) {
  const order = { critical: 4, high: 3, medium: 2, low: 1 };
  return [...notifications].sort((a, b) => order[b.priority] - order[a.priority]);
}
