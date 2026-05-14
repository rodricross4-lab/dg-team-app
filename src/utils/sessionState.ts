export type SessionStatus = 'nao_iniciado' | 'em_andamento' | 'finalizado';

export type SessionState = {
  status: SessionStatus;
  startedAt?: string;
  finishedAt?: string;
};

export function startSession(): SessionState {
  return {
    status: 'em_andamento',
    startedAt: new Date().toISOString()
  };
}

export function finishSession(state: SessionState): SessionState {
  return {
    ...state,
    status: 'finalizado',
    finishedAt: new Date().toISOString()
  };
}

export function getSessionDurationMinutes(state: SessionState): number {
  if (!state.startedAt || !state.finishedAt) return 0;

  const start = new Date(state.startedAt).getTime();
  const finish = new Date(state.finishedAt).getTime();

  return Math.max(0, Math.round((finish - start) / 60000));
}
