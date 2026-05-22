import type { SyncQueueItem } from './offlineSyncEngine';
import { getSupabaseClient, isSupabaseReady } from './supabaseService';

type AdapterResult = {
  ok: boolean;
  message: string;
};

function getTableName(entity: SyncQueueItem['entity']) {
  const tableMap: Record<SyncQueueItem['entity'], string> = {
    student: 'students',
    workout: 'workouts',
    logbook_set: 'logbook_sets',
    pr: 'prs',
    assessment: 'assessments',
    checkin: 'checkins',
    photo: 'photos'
  };

  return tableMap[entity];
}

function getPayloadId(payload: unknown) {
  if (payload && typeof payload === 'object' && 'id' in payload) {
    return String((payload as { id: string }).id);
  }

  return null;
}

export async function syncQueueItemToSupabase(item: SyncQueueItem): Promise<AdapterResult> {
  if (!isSupabaseReady()) {
    return {
      ok: false,
      message: 'Supabase não configurado.'
    };
  }

  const supabase = getSupabaseClient();
  const tableName = getTableName(item.entity);

  if (item.action === 'delete') {
    const id = getPayloadId(item.payload);

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

  const { error } = await supabase.from(tableName).upsert(item.payload as Record<string, unknown>);

  if (error) {
    return { ok: false, message: error.message };
  }

  return {
    ok: true,
    message: `${tableName} sincronizado na nuvem.`
  };
}
