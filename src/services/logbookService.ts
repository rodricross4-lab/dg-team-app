import { enqueueSync } from './offlineSyncEngine';
import { getSupabaseMissingMessage, isSupabaseReady } from './supabaseService';

export type LogbookSetRecord = {
  id: string;
  studentId: string;
  workoutId?: string;
  exerciseId?: string;
  exerciseName?: string;
  setKind: 'warmup' | 'feeder' | 'working' | 'backoff';
  load: number;
  reps: number;
  rir?: number;
  executionQuality?: 'low' | 'ok' | 'high';
  notes?: string;
  performedAt: string;
};

const STORAGE_KEY = 'dg-team-logbook-sets';

function readLocalSets(): LogbookSetRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalSets(sets: LogbookSetRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
}

export async function listLogbookSets(studentId?: string) {
  const all = readLocalSets();
  const data = studentId ? all.filter((set) => set.studentId === studentId) : all;

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady() ? 'Sets carregados localmente. Sync Supabase pendente.' : getSupabaseMissingMessage(),
    data
  };
}

export async function saveLogbookSet(set: Omit<LogbookSetRecord, 'id' | 'performedAt'> & Partial<Pick<LogbookSetRecord, 'id' | 'performedAt'>>) {
  const current = readLocalSets();
  const normalized: LogbookSetRecord = {
    ...set,
    id: set.id || crypto.randomUUID(),
    performedAt: set.performedAt || new Date().toISOString()
  };

  const exists = current.some((item) => item.id === normalized.id);
  const next = exists
    ? current.map((item) => (item.id === normalized.id ? normalized : item))
    : [normalized, ...current];

  writeLocalSets(next);
  enqueueSync('logbook_set', exists ? 'update' : 'create', normalized);

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady() ? 'Set salvo localmente. Sync Supabase pendente.' : getSupabaseMissingMessage(),
    data: normalized
  };
}

export async function deleteLogbookSet(setId: string) {
  const next = readLocalSets().filter((set) => set.id !== setId);
  writeLocalSets(next);
  enqueueSync('logbook_set', 'delete', { id: setId });

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady() ? 'Set removido localmente. Sync Supabase pendente.' : getSupabaseMissingMessage(),
    data: next
  };
}

export function getEffectiveSets(sets: LogbookSetRecord[]) {
  return sets.filter((set) => set.setKind === 'working' || set.setKind === 'backoff');
}

export function getVolumeLoad(sets: LogbookSetRecord[]) {
  return getEffectiveSets(sets).reduce((total, set) => total + set.load * set.reps, 0);
}
