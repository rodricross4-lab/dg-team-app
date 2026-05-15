import { loadAppStore } from '../store/appStore';
import { loadOperationalStore } from '../store/operationalStore';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const LOG_KEY = 'dg-team-logbook-store';

function loadLogbookEntries() {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith(LOG_KEY))
    .flatMap((key) => {
      try {
        const studentId = Number(key.replace(`${LOG_KEY}-`, ''));
        const entries = JSON.parse(localStorage.getItem(key) || '[]');
        return entries.map((entry: any) => ({ ...entry, student_id_local: studentId }));
      } catch {
        return [];
      }
    });
}

function getCloudDisabledResult(module: string) {
  return {
    module,
    ok: false,
    message: 'Supabase ainda não configurado. Dados seguem salvos localmente.',
    syncedAt: new Date().toISOString()
  };
}

function getCloudResult(module: string, ok: boolean, count: number, message: string) {
  return {
    module,
    ok,
    count,
    message,
    syncedAt: new Date().toISOString()
  };
}

async function safeUpsert(module: string, table: string, rows: any[]) {
  if (!isSupabaseConfigured() || !supabase) return getCloudDisabledResult(module);
  if (rows.length === 0) return getCloudResult(module, true, 0, `${module}: nenhum registro para sincronizar.`);

  const { error } = await supabase.from(table).upsert(rows as any);

  if (error) return getCloudResult(module, false, rows.length, error.message);
  return getCloudResult(module, true, rows.length, `${module}: ${rows.length} registro(s) sincronizados.`);
}

export async function syncStudentsToCloud() {
  const store = loadAppStore();
  const rows = store.students.map((student: any) => ({
    id: student.id,
    name: student.name,
    age: student.age,
    weight: student.weight,
    height: student.height,
    goal: student.goal,
    phase: student.phase,
    frequency: student.frequency,
    priority: student.priority || [],
    updated_at: new Date().toISOString()
  }));

  return safeUpsert('students', 'students', rows);
}

export async function syncWorkoutsToCloud() {
  const store = loadOperationalStore();
  const rows = store.workouts.map((workout: any) => ({
    id: workout.id,
    student_id: workout.studentId,
    week: workout.week,
    name: workout.name,
    exercises: workout.exercises || [],
    updated_at: workout.updatedAt || new Date().toISOString()
  }));

  return safeUpsert('workouts', 'workouts', rows);
}

export async function syncAssessmentsToCloud() {
  const store = loadOperationalStore();
  const rows = store.assessments.map((assessment: any) => ({
    student_id: assessment.studentId,
    week: assessment.week,
    weight: assessment.weight,
    body_fat: assessment.bodyFat,
    waist: assessment.waist,
    arm: assessment.arm,
    notes: assessment.notes,
    updated_at: assessment.updatedAt || new Date().toISOString()
  }));

  return safeUpsert('assessments', 'assessments', rows);
}

export async function syncPeriodizationToCloud() {
  const store = loadOperationalStore();
  const rows = store.periodization.map((week: any) => ({
    student_id: week.studentId,
    week: week.week,
    focus: week.focus,
    intensity: week.intensity,
    volume: week.volume,
    deload: week.deload,
    notes: week.notes,
    updated_at: week.updatedAt || new Date().toISOString()
  }));

  return safeUpsert('periodization', 'periodization_weeks', rows);
}

export async function syncLogbookToCloud() {
  const entries = loadLogbookEntries();
  const rows = entries.map((entry: any) => ({
    student_id: entry.student_id_local,
    exercise_id: entry.exerciseId,
    load: entry.load,
    reps: entry.reps,
    rir: entry.rir,
    execution: entry.execution,
    created_at: new Date().toISOString()
  }));

  return safeUpsert('logbook', 'logbook_entries', rows);
}

export async function runFullCloudSync() {
  const results = await Promise.all([
    syncStudentsToCloud(),
    syncWorkoutsToCloud(),
    syncAssessmentsToCloud(),
    syncPeriodizationToCloud(),
    syncLogbookToCloud()
  ]);

  return {
    success: results.every((result) => result.ok),
    results,
    syncedAt: new Date().toISOString()
  };
}
