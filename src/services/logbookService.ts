import type { LogbookSet, WorkoutSession } from '../types';
import { calculateValidVolume, calculateVolumeLoad, isValidSet } from '../utils/dgTrainingRules';
import { enqueueSync } from './offlineSyncEngine';
import { getSupabaseMissingMessage, isSupabaseReady } from './supabaseService';

const SESSION_STORAGE_KEY = 'dg-team-workout-sessions';
const SET_STORAGE_KEY = 'dg-team-logbook-sets';

function nowIso() {
  return new Date().toISOString();
}

function readSessions(): WorkoutSession[] {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeSessions(sessions: WorkoutSession[]) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
}

function readLocalSets(): LogbookSet[] {
  try {
    const raw = localStorage.getItem(SET_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalSets(sets: LogbookSet[]) {
  localStorage.setItem(SET_STORAGE_KEY, JSON.stringify(sets));
}

export async function listWorkoutSessions(studentId?: string) {
  const all = readSessions();

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady()
      ? 'Sessões carregadas localmente. Sync Supabase pendente.'
      : getSupabaseMissingMessage(),
    data: studentId
      ? all.filter((session) => session.student_id === studentId)
      : all
  };
}

export async function startWorkoutSession(params: {
  tenant_id: string;
  student_id: string;
  workout_id: string;
  notes?: string;
}) {
  const timestamp = nowIso();

  const session: WorkoutSession = {
    id: crypto.randomUUID(),
    tenant_id: params.tenant_id,
    student_id: params.student_id,
    workout_id: params.workout_id,
    performed_at: timestamp,
    status: 'draft',
    notes: params.notes,
    created_at: timestamp,
    updated_at: timestamp,
  };

  const next = [session, ...readSessions()];
  writeSessions(next);

  enqueueSync('workout', 'create', session);

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady()
      ? 'Sessão iniciada localmente. Sync Supabase pendente.'
      : getSupabaseMissingMessage(),
    data: session
  };
}

export async function finishWorkoutSession(sessionId: string) {
  const timestamp = nowIso();
  let updatedSession: WorkoutSession | null = null;

  const next = readSessions().map((session) => {
    if (session.id !== sessionId) return session;

    updatedSession = {
      ...session,
      status: 'completed',
      updated_at: timestamp,
    };

    return updatedSession;
  });

  writeSessions(next);

  if (updatedSession) {
    enqueueSync('workout', 'update', updatedSession);
  }

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady()
      ? 'Sessão finalizada localmente. Sync Supabase pendente.'
      : getSupabaseMissingMessage(),
    data: updatedSession
  };
}

export async function listLogbookSets(studentId?: string) {
  const all = readLocalSets();
  const data = studentId ? all.filter((set) => set.student_id === studentId) : all;

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady()
      ? 'Sets carregados localmente. Sync Supabase pendente.'
      : getSupabaseMissingMessage(),
    data
  };
}

export async function saveLogbookSet(set: Omit<LogbookSet, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<LogbookSet, 'id'>>) {
  const current = readLocalSets();
  const timestamp = nowIso();

  const normalized: LogbookSet = {
    ...set,
    id: set.id || crypto.randomUUID(),
    created_at: current.find((item) => item.id === set.id)?.created_at || timestamp,
    updated_at: timestamp,
  };

  const exists = current.some((item) => item.id === normalized.id);

  const next = exists
    ? current.map((item) => (item.id === normalized.id ? normalized : item))
    : [normalized, ...current];

  writeLocalSets(next);

  enqueueSync('logbook_set', exists ? 'update' : 'create', normalized);

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady()
      ? 'Set salvo localmente. Sync Supabase pendente.'
      : getSupabaseMissingMessage(),
    data: normalized
  };
}

export async function deleteLogbookSet(setId: string) {
  const next = readLocalSets().filter((set) => set.id !== setId);

  writeLocalSets(next);

  enqueueSync('logbook_set', 'delete', { id: setId });

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady()
      ? 'Set removido localmente. Sync Supabase pendente.'
      : getSupabaseMissingMessage(),
    data: next
  };
}

export function getValidSets(sets: LogbookSet[]) {
  return sets.filter(isValidSet);
}

export function getEffectiveVolume(sets: LogbookSet[]) {
  return calculateValidVolume(sets);
}

export function getVolumeLoad(sets: LogbookSet[]) {
  return calculateVolumeLoad(sets);
}
