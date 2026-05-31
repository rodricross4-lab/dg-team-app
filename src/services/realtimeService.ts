import type { RealtimeChannel } from '@supabase/supabase-js';
import type { LogbookSet, Student, WorkoutSession } from '../types';
import { runRealtimeOrchestrator, type RealtimeEventType, type RealtimeOrchestratorResult } from '../engines/realtimeOrchestratorEngine';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { getTenantContext } from './tenantContextService';

export type RealtimePayload<T> = {
  table: string;
  eventType?: string;
  new?: T;
  old?: Partial<T>;
};

export type RealtimeSubscription = {
  ok: boolean;
  message: string;
  unsubscribe: () => void;
};

export type RealtimeSubscriptionConfig = {
  tenantId?: string;
  studentId?: string;
  onEvent?: (event: RealtimePayload<Record<string, unknown>>) => void;
  onOrchestrated?: (result: RealtimeOrchestratorResult) => void;
};

type RealtimePayloadRow = {
  id?: string;
  student_id?: string;
  name?: string;
};

const activeChannels: RealtimeChannel[] = [];

const tableToEvent: Record<string, RealtimeEventType> = {
  logbook_sets: 'logbook_updated',
  checkins: 'checkin_saved',
  assessments: 'assessment_saved',
  workout_sessions: 'workout_saved',
  workouts: 'workout_saved',
  students: 'student_updated',
};

function disabledSubscription(message = 'Supabase não configurado. Realtime indisponível.'): RealtimeSubscription {
  return {
    ok: false,
    message,
    unsubscribe: () => undefined,
  };
}

function isPayloadRow(value: unknown): value is RealtimePayloadRow {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asRealtimePayload<T>(table: string, payload: unknown): RealtimePayload<T> {
  const source = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};

  return {
    table,
    eventType: typeof source.eventType === 'string' ? source.eventType : undefined,
    new: source.new as T | undefined,
    old: source.old as Partial<T> | undefined,
  };
}

function getPayloadRow(payload: RealtimePayload<Record<string, unknown>>): RealtimePayloadRow {
  return isPayloadRow(payload.new) ? payload.new : {};
}

function registerChannel(channel: RealtimeChannel) {
  activeChannels.push(channel);

  return () => {
    const index = activeChannels.indexOf(channel);
    if (index >= 0) activeChannels.splice(index, 1);

    if (supabase) {
      void supabase.removeChannel(channel);
    }
  };
}

function subscribeToTable<T>(params: {
  table: string;
  channelName: string;
  filter?: string;
  onEvent: (payload: RealtimePayload<T>) => void;
}): RealtimeSubscription {
  if (!isSupabaseConfigured() || !supabase) return disabledSubscription();

  const channel = supabase.channel(params.channelName);
  const subscription = {
    event: '*' as const,
    schema: 'public',
    table: params.table,
    filter: params.filter,
  };

  channel.on('postgres_changes', subscription, (payload) => {
    params.onEvent(asRealtimePayload<T>(params.table, payload));
  });

  void channel.subscribe();
  const unsubscribe = registerChannel(channel);

  return {
    ok: true,
    message: `Realtime ativo para ${params.table}.`,
    unsubscribe,
  };
}

export function subscribeToStudents(
  tenantId: string,
  callback: (payload: RealtimePayload<Student>) => void
) {
  return subscribeToTable<Student>({
    table: 'students',
    channelName: `dg-team-students-${tenantId}`,
    filter: `tenant_id=eq.${tenantId}`,
    onEvent: callback,
  });
}

export function subscribeToWorkoutSessions(
  studentId: string,
  callback: (payload: RealtimePayload<WorkoutSession>) => void
) {
  return subscribeToTable<WorkoutSession>({
    table: 'workout_sessions',
    channelName: `dg-team-workout-sessions-${studentId}`,
    filter: `student_id=eq.${studentId}`,
    onEvent: callback,
  });
}

export function subscribeToLogbookSets(
  studentId: string,
  callback: (payload: RealtimePayload<LogbookSet>) => void
) {
  return subscribeToTable<LogbookSet>({
    table: 'logbook_sets',
    channelName: `dg-team-logbook-sets-${studentId}`,
    filter: `student_id=eq.${studentId}`,
    onEvent: callback,
  });
}

export function unsubscribeAll() {
  const channels = [...activeChannels];
  activeChannels.length = 0;

  channels.forEach((channel) => {
    if (supabase) void supabase.removeChannel(channel);
  });
}

export function subscribeToCoachRealtime(config: RealtimeSubscriptionConfig = {}) {
  if (!isSupabaseConfigured() || !supabase) return disabledSubscription();

  const context = getTenantContext();
  const tenantId = config.tenantId || context.tenant_id;
  const subscriptions: RealtimeSubscription[] = [];

  const handleEvent = (payload: RealtimePayload<Record<string, unknown>>) => {
    config.onEvent?.(payload);

    const row = getPayloadRow(payload);
    const eventType = tableToEvent[payload.table];
    if (!eventType) return;

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
        assessmentPending: eventType !== 'assessment_saved',
      },
      automation: {
        studentId,
        studentName,
        validSets: eventType === 'logbook_updated' ? 1 : 0,
        executionQuality: 85,
        assessmentsPending: eventType !== 'assessment_saved',
        performanceDrop: false,
        plateau: false,
      },
    });

    config.onOrchestrated?.(result);
  };

  subscriptions.push(subscribeToTable<Record<string, unknown>>({
    table: 'students',
    channelName: `dg-team-coach-students-${tenantId}`,
    filter: `tenant_id=eq.${tenantId}`,
    onEvent: handleEvent,
  }));

  if (config.studentId) {
    subscriptions.push(
      subscribeToWorkoutSessions(config.studentId, (payload) => handleEvent(payload as RealtimePayload<Record<string, unknown>>)),
      subscribeToLogbookSets(config.studentId, (payload) => handleEvent(payload as RealtimePayload<Record<string, unknown>>))
    );
  } else {
    ['workout_sessions', 'logbook_sets', 'assessments', 'checkins'].forEach((table) => {
      subscriptions.push(subscribeToTable<Record<string, unknown>>({
        table,
        channelName: `dg-team-coach-${table}-${tenantId}`,
        filter: `tenant_id=eq.${tenantId}`,
        onEvent: handleEvent,
      }));
    });
  }

  return {
    ok: true,
    message: 'Realtime DG TEAM ativo para alunos, sessões e sets.',
    unsubscribe: () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    },
  };
}
