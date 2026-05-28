-- FN-08/09/10/11 supporting tables

create table if not exists public.learner_stats (
  device_id text primary key,
  streak int not null default 0,
  xp int not null default 0,
  last_study_date date,
  words_learned_today int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.speech_sessions (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  prompt text not null,
  transcript text,
  score float,
  created_at timestamptz not null default now()
);

create table if not exists public.pronunciation_scores (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  session_id uuid references public.speech_sessions (id) on delete cascade,
  word text not null,
  score float not null,
  feedback text,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_settings (
  device_id text primary key,
  enabled boolean not null default true,
  reminder_hour int not null default 9 check (reminder_hour between 0 and 23),
  reminder_minute int not null default 0 check (reminder_minute between 0 and 59),
  updated_at timestamptz not null default now()
);

alter table public.learner_stats enable row level security;
alter table public.speech_sessions enable row level security;
alter table public.pronunciation_scores enable row level security;
alter table public.notification_settings enable row level security;

drop policy if exists learner_stats_device on public.learner_stats;
create policy learner_stats_device on public.learner_stats for all to authenticated
  using (device_id = public.current_device_id())
  with check (device_id = public.current_device_id());

drop policy if exists speech_sessions_device on public.speech_sessions;
create policy speech_sessions_device on public.speech_sessions for all to authenticated
  using (device_id = public.current_device_id())
  with check (device_id = public.current_device_id());

drop policy if exists pronunciation_scores_device on public.pronunciation_scores;
create policy pronunciation_scores_device on public.pronunciation_scores for all to authenticated
  using (device_id = public.current_device_id())
  with check (device_id = public.current_device_id());

drop policy if exists notification_settings_device on public.notification_settings;
create policy notification_settings_device on public.notification_settings for all to authenticated
  using (device_id = public.current_device_id())
  with check (device_id = public.current_device_id());

grant select, insert, update, delete on public.learner_stats to authenticated;
grant select, insert, update, delete on public.speech_sessions to authenticated;
grant select, insert, update, delete on public.pronunciation_scores to authenticated;
grant select, insert, update, delete on public.notification_settings to authenticated;
