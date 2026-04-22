-- Run in Supabase SQL Editor (or supabase db push) after linking the project.
-- Supplements tracking: name, dosage, cycle start date, live day count in UI.

create table if not exists public.supplements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  dosage text not null,
  start_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists supplements_user_start on public.supplements (user_id, start_date desc);

alter table public.supplements enable row level security;

create policy "Users manage own supplements"
  on public.supplements
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_supplements_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists supplements_updated_at on public.supplements;
create trigger supplements_updated_at
  before update on public.supplements
  for each row
  execute function public.set_supplements_updated_at();

 