-- DG TEAM APP Supabase Schema
-- Plataforma operacional de coaching fitness.
-- Execute este arquivo no SQL Editor do Supabase.

create extension if not exists "pgcrypto";

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid,
  name text not null,
  email text,
  phone text,
  age int,
  weight numeric,
  height numeric,
  goal text,
  phase text,
  experience text,
  frequency int,
  priority text[],
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  primary_muscle text,
  secondary_muscles text[],
  pattern text,
  equipment text,
  stability text,
  fatigue_cost text,
  default_range text,
  default_rest text,
  tags text[],
  created_at timestamptz default now()
);

create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  week int not null,
  name text not null,
  split text,
  notes text,
  exercises jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists workout_sessions (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid references workouts(id) on delete cascade,
  student_id uuid references students(id) on delete cascade,
  label text not null,
  day_order int,
  focus text,
  notes text,
  exercises jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists periodization_weeks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  week int not null,
  focus text,
  intensity text,
  volume text,
  deload boolean default false,
  notes text,
  updated_at timestamptz default now()
);

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  week int not null,
  weight text,
  body_fat text,
  waist text,
  arm text,
  chest text,
  hip text,
  thigh text,
  notes text,
  updated_at timestamptz default now()
);

create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  weight numeric,
  mood text,
  recovery text,
  sleep_quality text,
  hunger text,
  adherence_training int,
  adherence_diet int,
  notes text,
  created_at timestamptz default now()
);

create table if not exists logbook_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  workout_id uuid references workouts(id) on delete cascade,
  session_id uuid references workout_sessions(id) on delete cascade,
  exercise_id text,
  exercise_name text,
  muscle_group text,
  load text,
  reps text,
  rir text,
  execution text,
  volume_load numeric,
  created_at timestamptz default now()
);

create table if not exists timeline_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  type text not null,
  title text not null,
  description text,
  priority text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists ai_insights (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  insight_type text not null,
  priority text,
  title text,
  message text,
  suggested_action text,
  resolved boolean default false,
  created_at timestamptz default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid,
  student_id uuid references students(id) on delete cascade,
  title text not null,
  message text,
  priority text,
  action_label text,
  read boolean default false,
  created_at timestamptz default now()
);

create table if not exists progress_photos (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  week int,
  view text,
  storage_path text not null,
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_students_coach on students(coach_id);
create index if not exists idx_workouts_student on workouts(student_id);
create index if not exists idx_sessions_student on workout_sessions(student_id);
create index if not exists idx_logbook_student on logbook_entries(student_id);
create index if not exists idx_checkins_student on checkins(student_id);
create index if not exists idx_timeline_student on timeline_events(student_id);
create index if not exists idx_ai_student on ai_insights(student_id);
create index if not exists idx_notifications_coach on notifications(coach_id);
