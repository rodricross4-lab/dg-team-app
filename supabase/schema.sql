create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid,
  name text not null,
  age integer,
  weight numeric,
  height numeric,
  goal text,
  phase text,
  frequency integer default 0,
  priority text[] default '{}',
  alerts text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  week integer default 1,
  name text not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid references workouts(id) on delete cascade,
  exercise_name text not null,
  muscle_group text,
  valid_sets integer default 0,
  rep_range text,
  rest text,
  order_index integer default 0,
  created_at timestamptz default now()
);

create table if not exists logbook_sets (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  workout_id uuid references workouts(id) on delete set null,
  exercise_id uuid references workout_exercises(id) on delete set null,
  set_kind text check (set_kind in ('warmup','feeder','working','backoff')) default 'working',
  load numeric default 0,
  reps integer default 0,
  rir numeric,
  execution_quality text check (execution_quality in ('low','ok','high')) default 'ok',
  notes text,
  performed_at timestamptz default now()
);

create table if not exists prs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  exercise_name text not null,
  pr_type text check (pr_type in ('load','reps','technical','consolidated')) not null,
  result text not null,
  created_at timestamptz default now()
);

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  weight numeric,
  notes text,
  measurements jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  sleep_quality integer,
  recovery_score integer,
  fatigue_score integer,
  body_weight numeric,
  notes text,
  created_at timestamptz default now()
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  photo_url text not null,
  angle text,
  created_at timestamptz default now()
);

create index if not exists idx_workouts_student_id on workouts(student_id);
create index if not exists idx_logbook_sets_student_id on logbook_sets(student_id);
create index if not exists idx_logbook_sets_performed_at on logbook_sets(performed_at);
create index if not exists idx_prs_student_id on prs(student_id);
create index if not exists idx_checkins_student_id on checkins(student_id);
