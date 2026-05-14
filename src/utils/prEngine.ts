const LOG_KEY = 'dg-team-logbook-store';

type LogEntry = {
  exerciseId: string;
  load: string;
  reps: string;
  rir: string;
  execution: string;
};

function loadLogs(studentId: number): LogEntry[] {
  try {
    const raw = localStorage.getItem(`${LOG_KEY}-${studentId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getStudentPRSummary(studentId: number) {
  const logs = loadLogs(studentId);
  const validLogs = logs.filter((log) => Number(log.load) > 0 && Number(log.reps) > 0);

  const bestLoad = validLogs.reduce((best, log) => Math.max(best, Number(log.load) || 0), 0);
  const bestVolumeSet = validLogs.reduce((best, log) => {
    const volume = (Number(log.load) || 0) * (Number(log.reps) || 0);
    return Math.max(best, volume);
  }, 0);

  return {
    totalValidSets: validLogs.length,
    bestLoad,
    bestVolumeSet,
    hasPR: bestLoad > 0 || bestVolumeSet > 0
  };
}

export function getPRMessage(studentId: number) {
  const summary = getStudentPRSummary(studentId);

  if (!summary.hasPR) {
    return 'Ainda não há PR registrado. Registre cargas e reps no logbook.';
  }

  return `PR atual: maior carga ${summary.bestLoad}kg • melhor série-volume ${summary.bestVolumeSet}kg.`;
}
