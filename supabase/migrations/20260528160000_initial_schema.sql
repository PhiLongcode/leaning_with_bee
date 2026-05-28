-- Học cùng Bee — initial schema (SRS)
-- Run: supabase db push (when linked to project)

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  device_id text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  word text not null,
  meaning text not null,
  pronunciation text,
  part_of_speech text,
  context text not null,
  example text not null,
  topic text not null,
  difficulty_level int not null default 1 check (difficulty_level between 1 and 5),
  created_at timestamptz not null default now()
);

create table if not exists public.user_vocabulary (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  vocab_id uuid not null references public.vocabulary (id) on delete cascade,
  is_favorite boolean not null default false,
  is_difficult boolean not null default false,
  created_at timestamptz not null default now(),
  unique (device_id, vocab_id)
);

create table if not exists public.user_sentences (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  sentence text not null,
  translation text not null,
  context text,
  topic text,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  vocab_id uuid not null references public.vocabulary (id) on delete cascade,
  repetition_level int not null default 0,
  next_review timestamptz,
  accuracy float,
  review_count int not null default 0,
  unique (device_id, vocab_id)
);

create table if not exists public.learning_collections (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.learning_collections (id) on delete cascade,
  item_type text not null check (item_type in ('vocabulary', 'sentence')),
  item_id uuid not null
);

create table if not exists public.conversation_scenarios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  level text,
  topic text
);

create table if not exists public.conversation_logs (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  scenario_id uuid references public.conversation_scenarios (id),
  transcript jsonb,
  score float,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_vocab_device on public.user_vocabulary (device_id);
create index if not exists idx_learning_progress_device_next on public.learning_progress (device_id, next_review);

alter table public.profiles enable row level security;
alter table public.vocabulary enable row level security;
alter table public.user_vocabulary enable row level security;
alter table public.user_sentences enable row level security;
alter table public.learning_progress enable row level security;
alter table public.learning_collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.conversation_scenarios enable row level security;
alter table public.conversation_logs enable row level security;

-- Helper: device_id for current user via profiles
create or replace function public.current_device_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select device_id from public.profiles where id = auth.uid();
$$;

-- Profiles: own row only
create policy profiles_select_own on public.profiles for select using (auth.uid() = id);
create policy profiles_insert_own on public.profiles for insert with check (auth.uid() = id);
create policy profiles_update_own on public.profiles for update using (auth.uid() = id);

-- Vocabulary: read all (catalog); insert/update via authenticated (MVP)
create policy vocabulary_select_all on public.vocabulary for select to authenticated using (true);
create policy vocabulary_insert_auth on public.vocabulary for insert to authenticated with check (true);

-- User-scoped tables
create policy user_vocabulary_device on public.user_vocabulary for all to authenticated
  using (device_id = public.current_device_id())
  with check (device_id = public.current_device_id());

create policy user_sentences_device on public.user_sentences for all to authenticated
  using (device_id = public.current_device_id())
  with check (device_id = public.current_device_id());

create policy learning_progress_device on public.learning_progress for all to authenticated
  using (device_id = public.current_device_id())
  with check (device_id = public.current_device_id());

create policy learning_collections_device on public.learning_collections for all to authenticated
  using (device_id = public.current_device_id())
  with check (device_id = public.current_device_id());

create policy collection_items_via_collection on public.collection_items for all to authenticated
  using (
    exists (
      select 1 from public.learning_collections c
      where c.id = collection_id and c.device_id = public.current_device_id()
    )
  );

create policy conversation_scenarios_read on public.conversation_scenarios for select to authenticated using (true);

create policy conversation_logs_device on public.conversation_logs for all to authenticated
  using (device_id = public.current_device_id())
  with check (device_id = public.current_device_id());
