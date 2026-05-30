import type { SupabaseClient } from '@supabase/supabase-js';
import type { SyncQueueItem } from './offlineSyncEngine';
import { getSupabaseClient, isSupabaseReady } from './supabaseService';

type AdapterResult = {
  ok: boolean;
  message: string;
};

type SyncPayload = Record<string, unknown>;
type ConflictResult = { ok: true; skip: boolean; message?: string } | { ok: false; message: string };

function isPayload(value: unknown): value is SyncPayload {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getPayload(item: SyncQueueItem): SyncPayload {
  if (!isPayload(item.payload)) {
    throw new Error(`Payload invalido para ${item.entity}.`);
  }

  return item.payload;
}

function getPayloadId(payload: SyncPayload) {
  return typeof payload.id === 'string' && payload.id ? payload.id : null;
}

function getPayloadUpdatedAt(payload: SyncPayload, fallback?: string) {
  const value = payload.updated_at ?? payload.updatedAt;
  if (typeof value === 'string' && value) return value;
  return fallback ?? null;
}

function parseTimestamp(value: string | null) {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function ensureUpdatedAt(payload: SyncPayload, fallback: string): SyncPayload {
  if (getPayloadUpdatedAt(payload)) return payload;
  return { ...payload, updated_at: fallback };
}

async function getRemoteConflict(
  supabase: SupabaseClient,
  tableName: string,
  payload: SyncPayload,
  fallbackUpdatedAt: string
): Promise<ConflictResult> {
  const id = getPayloadId(payload);
  if (!id) return { ok: true, skip: false };

  const localUpdatedAt = parseTimestamp(getPayloadUpdatedAt(payload, fallbackUpdatedAt));
  if (!localUpdatedAt) return { ok: true, skip: false };

  const { data, error } = await supabase
    .from(tableName)
    .select('id, updated_at')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }

  if (!isPayload(data)) return { ok: true, skip: false };

  const remoteUpdatedAt = parseTimestamp(getPayloadUpdatedAt(data));
  if (remoteUpdatedAt && remoteUpdatedAt > localUpdatedAt) {
    return {
      ok: true,
      skip: true,
      message: `${tableName} ignorado: registro remoto mais recente.`
    };
  }

  return { ok: true, skip: false };
}

function isWorkoutSessionPayload(payload: SyncPayload) {
  return 'performed_at' in payload || ('status' in payload && 'workout_id' in payload);
}

function getTableName(item: SyncQueueItem) {
  const payload = isPayload(item.payload) ? item.payload : {};

  if (item.entity === 'workout' && isWorkoutSessionPayload(payload)) {
    return 'workout_sessions';
  }

  const tableMap: Record<SyncQueueItem['entity'], string> = {
    student: 'students',
    workout: 'workouts',
    workout_session: 'workout_sessions',
    logbook_set: 'logbook_sets',
    pr: 'prs',
    assessment: 'assessments',
    checkin: 'checkins',
    photo: 'photos'
  };

  return tableMap[item.entity];
}

function mapWorkoutPayload(payload: SyncPayload): SyncPayload {
  if ('studentId' in payload || 'updatedAt' in payload) {
    return {
      id: payload.id,
      student_id: payload.studentId,
      week: payload.week,
      name: payload.name,
      notes: payload.notes ?? null,
      exercises: payload.exercises ?? [],
      updated_at: payload.updatedAt ?? new Date().toISOString()
    };
  }

  return payload;
}

function mapPayloadForSupabase(item: SyncQueueItem, tableName: string): SyncPayload {
  const payload = getPayload(item);

  if (tableName === 'workouts') {
    return mapWorkoutPayload(payload);
  }

  return payload;
}

export async function syncQueueItemToSupabase(item: SyncQueueItem): Promise<AdapterResult> {
  if (!isSupabaseReady()) {
    return {
      ok: false,
      message: 'Supabase nao configurado.'
    };
  }

  const supabase = getSupabaseClient();
  const tableName = getTableName(item);
  const payload = getPayload(item);

  if (item.action === 'delete') {
    const id = getPayloadId(payload);

    if (!id) {
      return {
        ok: false,
        message: `Delete sem ID para ${tableName}.`
      };
    }

    const conflict = await getRemoteConflict(supabase, tableName, payload, item.updatedAt);
    if (!conflict.ok) return conflict;
    if (conflict.skip) {
      return {
        ok: true,
        message: conflict.message ?? `${tableName} mantido na nuvem.`
      };
    }

    const { error } = await supabase.from(tableName).delete().eq('id', id);

    if (error) {
      return { ok: false, message: error.message };
    }

    return {
      ok: true,
      message: `${tableName} removido da nuvem.`
    };
  }

  if (item.action === 'archive') {
    const id = getPayloadId(payload);

    if (!id) {
      return {
        ok: false,
        message: `Archive sem ID para ${tableName}.`
      };
    }

    const archiveUpdate: SyncPayload = {
      status: 'inactive',
      deleted_at: payload.deleted_at ?? new Date().toISOString(),
      updated_at: payload.updated_at ?? new Date().toISOString()
    };
    const conflict = await getRemoteConflict(supabase, tableName, { id, ...archiveUpdate }, item.updatedAt);
    if (!conflict.ok) return conflict;
    if (conflict.skip) {
      return {
        ok: true,
        message: conflict.message ?? `${tableName} mantido na nuvem.`
      };
    }

    const { error } = await supabase
      .from(tableName)
      .update(archiveUpdate)
      .eq('id', id);

    if (error) {
      return { ok: false, message: error.message };
    }

    return {
      ok: true,
      message: `${tableName} arquivado na nuvem.`
    };
  }

  const row = ensureUpdatedAt(mapPayloadForSupabase(item, tableName), item.updatedAt);
  const conflict = await getRemoteConflict(supabase, tableName, row, item.updatedAt);
  if (!conflict.ok) return conflict;
  if (conflict.skip) {
    return {
      ok: true,
      message: conflict.message ?? `${tableName} mantido na nuvem.`
    };
  }

  const { error } = await supabase.from(tableName).upsert(row);

  if (error) {
    return { ok: false, message: error.message };
  }

  return {
    ok: true,
    message: `${tableName} sincronizado na nuvem.`
  };
}
