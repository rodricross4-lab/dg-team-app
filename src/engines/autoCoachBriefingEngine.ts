import { generateCoachNotifications, type NotificationInput } from './autoNotificationEngine';
import { calculateRetentionRisk, type RetentionInput } from './autoRetentionEngine';
import { generateCheckinActions, type CheckinInput } from './autoCheckinEngine';

export type CoachBriefingInput = {
  studentName: string;
  notifications: NotificationInput;
  retention: RetentionInput;
  checkin: CheckinInput;
  mainGoal?: string;
};

export type CoachBriefing = {
  headline: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  summary: string[];
  todayActions: string[];
};

export function generateCoachBriefing(input: CoachBriefingInput): CoachBriefing {
  const notifications = generateCoachNotifications(input.notifications);
  const retention = calculateRetentionRisk(input.retention);
  const checkins = generateCheckinActions(input.checkin);

  const priority = retention.level === 'critical' ? 'critical'
    : retention.level === 'high' ? 'high'
    : notifications.some((item) => item.priority === 'high' || item.priority === 'critical') ? 'high'
    : checkins.some((item) => item.severity === 'warning' || item.severity === 'critical') ? 'medium'
    : 'low';

  const summary = [
    `Objetivo principal: ${input.mainGoal || 'não informado'}.`,
    `Risco de retenção: ${retention.score}% (${retention.level}).`,
    `${notifications.length} notificação(ões) operacional(is).`,
    `${checkins.length} ponto(s) de check-in detectado(s).`
  ];

  const todayActions = [
    ...retention.coachActions,
    ...notifications.map((item) => item.actionLabel),
    ...checkins.map((item) => item.coachAction)
  ];

  return {
    headline: priority === 'critical'
      ? `${input.studentName} precisa de atenção imediata`
      : priority === 'high'
        ? `${input.studentName} precisa de ação nesta semana`
        : `${input.studentName} está em acompanhamento normal`,
    priority,
    summary,
    todayActions: Array.from(new Set(todayActions)).slice(0, 6)
  };
}
