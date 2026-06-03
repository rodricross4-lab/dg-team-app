import type { Student, StudentDraft } from '../types';
import { enqueueSync } from './offlineSyncEngine';
import { getSupabaseMissingMessage, isSupabaseReady } from './supabaseService';

const STORAGE_KEY = 'dg-team-students';

function nowIso() {
  return new Date().toISOString();
}

function readLocalStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalStudents(students: Student[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

export function getStoredStudents(options: { includeArchived?: boolean } = {}) {
  const students = readLocalStudents();

  return options.includeArchived
    ? students
    : students.filter((student) => student.deleted_at == null);
}

function normalizeStudent(student: StudentDraft): Student {
  const timestamp = nowIso();

  return {
    id: student.id || crypto.randomUUID(),
    tenant_id: student.tenant_id,
    coach_id: student.coach_id,
    user_id: student.user_id || null,
    name: student.name,
    email: student.email || null,
    phone: student.phone || null,
    birth_date: student.birth_date || null,
    age: student.age || null,
    height_cm: student.height_cm || null,
    weight_kg: student.weight_kg || null,
    goal: student.goal,
    phase: student.phase,
    training_frequency: student.training_frequency,
    priority_muscles: student.priority_muscles || [],
    alerts: student.alerts || [],
    status: student.status || 'active',
    created_at: student.created_at || timestamp,
    updated_at: timestamp,
    deleted_at: student.deleted_at || null,
  };
}

export async function fetchStudents() {
  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady()
      ? 'Sync Supabase habilitado.'
      : getSupabaseMissingMessage(),
    data: getStoredStudents()
  };
}

export async function saveStudent(studentDraft: StudentDraft) {
  const current = readLocalStudents();
  const normalized = normalizeStudent(studentDraft);

  const exists = current.some((item) => item.id === normalized.id);

  const next = exists
    ? current.map((item) =>
        item.id === normalized.id
          ? { ...item, ...normalized, updated_at: nowIso() }
          : item
      )
    : [normalized, ...current];

  writeLocalStudents(next);

  enqueueSync('student', exists ? 'update' : 'create', normalized);

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady()
      ? 'Aluno salvo localmente e enviado para sync queue.'
      : getSupabaseMissingMessage(),
    data: normalized
  };
}

export async function archiveStudent(studentId: string) {
  const next: Student[] = readLocalStudents().map((student) => {
    if (student.id !== studentId) return student;

    return {
      ...student,
      status: 'inactive' as const,
      deleted_at: nowIso(),
      updated_at: nowIso(),
    };
  });

  writeLocalStudents(next);

  enqueueSync('student', 'archive', {
    id: studentId,
    deleted_at: nowIso(),
  });

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady()
      ? 'Aluno arquivado localmente e enviado para sync queue.'
      : getSupabaseMissingMessage(),
    data: next
  };
}

export async function deleteStudent(studentId: string) {
  const next = readLocalStudents().filter((student) => student.id !== studentId);

  writeLocalStudents(next);

  enqueueSync('student', 'delete', { id: studentId });

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady()
      ? 'Aluno removido localmente e enviado para sync queue.'
      : getSupabaseMissingMessage(),
    data: next
  };
}
