import { supabase, isSupabaseConfigured } from './supabaseClient';
import { requireTenantContext, resolveTenantContext, type TenantContext } from './tenantContextService';

export type CloudResult<T = unknown> = {
  ok: boolean;
  message: string;
  data?: T;
};

type SupabaseRow = Record<string, unknown>;
const tenantScopedTables = new Set([
  'students',
  'workouts',
  'workout_sessions',
  'logbook_sets',
  'assessments',
  'checkins',
  'timeline_events',
  'ai_insights',
  'notifications'
]);
const coachScopedTables = new Set(['students', 'workouts', 'notifications']);

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

function withCloudContext(table: string, row: SupabaseRow, context: TenantContext): SupabaseRow {
  const next = { ...row };

  if (tenantScopedTables.has(table)) {
    if (typeof next.tenant_id === 'string' && next.tenant_id && next.tenant_id !== context.tenant_id) {
      throw new Error(`${table} bloqueado: tenant_id nao pertence ao contexto autenticado.`);
    }

    next.tenant_id = context.tenant_id;
  }

  if (coachScopedTables.has(table)) {
    if (typeof next.coach_id === 'string' && next.coach_id && next.coach_id !== context.coach_id) {
      throw new Error(`${table} bloqueado: coach_id nao pertence ao contexto autenticado.`);
    }

    next.coach_id = context.coach_id;
  }

  return next;
}

async function selectByStudent<T = SupabaseRow>(table: string, studentId: string): Promise<CloudResult<T[]>> {
  if (!studentId) return emptyRows<T>('Aluno não informado para consulta cloud.');
  if (!isSupabaseConfigured() || !supabase) return disabled<T[]>();

  const context = await resolveTenantContext();
  let query = supabase
    .from(table)
    .select('*')
    .eq('student_id', studentId);

  if (tenantScopedTables.has(table)) {
    query = query.eq('tenant_id', context.tenant_id);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) return { ok: false, message: error.message, data: [] };
  return { ok: true, message: `${table} carregado.`, data: (data || []) as T[] };
}

async function upsertRows(table: string, rows: SupabaseRow[]): Promise<CloudResult<SupabaseRow[]>> {
  if (!rows.length) return emptyRows<SupabaseRow>('Nenhum registro informado para sincronizar.');
  if (!isSupabaseConfigured() || !supabase) return disabled<SupabaseRow[]>();

  const context = await requireTenantContext();
  const scopedRows = rows.map((row) => withCloudContext(table, row, context));

  const { data, error } = await supabase
    .from(table)
    .upsert(scopedRows)
    .select('*');

  if (error) return { ok: false, message: error.message, data: [] };
  return { ok: true, message: `${table} sincronizado.`, data: (data || []) as SupabaseRow[] };
}

export const cloudDataService = {
  getStudents: async (): Promise<CloudResult<SupabaseRow[]>> => {
    if (!isSupabaseConfigured() || !supabase) return disabled<SupabaseRow[]>();

    context = await resolveTenantContext();
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('tenant_id', context.tenant_id)
      .order('created_at', { ascending: false });

    if (error) return { ok: false, message: error.message, data: [] };
    return { ok: true, message: 'Alunos carregados.', data: (data || []) as SupabaseRow[] };
  },

  saveStudents: (rows: SupabaseRow[]) => upsertRows('students', rows),
  getWorkouts: (studentId: string) => selectByStudent('workouts', studentId),
  saveWorkouts: (rows: SupabaseRow[]) => upsertRows('workouts', rows),
  getWorkoutSessions: (studentId: string) => selectByStudent('workout_sessions', studentId),
  saveWorkoutSessions: (rows: SupabaseRow[]) => upsertRows('workout_sessions', rows),
  getLogbook: (studentId: string) => selectByStudent('logbook_sets', studentId),
  saveLogbook: (rows: SupabaseRow[]) => upsertRows('logbook_sets', rows),
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

    context = await resolveTenantContext();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('tenant_id', context.tenant_id)
      .order('created_at', { ascending: false });

    if (error) return { ok: false, message: error.message, data: [] };
    return { ok: true, message: 'Notificações carregadas.', data: (data || []) as SupabaseRow[] };
  },

  saveNotifications: (rows: SupabaseRow[]) => upsertRows('notifications', rows)
};
