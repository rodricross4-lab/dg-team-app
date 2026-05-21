import { getSyncSummary } from './offlineSyncEngine';
import { processSyncQueue } from './syncProcessor';

let syncIntervalId: number | undefined;
let isRunning = false;

export function startAutoSync(intervalMs = 30000) {
  if (syncIntervalId) return;

  window.addEventListener('online', runAutoSyncOnce);
  syncIntervalId = window.setInterval(runAutoSyncOnce, intervalMs);
  runAutoSyncOnce();
}

export function stopAutoSync() {
  if (syncIntervalId) {
    window.clearInterval(syncIntervalId);
    syncIntervalId = undefined;
  }

  window.removeEventListener('online', runAutoSyncOnce);
}

export async function runAutoSyncOnce() {
  if (isRunning) return;
  if (!navigator.onLine) return;

  const summary = getSyncSummary();
  if (summary.pending === 0 && summary.failed === 0) return;

  isRunning = true;

  try {
    await processSyncQueue();
  } finally {
    isRunning = false;
  }
}

export function getAutoSyncStatus() {
  return {
    active: Boolean(syncIntervalId),
    running: isRunning,
    online: navigator.onLine,
    queue: getSyncSummary()
  };
}
