<!-- @file: 05_lesson_learn.md | @role: Lesson learn — gate 11-lesson-learn-gate.mdc -->

# Lesson learn

> **Gate ghi file:** [`.cursor/rules/11-lesson-learn-gate.mdc`](../../.cursor/rules/11-lesson-learn-gate.mdc)

| Đã làm tốt | Cần cải thiện | Đề xuất Global |
|------------|---------------|----------------|
| (2026-05-29) `vocabularyRepository` fallback load theo `word` khi thiếu cột `lesson_day`; seed 7×10 trong migration + `dailyVocabularySeed.ts`. | Verify remote sau `apply-all.sql` (7 nhóm × 10 từ); đóng ISS-001 khi `db:sync` hoặc SQL Editor xong. | GISS-001/002: checklist schema trước test mobile; `DATABASE_URL` pooler nếu `db:sync` ENOTFOUND. |
| (2026-05-29) `DROP POLICY IF EXISTS` trong migrations + compose `apply-all.sql` — chạy lại SQL an toàn (ISS-003). | Tự động hóa `db:sync` trên mọi máy dev (region/password). | GISS-004: migration policy phải idempotent. |
