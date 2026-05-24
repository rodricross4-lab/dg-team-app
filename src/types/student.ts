export type StudentPhase = 'cutting' | 'bulking' | 'recomp' | 'maintenance';
export type StudentStatus = 'active' | 'inactive' | 'paused';

export type Student = {
  id: string;
  tenant_id: string;
  coach_id: string;
  user_id?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  birth_date?: string | null;
  age?: number | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  goal: string;
  phase: StudentPhase;
  training_frequency: number;
  priority_muscles: string[];
  alerts?: string[];
  status: StudentStatus;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

export type StudentDraft = Omit<Student, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
