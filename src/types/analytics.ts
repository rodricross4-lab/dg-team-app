export type DashboardSummary = {
  activeStudents: number;
  workoutsToday: number;
  weeklyVolumeLoad: number;
  recentPRs: number;
  studentsAtRisk: number;
  pendingAssessments: number;
  validSets: number;
  executionQuality: number;
  averageTrainingFrequency: number;
};

export type MuscleVolume = {
  muscle: string;
  validSets: number;
  volumeLoad: number;
};

export type RecentPR = {
  student_id: string;
  exercise_id: string;
  type: 'load' | 'reps' | 'volume_load';
  previousValue: number;
  currentValue: number;
  created_at: string;
};

export type ExerciseTrendPoint = {
  date: string;
  exercise_id: string;
  load: number;
  reps: number;
  volumeLoad: number;
  executionQuality?: number;
};

export type CommandCenterInsight = {
  title: string;
  detail: string;
  action: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
};

export type StudentRecoveryScore = {
  student_id: string;
  studentName: string;
  score: number;
  level: 'good' | 'watch' | 'risk' | 'critical';
  reasons: string[];
};
