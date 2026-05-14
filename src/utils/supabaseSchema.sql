-- DG TEAM APP Supabase Schema
-- Execute this in Supabase SQL editor when cloud persistence is enabled.

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid,
  name text not null,
  age int,
  weight numeric,
  height numeric,
  goal text,
  phase text,
  frequency int,
  priority text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  week int not null,
  name text not null,
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
  notes text,
  updated_at timestamptz default now()
);

create table if not exists logbook_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  workout_id uuid references workouts(id) on delete cascade,
  exercise_id text,
  load text,
  reps text,
  rir text,
  execution text,
  created_at timestamptz default now()
);
