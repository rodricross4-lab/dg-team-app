export type AutomationContext = {
  studentId: number | string;
  studentName?: string;
  validSets?: number;
  volumeLoad?: number;
  executionQuality?: number;
  frequencyRate?: number;
  assessmentsPending?: boolean;
  performanceDrop?: boolean;
  plateau?: boolean;
};

export type AutomationAction = {
  id: string;
  severity: 'positive' | 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  suggestedAction: string;
};

export function generateAutomationActions(context: AutomationContext): AutomationAction[] {
  const actions: AutomationAction[] = [];

  if ((context.validSets || 0) === 0) {
    actions.push({
      id: `no-valid-sets-${context.studentId}`,
      severity: 'warning',
      title: 'Sem séries válidas registradas',
      message: 'O aluno ainda não possui registros úteis no logbook.',
      suggestedAction: 'Registrar cargas e reps das séries válidas no próximo treino.'
    });
  }

  if ((context.executionQuality || 0) > 0 && (context.executionQuality || 0) < 70) {
    actions.push({
      id: `low-execution-${context.studentId}`,
      severity: 'warning',
      title: 'Execução abaixo do ideal',
      message: 'A qualidade média de execução está abaixo do padrão DG Team.',
      suggestedAction: 'Consolidar técnica antes de aumentar carga ou volume.'
    });
  }

  if (context.performanceDrop) {
    actions.push({
      id: `performance-drop-${context.studentId}`,
      severity: 'critical',
      title: 'Queda de performance detectada',
      message: 'O sistema identificou queda de desempenho no padrão recente.',
      suggestedAction: 'Revisar recuperação, descanso, volume e proximidade da falha.'
    });
  }

  if (context.plateau) {
    actions.push({
      id: `plateau-${context.studentId}`,
      severity: 'warning',
      title: 'Possível platô',
      message: 'Carga e repetições parecem estáveis por tempo demais.',
      suggestedAction: 'Aplicar progressão de reps, consolidar execução ou trocar variação.'
    });
  }

  if (context.assessmentsPending) {
    actions.push({
      id: `assessment-pending-${context.studentId}`,
      severity: 'info',
      title: 'Avaliação pendente',
      message: 'Existe avaliação física pendente para atualização do ciclo.',
      suggestedAction: 'Atualizar peso, medidas, fotos e observações.'
    });
  }

  if ((context.validSets || 0) > 0 && (context.executionQuality || 0) >= 85 && !context.performanceDrop) {
    actions.push({
      id: `good-zone-${context.studentId}`,
      severity: 'positive',
      title: 'Zona boa de progressão',
      message: 'Execução e registros indicam boa tolerância ao estímulo atual.',
      suggestedAction: 'Manter progressão sustentável com microloading quando bater topo do range.'
    });
  }

  return actions;
}

export function getAutomationSummary(actions: AutomationAction[]) {
  const critical = actions.filter((action) => action.severity === 'critical').length;
  const warning = actions.filter((action) => action.severity === 'warning').length;
  const positive = actions.filter((action) => action.severity === 'positive').length;

  if (critical > 0) return `${critical} alerta(s) crítico(s) exigem atenção.`;
  if (warning > 0) return `${warning} alerta(s) moderado(s) para revisar.`;
  if (positive > 0) return 'Sistema em zona boa de progresso.';
  return 'Sem automações críticas no momento.';
}
