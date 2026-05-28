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
