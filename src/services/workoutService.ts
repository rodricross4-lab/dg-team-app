import { enqueueSync } from './offlineSyncEngine';
import { getSupabaseMissingMessage, isSupabaseReady } from './supabaseService';

export type WorkoutExerciseRecord = {
  id: string;
  workoutId: string;
  exerciseName: string;
  muscleGroup?: string;
  validSets?: number;
  repRange?: string;
  rest?: string;
  orderIndex?: number;
};

export type WorkoutRecord = {
  id: string;
  studentId: string;
  week?: number;
  name: string;
  notes?: string;
  exercises?: WorkoutExerciseRecord[];
};

const STORAGE_KEY = 'dg-team-workouts';

function readLocalWorkouts(): WorkoutRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalWorkouts(workouts: WorkoutRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

export async function listWorkouts(studentId?: string) {
  const all = readLocalWorkouts();
  const data = studentId ? all.filter((workout) => workout.studentId === studentId) : all;

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady() ? 'Treinos carregados localmente. Sync Supabase pendente.' : getSupabaseMissingMessage(),
    data
  };
}

export async function saveWorkout(workout: WorkoutRecord) {
  const current = readLocalWorkouts();
  const id = workout.id || crypto.randomUUID();
  const normalized: WorkoutRecord = {
    ...workout,
    id,
    exercises: (workout.exercises || []).map((exercise, index) => ({
      ...exercise,
      id: exercise.id || crypto.randomUUID(),
      workoutId: id,
      orderIndex: exercise.orderIndex ?? index
    }))
  };

  const exists = current.some((item) => item.id === id);
  const next = exists
    ? current.map((item) => (item.id === id ? normalized : item))
    : [normalized, ...current];

  writeLocalWorkouts(next);
  enqueueSync('workout', exists ? 'update' : 'create', normalized);

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady() ? 'Treino salvo localmente. Sync Supabase pendente.' : getSupabaseMissingMessage(),
    data: normalized
  };
}

export async function deleteWorkout(workoutId: string) {
  const next = readLocalWorkouts().filter((workout) => workout.id !== workoutId);
  writeLocalWorkouts(next);
  enqueueSync('workout', 'delete', { id: workoutId });

  return {
    source: isSupabaseReady() ? 'supabase-ready' as const : 'local' as const,
    warning: isSupabaseReady() ? 'Treino removido localmente. Sync Supabase pendente.' : getSupabaseMissingMessage(),
    data: next
  };
}
