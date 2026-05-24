export type WorkoutPhase = 'accumulation' | 'intensification' | 'deload' | 'maintenance';

export type Workout = {
  id: string;
  tenant_id: string;
  student_id: string;
  coach_id: string;
  name: string;
  description?: string | null;
  split_name?: string | null;
  phase?: WorkoutPhase;
  week?: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type WorkoutExercise = {
  id: string;
  tenant_id: string;
  workout_id: string;
  exercise_id: string;
  order_index: number;
  warmup_sets: number;
  feeder_sets: number;
  valid_sets: number;
  backoff_sets?: number;
  rep_range_min: number;
  rep_range_max: number;
  rest_seconds: number;
  target_rir?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};
