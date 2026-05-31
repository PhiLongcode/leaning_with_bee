-- FN-17 — dialogue, explanation_native, native_language, AI enrich permission

alter table public.profiles
  add column if not exists native_language text not null default 'vi'
  check (native_language in ('vi', 'en', 'zh', 'ja', 'ko'));

alter table public.vocabulary
  add column if not exists dialogue jsonb,
  add column if not exists explanation_native jsonb;

create table if not exists public.vocab_ai_generations (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  word text not null,
  mode text not null check (mode in ('full', 'enrich')),
  native_language text not null,
  request jsonb,
  response jsonb,
  created_at timestamptz not null default now()
);

alter table public.vocab_ai_generations enable row level security;

drop policy if exists vocab_ai_generations_select_own on public.vocab_ai_generations;
create policy vocab_ai_generations_select_own on public.vocab_ai_generations
  for select to authenticated
  using (
    device_id = (
      select p.device_id from public.profiles p where p.id = auth.uid()
    )
  );

drop policy if exists vocab_ai_generations_insert_own on public.vocab_ai_generations;
create policy vocab_ai_generations_insert_own on public.vocab_ai_generations
  for insert to authenticated
  with check (
    device_id = (
      select p.device_id from public.profiles p where p.id = auth.uid()
    )
  );

grant select, insert on public.vocab_ai_generations to authenticated;

-- default permission flag for AI vocab enrich
update public.app_system_config
set permissions = permissions || jsonb_build_object('allow_ai_vocab_enrich', true)
where id = 1
  and not (permissions ? 'allow_ai_vocab_enrich');
