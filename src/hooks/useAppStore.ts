import { useMemo, useState } from 'react';
import type { Student, WorkoutSession } from '../types';
import {
  addStudent,
  editStudent,
  loadAppStore,
  removeStudent,
  saveStudentWorkouts
} from '../store/appStore';

export function useAppStore() {
  const [store, setStore] = useState(() => loadAppStore());

  const actions = useMemo(() => ({
    addStudent(student: Student) {
      const next = addStudent(store, student);
      setStore(next);
      return next;
    },

    editStudent(id: number, patch: Partial<Student>) {
      const next = editStudent(store, id, patch);
      setStore(next);
      return next;
    },

    removeStudent(id: number) {
      const next = removeStudent(store, id);
      setStore(next);
      return next;
    },

    saveWorkouts(studentId: number, workouts: WorkoutSession[]) {
      const next = saveStudentWorkouts(store, studentId, workouts);
      setStore(next);
      return next;
    }
  }), [store]);

  return {
    store,
    actions
  };
}
