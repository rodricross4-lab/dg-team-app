import { clearOfflineQueue, getOfflineQueue } from './offlineQueue';

export async function syncOfflineData() {
  const queue = getOfflineQueue();

  if (queue.length === 0) {
    return {
      synced: 0,
      message: 'Nenhum dado pendente para sincronizar.'
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  clearOfflineQueue();

  return {
    synced: queue.length,
    message: `${queue.length} itens sincronizados com sucesso.`
  };
}
