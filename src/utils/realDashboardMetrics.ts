import { loadOperationalStore } from '../store/operationalStore';

const LOG_KEY = 'dg-team-logbook-store';

type LogEntry = {
  exerciseId: string;
  load: string;
  reps: string;
  rir: string;
  execution: string;
};

function loadStudentLogs(studentId: number): LogEntry[] {
  try {
    const raw = localStorage.getItem(`${LOG_KEY}-${studentId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getRealDashboardMetrics(studentIds: number[]) {
  const operational = loadOperationalStore();
  const allLogs = studentIds.flatMap((studentId) => loadStudentLogs(studentId));

  const volumeLoad = allLogs.reduce((total, log) => {
    const load = Number(log.load) || 0;
    const reps = Number(log.reps) || 0;
    return total + load * reps;
  }, 0);

  const validSets = allLogs.filter((log) => Number(log.reps) > 0).length;
  const goodExecutions = allLogs.filter((log) => ['boa', 'excelente'].includes(log.execution)).length;
  const executionQuality = validSets > 0 ? Math.round((goodExecutions / validSets) * 100) : 0;

  return {
    savedWorkouts: operational.workouts.length,
    savedAssessments: operational.assessments.length,
    savedPeriodizationWeeks: operational.periodization.length,
    validSets,
    volumeLoad,
    executionQuality
  };
}

export function getDashboardAlerts(studentIds: number[]) {
  const metrics = getRealDashboardMetrics(studentIds);
  const alerts: string[] = [];

  if (metrics.savedWorkouts === 0) alerts.push('Nenhum treino salvo ainda. Prioridade: criar treinos reais por aluno.');
  if (metrics.validSets === 0) alerts.push('Nenhuma série válida registrada no logbook ainda.');
  if (metrics.executionQuality > 0 && metrics.executionQuality < 70) alerts.push('Qualidade média de execução abaixo do ideal. Revisar técnica antes de progredir carga.');
  if (metrics.volumeLoad > 0) alerts.push(`Volume load registrado no sistema: ${metrics.volumeLoad}kg.`);

  return alerts;
}
