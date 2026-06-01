export type EditableExercise = {
  id: string;
  name: string;
  group: string;
  warmup: string;
  feeder: string;
  validSets: string;
  reps: string;
  rest: string;
  notes: string;
};

export type EditableWorkout = {
  id: string;
  studentId: string;
  week: number;
  name: string;
  exercises: EditableExercise[];
  updatedAt: string;
};

export type EditableAssessment = {
  studentId: string;
  week: 1 | 4 | 8;
  protocol?: '7-site' | '3-site' | 'custom';
  weight: string;
  bodyFat: string;
  waist: string;
  abdomen?: string;
  hip?: string;
  chest?: string;
  arm: string;
  thigh?: string;
  calf?: string;
  notes: string;
  createdAt?: string;
  updatedAt: string;
};

export type EditablePeriodizationWeek = {
  studentId: string;
  week: number;
  focus: string;
  intensity: string;
  volume: string;
  deload: boolean;
  notes: string;
  updatedAt: string;
};

export type OperationalStore = {
  workouts: EditableWorkout[];
  assessments: EditableAssessment[];
  periodization: EditablePeriodizationWeek[];
};

const KEY = 'dg-team-operational-store';

const initialStore: OperationalStore = {
  workouts: [],
  assessments: [],
  periodization: []
};

export function loadOperationalStore(): OperationalStore {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : initialStore;
  } catch {
    return initialStore;
  }
}

export function saveOperationalStore(store: OperationalStore) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function upsertWorkout(workout: EditableWorkout) {
  const store = loadOperationalStore();
  const exists = store.workouts.some((item) => item.id === workout.id);

  const next: OperationalStore = {
    ...store,
    workouts: exists
      ? store.workouts.map((item) => (item.id === workout.id ? workout : item))
      : [...store.workouts, workout]
  };

  saveOperationalStore(next);
  return next;
}

export function deleteWorkout(id: string) {
  const store = loadOperationalStore();
  const next = {
    ...store,
    workouts: store.workouts.filter((item) => item.id !== id)
  };
  saveOperationalStore(next);
  return next;
}

export function getStudentWorkouts(studentId: string) {
  return loadOperationalStore().workouts.filter((item) => item.studentId === studentId);
}

export function upsertAssessment(assessment: EditableAssessment) {
  const store = loadOperationalStore();
  const next = {
    ...store,
    assessments: [
      ...store.assessments.filter((item) => !(item.studentId === assessment.studentId && item.week === assessment.week)),
      assessment
    ]
  };
  saveOperationalStore(next);
  return next;
}

export function getStudentAssessments(studentId: string) {
  return loadOperationalStore().assessments.filter((item) => item.studentId === studentId);
}

export function upsertPeriodizationWeek(week: EditablePeriodizationWeek) {
  const store = loadOperationalStore();
  const next = {
    ...store,
    periodization: [
      ...store.periodization.filter((item) => !(item.studentId === week.studentId && item.week === week.week)),
      week
    ]
  };
  saveOperationalStore(next);
  return next;
}

export function getStudentPeriodization(studentId: string) {
  return loadOperationalStore().periodization.filter((item) => item.studentId === studentId);
}
