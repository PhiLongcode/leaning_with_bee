<!-- @file: 05_lesson_learn.md | @role: Lesson learn — gate 11-lesson-learn-gate.mdc -->

# Lesson learn

> **Gate ghi file:** [`.cursor/rules/11-lesson-learn-gate.mdc`](../../.cursor/rules/11-lesson-learn-gate.mdc)

| Đã làm tốt | Cần cải thiện | Đề xuất Global |
|------------|---------------|----------------|
| (2026-05-29) `userVocabularyRepository`: lookup `vocabulary` theo `word` từ seed → UUID thật; mock chỉ khi không resolve hoặc id không phải UUID (ISS-001). | E2E sau khi fn01 schema đủ: thêm/xóa favorite dùng UUID DB, không còn `uv-*`. | GISS-003: adapter Supabase không gửi mock id lên cột `uuid`. |
