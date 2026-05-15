import { supabase, isSupabaseConfigured } from './supabaseClient';
import { runRealtimeOrchestrator, type RealtimeEventType } from '../engines/realtimeOrchestratorEngine';

export type RealtimeSubscriptionConfig = {
  studentId?: string;
  onEvent?: (event: unknown) => void;
  onOrchestrated?: (result: ReturnType<typeof runRealtimeOrchestrator>) => void;
};

const tableToEvent: Record<string, RealtimeEventType> = {
  logbook_entries: 'logbook_updated',
  checkins: 'checkin_saved',
  assessments: 'assessment_saved',
  workouts: 'workout_saved',
  students: 'student_updated'
};

export function subscribeToCoachRealtime(config: RealtimeSubscriptionConfig = {}) {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      ok: false,
      message: 'Supabase não configurado. Realtime indisponível.',
      unsubscribe: () => undefined
    };
  }

  const channel = supabase.channel('dg-team-coach-realtime');

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

        const eventType = tableToEvent[table];
        const studentId = String((payload.new as any)?.student_id || (payload.new as any)?.id || config.studentId || 'unknown');

        const result = runRealtimeOrchestrator({
          eventType,
          studentId,
          studentName: 'Aluno DG',
          notification: {
            studentId,
            studentName: 'Aluno DG',
            checkinLate: eventType === 'checkin_saved' ? false : undefined,
            performanceDrop: eventType === 'logbook_updated' ? false : undefined,
            assessmentPending: eventType !== 'assessment_saved'
          },
          automation: {
            studentId,
            studentName: 'Aluno DG',
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

  channel.subscribe();

  return {
    ok: true,
    message: 'Realtime DG TEAM ativo.',
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
}
