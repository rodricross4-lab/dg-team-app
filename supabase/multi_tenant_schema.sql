create table if not exists app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text check (role in ('coach','student','admin')) not null default 'coach',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists coaches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  name text not null,
  cref text,
  plan text default 'starter',
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table students add column if not exists coach_id uuid references coaches(id) on delete cascade;
alter table students add column if not exists user_id uuid references app_users(id) on delete set null;
alter table students add column if not exists active boolean default true;

create table if not exists coach_student_relations (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references coaches(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  status text check (status in ('active','paused','finished')) default 'active',
  created_at timestamptz default now(),
  unique(coach_id, student_id)
);

alter table students enable row level security;
alter table workouts enable row level security;
alter table workout_exercises enable row level security;
alter table logbook_sets enable row level security;
alter table prs enable row level security;
alter table assessments enable row level security;
alter table checkins enable row level security;
alter table photos enable row level security;
alter table app_users enable row level security;
alter table coaches enable row level security;
alter table coach_student_relations enable row level security;

create policy if not exists app_users_self_select on app_users
  for select using (auth.uid() = id);

create policy if not exists coaches_owner_select on coaches
  for select using (user_id = auth.uid());

create policy if not exists coaches_owner_write on coaches
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy if not exists students_coach_access on students
  for all using (
    coach_id in (select id from coaches where user_id = auth.uid())
    or user_id = auth.uid()
  ) with check (
    coach_id in (select id from coaches where user_id = auth.uid())
    or user_id = auth.uid()
  );

create policy if not exists workouts_coach_access on workouts
  for all using (
    student_id in (
      select s.id from students s
      join coaches c on c.id = s.coach_id
      where c.user_id = auth.uid()
    )
  ) with check (
    student_id in (
      select s.id from students s
      join coaches c on c.id = s.coach_id
      where c.user_id = auth.uid()
    )
  );

create policy if not exists logbook_sets_coach_or_student_access on logbook_sets
  for all using (
    student_id in (
      select s.id from students s
      left join coaches c on c.id = s.coach_id
      where c.user_id = auth.uid() or s.user_id = auth.uid()
    )
  ) with check (
    student_id in (
      select s.id from students s
      left join coaches c on c.id = s.coach_id
      where c.user_id = auth.uid() or s.user_id = auth.uid()
    )
  );

create index if not exists idx_students_coach_id on students(coach_id);
create index if not exists idx_students_user_id on students(user_id);
create index if not exists idx_coaches_user_id on coaches(user_id);
create index if not exists idx_coach_student_relations_coach_id on coach_student_relations(coach_id);
create index if not exists idx_coach_student_relations_student_id on coach_student_relations(student_id);
