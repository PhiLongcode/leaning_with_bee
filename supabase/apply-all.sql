-- Tự động gộp từ supabase/migrations/ — 2026-05-28
-- Chạy: npm run db:sync
-- Hoặc Supabase Dashboard → SQL Editor
-- Policies: DROP IF EXISTS trước CREATE (chạy lại an toàn khi schema đã có một phần)

-- === 20260528000000_schema_deployments.sql ===

-- Theo dõi migration đã apply (db-sync)
create table if not exists public.schema_deployments (
  name text primary key,
  applied_at timestamptz not null default now()
);

-- === 20260528160000_initial_schema.sql ===

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
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select using (auth.uid() = id);
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert with check (auth.uid() = id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (auth.uid() = id);

-- Vocabulary: read all (catalog); insert/update via authenticated (MVP)
drop policy if exists vocabulary_select_all on public.vocabulary;
create policy vocabulary_select_all on public.vocabulary for select to authenticated using (true);
drop policy if exists vocabulary_insert_auth on public.vocabulary;
create policy vocabulary_insert_auth on public.vocabulary for insert to authenticated with check (true);

-- User-scoped tables
drop policy if exists user_vocabulary_device on public.user_vocabulary;
create policy user_vocabulary_device on public.user_vocabulary for all to authenticated
  using (device_id = public.current_device_id())
  with check (device_id = public.current_device_id());

drop policy if exists user_sentences_device on public.user_sentences;
create policy user_sentences_device on public.user_sentences for all to authenticated
  using (device_id = public.current_device_id())
  with check (device_id = public.current_device_id());

drop policy if exists learning_progress_device on public.learning_progress;
create policy learning_progress_device on public.learning_progress for all to authenticated
  using (device_id = public.current_device_id())
  with check (device_id = public.current_device_id());

drop policy if exists learning_collections_device on public.learning_collections;
create policy learning_collections_device on public.learning_collections for all to authenticated
  using (device_id = public.current_device_id())
  with check (device_id = public.current_device_id());

drop policy if exists collection_items_via_collection on public.collection_items;
create policy collection_items_via_collection on public.collection_items for all to authenticated
  using (
    exists (
      select 1 from public.learning_collections c
      where c.id = collection_id and c.device_id = public.current_device_id()
    )
  );

drop policy if exists conversation_scenarios_read on public.conversation_scenarios;
create policy conversation_scenarios_read on public.conversation_scenarios for select to authenticated using (true);

drop policy if exists conversation_logs_device on public.conversation_logs;
create policy conversation_logs_device on public.conversation_logs for all to authenticated
  using (device_id = public.current_device_id())
  with check (device_id = public.current_device_id());

-- === 20260528210000_grants_and_profile_bootstrap.sql ===

-- Grants (Data API) + profile bootstrap + policy fixes
-- Ref: .agents/skills/supabase/SKILL.md

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

-- Profile row when auth user is created (device_id from signInAnonymously options.data)
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

-- Safer device helper (must be signed in)
create or replace function public.current_device_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select device_id
  from public.profiles
  where id = auth.uid();
$$;

revoke all on function public.current_device_id() from public;
grant execute on function public.current_device_id() to authenticated;

-- collection_items: WITH CHECK was missing on ALL policy
drop policy if exists collection_items_via_collection on public.collection_items;
create policy collection_items_via_collection on public.collection_items
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.learning_collections c
      where c.id = collection_id
        and c.device_id = public.current_device_id()
    )
  )
  with check (
    exists (
      select 1
      from public.learning_collections c
      where c.id = collection_id
        and c.device_id = public.current_device_id()
    )
  );

-- Catalog readable before full session (optional pre-auth)
drop policy if exists vocabulary_select_all on public.vocabulary;
create policy vocabulary_select_all on public.vocabulary
  for select
  to anon, authenticated
  using (true);

