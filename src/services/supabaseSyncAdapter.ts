import type { SyncQueueItem } from './offlineSyncEngine';
import { getSupabaseClient, isSupabaseReady } from './supabaseService';

type AdapterResult = {
  ok: boolean;
  message: string;
};

type SyncPayload = Record<string, unknown>;

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

    const { error } = await supabase
      .from(tableName)
      .update({
        status: 'inactive',
        deleted_at: payload.deleted_at ?? new Date().toISOString(),
        updated_at: payload.updated_at ?? new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      return { ok: false, message: error.message };
    }

    return {
      ok: true,
      message: `${tableName} arquivado na nuvem.`
    };
  }

  const row = mapPayloadForSupabase(item, tableName);
  const { error } = await supabase.from(tableName).upsert(row);

  if (error) {
    return { ok: false, message: error.message };
  }

  return {
    ok: true,
    message: `${tableName} sincronizado na nuvem.`
  };
}
