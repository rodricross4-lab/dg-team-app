import { useEffect, useState } from 'react';
import { subscribeToCoachRealtime } from '../services/realtimeService';
import { getTenantContext } from '../services/tenantContextService';
import type { RealtimeOrchestratorResult } from '../engines/realtimeOrchestratorEngine';

export function useCoachRealtime(studentId?: string) {
  const [status, setStatus] = useState('Realtime não iniciado');
  const [events, setEvents] = useState<unknown[]>([]);
  const [orchestrated, setOrchestrated] = useState<RealtimeOrchestratorResult[]>([]);

  useEffect(() => {
    const context = getTenantContext();
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

    setStatus(subscription.message);

    return () => {
      subscription.unsubscribe();
    };
  }, [studentId]);

  return {
    status,
    events,
    orchestrated,
    latest: orchestrated[0]
  };
}
