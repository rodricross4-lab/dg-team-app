export type SyncAction = 'create' | 'update' | 'delete' | 'archive';
export type SyncEntity = 'student' | 'workout' | 'workout_session' | 'logbook_set' | 'pr' | 'assessment' | 'checkin' | 'photo';

export type SyncQueueItem = {
  id: string;
  entity: SyncEntity;
  action: SyncAction;
  payload: unknown;
  status: 'pending' | 'syncing' | 'done' | 'failed';
  attempts: number;
  createdAt: string;
  updatedAt: string;
  nextRetryAt?: string;
  error?: string;
};

const STORAGE_KEY = 'dg-team-offline-sync-queue';
export const MAX_SYNC_ATTEMPTS = 5;
const BASE_RETRY_DELAY_MS = 15000;
const MAX_RETRY_DELAY_MS = 5 * 60 * 1000;

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

function getRetryDelayMs(attempts: number) {
  return Math.min(BASE_RETRY_DELAY_MS * 2 ** Math.max(attempts - 1, 0), MAX_RETRY_DELAY_MS);
}

function getNextRetryAt(attempts: number) {
  if (attempts >= MAX_SYNC_ATTEMPTS) return undefined;
  return new Date(Date.now() + getRetryDelayMs(attempts)).toISOString();
}

function isRetryReady(item: SyncQueueItem, nowMs = Date.now()) {
  if (item.status === 'pending') return true;
  if (item.status !== 'failed') return false;
  if (item.attempts >= MAX_SYNC_ATTEMPTS) return false;
  if (!item.nextRetryAt) return true;
  return new Date(item.nextRetryAt).getTime() <= nowMs;
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
  const nowMs = Date.now();
  return readQueue().filter((item) => isRetryReady(item, nowMs));
}

export function markSyncing(itemId: string) {
  const now = new Date().toISOString();
  const next = readQueue().map((item) =>
    item.id === itemId ? { ...item, status: 'syncing' as const, updatedAt: now, nextRetryAt: undefined } : item
  );
  writeQueue(next);
  return next;
}

export function markSyncDone(itemId: string) {
  const now = new Date().toISOString();
  const next = readQueue().map((item) =>
    item.id === itemId ? { ...item, status: 'done' as const, updatedAt: now, nextRetryAt: undefined, error: undefined } : item
  );
  writeQueue(next);
  return next;
}

export function markSyncFailed(itemId: string, error: string) {
  const now = new Date().toISOString();
  const next = readQueue().map((item) =>
    item.id === itemId ? (() => {
      const attempts = item.attempts + 1;
      return {
        ...item,
        status: 'failed' as const,
        attempts,
        updatedAt: now,
        nextRetryAt: getNextRetryAt(attempts),
        error,
      };
    })() : item
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
    retryReady: queue.filter((item) => isRetryReady(item)).length,
    blocked: queue.filter((item) => item.status === 'failed' && item.attempts >= MAX_SYNC_ATTEMPTS).length,
    done: queue.filter((item) => item.status === 'done').length
  };
}
