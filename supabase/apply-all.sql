-- Chạy một lần trong Supabase Dashboard → SQL Editor (project wtprvgolyoxrjvutvbsq)
-- Hoặc: npx supabase login && npm run db:push

-- === 20260528160000_initial_schema.sql ===

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

create or replace function public.current_device_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select device_id from public.profiles where id = auth.uid();
$$;

create policy profiles_select_own on public.profiles for select using (auth.uid() = id);
create policy profiles_insert_own on public.profiles for insert with check (auth.uid() = id);
create policy profiles_update_own on public.profiles for update using (auth.uid() = id);

create policy vocabulary_select_all on public.vocabulary for select to authenticated using (true);
create policy vocabulary_insert_auth on public.vocabulary for insert to authenticated with check (true);

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

-- === 20260528210000_grants_and_profile_bootstrap.sql ===

grant usage on schema public to anon, authenticated;
grant select on table public.vocabulary to anon, authenticated;
grant select on table public.conversation_scenarios to anon, authenticated;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.user_vocabulary to authenticated;
grant select, insert, update, delete on table public.user_sentences to authenticated;
grant select, insert, update, delete on table public.learning_progress to authenticated;
grant select, insert, update, delete on table public.learning_collections to authenticated;
grant select, insert, update, delete on table public.collection_items to authenticated;
grant select, insert, update, delete on table public.conversation_logs to authenticated;
grant insert on table public.vocabulary to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_device_id text;
begin
  v_device_id := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'device_id'), ''),
    new.id::text
  );
  insert into public.profiles (id, device_id)
  values (new.id, v_device_id)
  on conflict (id) do update
    set device_id = excluded.device_id
    where public.profiles.device_id is distinct from excluded.device_id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

revoke all on function public.handle_new_user() from public;
grant execute on function public.handle_new_user() to service_role;

create or replace function public.current_device_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select device_id from public.profiles where id = auth.uid();
$$;

revoke all on function public.current_device_id() from public;
grant execute on function public.current_device_id() to authenticated;

drop policy if exists collection_items_via_collection on public.collection_items;
create policy collection_items_via_collection on public.collection_items
  for all to authenticated
  using (
    exists (
      select 1 from public.learning_collections c
      where c.id = collection_id and c.device_id = public.current_device_id()
    )
  )
  with check (
    exists (
      select 1 from public.learning_collections c
      where c.id = collection_id and c.device_id = public.current_device_id()
    )
  );

drop policy if exists vocabulary_select_all on public.vocabulary;
create policy vocabulary_select_all on public.vocabulary
  for select to anon, authenticated using (true);

drop policy if exists conversation_scenarios_read on public.conversation_scenarios;
create policy conversation_scenarios_read on public.conversation_scenarios
  for select to anon, authenticated using (true);

-- === 20260528210100_seed_catalog.sql ===

insert into public.vocabulary (
  word, meaning, pronunciation, part_of_speech, context, example, topic, difficulty_level
)
select v.word, v.meaning, v.pronunciation, v.part_of_speech, v.context, v.example, v.topic, v.difficulty_level
from (
  values
    ('deploy', 'triển khai (phần mềm lên môi trường chạy)', '/dɪˈplɔɪ/', 'verb',
     'We will deploy the hotfix to production after QA signs off.',
     'The team deploys every Friday during the release window.', 'Software Development', 2),
    ('stakeholder', 'bên liên quan', '/ˈsteɪkˌhoʊldər/', 'noun',
     'Please loop in stakeholders before we change the timeline.',
     'Stakeholders reviewed the roadmap in yesterday''s sync.', 'Workplace Communication', 2),
    ('blocker', 'vấn đề chặn tiến độ', '/ˈblɒkər/', 'noun',
     'There is a blocker on the API integration — we need credentials.',
     'She flagged the dependency as a blocker in stand-up.', 'Agile / Scrum', 1),
    ('sync', 'họp đồng bộ nhanh', '/sɪŋk/', 'noun',
     'Let''s keep the daily sync under fifteen minutes.',
     'We discussed blockers in this morning''s sync.', 'Agile / Scrum', 1),
    ('rollback', 'hoàn tác bản triển khai', '/ˈroʊlˌbæk/', 'noun',
     'Prepare a rollback plan before the release window.',
     'The team executed a rollback after error rates spiked.', 'Software Development', 3)
) as v(word, meaning, pronunciation, part_of_speech, context, example, topic, difficulty_level)
where not exists (select 1 from public.vocabulary existing where existing.word = v.word);

insert into public.conversation_scenarios (title, description, level, topic)
select v.title, v.description, v.level, v.topic
from (
  values
    ('Stand-up update', 'Report progress and blockers in a daily stand-up.', 'B1', 'Agile / Scrum'),
    ('Code review request', 'Ask a teammate to review your pull request.', 'B1', 'Software Development'),
    ('Timeline negotiation', 'Discuss deadline changes with a stakeholder.', 'B2', 'Workplace Communication')
) as v(title, description, level, topic)
where not exists (
  select 1 from public.conversation_scenarios existing where existing.title = v.title
);
