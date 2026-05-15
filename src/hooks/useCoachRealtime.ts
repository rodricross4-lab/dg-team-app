import { useEffect, useState } from 'react';
import { subscribeToCoachRealtime } from '../services/realtimeService';
import type { RealtimeOrchestratorResult } from '../engines/realtimeOrchestratorEngine';

export function useCoachRealtime() {
  const [status, setStatus] = useState('Realtime não iniciado');
  const [events, setEvents] = useState<unknown[]>([]);
  const [orchestrated, setOrchestrated] = useState<RealtimeOrchestratorResult[]>([]);

  useEffect(() => {
    const subscription = subscribeToCoachRealtime({
      onEvent: (event) => {
        setEvents((current) => [event, ...current].slice(0, 20));
      },
      onOrchestrated: (result) => {
        setOrchestrated((current) => [result, ...current].slice(0, 20));
      }
    });

    setStatus(subscription.message);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    status,
    events,
    orchestrated,
    latest: orchestrated[0]
  };
}
