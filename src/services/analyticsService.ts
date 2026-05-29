import { loadOperationalStore } from '../store/operationalStore';
import type { DashboardSummary, ExerciseTrendPoint, LogbookSet, MuscleVolume, RecentPR, Student } from '../types';
import { getStoredLogbookSets, getStoredWorkoutSessions } from './logbookService';

const DAY_MS = 24 * 60 * 60 * 1000;

function getTime(value?: string) {
  const time = value ? new Date(value).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

function isToday(value?: string) {
  if (!value) return false;

  const date = new Date(value);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function isWithinLastDays(value: string | undefined, days: number) {
  const time = getTime(value);
  if (!time) return false;

  return Date.now() - time <= days * DAY_MS;
}

function isActiveStudent(student: Student) {
  return student.status === 'active' && student.deleted_at == null;
}

function isValidSet(set: LogbookSet) {
  return set.set_type === 'valid';
}

function getSetVolumeLoad(set: LogbookSet) {
  return (set.weight_kg || 0) * (set.reps || 0);
}

function getExerciseGroups() {
  const groups = new Map<string, string>();

  loadOperationalStore().workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      groups.set(exercise.id, exercise.group || 'Sem grupo');
    });
  });

  return groups;
}

function getWeeklyValidSets(studentId?: string) {
  return getStoredLogbookSets(studentId).filter((set) => (
    isValidSet(set) && isWithinLastDays(set.created_at || set.updated_at, 7)
  ));
}

export function getWeeklyVolumeLoad(studentId?: string) {
  return getWeeklyValidSets(studentId).reduce((total, set) => total + getSetVolumeLoad(set), 0);
}

export function getWeeklyVolumeByMuscle(studentId?: string): MuscleVolume[] {
  const exerciseGroups = getExerciseGroups();
  const volumeByMuscle = new Map<string, MuscleVolume>();

  getWeeklyValidSets(studentId).forEach((set) => {
    const muscle = exerciseGroups.get(set.exercise_id) || 'Sem grupo';
    const current = volumeByMuscle.get(muscle) || { muscle, validSets: 0, volumeLoad: 0 };

    volumeByMuscle.set(muscle, {
      ...current,
      validSets: current.validSets + 1,
      volumeLoad: current.volumeLoad + getSetVolumeLoad(set),
    });
  });

  return Array.from(volumeByMuscle.values()).sort((a, b) => b.volumeLoad - a.volumeLoad);
}

export function getRecentPRs(studentId?: string): RecentPR[] {
  const bestByExercise = new Map<string, { load: number; reps: number; volumeLoad: number }>();
  const prs: RecentPR[] = [];

  getStoredLogbookSets(studentId)
    .filter(isValidSet)
    .sort((a, b) => getTime(a.created_at) - getTime(b.created_at))
    .forEach((set) => {
      const key = `${set.student_id}:${set.exercise_id}`;
      const currentLoad = set.weight_kg || 0;
      const currentReps = set.reps || 0;
      const currentVolumeLoad = getSetVolumeLoad(set);
      const best = bestByExercise.get(key);

      if (best) {
        if (currentLoad > best.load) {
          prs.push({
            student_id: set.student_id,
            exercise_id: set.exercise_id,
            type: 'load',
            previousValue: best.load,
            currentValue: currentLoad,
            created_at: set.created_at,
          });
        }

        if (currentReps > best.reps) {
          prs.push({
            student_id: set.student_id,
            exercise_id: set.exercise_id,
            type: 'reps',
            previousValue: best.reps,
            currentValue: currentReps,
            created_at: set.created_at,
          });
        }

        if (currentVolumeLoad > best.volumeLoad) {
          prs.push({
            student_id: set.student_id,
            exercise_id: set.exercise_id,
            type: 'volume_load',
            previousValue: best.volumeLoad,
            currentValue: currentVolumeLoad,
            created_at: set.created_at,
          });
        }
      }

      bestByExercise.set(key, {
        load: Math.max(best?.load || 0, currentLoad),
        reps: Math.max(best?.reps || 0, currentReps),
        volumeLoad: Math.max(best?.volumeLoad || 0, currentVolumeLoad),
      });
    });

  return prs.sort((a, b) => getTime(b.created_at) - getTime(a.created_at));
}

