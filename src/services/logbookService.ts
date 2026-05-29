import type { ExerciseSessionGroup, LogbookSet, WorkoutSession } from '../types';
import { calculateValidVolume, calculateVolumeLoad, getBestValidSet, isValidSet } from '../utils/dgTrainingRules';
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

export function getStoredWorkoutSessions(studentId?: string) {
  const sessions = readSessions();
  return studentId ? sessions.filter((session) => session.student_id === studentId) : sessions;
}

export function getStoredLogbookSets(studentId?: string) {
  const sets = readLocalSets();
  return studentId ? sets.filter((set) => set.student_id === studentId) : sets;
}

export async function listWorkoutSessions(studentId?: string) {
  const all = getStoredWorkoutSessions();

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
  const all = getStoredLogbookSets();
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

export function getExerciseHistory(studentId: string, exerciseId: string) {
  return getStoredLogbookSets(studentId)
    .filter((set) => set.exercise_id === exerciseId && isValidSet(set))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function getExerciseSessionGroups(studentId: string, exerciseId: string): ExerciseSessionGroup[] {
  const sessions = getStoredWorkoutSessions(studentId);
  const sessionsById = new Map(sessions.map((session) => [session.id, session]));
  const grouped = new Map<string, LogbookSet[]>();

  getExerciseHistory(studentId, exerciseId).forEach((set) => {
    const current = grouped.get(set.session_id) || [];
    grouped.set(set.session_id, [...current, set]);
  });

  return Array.from(grouped.entries())
    .map(([sessionId, sets]) => {
      const session = sessionsById.get(sessionId);
      const performedAt = session?.performed_at || sets[0]?.created_at || '';

      return {
        session_id: sessionId,
        performed_at: performedAt,
        sets,
        validSets: calculateValidVolume(sets),
        volumeLoad: calculateVolumeLoad(sets),
        bestSet: getBestValidSet(sets),
      };
    })
    .sort((a, b) => new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime());
}

export function getPreviousExerciseSets(studentId: string, exerciseId: string, currentSessionId: string) {
  const currentSession = getStoredWorkoutSessions(studentId).find((session) => session.id === currentSessionId);
  const currentTime = currentSession ? new Date(currentSession.performed_at).getTime() : Number.POSITIVE_INFINITY;

  const previousGroup = getExerciseSessionGroups(studentId, exerciseId).find((group) => {
    if (group.session_id === currentSessionId) return false;
    return new Date(group.performed_at).getTime() <= currentTime;
  });

  return previousGroup?.sets || [];
}
