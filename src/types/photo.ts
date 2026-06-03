export type PhotoWeek = 1 | 4 | 8;

export type PhotoAngle = 'frente' | 'costas' | 'lado esquerdo' | 'lado direito';

export type ProgressPhoto = {
  id: string;
  tenant_id: string;
  student_id: string;
  week: PhotoWeek;
  angle: PhotoAngle;
  url: string;
  photo_url: string | null;
  storage_path: string | null;
  date: string;
  weight?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

export type ProgressPhotoDraft = {
  id?: string;
  tenant_id?: string;
  student_id: string;
  week: PhotoWeek;
  angle: PhotoAngle;
  url?: string;
  photo_url?: string | null;
  storage_path?: string | null;
  date?: string;
  weight?: number | null;
  notes?: string | null;
  created_at?: string;
};
