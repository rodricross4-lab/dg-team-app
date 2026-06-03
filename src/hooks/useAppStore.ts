import { useMemo, useState } from 'react';
import type { GeneratedWorkout, Student } from '../types';
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

    editStudent(id: string, patch: Partial<Student>) {
      const next = editStudent(store, id, patch);
      setStore(next);
      return next;
    },

    removeStudent(id: string) {
      const next = removeStudent(store, id);
      setStore(next);
      return next;
    },

    saveWorkouts(studentId: string, workouts: GeneratedWorkout[]) {
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
