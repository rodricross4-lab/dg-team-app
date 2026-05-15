export type TimelineEventType =
  | 'workout'
  | 'pr'
  | 'checkin'
  | 'assessment'
  | 'retention'
  | 'notification'
  | 'adjustment';

export type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  date: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
};

export function buildStudentTimeline(events: TimelineEvent[]) {
  return [...events].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function generateAutoTimelineInsights(events: TimelineEvent[]) {
  const insights: string[] = [];

  const prs = events.filter((event) => event.type === 'pr').length;
  const retentionAlerts = events.filter((event) => event.type === 'retention');
  const adjustments = events.filter((event) => event.type === 'adjustment').length;

  if (prs >= 3) {
    insights.push('Aluno apresentou boa sequência recente de PRs.');
  }

  if (retentionAlerts.some((item) => item.priority === 'high' || item.priority === 'critical')) {
    insights.push('Existem alertas recentes de retenção que precisam atenção.');
  }

  if (adjustments >= 2) {
    insights.push('Múltiplos ajustes recentes detectados na estratégia do aluno.');
  }

  if (insights.length === 0) {
    insights.push('Timeline sem padrão crítico relevante no momento.');
  }

  return insights;
}
