import { supabase, isSupabaseConfigured } from './supabaseClient';

export type CloudResult<T = unknown> = {
  ok: boolean;
  message: string;
  data?: T;
};

type SupabaseRow = Record<string, unknown>;

function disabled<T = unknown>(): CloudResult<T> {
  return {
    ok: false,
    message: 'Supabase não configurado. Operação cloud indisponível.'
  };
}

function emptyRows<T = unknown>(message: string): CloudResult<T[]> {
  return {
    ok: false,
    message,
    data: []
  };
}

async function selectByStudent<T = SupabaseRow>(table: string, studentId: string): Promise<CloudResult<T[]>> {
  if (!studentId) return emptyRows<T>('Aluno não informado para consulta cloud.');
  if (!isSupabaseConfigured() || !supabase) return disabled<T[]>();

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) return { ok: false, message: error.message, data: [] };
  return { ok: true, message: `${table} carregado.`, data: (data || []) as T[] };
}

async function upsertRows<T extends SupabaseRow = SupabaseRow>(table: string, rows: T[]): Promise<CloudResult<T[]>> {
  if (!rows.length) return emptyRows<T>('Nenhum registro informado para sincronizar.');
  if (!isSupabaseConfigured() || !supabase) return disabled<T[]>();

  const { data, error } = await supabase
    .from(table)
    .upsert(rows)
    .select('*');

  if (error) return { ok: false, message: error.message, data: [] };
  return { ok: true, message: `${table} sincronizado.`, data: (data || []) as T[] };
}

export const cloudDataService = {
  getStudents: async (): Promise<CloudResult<SupabaseRow[]>> => {
    if (!isSupabaseConfigured() || !supabase) return disabled<SupabaseRow[]>();

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return { ok: false, message: error.message, data: [] };
    return { ok: true, message: 'Alunos carregados.', data: (data || []) as SupabaseRow[] };
  },

  saveStudents: (rows: SupabaseRow[]) => upsertRows('students', rows),
  getWorkouts: (studentId: string) => selectByStudent('workouts', studentId),
  saveWorkouts: (rows: SupabaseRow[]) => upsertRows('workouts', rows),
  getWorkoutSessions: (studentId: string) => selectByStudent('workout_sessions', studentId),
  saveWorkoutSessions: (rows: SupabaseRow[]) => upsertRows('workout_sessions', rows),
  getLogbook: (studentId: string) => selectByStudent('logbook_entries', studentId),
  saveLogbook: (rows: SupabaseRow[]) => upsertRows('logbook_entries', rows),
  getAssessments: (studentId: string) => selectByStudent('assessments', studentId),
  saveAssessments: (rows: SupabaseRow[]) => upsertRows('assessments', rows),
  getCheckins: (studentId: string) => selectByStudent('checkins', studentId),
  saveCheckins: (rows: SupabaseRow[]) => upsertRows('checkins', rows),
  getTimeline: (studentId: string) => selectByStudent('timeline_events', studentId),
  saveTimeline: (rows: SupabaseRow[]) => upsertRows('timeline_events', rows),
  getInsights: (studentId: string) => selectByStudent('ai_insights', studentId),
  saveInsights: (rows: SupabaseRow[]) => upsertRows('ai_insights', rows),

  getNotifications: async (): Promise<CloudResult<SupabaseRow[]>> => {
    if (!isSupabaseConfigured() || !supabase) return disabled<SupabaseRow[]>();

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return { ok: false, message: error.message, data: [] };
    return { ok: true, message: 'Notificações carregadas.', data: (data || []) as SupabaseRow[] };
  },

  saveNotifications: (rows: SupabaseRow[]) => upsertRows('notifications', rows)
};
