import CoachBriefingPanel from './CoachBriefingPanel';
import CoachCommandCenterPanel from './CoachCommandCenterPanel';
import NotificationCenter from './NotificationCenter';
import RetentionRiskPanel from './RetentionRiskPanel';
import TimelinePanelDG from './TimelinePanelDG';
import AutomationCenter from './AutomationCenter';
import type { CoachBriefingInput } from '../engines/autoCoachBriefingEngine';
import type { CoachCommandInput } from '../engines/coachCommandCenterEngine';
import type { TimelineEvent } from '../engines/autoTimelineEngine';

export default function DailyCoachDashboard() {
  const studentId = 1;
  const studentName = 'Aluno DG';

  const briefingInput: CoachBriefingInput = {
    studentName,
    mainGoal: 'Hipertrofia com progressão sustentável',
    notifications: {
      studentId,
      studentName,
      retentionLevel: 'medium',
      checkinLate: true,
      performanceDrop: false,
      newPr: true,
      assessmentPending: true
    },
    retention: {
      studentId,
      studentName,
      attendanceRate: 72,
      daysSinceLastWorkout: 3,
      daysSinceLastCheckin: 8,
      performanceTrend: 'stable',
      mood: 'ok',
      recovery: 'ok'
    },
    checkin: {
      studentId,
      studentName,
      daysSinceLastCheckin: 8,
      attendanceRate: 72,
      performanceTrend: 'stable',
      recovery: 'ok',
      mood: 'ok'
    }
  };

  const commandInput: CoachCommandInput = {
    automationContext: {
      studentId,
      studentName,
      validSets: 8,
      volumeLoad: 5400,
      executionQuality: 82,
      assessmentsPending: true,
      performanceDrop: false,
      plateau: false
    },
    adjustmentContext: {
      muscleGroup: 'Quadríceps',
      weeklyValidSets: 8,
      executionQuality: 82,
      performanceTrend: 'stable',
      recovery: 'ok',
      phase: 'bulking'
    },
    systemHealth: {
      hasAuth: true,
      hasCloud: true,
      hasStudents: true,
      hasWorkouts: true,
      hasLogbookEntries: true,
      hasAssessments: true,
      buildStatus: 'unknown'
    },
    lastTrigger: 'logbook_updated'
  };

  const timelineEvents: TimelineEvent[] = [
    {
      id: 'event-1',
      type: 'workout',
      title: 'Treino registrado',
      description: 'Logbook atualizado com séries válidas e execução.',
      date: new Date().toISOString(),
      priority: 'medium'
    },
    {
      id: 'event-2',
      type: 'pr',
      title: 'Novo PR detectado',
      description: 'Aluno apresentou melhor série-volume no ciclo.',
      date: new Date(Date.now() - 86400000).toISOString(),
      priority: 'low'
    },
    {
      id: 'event-3',
      type: 'assessment',
      title: 'Avaliação pendente',
      description: 'Atualizar medidas e fotos para fechar o bloco.',
      date: new Date(Date.now() - 172800000).toISOString(),
      priority: 'medium'
    }
  ];

  return (
    <div>
      <CoachCommandCenterPanel input={commandInput} />
      <CoachBriefingPanel input={briefingInput} />
      <NotificationCenter input={briefingInput.notifications} />
      <AutomationCenter context={commandInput.automationContext} />
      <RetentionRiskPanel input={briefingInput.retention} />
      <TimelinePanelDG events={timelineEvents} />
    </div>
  );
}
