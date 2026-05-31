<!-- @file: src/fn11_notification_reminder/02_dev_plan_checklist.md | @role: Dev plan — REQ-11 -->

# Dev plan — Notification Reminder

## Metadata

| Field | Value |
|-------|-------|
| FN | fn11_notification_reminder — REQ-11 |
| Trạng thái | **Done (DoD)** |
| Đồng bộ lần cuối | 2026-05-29 |

## Task 3 — Implementation

- [x] `expo-notifications` + `NotificationsScreen`
- [x] `computeReminderSlots`, ưu tiên FN-05 due message
- [x] Migration `20260529120000_notification_window_prefs.sql` (window trên DB)
- [x] `NotificationSettings` + repo lưu window_start/end/interval
- [x] Mở app từ notification → FN-05
- [ ] Custom sound `reminder.mp3` (AC phase 2)
- [ ] Chạy migration remote (`db:push` hoặc SQL Editor)

## Ma trận DoD

| AC | Pass |
|----|------|
| Khung giờ + lịch local | [x] |
| Nội dung ưu tiên ôn từ | [x] |
| Prefs trên Supabase | [x] code — cần apply migration |

**Xác nhận Done FN:** **có** (2026-05-31) — unit `tests/fn11/reminderSchedule.spec.ts` 3/3; rebuild APK khi đổi native plugin. G4: apply migration window columns.
