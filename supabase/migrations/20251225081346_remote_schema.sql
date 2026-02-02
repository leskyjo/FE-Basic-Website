-- Core schema for FE Web App onboarding and questionnaire persistence
-- This migration defines the minimal tables required by the current Next.js app:
-- - profiles
-- - questionnaire_answers

-- PROFILES
-- Stores basic user metadata and onboarding progression.
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  preferred_name text,
  zip_code text,
  onboarding_step integer not null default 0,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- QUESTIONNAIRE ANSWERS
-- Stores per-question answers for the Life Plan questionnaire.
-- The app upserts on (user_id, question_id), so we enforce that as the primary key.
create table if not exists public.questionnaire_answers (
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null,
  group_id text not null,
  answer_value text,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

-- Basic Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.questionnaire_answers enable row level security;

-- Allow authenticated users to manage only their own profile.
drop policy if exists "profiles_self_access" on public.profiles;
create policy "profiles_self_access" on public.profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Allow authenticated users to read/write only their own questionnaire answers.
drop policy if exists "questionnaire_answers_self_access" on public.questionnaire_answers;
create policy "questionnaire_answers_self_access" on public.questionnaire_answers
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Simple trigger to keep updated_at current.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_profiles
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_updated_at_questionnaire_answers
before update on public.questionnaire_answers
for each row execute function public.set_updated_at();