drop policy if exists conversation_scenarios_read on public.conversation_scenarios;
create policy conversation_scenarios_read on public.conversation_scenarios
  for select
  to anon, authenticated
  using (true);

-- === 20260528210100_seed_catalog.sql ===

-- Seed catalog — FN-01 demo data (idempotent)
insert into public.vocabulary (
  word,
  meaning,
  pronunciation,
  part_of_speech,
  context,
  example,
  topic,
  difficulty_level
)
select
  v.word,
  v.meaning,
  v.pronunciation,
  v.part_of_speech,
  v.context,
  v.example,
  v.topic,
  v.difficulty_level
from (
  values
    (
      'deploy',
      'triển khai (phần mềm lên môi trường chạy)',
      '/dɪˈplɔɪ/',
      'verb',
      'We will deploy the hotfix to production after QA signs off.',
      'The team deploys every Friday during the release window.',
      'Software Development',
      2
    ),
    (
      'stakeholder',
      'bên liên quan',
      '/ˈsteɪkˌhoʊldər/',
      'noun',
      'Please loop in stakeholders before we change the timeline.',
      'Stakeholders reviewed the roadmap in yesterday''s sync.',
      'Workplace Communication',
      2
    ),
    (
      'blocker',
      'vấn đề chặn tiến độ',
      '/ˈblɒkər/',
      'noun',
      'There is a blocker on the API integration — we need credentials.',
      'She flagged the dependency as a blocker in stand-up.',
      'Agile / Scrum',
      1
    ),
    (
      'sync',
      'họp đồng bộ nhanh',
      '/sɪŋk/',
      'noun',
      'Let''s keep the daily sync under fifteen minutes.',
      'We discussed blockers in this morning''s sync.',
      'Agile / Scrum',
      1
    ),
    (
      'rollback',
      'hoàn tác bản triển khai',
      '/ˈroʊlˌbæk/',
      'noun',
      'Prepare a rollback plan before the release window.',
      'The team executed a rollback after error rates spiked.',
      'Software Development',
      3
    )
) as v(word, meaning, pronunciation, part_of_speech, context, example, topic, difficulty_level)
where not exists (
  select 1 from public.vocabulary existing where existing.word = v.word
);

insert into public.conversation_scenarios (title, description, level, topic)
select v.title, v.description, v.level, v.topic
from (
  values
    ('Stand-up update', 'Report progress and blockers in a daily stand-up.', 'B1', 'Agile / Scrum'),
    ('Code review request', 'Ask a teammate to review your pull request.', 'B1', 'Software Development'),
    ('Timeline negotiation', 'Discuss deadline changes with a stakeholder.', 'B2', 'Workplace Communication')
) as v(title, description, level, topic)
where not exists (
  select 1
  from public.conversation_scenarios existing
  where existing.title = v.title
);

-- === 20260529000000_fn08_10_11_tables.sql ===

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

-- === 20260529120000_vocabulary_lesson_days.sql ===

-- Lộ trình 7 ngày — metadata + cột gắn từ vựng theo ngày

create table if not exists public.learning_days (
  day_number int primary key check (day_number between 1 and 7),
  title text not null,
  subtitle text not null,
  topic text not null,
  word_count int not null default 10
);

alter table public.vocabulary
  add column if not exists lesson_day int check (lesson_day between 1 and 7),
  add column if not exists lesson_order int not null default 0;

create index if not exists idx_vocabulary_lesson_day on public.vocabulary (lesson_day, lesson_order);

alter table public.learning_days enable row level security;

drop policy if exists learning_days_read on public.learning_days;
create policy learning_days_read on public.learning_days
  for select to anon, authenticated using (true);

grant select on table public.learning_days to anon, authenticated;

