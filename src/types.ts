export type TrainingLevel = 'Iniciante' | 'Intermediário' | 'Avançado';
export type ExecutionQuality = 'ruim' | 'ok' | 'boa' | 'excelente';

export type Student = {
  id: number;
  name: string;
  age: number;
  weight: number;
  height: number;
  sex: string;
  goal: string;
  phase: string;
  frequency: number;
  level: TrainingLevel;
  priority: string[];
  limitations: string[];
  alerts: string[];
};

export type SetEntry = {
  id: string;
  type: 'aquecimento' | 'ajuste' | 'valida' | 'backoff';
  load: number;
  reps: number;
  rir: number;
  execution: ExecutionQuality;
  notes: string;
  countsVolume: boolean;
};

export type WorkoutExercise = {
  id: string;
  name: string;
  group: string;
  range: string;
  rest: string;
  sets: SetEntry[];
};

export type WorkoutSession = {
  id: string;
  week: number;
  name: string;
  date?: string;
  startedAt?: string;
  finishedAt?: string;
  exercises: WorkoutExercise[];
};