export function getStudentsAtRisk(students: Student[]) {
  const activeStudents = students.filter(isActiveStudent);
  const weeklySets = getWeeklyValidSets();
  const lowQualityStudentIds = new Set(
    weeklySets
      .filter((set) => (set.execution_quality || 0) > 0 && (set.execution_quality || 0) <= 2)
      .map((set) => set.student_id)
  );
  const trainedStudentIds = new Set(weeklySets.map((set) => set.student_id));
  const studentsWithWorkouts = new Set(loadOperationalStore().workouts.map((workout) => workout.studentId));

  return activeStudents.filter((student) => (
    Boolean(student.alerts?.length) ||
    lowQualityStudentIds.has(student.id) ||
    (studentsWithWorkouts.has(student.id) && !trainedStudentIds.has(student.id))
  ));
}

export function getDashboardSummary(students: Student[]): DashboardSummary {
  const activeStudents = students.filter(isActiveStudent);
  const activeStudentIds = new Set(activeStudents.map((student) => student.id));
  const weeklySets = getWeeklyValidSets().filter((set) => activeStudentIds.has(set.student_id));
  const sessions = getStoredWorkoutSessions().filter((session) => activeStudentIds.has(session.student_id));
  const assessments = loadOperationalStore().assessments;
  const recentPrs = getRecentPRs().filter((pr) => activeStudentIds.has(pr.student_id) && isWithinLastDays(pr.created_at, 7));

  const executionQualitySets = weeklySets.filter((set) => set.execution_quality);
  const executionQuality = executionQualitySets.length
    ? Math.round((executionQualitySets.reduce((total, set) => total + (set.execution_quality || 0), 0) / (executionQualitySets.length * 5)) * 100)
    : 0;

  const averageTrainingFrequency = activeStudents.length
    ? Math.round(activeStudents.reduce((total, student) => total + student.training_frequency, 0) / activeStudents.length)
    : 0;

  return {
    activeStudents: activeStudents.length,
    workoutsToday: sessions.filter((session) => isToday(session.performed_at)).length,
    weeklyVolumeLoad: weeklySets.reduce((total, set) => total + getSetVolumeLoad(set), 0),
    recentPRs: recentPrs.length,
    studentsAtRisk: getStudentsAtRisk(students).length,
    pendingAssessments: activeStudents.filter((student) => !assessments.some((assessment) => assessment.studentId === student.id)).length,
    validSets: weeklySets.length,
    executionQuality,
    averageTrainingFrequency,
  };
}

export function getDashboardAlerts(students: Student[]) {
  const summary = getDashboardSummary(students);
  const alerts: string[] = [];

  if (summary.activeStudents === 0) alerts.push('Nenhum aluno ativo cadastrado.');
  if (summary.validSets === 0) alerts.push('Nenhuma serie valida registrada nos ultimos 7 dias.');
  if (summary.studentsAtRisk > 0) alerts.push(`${summary.studentsAtRisk} aluno(s) em alerta por execucao, aderencia ou alertas ativos.`);
  if (summary.executionQuality > 0 && summary.executionQuality < 70) alerts.push('Qualidade media de execucao abaixo do ideal.');
  if (summary.recentPRs > 0) alerts.push(`${summary.recentPRs} PR(s) detectado(s) nos ultimos 7 dias.`);

  return alerts;
}

export function getExercisePerformanceTrend(studentId: string, exerciseId: string): ExerciseTrendPoint[] {
  return getStoredLogbookSets(studentId)
    .filter((set) => set.exercise_id === exerciseId && isValidSet(set))
    .sort((a, b) => getTime(a.created_at) - getTime(b.created_at))
    .map((set) => ({
      date: set.created_at,
      exercise_id: set.exercise_id,
      load: set.weight_kg || 0,
      reps: set.reps || 0,
      volumeLoad: getSetVolumeLoad(set),
      executionQuality: set.execution_quality,
    }));
}
