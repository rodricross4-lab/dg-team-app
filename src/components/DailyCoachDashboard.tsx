import CoachBriefingPanel from './CoachBriefingPanel';
import CoachCommandCenterPanel from './CoachCommandCenterPanel';
import NotificationCenter from './NotificationCenter';
import RetentionRiskPanel from './RetentionRiskPanel';
import TimelinePanelDG from './TimelinePanelDG';
import AutomationCenter from './AutomationCenter';

export default function DailyCoachDashboard() {
  const studentId = 1;
  const studentName = 'Aluno DG';

  const briefingInput = {
    studentName,
    mainGoal: 'Hipertrofia com progressão sustentável',
    notifications: {
      studentId,
      studentName,
      retentionLevel: 'medium' as const,
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
      performanceTrend: 'stable' as const,
      mood: 'ok' as const,
      recovery: 'ok' as const
    },
    checkin: {
      studentId,
      studentName,
      daysSinceLastCheckin: 8,
      attendanceRate: 72,
      performanceTrend: 'stable' as const,
      recovery: 'ok' as const,
      mood: 'ok' as const
    }
  };

  const commandInput = {
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
      performanceTrend: 'stable' as const,
      recovery: 'ok' as const,
      phase: 'bulking' as const
    },
    systemHealth: {
      hasAuth: true,
      hasCloud: true,
      hasStudents: true,
      hasWorkouts: true,
      hasLogbookEntries: true,
      hasAssessments: true,
      buildStatus: 'unknown' as const
    },
    lastTrigger: 'logbook_updated' as const
  };

  const timelineEvents = [
    {
      id: 'event-1',
      type: 'workout' as const,
      title: 'Treino registrado',
      description: 'Logbook atualizado com séries válidas e execução.',
      date: new Date().toISOString(),
      priority: 'medium' as const
    },
    {
      id: 'event-2',
      type: 'pr' as const,
      title: 'Novo PR detectado',
      description: 'Aluno apresentou melhor série-volume no ciclo.',
      date: new Date(Date.now() - 86400000).toISOString(),
      priority: 'low' as const
    },
    {
      id: 'event-3',
      type: 'assessment' as const,
      title: 'Avaliação pendente',
      description: 'Atualizar medidas e fotos para fechar o bloco.',
      date: new Date(Date.now() - 172800000).toISOString(),
      priority: 'medium' as const
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
