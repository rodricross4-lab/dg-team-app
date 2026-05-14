import { loadAppStore } from '../store/appStore';
import { loadOperationalStore } from '../store/operationalStore';
import { isSupabaseConfigured } from './supabaseClient';

const LOG_KEY = 'dg-team-logbook-store';

function loadLogbookKeys() {
  return Object.keys(localStorage).filter((key) => key.startsWith(LOG_KEY));
}

function getCloudDisabledResult(module: string) {
  return {
    module,
    ok: false,
    message: 'Supabase ainda não configurado. Dados seguem salvos localmente.',
    syncedAt: new Date().toISOString()
  };
}

function getCloudReadyResult(module: string, count: number) {
  return {
    module,
    ok: true,
    count,
    message: `${module}: ${count} registro(s) prontos para sincronização cloud.`,
    syncedAt: new Date().toISOString()
  };
}

export async function syncStudentsToCloud() {
  const store = loadAppStore();
  if (!isSupabaseConfigured()) return getCloudDisabledResult('students');
  return getCloudReadyResult('students', store.students.length);
}

export async function syncWorkoutsToCloud() {
  const store = loadOperationalStore();
  if (!isSupabaseConfigured()) return getCloudDisabledResult('workouts');
  return getCloudReadyResult('workouts', store.workouts.length);
}

export async function syncAssessmentsToCloud() {
  const store = loadOperationalStore();
  if (!isSupabaseConfigured()) return getCloudDisabledResult('assessments');
  return getCloudReadyResult('assessments', store.assessments.length);
}

export async function syncPeriodizationToCloud() {
  const store = loadOperationalStore();
  if (!isSupabaseConfigured()) return getCloudDisabledResult('periodization');
  return getCloudReadyResult('periodization', store.periodization.length);
}

export async function syncLogbookToCloud() {
  const logbookKeys = loadLogbookKeys();
  if (!isSupabaseConfigured()) return getCloudDisabledResult('logbook');
  return getCloudReadyResult('logbook', logbookKeys.length);
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
