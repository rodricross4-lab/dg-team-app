export type OfflineQueueItem = {
  id: string;
  type: 'student' | 'workout' | 'evaluation' | 'photo' | 'checkin';
  action: 'create' | 'update' | 'delete';
  payload: unknown;
  createdAt: string;
};

const QUEUE_KEY = 'dg-team-offline-queue';

export function getOfflineQueue(): OfflineQueueItem[] {
  const raw = localStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addToOfflineQueue(item: Omit<OfflineQueueItem, 'createdAt'>) {
  const queue = getOfflineQueue();
  const nextQueue = [
    ...queue,
    {
      ...item,
      createdAt: new Date().toISOString()
    }
  ];

  localStorage.setItem(QUEUE_KEY, JSON.stringify(nextQueue));
  return nextQueue;
}

export function clearOfflineQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

export function getOfflineQueueCount() {
  return getOfflineQueue().length;
}
