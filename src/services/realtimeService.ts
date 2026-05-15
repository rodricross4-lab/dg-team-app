import { supabase, isSupabaseConfigured } from './supabaseClient';
import { runRealtimeOrchestrator, type RealtimeEventType, type RealtimeOrchestratorResult } from '../engines/realtimeOrchestratorEngine';

export type RealtimeSubscriptionConfig = {
  studentId?: string;
  onEvent?: (event: unknown) => void;
  onOrchestrated?: (result: RealtimeOrchestratorResult) => void;
};

type RealtimePayloadRow = {
  id?: string;
  student_id?: string;
  name?: string;
};

const tableToEvent: Record<string, RealtimeEventType> = {
  logbook_entries: 'logbook_updated',
  checkins: 'checkin_saved',
  assessments: 'assessment_saved',
  workouts: 'workout_saved',
  students: 'student_updated'
};

function getPayloadRow(payload: { new?: unknown }): RealtimePayloadRow {
  if (payload.new && typeof payload.new === 'object') return payload.new as RealtimePayloadRow;
  return {};
}

export function subscribeToCoachRealtime(config: RealtimeSubscriptionConfig = {}) {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      ok: false,
      message: 'Supabase não configurado. Realtime indisponível.',
      unsubscribe: () => undefined
    };
  }

  const client = supabase;
  const channel = client.channel('dg-team-coach-realtime');

  Object.keys(tableToEvent).forEach((table) => {
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table
      },
      (payload) => {
        config.onEvent?.(payload);

        const row = getPayloadRow(payload);
        const eventType = tableToEvent[table];
        const studentId = String(row.student_id || row.id || config.studentId || 'unknown');
        const studentName = row.name || 'Aluno DG';

        const result = runRealtimeOrchestrator({
          eventType,
          studentId,
          studentName,
          notification: {
            studentId,
            studentName,
            checkinLate: eventType === 'checkin_saved' ? false : undefined,
            performanceDrop: eventType === 'logbook_updated' ? false : undefined,
            assessmentPending: eventType !== 'assessment_saved'
          },
          automation: {
            studentId,
            studentName,
            validSets: eventType === 'logbook_updated' ? 1 : 0,
            executionQuality: 85,
            assessmentsPending: eventType !== 'assessment_saved',
            performanceDrop: false,
            plateau: false
          }
        });

        config.onOrchestrated?.(result);
      }
    );
  });

  void channel.subscribe();

  return {
    ok: true,
    message: 'Realtime DG TEAM ativo.',
    unsubscribe: () => {
      void client.removeChannel(channel);
    }
  };
}
