import { generateAutomationActions, type AutomationContext } from './automationEngine';
import { getAutoAdjustment, type AutoAdjustmentInput } from './autoAdjustmentEngine';
import { getSystemHealth, type SystemHealthInput } from './systemHealthEngine';
import { getWorkflowAutomations, type WorkflowTrigger } from './workflowAutomationEngine';

export type CoachCommandInput = {
  automationContext: AutomationContext;
  adjustmentContext: AutoAdjustmentInput;
  systemHealth: SystemHealthInput;
  lastTrigger?: WorkflowTrigger;
};

export type CoachCommandResult = {
  priority: 'critical' | 'high' | 'medium' | 'low';
  headline: string;
  summary: string;
  actions: string[];
};

export function getCoachCommandCenter(input: CoachCommandInput): CoachCommandResult {
  const automations = generateAutomationActions(input.automationContext);
  const adjustment = getAutoAdjustment(input.adjustmentContext);
  const health = getSystemHealth(input.systemHealth);
  const workflows = input.lastTrigger ? getWorkflowAutomations(input.lastTrigger) : [];

  const criticalAutomations = automations.filter((item) => item.severity === 'critical');
  const warningAutomations = automations.filter((item) => item.severity === 'warning');

  const actions = [
    ...criticalAutomations.map((item) => item.suggestedAction),
    ...warningAutomations.map((item) => item.suggestedAction),
    adjustment.recommendation,
    ...workflows.map((item) => item.nextStep)
  ].filter(Boolean);

  if (health.status === 'critical') {
    return {
      priority: 'critical',
      headline: 'Sistema precisa de estabilização',
      summary: 'Antes de escalar recursos, revisar base, dados e fluxo principal.',
      actions: actions.length ? actions : ['Rodar revisão completa: login, treino, logbook, dashboard e sync.']
    };
  }

  if (criticalAutomations.length > 0) {
    return {
      priority: 'critical',
      headline: 'Atenção imediata necessária',
      summary: 'Há alertas críticos que podem impactar resultado ou adesão.',
      actions
    };
  }

  if (warningAutomations.length > 0 || adjustment.type === 'deload' || adjustment.type === 'volume') {
    return {
      priority: 'high',
      headline: 'Ajuste recomendado pela IA DG',
      summary: adjustment.reason,
      actions
    };
  }

  if (health.status === 'stable' || health.status === 'excellent') {
    return {
      priority: 'medium',
      headline: 'Sistema em zona boa de operação',
      summary: 'Manter fluxo atual e evoluir com qualidade, sem adicionar complexidade desnecessária.',
      actions: actions.length ? actions : ['Continuar registrando logbook e monitorando métricas reais.']
    };
  }

  return {
    priority: 'low',
    headline: 'Sem prioridade crítica no momento',
    summary: 'Sistema operando sem alertas relevantes.',
    actions: actions.length ? actions : ['Manter acompanhamento normal.']
  };
}
