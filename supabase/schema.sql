create table if not exists app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text check (role in ('coach','student')) not null default 'coach',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists coaches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references app_users(id) on delete cascade,
  name text not null,
  cref text,
  plan text default 'starter',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid references coaches(id) on delete cascade,
  user_id uuid references app_users(id) on delete set null,
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

create index if not exists idx_app_users_role on app_users(role);
create index if not exists idx_coaches_user_id on coaches(user_id);
create index if not exists idx_students_coach_id on students(coach_id);
create index if not exists idx_students_user_id on students(user_id);
create index if not exists idx_workouts_student_id on workouts(student_id);
create index if not exists idx_logbook_sets_student_id on logbook_sets(student_id);
create index if not exists idx_logbook_sets_performed_at on logbook_sets(performed_at);
create index if not exists idx_prs_student_id on prs(student_id);
create index if not exists idx_checkins_student_id on checkins(student_id);

alter table app_users enable row level security;
alter table coaches enable row level security;
alter table students enable row level security;
alter table workouts enable row level security;
alter table workout_exercises enable row level security;
alter table logbook_sets enable row level security;
alter table prs enable row level security;
alter table assessments enable row level security;
alter table checkins enable row level security;
alter table photos enable row level security;

create policy if not exists app_users_self_select on app_users
  for select using (id = auth.uid());

create policy if not exists app_users_self_update on app_users
  for update using (id = auth.uid());

create policy if not exists coaches_own_all on coaches
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy if not exists students_coach_all on students
  for all using (
    coach_id in (select id from coaches where user_id = auth.uid())
  ) with check (
    coach_id in (select id from coaches where user_id = auth.uid())
  );

create policy if not exists students_self_select on students
  for select using (user_id = auth.uid());

create policy if not exists workouts_coach_student_access on workouts
  for all using (
    student_id in (
      select students.id from students
      join coaches on coaches.id = students.coach_id
      where coaches.user_id = auth.uid() or students.user_id = auth.uid()
    )
  ) with check (
    student_id in (
      select students.id from students
      join coaches on coaches.id = students.coach_id
      where coaches.user_id = auth.uid() or students.user_id = auth.uid()
    )
  );

create policy if not exists workout_exercises_coach_student_access on workout_exercises
  for all using (
    workout_id in (
      select workouts.id from workouts
      join students on students.id = workouts.student_id
      join coaches on coaches.id = students.coach_id
      where coaches.user_id = auth.uid() or students.user_id = auth.uid()
    )
  ) with check (
    workout_id in (
      select workouts.id from workouts
      join students on students.id = workouts.student_id
      join coaches on coaches.id = students.coach_id
      where coaches.user_id = auth.uid() or students.user_id = auth.uid()
    )
  );

create policy if not exists logbook_sets_coach_student_access on logbook_sets
  for all using (
    student_id in (
      select students.id from students
      join coaches on coaches.id = students.coach_id
      where coaches.user_id = auth.uid() or students.user_id = auth.uid()
    )
  ) with check (
    student_id in (
      select students.id from students
      join coaches on coaches.id = students.coach_id
      where coaches.user_id = auth.uid() or students.user_id = auth.uid()
    )
  );

create policy if not exists prs_coach_student_access on prs
  for all using (
    student_id in (
      select students.id from students
      join coaches on coaches.id = students.coach_id
      where coaches.user_id = auth.uid() or students.user_id = auth.uid()
    )
  ) with check (
    student_id in (
      select students.id from students
      join coaches on coaches.id = students.coach_id
      where coaches.user_id = auth.uid() or students.user_id = auth.uid()
    )
  );

create policy if not exists assessments_coach_student_access on assessments
  for all using (
    student_id in (
      select students.id from students
      join coaches on coaches.id = students.coach_id
      where coaches.user_id = auth.uid() or students.user_id = auth.uid()
    )
  ) with check (
    student_id in (
      select students.id from students
      join coaches on coaches.id = students.coach_id
      where coaches.user_id = auth.uid() or students.user_id = auth.uid()
    )
  );

create policy if not exists checkins_coach_student_access on checkins
  for all using (
    student_id in (
      select students.id from students
      join coaches on coaches.id = students.coach_id
      where coaches.user_id = auth.uid() or students.user_id = auth.uid()
    )
  ) with check (
    student_id in (
      select students.id from students
      join coaches on coaches.id = students.coach_id
      where coaches.user_id = auth.uid() or students.user_id = auth.uid()
    )
  );

create policy if not exists photos_coach_student_access on photos
  for all using (
    student_id in (
      select students.id from students
      join coaches on coaches.id = students.coach_id
      where coaches.user_id = auth.uid() or students.user_id = auth.uid()
    )
  ) with check (
    student_id in (
      select students.id from students
      join coaches on coaches.id = students.coach_id
      where coaches.user_id = auth.uid() or students.user_id = auth.uid()
    )
  );
