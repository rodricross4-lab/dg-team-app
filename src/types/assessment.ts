export type SkinfoldProtocol = '7-site' | '3-site' | 'custom';

export type CircumferenceMeasurements = {
  waist?: number;
  abdomen?: number;
  hip?: number;
  chest?: number;
  relaxed_arm?: number;
  flexed_arm?: number;
  forearm?: number;
  thigh?: number;
  calf?: number;
};

export type SkinfoldMeasurements = {
  chest?: number;
  triceps?: number;
  subscapular?: number;
  suprailiac?: number;
  midaxillary?: number;
  abdominal?: number;
  thigh?: number;
};

export type Assessment = {
  id: string;
  tenant_id: string;
  student_id: string;
  protocol: SkinfoldProtocol;
  weight_kg?: number | null;
  body_fat_percentage?: number | null;
  lean_mass_kg?: number | null;
  circumference: CircumferenceMeasurements;
  skinfolds: SkinfoldMeasurements;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};
