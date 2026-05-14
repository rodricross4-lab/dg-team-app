export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return 'unsupported';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  return Notification.requestPermission();
}

export function notifyRestFinished() {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification('DG TEAM', {
      body: 'Descanso finalizado. Próxima série.',
      silent: false
    });
  }
}

export function notifyTrainingSaved(studentName: string) {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification('Treino salvo', {
      body: `${studentName}: logbook, volume e IA atualizados.`
    });
  }
}
