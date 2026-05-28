export type SyncAction = 'create' | 'update' | 'delete' | 'archive';
export type SyncEntity = 'student' | 'workout' | 'logbook_set' | 'pr' | 'assessment' | 'checkin' | 'photo';

export type SyncQueueItem = {
  id: string;
  entity: SyncEntity;
  action: SyncAction;
  payload: unknown;
  status: 'pending' | 'syncing' | 'done' | 'failed';
  attempts: number;
  createdAt: string;
  updatedAt: string;
  error?: string;
};

const STORAGE_KEY = 'dg-team-offline-sync-queue';

function readQueue(): SyncQueueItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeQueue(queue: SyncQueueItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export function enqueueSync(entity: SyncEntity, action: SyncAction, payload: unknown) {
  const now = new Date().toISOString();
  const item: SyncQueueItem = {
    id: crypto.randomUUID(),
    entity,
    action,
    payload,
    status: 'pending',
    attempts: 0,
    createdAt: now,
    updatedAt: now
  };

  const next = [item, ...readQueue()];
  writeQueue(next);
  return item;
}

export function listSyncQueue() {
  return readQueue();
}

export function getPendingSyncQueue() {
  return readQueue().filter((item) => item.status === 'pending' || item.status === 'failed');
}

export function markSyncDone(itemId: string) {
  const now = new Date().toISOString();
  const next = readQueue().map((item) =>
    item.id === itemId ? { ...item, status: 'done' as const, updatedAt: now } : item
  );
  writeQueue(next);
  return next;
}

export function markSyncFailed(itemId: string, error: string) {
  const now = new Date().toISOString();
  const next = readQueue().map((item) =>
    item.id === itemId
      ? { ...item, status: 'failed' as const, attempts: item.attempts + 1, updatedAt: now, error }
      : item
  );
  writeQueue(next);
  return next;
}

export function clearCompletedSyncItems() {
  const next = readQueue().filter((item) => item.status !== 'done');
  writeQueue(next);
  return next;
}

export function getSyncSummary() {
  const queue = readQueue();
  return {
    total: queue.length,
    pending: queue.filter((item) => item.status === 'pending').length,
    failed: queue.filter((item) => item.status === 'failed').length,
    done: queue.filter((item) => item.status === 'done').length
  };
}
