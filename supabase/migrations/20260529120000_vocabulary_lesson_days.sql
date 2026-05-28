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
