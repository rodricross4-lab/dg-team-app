import { clearCompletedSyncItems, getPendingSyncQueue, getSyncSummary, markSyncDone, markSyncFailed, markSyncing } from './offlineSyncEngine';
import { isSupabaseReady } from './supabaseService';
import { syncQueueItemToSupabase } from './supabaseSyncAdapter';

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
      message: 'Sync pausado: app offline ou Supabase nao configurado.'
    };
  }

  const queue = getPendingSyncQueue();

  if (queue.length === 0) {
    const summary = getSyncSummary();

    return {
      processed: 0,
      done: 0,
      failed: 0,
      skipped: false,
      message: summary.blocked > 0
        ? 'Sync pausado: limite de tentativas atingido em alguns itens.'
        : 'Sync aguardando proxima tentativa.'
    };
  }

  let done = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      markSyncing(item.id);
      const result = await syncQueueItemToSupabase(item);

      if (!result.ok) {
        throw new Error(result.message);
      }

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
    message: failed > 0 ? 'Sync concluido com pendencias.' : 'Tudo sincronizado.'
  };
}

export function getSyncStatusLabel() {
  if (!navigator.onLine) return 'Offline mode ativo';
  if (!isSupabaseReady()) return 'Supabase pendente';
  return 'Pronto para sincronizar';
}
