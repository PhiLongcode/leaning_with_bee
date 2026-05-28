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
