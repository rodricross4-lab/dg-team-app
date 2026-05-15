import { supabase, isSupabaseConfigured } from './supabaseClient';

type CloudResult<T = unknown> = {
  ok: boolean;
  message: string;
  data?: T;
};

function disabled<T = unknown>(): CloudResult<T> {
  return {
    ok: false,
    message: 'Supabase não configurado. Operação cloud indisponível.'
  };
}

async function selectByStudent<T>(table: string, studentId: string): Promise<CloudResult<T[]>> {
  if (!isSupabaseConfigured() || !supabase) return disabled<T[]>();

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: `${table} carregado.`, data: data as T[] };
}

async function upsertRows<T>(table: string, rows: T[]): Promise<CloudResult<T[]>> {
  if (!isSupabaseConfigured() || !supabase) return disabled<T[]>();

  const { data, error } = await supabase
    .from(table)
    .upsert(rows as any)
    .select('*');

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: `${table} sincronizado.`, data: data as T[] };
}

export const cloudDataService = {
  getStudents: async () => {
    if (!isSupabaseConfigured() || !supabase) return disabled();
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: 'Alunos carregados.', data };
  },

  saveStudents: (rows: unknown[]) => upsertRows('students', rows),
  getWorkouts: (studentId: string) => selectByStudent('workouts', studentId),
  saveWorkouts: (rows: unknown[]) => upsertRows('workouts', rows),
  getWorkoutSessions: (studentId: string) => selectByStudent('workout_sessions', studentId),
  saveWorkoutSessions: (rows: unknown[]) => upsertRows('workout_sessions', rows),
  getLogbook: (studentId: string) => selectByStudent('logbook_entries', studentId),
  saveLogbook: (rows: unknown[]) => upsertRows('logbook_entries', rows),
  getAssessments: (studentId: string) => selectByStudent('assessments', studentId),
  saveAssessments: (rows: unknown[]) => upsertRows('assessments', rows),
  getCheckins: (studentId: string) => selectByStudent('checkins', studentId),
  saveCheckins: (rows: unknown[]) => upsertRows('checkins', rows),
  getTimeline: (studentId: string) => selectByStudent('timeline_events', studentId),
  saveTimeline: (rows: unknown[]) => upsertRows('timeline_events', rows),
  getInsights: (studentId: string) => selectByStudent('ai_insights', studentId),
  saveInsights: (rows: unknown[]) => upsertRows('ai_insights', rows),
  getNotifications: async () => {
    if (!isSupabaseConfigured() || !supabase) return disabled();
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: 'Notificações carregadas.', data };
  },
  saveNotifications: (rows: unknown[]) => upsertRows('notifications', rows)
};
