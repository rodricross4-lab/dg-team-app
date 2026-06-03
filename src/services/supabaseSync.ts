import { loadAppStore } from '../store/appStore';
import { loadOperationalStore } from '../store/operationalStore';
import { getStoredLogbookSets, getStoredWorkoutSessions } from './logbookService';
import { getStoredProgressPhotos, toSupabasePhotoPayload } from './photoService';
import { isSupabaseConfigured, supabase } from './supabaseClient';

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

async function safeUpsert(module: string, table: string, rows: Record<string, unknown>[]) {
  if (!isSupabaseConfigured() || !supabase) return getCloudDisabledResult(module);
  if (rows.length === 0) return getCloudResult(module, true, 0, `${module}: nenhum registro para sincronizar.`);

  const { error } = await supabase.from(table).upsert(rows);

  if (error) return getCloudResult(module, false, rows.length, error.message);
  return getCloudResult(module, true, rows.length, `${module}: ${rows.length} registro(s) sincronizados.`);
}

function parseNumber(value?: string) {
  if (!value?.trim()) return null;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function cleanNumberMap(values: Record<string, number | null>) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== null)
  );
}

export async function syncStudentsToCloud() {
  const store = loadAppStore();
  const rows = store.students.map((student) => ({
    id: student.id,
    tenant_id: student.tenant_id,
    coach_id: student.coach_id,
    user_id: student.user_id ?? null,
    name: student.name,
    email: student.email ?? null,
    phone: student.phone ?? null,
    birth_date: student.birth_date ?? null,
    age: student.age ?? null,
    weight_kg: student.weight_kg ?? null,
    height_cm: student.height_cm ?? null,
    goal: student.goal,
    phase: student.phase,
    training_frequency: student.training_frequency,
    priority_muscles: student.priority_muscles,
    alerts: student.alerts ?? [],
    status: student.status,
    created_at: student.created_at,
    updated_at: student.updated_at,
    deleted_at: student.deleted_at ?? null
  }));

  return safeUpsert('students', 'students', rows);
}

export async function syncWorkoutsToCloud() {
  const store = loadOperationalStore();
  const students = new Map(loadAppStore().students.map((student) => [student.id, student]));
  const rows = store.workouts.flatMap((workout) => {
    const student = students.get(workout.studentId);
    if (!student?.tenant_id) return [];

    return [{
      id: workout.id,
      tenant_id: student.tenant_id,
      coach_id: student.coach_id,
      student_id: workout.studentId,
      week: workout.week,
      name: workout.name,
      exercises: workout.exercises || [],
      is_active: true,
      updated_at: workout.updatedAt || new Date().toISOString()
    }];
  });

  return safeUpsert('workouts', 'workouts', rows);
}

export async function syncAssessmentsToCloud() {
  const store = loadOperationalStore();
  const students = new Map(loadAppStore().students.map((student) => [student.id, student]));
  const rows = store.assessments.flatMap((assessment) => {
    const student = students.get(assessment.studentId);
    if (!student?.tenant_id) return [];

    const weight = parseNumber(assessment.weight);
    const bodyFat = parseNumber(assessment.bodyFat);
    const leanMass = weight !== null && bodyFat !== null
      ? Math.round(weight * (1 - bodyFat / 100) * 10) / 10
      : null;

    return [{
      id: `${assessment.studentId}-assessment-week-${assessment.week}`,
      tenant_id: student.tenant_id,
      student_id: assessment.studentId,
      protocol: assessment.protocol || 'custom',
      week: assessment.week,
      weight_kg: weight,
      body_fat_percentage: bodyFat,
      lean_mass_kg: leanMass,
      circumference: cleanNumberMap({
        waist: parseNumber(assessment.waist),
        abdomen: parseNumber(assessment.abdomen),
        hip: parseNumber(assessment.hip),
        chest: parseNumber(assessment.chest),
        flexed_arm: parseNumber(assessment.arm),
        thigh: parseNumber(assessment.thigh),
        calf: parseNumber(assessment.calf)
      }),
      skinfolds: {},
      notes: assessment.notes || null,
      created_at: assessment.createdAt || assessment.updatedAt || new Date().toISOString(),
      updated_at: assessment.updatedAt || new Date().toISOString()
    }];
  });

  return safeUpsert('assessments', 'assessments', rows);
}

export async function syncPeriodizationToCloud() {
  const store = loadOperationalStore();
  const students = new Map(loadAppStore().students.map((student) => [student.id, student]));
  const rows = store.periodization.flatMap((week) => {
    const student = students.get(week.studentId);
    if (!student?.tenant_id) return [];

    return [{
      id: `${week.studentId}-periodization-week-${week.week}`,
      tenant_id: student.tenant_id,
      student_id: week.studentId,
      week: week.week,
      focus: week.focus,
      intensity: week.intensity,
      volume: week.volume,
      deload: week.deload,
      notes: week.notes,
      updated_at: week.updatedAt || new Date().toISOString()
    }];
  });

  return safeUpsert('periodization', 'periodization_weeks', rows);
}

export async function syncLogbookToCloud() {
  const rows = getStoredLogbookSets().map((set) => ({ ...set }));

  return safeUpsert('logbook', 'logbook_sets', rows);
}

export async function syncWorkoutSessionsToCloud() {
  const rows = getStoredWorkoutSessions().map((session) => ({ ...session }));

  return safeUpsert('workout_sessions', 'workout_sessions', rows);
}

export async function syncPhotosToCloud() {
  const rows = getStoredProgressPhotos()
    .filter((photo) => Boolean(photo.tenant_id))
    .map((photo) => toSupabasePhotoPayload(photo));

  return safeUpsert('photos', 'photos', rows);
}

export async function runFullCloudSync() {
  const results = await Promise.all([
    syncStudentsToCloud(),
    syncWorkoutsToCloud(),
    syncWorkoutSessionsToCloud(),
    syncAssessmentsToCloud(),
    syncPeriodizationToCloud(),
    syncLogbookToCloud(),
    syncPhotosToCloud()
  ]);

  return {
    success: results.every((result) => result.ok),
    results,
    syncedAt: new Date().toISOString()
  };
}