insert into public.learning_days (day_number, title, subtitle, topic, word_count)
values
  (1, 'Ngày 1', 'Stand-up & Agile', 'Agile / Scrum', 10),
  (2, 'Ngày 2', 'Code & Git', 'Software Development', 10),
  (3, 'Ngày 3', 'Giao tiếp team', 'Workplace Communication', 10),
  (4, 'Ngày 4', 'Email & báo cáo', 'Business Writing', 10),
  (5, 'Ngày 5', 'Chất lượng & bug', 'Quality Assurance', 10),
  (6, 'Ngày 6', 'Kế hoạch & timeline', 'Project Planning', 10),
  (7, 'Ngày 7', 'Phỏng vấn & thăng tiến', 'Career Growth', 10)
on conflict (day_number) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  topic = excluded.topic,
  word_count = excluded.word_count;

-- === 20260529120100_seed_7_day_vocabulary.sql ===

-- 7 ngày × 10 từ = 70 từ workplace English (idempotent theo word)

-- Gán ngày cho 5 từ seed cũ
update public.vocabulary set lesson_day = 1, lesson_order = 1 where word = 'deploy' and (lesson_day is null or lesson_order = 0);
update public.vocabulary set lesson_day = 1, lesson_order = 2 where word = 'sync' and (lesson_day is null or lesson_order = 0);
update public.vocabulary set lesson_day = 1, lesson_order = 3 where word = 'blocker' and (lesson_day is null or lesson_order = 0);
update public.vocabulary set lesson_day = 3, lesson_order = 1 where word = 'stakeholder' and (lesson_day is null or lesson_order = 0);
update public.vocabulary set lesson_day = 2, lesson_order = 1 where word = 'rollback' and (lesson_day is null or lesson_order = 0);

