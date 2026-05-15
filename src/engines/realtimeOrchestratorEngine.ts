import { generateCoachNotifications, type NotificationInput } from './autoNotificationEngine';
import { calculateRetentionRisk, type RetentionInput } from './autoRetentionEngine';
import { generateCheckinActions, type CheckinInput } from './autoCheckinEngine';
import { generateAutomationActions, type AutomationContext } from './automationEngine';
import { getAutoAdjustment, type AutoAdjustmentInput } from './autoAdjustmentEngine';

export type RealtimeEventType =
  | 'logbook_updated'
  | 'checkin_saved'
  | 'assessment_saved'
  | 'workout_saved'
  | 'student_updated';

export type RealtimeOrchestratorInput = {
  eventType: RealtimeEventType;
  studentId: number | string;
  studentName?: string;
  notification?: NotificationInput;
  retention?: RetentionInput;
  checkin?: CheckinInput;
  automation?: AutomationContext;
  adjustment?: AutoAdjustmentInput;
};

export type RealtimeOrchestratorResult = {
  eventType: RealtimeEventType;
  generatedAt: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  outputs: {
    notifications: ReturnType<typeof generateCoachNotifications>;
    retention?: ReturnType<typeof calculateRetentionRisk>;
    checkins?: ReturnType<typeof generateCheckinActions>;
    automations?: ReturnType<typeof generateAutomationActions>;
    adjustment?: ReturnType<typeof getAutoAdjustment>;
  };
};

export function runRealtimeOrchestrator(input: RealtimeOrchestratorInput): RealtimeOrchestratorResult {
  const notifications = input.notification ? generateCoachNotifications(input.notification) : [];
  const retention = input.retention ? calculateRetentionRisk(input.retention) : undefined;
  const checkins = input.checkin ? generateCheckinActions(input.checkin) : undefined;
  const automations = input.automation ? generateAutomationActions(input.automation) : undefined;
  const adjustment = input.adjustment ? getAutoAdjustment(input.adjustment) : undefined;

  const hasCriticalNotification = notifications.some((item) => item.priority === 'critical');
  const hasHighNotification = notifications.some((item) => item.priority === 'high');
  const hasCriticalRetention = retention?.level === 'critical';
  const hasHighRetention = retention?.level === 'high';
  const hasCriticalAutomation = automations?.some((item) => item.severity === 'critical');

  const priority = hasCriticalNotification || hasCriticalRetention || hasCriticalAutomation
    ? 'critical'
    : hasHighNotification || hasHighRetention
      ? 'high'
      : notifications.length || checkins?.length || automations?.length
        ? 'medium'
        : 'low';

  const summary = priority === 'critical'
    ? 'Evento gerou prioridade crítica para o coach.'
    : priority === 'high'
      ? 'Evento gerou prioridade alta para acompanhamento.'
      : priority === 'medium'
        ? 'Evento gerou atualizações operacionais para revisar.'
        : 'Evento registrado sem alerta relevante.';

  return {
    eventType: input.eventType,
    generatedAt: new Date().toISOString(),
    priority,
    summary,
    outputs: {
      notifications,
      retention,
      checkins,
      automations,
      adjustment
    }
  };
}
