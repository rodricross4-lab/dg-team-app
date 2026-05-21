import { clearCompletedSyncItems, getPendingSyncQueue, markSyncDone, markSyncFailed } from './offlineSyncEngine';
import { isSupabaseReady } from './supabaseService';

export type SyncProcessorResult = {
  processed: number;
  done: number;
  failed: number;
  skipped: boolean;
  message: string;
};

export function canSyncNow() {
  return isSupabaseReady() && navigator.onLine;
}

export async function processSyncQueue(): Promise<SyncProcessorResult> {
  if (!canSyncNow()) {
    return {
      processed: 0,
      done: 0,
      failed: 0,
      skipped: true,
      message: 'Sync pausado: app offline ou Supabase não configurado.'
    };
  }

  const queue = getPendingSyncQueue();
  let done = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      // Próxima etapa: trocar este mock pelo upsert/delete real no Supabase.
      markSyncDone(item.id);
      done += 1;
    } catch (error) {
      markSyncFailed(item.id, error instanceof Error ? error.message : 'Erro desconhecido no sync.');
      failed += 1;
    }
  }

  clearCompletedSyncItems();

  return {
    processed: queue.length,
    done,
    failed,
    skipped: false,
    message: failed > 0 ? 'Sync concluído com pendências.' : 'Tudo sincronizado.'
  };
}

export function getSyncStatusLabel() {
  if (!navigator.onLine) return 'Offline mode ativo';
  if (!isSupabaseReady()) return 'Supabase pendente';
  return 'Pronto para sincronizar';
}