insert into public.vocabulary (
  word, meaning, pronunciation, part_of_speech, context, example, topic, difficulty_level, lesson_day, lesson_order
)
select v.word, v.meaning, v.pronunciation, v.part_of_speech, v.context, v.example, v.topic, v.difficulty_level, v.lesson_day, v.lesson_order
from (
  values
    -- === Ngày 1: Stand-up & Agile ===
    ('deploy', 'triển khai (phần mềm)', '/dɪˈplɔɪ/', 'verb', 'We will deploy the hotfix to production after QA signs off.', 'The team deploys every Friday during the release window.', 'Agile / Scrum', 2, 1, 1),
    ('sync', 'họp đồng bộ nhanh', '/sɪŋk/', 'noun', 'Let''s keep the daily sync under fifteen minutes.', 'We discussed blockers in this morning''s sync.', 'Agile / Scrum', 1, 1, 2),
    ('blocker', 'vấn đề chặn tiến độ', '/ˈblɒkər/', 'noun', 'There is a blocker on the API integration — we need credentials.', 'She flagged the dependency as a blocker in stand-up.', 'Agile / Scrum', 1, 1, 3),
    ('stand-up', 'họp stand-up hàng ngày', '/ˈstænd ʌp/', 'noun', 'In stand-up, each person shares what they did yesterday and today''s plan.', 'Our stand-up starts at 9:30 every weekday.', 'Agile / Scrum', 1, 1, 4),
    ('sprint', 'chu kỳ phát triển ngắn', '/sprɪnt/', 'noun', 'This sprint goal is to ship the checkout redesign.', 'We committed eight story points for the sprint.', 'Agile / Scrum', 2, 1, 5),
    ('backlog', 'danh sách việc chờ làm', '/ˈbæk.lɒɡ/', 'noun', 'Please add the bug to the backlog and prioritize it.', 'The product owner groomed the backlog on Tuesday.', 'Agile / Scrum', 2, 1, 6),
    ('retrospective', 'buổi họp cải tiến sau sprint', '/ˌretrəˈspektɪv/', 'noun', 'In retrospective we discussed what went well and what to improve.', 'The team agreed on two action items in the retrospective.', 'Agile / Scrum', 3, 1, 7),
    ('velocity', 'tốc độ hoàn thành của team', '/vəˈlɒsəti/', 'noun', 'Our velocity dropped because two engineers were on leave.', 'Velocity helps us forecast the next release.', 'Agile / Scrum', 3, 1, 8),
    ('increment', 'phần sản phẩm hoàn thành trong sprint', '/ˈɪŋkrəmənt/', 'noun', 'The increment must be potentially shippable at sprint end.', 'Stakeholders reviewed the latest increment in the demo.', 'Agile / Scrum', 3, 1, 9),
    ('scrum', 'khung làm việc Agile', '/skrʌm/', 'noun', 'We follow Scrum with two-week sprints and defined roles.', 'Scrum ceremonies keep the team aligned.', 'Agile / Scrum', 2, 1, 10),

    -- === Ngày 2: Code & Git ===
    ('rollback', 'hoàn tác bản triển khai', '/ˈroʊlˌbæk/', 'noun', 'Prepare a rollback plan before the release window.', 'The team executed a rollback after error rates spiked.', 'Software Development', 3, 2, 1),
    ('commit', 'lưu thay đổi vào Git', '/kəˈmɪt/', 'verb', 'Please commit your changes with a clear message.', 'She committed the fix before lunch.', 'Software Development', 1, 2, 2),
    ('merge', 'gộp nhánh code', '/mɜːrdʒ/', 'verb', 'We will merge feature-branch into main after review.', 'The merge conflict took an hour to resolve.', 'Software Development', 2, 2, 3),
    ('pull request', 'yêu cầu review code', '/pʊl rɪˈkwest/', 'noun', 'Open a pull request when the feature is ready for review.', 'I left comments on your pull request.', 'Software Development', 2, 2, 4),
    ('refactor', 'tái cấu trúc code', '/riːˈfæktər/', 'verb', 'We need to refactor this module before adding features.', 'He refactored the service to reduce duplication.', 'Software Development', 3, 2, 5),
    ('debug', 'gỡ lỗi', '/diːˈbʌɡ/', 'verb', 'I spent the afternoon debugging the payment API.', 'Can you help me debug this null pointer?', 'Software Development', 2, 2, 6),
    ('pipeline', 'chuỗi build/deploy tự động', '/ˈpaɪplaɪn/', 'noun', 'The pipeline failed at the integration test stage.', 'We fixed the pipeline and redeployed.', 'Software Development', 3, 2, 7),
    ('hotfix', 'bản sửa khẩn cấp', '/ˈhɒtfɪks/', 'noun', 'We shipped a hotfix for the login outage.', 'The hotfix went live within two hours.', 'Software Development', 2, 2, 8),
    ('artifact', 'file/build output từ CI', '/ˈɑːrtɪfækt/', 'noun', 'Download the build artifact from the release page.', 'The pipeline stores artifacts for thirty days.', 'Software Development', 3, 2, 9),
    ('lint', 'kiểm tra style code tự động', '/lɪnt/', 'verb', 'Run lint before you push to catch formatting issues.', 'The linter flagged unused imports.', 'Software Development', 2, 2, 10),

    -- === Ngày 3: Giao tiếp team ===
    ('stakeholder', 'bên liên quan', '/ˈsteɪkˌhoʊldər/', 'noun', 'Please loop in stakeholders before we change the timeline.', 'Stakeholders reviewed the roadmap in yesterday''s sync.', 'Workplace Communication', 2, 3, 1),
    ('align', 'thống nhất, căn chỉnh', '/əˈlaɪn/', 'verb', 'Let''s align on priorities before the client call.', 'We aligned with design on the new flow.', 'Workplace Communication', 2, 3, 2),
    ('escalate', 'leo thang (báo cấp trên)', '/ˈeskəleɪt/', 'verb', 'If the issue persists, escalate to the platform team.', 'She escalated the outage to on-call.', 'Workplace Communication', 3, 3, 3),
    ('clarify', 'làm rõ', '/ˈklærəfaɪ/', 'verb', 'Could you clarify the acceptance criteria?', 'He clarified the scope in the meeting notes.', 'Workplace Communication', 1, 3, 4),
    ('follow-up', 'theo dõi sau cuộc họp', '/ˈfɒloʊ ʌp/', 'noun', 'I''ll send a follow-up email with action items.', 'Her follow-up closed the open questions.', 'Workplace Communication', 2, 3, 5),
    ('bandwidth', 'năng lực / thời gian làm thêm', '/ˈbændwɪdθ/', 'noun', 'I don''t have bandwidth for another project this week.', 'Do you have bandwidth to review this doc?', 'Workplace Communication', 2, 3, 6),
    ('touch base', 'trao đổi nhanh', '/tʌtʃ beɪs/', 'phrasal verb', 'Let''s touch base after the stand-up.', 'We touched base on the migration plan.', 'Workplace Communication', 2, 3, 7),
    ('loop in', 'mời tham gia (email/họp)', '/luːp ɪn/', 'phrasal verb', 'Loop in legal before we sign the contract.', 'I looped in the data team on the analytics bug.', 'Workplace Communication', 2, 3, 8),
    ('actionable', 'có thể hành động ngay', '/ˈækʃənəbl/', 'adjective', 'Please give actionable feedback, not vague comments.', 'The retrospective notes were clear and actionable.', 'Workplace Communication', 3, 3, 9),
    ('heads-up', 'báo trước', '/hedz ʌp/', 'noun', 'Just a heads-up: production deploy is at 6 PM.', 'Thanks for the heads-up about the policy change.', 'Workplace Communication', 2, 3, 10),

    -- === Ngày 4: Email & báo cáo ===
    ('deadline', 'hạn chót', '/ˈdedlaɪn/', 'noun', 'The deadline for the proposal is Friday EOD.', 'We met the deadline despite the outage.', 'Business Writing', 1, 4, 1),
    ('milestone', 'cột mốc dự án', '/ˈmaɪlstoʊn/', 'noun', 'Beta launch is the next milestone on the roadmap.', 'We celebrated the milestone with a demo.', 'Business Writing', 2, 4, 2),
    ('scope', 'phạm vi công việc', '/skoʊp/', 'noun', 'That request is out of scope for this sprint.', 'We documented the scope in the SOW.', 'Business Writing', 2, 4, 3),
    ('deliverable', 'sản phẩm bàn giao', '/dɪˈlɪvərəbl/', 'noun', 'The main deliverable is a working API by Q2.', 'All deliverables were signed off by the client.', 'Business Writing', 3, 4, 4),
    ('concise', 'súc tích', '/kənˈsaɪs/', 'adjective', 'Keep the status update concise — one page max.', 'Her concise summary saved us twenty minutes.', 'Business Writing', 2, 4, 5),
    ('acknowledge', 'xác nhận đã nhận', '/əkˈnɒlɪdʒ/', 'verb', 'Please acknowledge receipt of the security policy.', 'He acknowledged the risk in writing.', 'Business Writing', 2, 4, 6),
    ('prioritize', 'ưu tiên hóa', '/praɪˈɒrətaɪz/', 'verb', 'We need to prioritize customer-facing bugs.', 'The PM prioritized features for the next quarter.', 'Business Writing', 2, 4, 7),
    ('EOD', 'cuối ngày làm việc', '/ˌiː əʊ ˈdiː/', 'abbreviation', 'Send the report by EOD Thursday.', 'I''ll review the contract EOD tomorrow.', 'Business Writing', 1, 4, 8),
    ('FYI', 'để bạn biết', '/ˌef waɪ ˈaɪ/', 'abbreviation', 'FYI — the office will be closed on Monday.', 'FYI, I updated the shared doc with latest figures.', 'Business Writing', 1, 4, 9),
    ('as per', 'theo như', '/æz pɜːr/', 'phrase', 'As per our discussion, I attached the revised timeline.', 'As per policy, access requests need manager approval.', 'Business Writing', 2, 4, 10),

    -- === Ngày 5: Chất lượng & bug ===
    ('regression', 'lỗi tái phát sau khi sửa', '/rɪˈɡreʃn/', 'noun', 'QA found a regression in the checkout flow.', 'We added tests to prevent regression.', 'Quality Assurance', 3, 5, 1),
    ('reproduce', 'tái hiện lỗi', '/ˌriːprəˈdjuːs/', 'verb', 'I cannot reproduce the bug on staging.', 'Steps to reproduce are in the ticket.', 'Quality Assurance', 2, 5, 2),
    ('workaround', 'cách xử lý tạm', '/ˈwɜːrkəraʊnd/', 'noun', 'There is a workaround until the patch ships.', 'Support shared a workaround with customers.', 'Quality Assurance', 2, 5, 3),
    ('root cause', 'nguyên nhân gốc', '/ruːt kɔːz/', 'noun', 'We identified the root cause in the cache layer.', 'The postmortem documents the root cause.', 'Quality Assurance', 3, 5, 4),
    ('severity', 'mức độ nghiêm trọng', '/sɪˈverəti/', 'noun', 'Please set severity to P1 for payment failures.', 'Severity was downgraded after the hotfix.', 'Quality Assurance', 2, 5, 5),
    ('triage', 'phân loại ưu tiên bug', '/ˈtriːɑːʒ/', 'verb', 'We triage incoming bugs every morning.', 'On-call triaged the alerts within ten minutes.', 'Quality Assurance', 3, 5, 6),
    ('patch', 'bản vá', '/pætʃ/', 'noun', 'Security released a patch for the vulnerability.', 'Apply the patch before the audit next week.', 'Quality Assurance', 2, 5, 7),
    ('verify', 'xác minh', '/ˈverɪfaɪ/', 'verb', 'Please verify the fix in production.', 'QA verified all acceptance criteria.', 'Quality Assurance', 1, 5, 8),
    ('acceptance criteria', 'tiêu chí nghiệm thu', '/əkˈseptəns kraɪˈtɪəriə/', 'noun', 'The story is done when acceptance criteria pass.', 'We updated acceptance criteria with the PO.', 'Quality Assurance', 3, 5, 9),
    ('test case', 'kịch bản kiểm thử', '/test keɪs/', 'noun', 'Add a test case for the edge case we missed.', 'The test case covers offline mode.', 'Quality Assurance', 2, 5, 10),

    -- === Ngày 6: Kế hoạch & timeline ===
    ('estimate', 'ước lượng (effort)', '/ˈestɪmeɪt/', 'verb', 'Can you estimate the backend work in story points?', 'We estimated three days for integration.', 'Project Planning', 2, 6, 1),
    ('capacity', 'năng lực team (thời gian)', '/kəˈpæsəti/', 'noun', 'Sprint capacity is lower due to holidays.', 'We planned capacity before committing stories.', 'Project Planning', 2, 6, 2),
    ('dependency', 'phụ thuộc (task/team)', '/dɪˈpendənsi/', 'noun', 'The UI task has a dependency on the API contract.', 'We tracked dependencies on the program board.', 'Project Planning', 3, 6, 3),
    ('roadmap', 'lộ trình sản phẩm', '/ˈroʊdmæp/', 'noun', 'The Q3 roadmap includes mobile notifications.', 'Leadership reviewed the roadmap in the offsite.', 'Project Planning', 2, 6, 4),
    ('kickoff', 'họp khởi động dự án', '/ˈkɪkɒf/', 'noun', 'Project kickoff is scheduled for next Monday.', 'We aligned roles and risks at kickoff.', 'Project Planning', 2, 6, 5),
    ('sign-off', 'phê duyệt chính thức', '/saɪn ɒf/', 'noun', 'We need legal sign-off before launch.', 'Client sign-off arrived this morning.', 'Project Planning', 2, 6, 6),
    ('baseline', 'mốc ban đầu để so sánh', '/ˈbeɪslaɪn/', 'noun', 'We set a performance baseline before optimization.', 'The scope baseline changed after phase two.', 'Project Planning', 3, 6, 7),
    ('buffer', 'thời gian dự phòng', '/ˈbʌfər/', 'noun', 'Add a two-day buffer for integration risk.', 'The schedule includes buffer for holidays.', 'Project Planning', 2, 6, 8),
    ('resource', 'nhân lực / tài nguyên', '/ˈriːsɔːrs/', 'noun', 'We need another backend resource for the migration.', 'Resources were reallocated to the critical path.', 'Project Planning', 2, 6, 9),
    ('critical path', 'chuỗi công việc quyết định tiến độ', '/ˈkrɪtɪkl pæθ/', 'noun', 'Delay on the API is on the critical path.', 'We monitored the critical path weekly.', 'Project Planning', 3, 6, 10),

    -- === Ngày 7: Phỏng vấn & thăng tiến ===
    ('collaborate', 'hợp tác', '/kəˈlæbəreɪt/', 'verb', 'I collaborate closely with design and QA.', 'We collaborated across three time zones.', 'Career Growth', 1, 7, 1),
    ('initiative', 'chủ động', '/ɪˈnɪʃətɪv/', 'noun', 'She took initiative to automate the report.', 'Tell me about a time you showed initiative.', 'Career Growth', 2, 7, 2),
    ('mentorship', 'cố vấn / hướng dẫn', '/ˈmentɔːrʃɪp/', 'noun', 'Mentorship helped me grow into a tech lead role.', 'He provides mentorship to junior developers.', 'Career Growth', 2, 7, 3),
    ('ownership', 'chủ động chịu trách nhiệm', '/ˈoʊnərʃɪp/', 'noun', 'We expect ownership end-to-end for production features.', 'She demonstrated ownership during the incident.', 'Career Growth', 2, 7, 4),
    ('accountability', 'trách nhiệm giải trình', '/əˌkaʊntəˈbɪləti/', 'noun', 'Clear accountability reduces confusion in incidents.', 'The RACI matrix defines accountability.', 'Career Growth', 3, 7, 5),
    ('trade-off', 'đánh đổi', '/ˈtreɪd ɒf/', 'noun', 'There is a trade-off between speed and quality.', 'We discussed trade-offs in the architecture review.', 'Career Growth', 3, 7, 6),
    ('scalable', 'có thể mở rộng', '/ˈskeɪləbl/', 'adjective', 'We need a scalable solution for ten times traffic.', 'The new design is more scalable and maintainable.', 'Career Growth', 3, 7, 7),
    ('impact', 'tác động / giá trị mang lại', '/ˈɪmpækt/', 'noun', 'Describe the business impact of your last project.', 'The feature had measurable impact on retention.', 'Career Growth', 2, 7, 8),
    ('leverage', 'tận dụng', '/ˈlevərɪdʒ/', 'verb', 'We can leverage existing APIs instead of rebuilding.', 'She leveraged her network to unblock hiring.', 'Career Growth', 3, 7, 9),
    ('proactive', 'chủ động phòng ngừa', '/proʊˈæktɪv/', 'adjective', 'Be proactive about flagging risks early.', 'His proactive communication prevented an outage.', 'Career Growth', 2, 7, 10)
) as v(word, meaning, pronunciation, part_of_speech, context, example, topic, difficulty_level, lesson_day, lesson_order)
where not exists (
  select 1 from public.vocabulary existing where existing.word = v.word
);

-- Đảm bảo từ đã tồn tại được gán đúng ngày
update public.vocabulary v set lesson_day = s.lesson_day, lesson_order = s.lesson_order
from (values
  ('deploy', 1, 1), ('sync', 1, 2), ('blocker', 1, 3), ('stakeholder', 3, 1), ('rollback', 2, 1)
) as s(word, lesson_day, lesson_order)
where v.word = s.word;
