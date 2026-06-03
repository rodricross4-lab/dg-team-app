import { getStoredLogbookSets } from '../services/logbookService';
import { isValidSet } from './dgTrainingRules';

export function getStudentPRSummary(studentId: string) {
  const validSets = getStoredLogbookSets(studentId).filter((set) => (
    isValidSet(set) && (set.weight_kg || 0) > 0 && (set.reps || 0) > 0
  ));

  const bestLoad = validSets.reduce((best, set) => Math.max(best, set.weight_kg || 0), 0);
  const bestVolumeSet = validSets.reduce((best, set) => {
    const volume = (set.weight_kg || 0) * (set.reps || 0);
    return Math.max(best, volume);
  }, 0);

  return {
    totalValidSets: validSets.length,
    bestLoad,
    bestVolumeSet,
    hasPR: bestLoad > 0 || bestVolumeSet > 0
  };
}

export function getPRMessage(studentId: string) {
  const summary = getStudentPRSummary(studentId);

  if (!summary.hasPR) {
    return 'Ainda não há PR registrado. Registre cargas e reps no logbook.';
  }

  return `PR atual: maior carga ${summary.bestLoad}kg • melhor série-volume ${summary.bestVolumeSet}kg.`;
}
