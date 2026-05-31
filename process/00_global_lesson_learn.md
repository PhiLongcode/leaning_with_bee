<!-- @file: process/00_global_lesson_learn.md | @role: Lesson learn toàn dự án (roll-up từ fn**/05) -->

# Global lesson learn

> SSOT bài học áp dụng **≥2 FN** hoặc quy trình repo.  
> Nguồn: cột **Đề xuất Global** trong `src/fn**/05_lesson_learn.md` (sau gate [11-lesson-learn-gate](../../.cursor/rules/11-lesson-learn-gate.mdc)).  
> Issue tương ứng: [`00_global_issue_log.md`](00_global_issue_log.md) (GISS).

| Ngày | Nguồn FN / GISS | Đã làm tốt / Insight | Cần tránh / Cải thiện |
|------|-----------------|----------------------|------------------------|
| 2026-05-29 | fn01, GISS-001/002 | Trước test app mobile: verify schema remote (`learning_days`, `lesson_day`, `learner_stats`) hoặc chạy `supabase/apply-all.sql`. | Không chỉ tin `npm run db:sync` trên Windows — `db.*.supabase.co` thường IPv6-only; dùng `DATABASE_URL` (Session pooler) từ Dashboard hoặc SQL Editor. |
| 2026-05-29 | fn01, GISS-004 | Migration SQL idempotent: `DROP POLICY IF EXISTS` trước `CREATE POLICY`; `npm run db:compose` chèn drop khi gộp `apply-all.sql`. | Chạy lại full SQL trên DB đã có một phần → lỗi 42710 policy duplicate. |
| 2026-05-29 | fn02, fn04, GISS-003 | Adapter Supabase: `isInvalidUuid` + resolve `word` → UUID; `remoteUnavailable` khi 404 bảng (fn10/fn11). | Không POST mock id (`day1-1`, `uv-…`) lên cột `uuid`. |
| 2026-05-29 | mobile, GISS-005 | Build APK local: Gradle 8.13, `ext.ndkVersion` 28.2 trước `expo-root-project`, Metro shim Node (`stream`/`ws`) — `npm run mobile:build:apk`. | Sau `expo prebuild --clean` cần chạy lại `build-apk.js` patch hoặc giữ `android/` đã chỉnh. |

## Liên kết FN

| FN | File lesson |
|----|-------------|
| fn01 | [`src/fn01_hoc_tu_vung_ngu_canh/05_lesson_learn.md`](../src/fn01_hoc_tu_vung_ngu_canh/05_lesson_learn.md) |
| fn02 | [`src/fn02_quan_ly_tu_vung_ca_nhan/05_lesson_learn.md`](../src/fn02_quan_ly_tu_vung_ca_nhan/05_lesson_learn.md) |
| fn04 | [`src/fn04_learning_collection/05_lesson_learn.md`](../src/fn04_learning_collection/05_lesson_learn.md) |
| fn10 | [`src/fn10_dashboard_hoc_tap/05_lesson_learn.md`](../src/fn10_dashboard_hoc_tap/05_lesson_learn.md) |
| fn11 | [`src/fn11_notification_reminder/05_lesson_learn.md`](../src/fn11_notification_reminder/05_lesson_learn.md) |
