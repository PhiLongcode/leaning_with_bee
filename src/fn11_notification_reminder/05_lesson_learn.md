<!-- @file: 05_lesson_learn.md | @role: Lesson learn — gate 11-lesson-learn-gate.mdc -->

# Lesson learn

> **Gate ghi file:** [`.cursor/rules/11-lesson-learn-gate.mdc`](../../.cursor/rules/11-lesson-learn-gate.mdc)

| Đã làm tốt | Cần cải thiện | Đề xuất Global |
|------------|---------------|----------------|
| (2026-05-29) `notificationRepository` cùng pattern fn10: mock settings khi bảng thiếu, không crash Settings (ISS-001). | Verify upsert `notification_settings` sau `apply-all.sql`. | GISS-001: 404 PGRST205 = schema chưa push, không phải lỗi business logic. |
| (2026-05-29) FN-11 push: `expo-notifications`, `computeReminderSlots`, ưu tiên nội dung FN-05 due; tap → màn SRS. | Cần `npx expo prebuild` / build APK mới sau plugin; chưa có `reminder_*.mp3` khi mở notification. | Lịch local: refresh nội dung due mỗi lần mở app / Lưu cài đặt. |
