export type ExerciseCategory = 'compound' | 'isolation' | 'mobility' | 'activation' | 'core';
export type ExerciseLevel = 'beginner' | 'intermediate' | 'advanced';

export type Exercise = {
  id: string;
  tenant_id?: string | null;
  name: string;
  muscle_group: string;
  muscle_subdivision?: string | null;
  category: ExerciseCategory;
  pattern?: string | null;
  equipment?: string | null;
  default_rep_min: number;
  default_rep_max: number;
  default_rest_seconds: number;
  level: ExerciseLevel;
  substitutes: string[];
  notes?: string | null;
  is_global: boolean;
  created_at: string;
  updated_at: string;
};
