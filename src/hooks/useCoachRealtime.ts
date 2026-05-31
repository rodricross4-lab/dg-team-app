import { useEffect, useState } from 'react';
import { subscribeToCoachRealtime } from '../services/realtimeService';
import { resolveTenantContext } from '../services/tenantContextService';
import type { RealtimeOrchestratorResult } from '../engines/realtimeOrchestratorEngine';

export function useCoachRealtime(studentId?: string) {
  const [status, setStatus] = useState('Realtime não iniciado');
  const [events, setEvents] = useState<unknown[]>([]);
  const [orchestrated, setOrchestrated] = useState<RealtimeOrchestratorResult[]>([]);

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => undefined;

    resolveTenantContext()
      .then((context) => {
        if (!active) return;

        const subscription = subscribeToCoachRealtime({
          tenantId: context.tenant_id,
          studentId,
          onEvent: (event) => {
            setEvents((current) => [event, ...current].slice(0, 20));
          },
          onOrchestrated: (result) => {
            setOrchestrated((current) => [result, ...current].slice(0, 20));
          }
        });

        unsubscribe = subscription.unsubscribe;
        setStatus(context.warning || subscription.message);
      })
      .catch((error) => {
        if (active) setStatus(error instanceof Error ? error.message : 'Realtime indisponivel.');
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [studentId]);

  return {
    status,
    events,
    orchestrated,
    latest: orchestrated[0]
  };
}
