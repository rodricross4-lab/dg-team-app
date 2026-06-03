import type { GeneratedWorkout, Student } from '../types';
import { createEntity, deleteEntity, updateEntity } from '../utils/crudFactory';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORE_KEY = 'dg-team-app-store';

export type AppStore = {
  students: Student[];
  workouts: Record<string, GeneratedWorkout[]>;
};

export const initialStore: AppStore = {
  students: [],
  workouts: {}
};

export function loadAppStore(): AppStore {
  return loadFromStorage<AppStore>(STORE_KEY, initialStore);
}

export function saveAppStore(store: AppStore) {
  saveToStorage(STORE_KEY, store);
}

export function addStudent(store: AppStore, student: Student): AppStore {
  const next = {
    ...store,
    students: createEntity(store.students, student)
  };

  saveAppStore(next);
  return next;
}

export function editStudent(store: AppStore, id: string, patch: Partial<Student>): AppStore {
  const next = {
    ...store,
    students: updateEntity(store.students, id, patch)
  };

  saveAppStore(next);
  return next;
}

export function removeStudent(store: AppStore, id: string): AppStore {
  const next = {
    ...store,
    students: deleteEntity(store.students, id)
  };

  saveAppStore(next);
  return next;
}

export function saveStudentWorkouts(store: AppStore, studentId: string, workouts: GeneratedWorkout[]): AppStore {
  const next = {
    ...store,
    workouts: {
      ...store.workouts,
      [studentId]: workouts
    }
  };

  saveAppStore(next);
  return next;
}
