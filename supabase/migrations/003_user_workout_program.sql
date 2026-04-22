-- Per-user custom workout program (one row per user, JSONB definition).

create table if not exists public.user_workout_programs (
  user_id uuid primary key references auth.users (id) on delete cascade,
  program jsonb not null default '{"version":1,"days":[]}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_workout_programs_updated on public.user_workout_programs (updated_at desc);

alter table public.user_workout_programs enable row level security;

create policy "Users manage own workout program"
  on public.user_workout_programs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Allow dynamic day keys (user-defined) while keeping type text.
alter table public.workout_sessions
  drop constraint if exists workout_sessions_day_key_check;

alter table public.workout_sessions
  add constraint workout_sessions_day_key_length check (char_length(day_key) >= 1 and char_length(day_key) <= 64);
