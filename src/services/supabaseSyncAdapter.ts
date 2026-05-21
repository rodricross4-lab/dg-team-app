import type { SyncQueueItem } from './offlineSyncEngine';
import { isSupabaseReady } from './supabaseService';

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

export async function syncQueueItemToSupabase(item: SyncQueueItem): Promise<AdapterResult> {
  if (!isSupabaseReady()) {
    return {
      ok: false,
      message: 'Supabase não configurado.'
    };
  }

  const tableName = getTableName(item.entity);

  // Próxima etapa: substituir por chamadas reais usando o Supabase client.
  // Mantemos o adapter separado para evitar acoplar o processador ao banco.
  return {
    ok: true,
    message: `${item.action} preparado para ${tableName}`
  };
}
