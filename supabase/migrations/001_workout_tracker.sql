-- Run in Supabase SQL Editor (or supabase db push) after linking the project.
-- Workout sessions + per-set logs for the Pulse training tracker.

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  session_date date not null,
  day_key text not null check (day_key in ('day1', 'day2', 'day3', 'day4', 'abs')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, session_date, day_key)
);

create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions (id) on delete cascade,
  exercise_id text not null,
  set_index int not null check (set_index >= 0),
  weight_kg numeric,
  reps int,
  unique (session_id, exercise_id, set_index)
);

create index if not exists workout_sessions_user_date on public.workout_sessions (user_id, session_date desc);
create index if not exists workout_sets_session on public.workout_sets (session_id);

alter table public.workout_sessions enable row level security;
alter table public.workout_sets enable row level security;

create policy "Users manage own workout_sessions"
  on public.workout_sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage sets for own sessions"
  on public.workout_sets
  for all
  using (
    exists (
      select 1
      from public.workout_sessions s
      where s.id = workout_sets.session_id
        and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.workout_sessions s
      where s.id = workout_sets.session_id
        and s.user_id = auth.uid()
    )
  );
