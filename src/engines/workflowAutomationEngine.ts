export type WorkflowTrigger =
  | 'workout_saved'
  | 'logbook_updated'
  | 'assessment_saved'
  | 'periodization_updated'
  | 'student_inactive'
  | 'performance_drop'
  | 'new_pr';

export type WorkflowAutomation = {
  id: string;
  trigger: WorkflowTrigger;
  title: string;
  description: string;
  nextStep: string;
  priority: 'low' | 'medium' | 'high';
};

export function getWorkflowAutomations(trigger: WorkflowTrigger): WorkflowAutomation[] {
  const map: Record<WorkflowTrigger, WorkflowAutomation[]> = {
    workout_saved: [
      {
        id: 'after-workout-save-logbook',
        trigger,
        title: 'Logbook pronto para uso',
        description: 'Treino salvo. O logbook já pode puxar os exercícios desse aluno.',
        nextStep: 'Abrir logbook presencial e registrar somente séries válidas.',
        priority: 'medium'
      }
    ],
    logbook_updated: [
      {
        id: 'after-logbook-update-dashboard',
        trigger,
        title: 'Atualizar métricas do aluno',
        description: 'Novo registro de performance detectado.',
        nextStep: 'Recalcular volume load, PRs, execução e alertas IA DG.',
        priority: 'high'
      }
    ],
    assessment_saved: [
      {
        id: 'after-assessment-cycle-review',
        trigger,
        title: 'Revisar ciclo após avaliação',
        description: 'Nova avaliação salva no aluno.',
        nextStep: 'Comparar medidas, fotos e performance para ajustar o próximo bloco.',
        priority: 'medium'
      }
    ],
    periodization_updated: [
      {
        id: 'after-periodization-update-workouts',
        trigger,
        title: 'Conectar periodização aos treinos',
        description: 'Ciclo atualizado.',
        nextStep: 'Verificar se os treinos seguem foco, volume e intensidade da semana.',
        priority: 'medium'
      }
    ],
    student_inactive: [
      {
        id: 'inactive-student-contact',
        trigger,
        title: 'Aluno em risco de abandono',
        description: 'Baixa frequência ou ausência recente detectada.',
        nextStep: 'Enviar mensagem de acompanhamento e ajustar barreiras de adesão.',
        priority: 'high'
      }
    ],
    performance_drop: [
      {
        id: 'performance-drop-review',
        trigger,
        title: 'Queda de performance',
        description: 'Performance caiu em padrão relevante.',
        nextStep: 'Revisar sono, recuperação, volume e proximidade da falha.',
        priority: 'high'
      }
    ],
    new_pr: [
      {
        id: 'new-pr-celebrate-progress',
        trigger,
        title: 'Novo PR registrado',
        description: 'Aluno atingiu nova marca de performance.',
        nextStep: 'Registrar no histórico e avaliar próxima microprogressão.',
        priority: 'low'
      }
    ]
  };

  return map[trigger];
}

export function getWorkflowPrioritySummary(automations: WorkflowAutomation[]) {
  const high = automations.filter((item) => item.priority === 'high').length;
  if (high > 0) return `${high} automação(ões) de alta prioridade.`;
  return 'Sem automações críticas neste fluxo.';
}
