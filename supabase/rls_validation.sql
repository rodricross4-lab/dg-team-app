-- DG TEAM APP - RLS validation checks.
-- Run this after supabase/schema.sql in the Supabase SQL Editor.
-- The first sections are read-only. Manual write checks are commented at the end.

with required_tables(table_name) as (
  values
    ('tenants'),
    ('app_users'),
    ('coaches'),
    ('students'),
    ('exercises'),
    ('workouts'),
    ('workout_exercises'),
    ('workout_sessions'),
    ('logbook_sets'),
    ('prs'),
    ('assessments'),
    ('checkins'),
    ('photos'),
    ('periodization_weeks'),
    ('timeline_events'),
    ('ai_insights'),
    ('notifications')
)
select
  required_tables.table_name,
  case
    when pg_class.relrowsecurity then 'ok'
    else 'missing_rls'
  end as rls_status
from required_tables
join pg_class on pg_class.relname = required_tables.table_name
join pg_namespace on pg_namespace.oid = pg_class.relnamespace
where pg_namespace.nspname = 'public'
order by required_tables.table_name;

with required_helpers(function_name) as (
  values
    ('dg_current_tenant_id'),
    ('dg_is_current_coach'),
    ('dg_can_access_student'),
    ('dg_student_tenant_matches'),
    ('dg_can_access_workout'),
    ('dg_workout_tenant_matches'),
    ('dg_session_matches_student_tenant')
)
select
  required_helpers.function_name,
  case when pg_proc.proname is null then 'missing' else 'ok' end as helper_status
from required_helpers
cross join pg_namespace
left join pg_proc
  on pg_proc.pronamespace = pg_namespace.oid
  and pg_proc.proname = required_helpers.function_name
where pg_namespace.nspname = 'public'
order by required_helpers.function_name;

with required_policies(table_name, policy_name) as (
  values
    ('app_users', 'app_users_self_select'),
    ('app_users', 'app_users_self_update'),
    ('tenants', 'tenants_member_select'),
    ('coaches', 'coaches_owner_all'),
    ('students', 'students_coach_or_self_all'),
    ('exercises', 'exercises_tenant_or_global_select'),
    ('exercises', 'exercises_tenant_write'),
    ('workouts', 'workouts_access'),
    ('workout_exercises', 'workout_exercises_access'),
    ('workout_sessions', 'workout_sessions_access'),
    ('logbook_sets', 'logbook_sets_access'),
    ('prs', 'prs_access'),
    ('assessments', 'assessments_access'),
    ('checkins', 'checkins_access'),
    ('photos', 'photos_access'),
    ('periodization_weeks', 'periodization_weeks_access'),
    ('timeline_events', 'timeline_events_access'),
    ('ai_insights', 'ai_insights_access'),
    ('notifications', 'notifications_coach_access')
)
select
  required_policies.table_name,
  required_policies.policy_name,
  case when pg_policies.policyname is null then 'missing' else 'ok' end as policy_status
from required_policies
left join pg_policies
  on pg_policies.schemaname = 'public'
  and pg_policies.tablename = required_policies.table_name
  and pg_policies.policyname = required_policies.policy_name
order by required_policies.table_name, required_policies.policy_name;

with required_policy_fragments(table_name, policy_name, fragment) as (
  values
    ('coaches', 'coaches_owner_all', 'dg_current_tenant_id'),
    ('students', 'students_coach_or_self_all', 'dg_current_tenant_id'),
    ('students', 'students_coach_or_self_all', 'dg_is_current_coach'),
    ('workouts', 'workouts_access', 'dg_can_access_student'),
    ('workouts', 'workouts_access', 'dg_student_tenant_matches'),
    ('workout_exercises', 'workout_exercises_access', 'dg_can_access_workout'),
    ('workout_sessions', 'workout_sessions_access', 'dg_student_tenant_matches'),
    ('logbook_sets', 'logbook_sets_access', 'dg_student_tenant_matches'),
    ('logbook_sets', 'logbook_sets_access', 'dg_session_matches_student_tenant'),
    ('prs', 'prs_access', 'dg_student_tenant_matches'),
    ('assessments', 'assessments_access', 'dg_student_tenant_matches'),
    ('checkins', 'checkins_access', 'dg_student_tenant_matches'),
    ('photos', 'photos_access', 'dg_student_tenant_matches'),
    ('periodization_weeks', 'periodization_weeks_access', 'dg_student_tenant_matches'),
    ('timeline_events', 'timeline_events_access', 'dg_student_tenant_matches'),
    ('ai_insights', 'ai_insights_access', 'dg_student_tenant_matches'),
    ('notifications', 'notifications_coach_access', 'dg_is_current_coach')
)
select
  required_policy_fragments.table_name,
  required_policy_fragments.policy_name,
  required_policy_fragments.fragment,
  case
    when position(required_policy_fragments.fragment in coalesce(pg_policies.qual, '') || ' ' || coalesce(pg_policies.with_check, '')) > 0
      then 'ok'
    else 'missing_fragment'
  end as fragment_status
from required_policy_fragments
left join pg_policies
  on pg_policies.schemaname = 'public'
  and pg_policies.tablename = required_policy_fragments.table_name
  and pg_policies.policyname = required_policy_fragments.policy_name
order by required_policy_fragments.table_name, required_policy_fragments.policy_name, required_policy_fragments.fragment;

select 'workouts_tenant_mismatch' as check_name, count(*) as mismatch_count
from workouts
join students on students.id = workouts.student_id
where workouts.tenant_id is distinct from students.tenant_id
union all
select 'workout_sessions_tenant_mismatch', count(*)
from workout_sessions
join students on students.id = workout_sessions.student_id
where workout_sessions.tenant_id is distinct from students.tenant_id
union all
select 'logbook_sets_student_tenant_mismatch', count(*)
from logbook_sets
join students on students.id = logbook_sets.student_id
where logbook_sets.tenant_id is distinct from students.tenant_id
union all
select 'logbook_sets_session_mismatch', count(*)
from logbook_sets
join workout_sessions on workout_sessions.id = logbook_sets.session_id
where logbook_sets.tenant_id is distinct from workout_sessions.tenant_id
  or logbook_sets.student_id is distinct from workout_sessions.student_id
union all
select 'notifications_tenant_mismatch', count(*)
from notifications
join coaches on coaches.id = notifications.coach_id
where notifications.tenant_id is distinct from coaches.tenant_id;

-- Manual RLS smoke test notes:
-- 1. Use two real auth users in the same Supabase project:
--    coach A in tenant A and coach B in tenant B.
-- 2. In SQL Editor, impersonate coach A only for this transaction:
--    begin;
--    select set_config('request.jwt.claim.sub', '<coach-a-auth-user-uuid>', true);
--    select auth.uid();
-- 3. Confirm coach A can select only rows from tenant A:
--    select distinct tenant_id from students;
-- 4. Confirm inserting with coach A's real coach_id and tenant_id succeeds.
-- 5. Confirm inserting any child row with another tenant_id fails RLS.
-- 6. Confirm coach B cannot select coach A's students after switching the claim:
--    select set_config('request.jwt.claim.sub', '<coach-b-auth-user-uuid>', true);
--    select * from students where tenant_id = '<tenant-a-id>';
-- 7. rollback;
