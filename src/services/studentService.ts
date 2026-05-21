import { getSupabaseMissingMessage, isSupabaseReady } from './supabaseService';

export type StudentRecord = {
  id: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  phase?: string;
  frequency?: number;
  priority?: string[];
  alerts?: string[];
};

const STORAGE_KEY = 'dg-team-students';

function readLocalStudents(): StudentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalStudents(students: StudentRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

export async function listStudents() {
  if (!isSupabaseReady()) {
    return {
      source: 'local' as const,
      warning: getSupabaseMissingMessage(),
      data: readLocalStudents()
    };
  }

  return {
    source: 'supabase-ready' as const,
    warning: 'Supabase configurado. Conectar query real na próxima etapa.',
    data: readLocalStudents()
  };
}

export async function saveStudent(student: StudentRecord) {
  const current = readLocalStudents();
  const exists = current.some((item) => item.id === student.id);
  const next = exists
    ? current.map((item) => (item.id === student.id ? student : item))
    : [{ ...student, id: student.id || crypto.randomUUID() }, ...current];

  writeLocalStudents(next);

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady() ? 'Aluno salvo localmente. Sync Supabase pendente.' : getSupabaseMissingMessage(),
    data: next
  };
}

export async function deleteStudent(studentId: string) {
  const next = readLocalStudents().filter((student) => student.id !== studentId);
  writeLocalStudents(next);

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady() ? 'Aluno removido localmente. Sync Supabase pendente.' : getSupabaseMissingMessage(),
    data: next
  };
}
