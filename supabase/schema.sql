create extension if not exists "pgcrypto";

create table if not exists tenants (
  id text primary key default gen_random_uuid()::text,
  name text not null default 'DG Team',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id text references tenants(id) on delete cascade,
  email text unique not null,
  role text check (role in ('coach','student','admin')) not null default 'coach',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists coaches (
  id text primary key default gen_random_uuid()::text,
  tenant_id text not null references tenants(id) on delete cascade,
  user_id uuid not null references app_users(id) on delete cascade,
  name text not null,
  cref text,
  plan text not null default 'starter',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists students (
  id text primary key default gen_random_uuid()::text,
  tenant_id text not null references tenants(id) on delete cascade,
  coach_id text not null references coaches(id) on delete cascade,
  user_id uuid references app_users(id) on delete set null,
  name text not null,
  email text,
  phone text,
  birth_date date,
  age integer,
  height_cm numeric,
  weight_kg numeric,
  goal text not null default '',
  phase text check (phase in ('cutting','bulking','recomp','maintenance')) not null default 'maintenance',
  training_frequency integer not null default 0,
  priority_muscles text[] not null default '{}',
  alerts text[] not null default '{}',
  status text check (status in ('active','inactive','paused')) not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists exercises (
  id text primary key default gen_random_uuid()::text,
  tenant_id text references tenants(id) on delete cascade,
  name text not null,
  muscle_group text not null,
  muscle_subdivision text,
  category text check (category in ('compound','isolation','mobility','activation','core')) not null default 'compound',
  pattern text,
  equipment text,
  default_rep_min integer not null default 6,
  default_rep_max integer not null default 12,
  default_rest_seconds integer not null default 120,
  level text check (level in ('beginner','intermediate','advanced')) not null default 'beginner',
  substitutes text[] not null default '{}',
  notes text,
  is_global boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists workouts (
  id text primary key default gen_random_uuid()::text,
  tenant_id text references tenants(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  coach_id text references coaches(id) on delete set null,
  name text not null,
  description text,
  split_name text,
  phase text check (phase in ('accumulation','intensification','deload','maintenance')),
  week integer,
  exercises jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists workout_exercises (
  id text primary key default gen_random_uuid()::text,
  tenant_id text references tenants(id) on delete cascade,
  workout_id text not null references workouts(id) on delete cascade,
  exercise_id text,
  order_index integer not null default 0,
  warmup_sets integer not null default 0,
  feeder_sets integer not null default 0,
  valid_sets integer not null default 0,
  backoff_sets integer not null default 0,
  rep_range_min integer not null default 6,
  rep_range_max integer not null default 12,
  rest_seconds integer not null default 120,
  target_rir numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists workout_sessions (
  id text primary key default gen_random_uuid()::text,
  tenant_id text not null references tenants(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  workout_id text not null references workouts(id) on delete cascade,
  performed_at timestamptz not null default now(),
  status text check (status in ('draft','completed')) not null default 'draft',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists logbook_sets (
  id text primary key default gen_random_uuid()::text,
  tenant_id text not null references tenants(id) on delete cascade,
  session_id text not null references workout_sessions(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  exercise_id text not null,
  set_type text check (set_type in ('warmup','feeder','valid','backoff')) not null default 'valid',
  set_order integer not null default 1,
  weight_kg numeric,
  reps integer,
  rir numeric,
  failure boolean not null default false,
  execution_quality integer check (execution_quality between 1 and 5),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists prs (
  id text primary key default gen_random_uuid()::text,
  tenant_id text references tenants(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  exercise_id text,
  pr_type text check (pr_type in ('load','reps','volume_load','quality')) not null,
  previous_value numeric,
  current_value numeric not null,
  label text,
  created_at timestamptz not null default now()
);

create table if not exists assessments (
  id text primary key default gen_random_uuid()::text,
  tenant_id text references tenants(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  protocol text default 'custom',
  week integer,
  weight_kg numeric,
  body_fat_percentage numeric,
  lean_mass_kg numeric,
  circumference jsonb not null default '{}'::jsonb,
  skinfolds jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists checkins (
  id text primary key default gen_random_uuid()::text,
  tenant_id text references tenants(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  sleep_quality integer,
  recovery_score integer,
  fatigue_score integer,
  body_weight numeric,
  mood text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists photos (
  id text primary key default gen_random_uuid()::text,
  tenant_id text references tenants(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  photo_url text,
  storage_path text,
  angle text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists periodization_weeks (
  id text primary key default gen_random_uuid()::text,
  tenant_id text references tenants(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  week integer not null,
  focus text,
  intensity text,
  volume text,
  deload boolean not null default false,
  notes text,
  updated_at timestamptz not null default now()
);

create table if not exists timeline_events (
  id text primary key default gen_random_uuid()::text,
  tenant_id text references tenants(id) on delete cascade,
  student_id text references students(id) on delete cascade,
  type text not null,
  title text not null,
  description text,
  priority text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists ai_insights (
  id text primary key default gen_random_uuid()::text,
  tenant_id text references tenants(id) on delete cascade,
  student_id text references students(id) on delete cascade,
  insight_type text not null,
  priority text,
  title text,
  message text,
  suggested_action text,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id text primary key default gen_random_uuid()::text,
  tenant_id text references tenants(id) on delete cascade,
  coach_id text references coaches(id) on delete cascade,
  student_id text references students(id) on delete cascade,
  title text not null,
  message text not null,
  priority text,
  action_label text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_app_users_tenant_id on app_users(tenant_id);
create index if not exists idx_coaches_tenant_id on coaches(tenant_id);
create index if not exists idx_coaches_user_id on coaches(user_id);
create index if not exists idx_students_tenant_id on students(tenant_id);
create index if not exists idx_students_coach_id on students(coach_id);
create index if not exists idx_students_user_id on students(user_id);
create index if not exists idx_workouts_student_id on workouts(student_id);
create index if not exists idx_workout_sessions_student_id on workout_sessions(student_id);
create index if not exists idx_logbook_sets_student_id on logbook_sets(student_id);
create index if not exists idx_logbook_sets_session_id on logbook_sets(session_id);
create index if not exists idx_prs_student_id on prs(student_id);
create index if not exists idx_assessments_student_id on assessments(student_id);
create index if not exists idx_checkins_student_id on checkins(student_id);
create index if not exists idx_photos_student_id on photos(student_id);

alter table tenants enable row level security;
alter table app_users enable row level security;
alter table coaches enable row level security;
alter table students enable row level security;
alter table exercises enable row level security;
alter table workouts enable row level security;
alter table workout_exercises enable row level security;
alter table workout_sessions enable row level security;
alter table logbook_sets enable row level security;
alter table prs enable row level security;
alter table assessments enable row level security;
alter table checkins enable row level security;
alter table photos enable row level security;
alter table periodization_weeks enable row level security;
alter table timeline_events enable row level security;
alter table ai_insights enable row level security;
alter table notifications enable row level security;

drop policy if exists app_users_self_select on app_users;
create policy app_users_self_select on app_users for select using (id = auth.uid());

drop policy if exists app_users_self_update on app_users;
create policy app_users_self_update on app_users for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists tenants_member_select on tenants;
create policy tenants_member_select on tenants for select using (
  id in (select tenant_id from app_users where app_users.id = auth.uid())
);

drop policy if exists coaches_owner_all on coaches;
create policy coaches_owner_all on coaches for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists students_coach_or_self_all on students;
create policy students_coach_or_self_all on students for all using (
  user_id = auth.uid()
  or coach_id in (select id from coaches where user_id = auth.uid())
) with check (
  user_id = auth.uid()
  or coach_id in (select id from coaches where user_id = auth.uid())
);

drop policy if exists exercises_tenant_or_global_select on exercises;
create policy exercises_tenant_or_global_select on exercises for select using (
  is_global
  or tenant_id in (select tenant_id from app_users where app_users.id = auth.uid())
);

drop policy if exists exercises_tenant_write on exercises;
create policy exercises_tenant_write on exercises for all using (
  tenant_id in (select tenant_id from app_users where app_users.id = auth.uid())
) with check (
  tenant_id in (select tenant_id from app_users where app_users.id = auth.uid())
);

drop policy if exists workouts_access on workouts;
create policy workouts_access on workouts for all using (
  student_id in (select id from students)
) with check (
  student_id in (select id from students)
);

drop policy if exists workout_exercises_access on workout_exercises;
create policy workout_exercises_access on workout_exercises for all using (
  workout_id in (select id from workouts)
) with check (
  workout_id in (select id from workouts)
);

drop policy if exists workout_sessions_access on workout_sessions;
create policy workout_sessions_access on workout_sessions for all using (
  student_id in (select id from students)
) with check (
  student_id in (select id from students)
);

drop policy if exists logbook_sets_access on logbook_sets;
create policy logbook_sets_access on logbook_sets for all using (
  student_id in (select id from students)
) with check (
  student_id in (select id from students)
);

drop policy if exists prs_access on prs;
create policy prs_access on prs for all using (
  student_id in (select id from students)
) with check (
  student_id in (select id from students)
);

drop policy if exists assessments_access on assessments;
create policy assessments_access on assessments for all using (
  student_id in (select id from students)
) with check (
  student_id in (select id from students)
);

drop policy if exists checkins_access on checkins;
create policy checkins_access on checkins for all using (
  student_id in (select id from students)
) with check (
  student_id in (select id from students)
);

drop policy if exists photos_access on photos;
create policy photos_access on photos for all using (
  student_id in (select id from students)
) with check (
  student_id in (select id from students)
);

drop policy if exists periodization_weeks_access on periodization_weeks;
create policy periodization_weeks_access on periodization_weeks for all using (
  student_id in (select id from students)
) with check (
  student_id in (select id from students)
);

drop policy if exists timeline_events_access on timeline_events;
create policy timeline_events_access on timeline_events for all using (
  student_id in (select id from students)
) with check (
  student_id in (select id from students)
);

drop policy if exists ai_insights_access on ai_insights;
create policy ai_insights_access on ai_insights for all using (
  student_id in (select id from students)
) with check (
  student_id in (select id from students)
);

drop policy if exists notifications_coach_access on notifications;
create policy notifications_coach_access on notifications for all using (
  coach_id in (select id from coaches where user_id = auth.uid())
) with check (
  coach_id in (select id from coaches where user_id = auth.uid())
);
