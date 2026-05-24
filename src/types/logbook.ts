export type SetType = 'warmup' | 'feeder' | 'valid' | 'backoff';

export type WorkoutSession = {
  id: string;
  tenant_id: string;
  student_id: string;
  workout_id: string;
  performed_at: string;
  status: 'draft' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type LogbookSet = {
  id: string;
  tenant_id: string;
  session_id: string;
  student_id: string;
  exercise_id: string;
  set_type: SetType;
  set_order: number;
  weight_kg?: number;
  reps?: number;
  rir?: number;
  failure?: boolean;
  execution_quality?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type ProgressionSuggestion = {
  increaseLoad: boolean;
  maintainLoad: boolean;
  reason: string;
};
