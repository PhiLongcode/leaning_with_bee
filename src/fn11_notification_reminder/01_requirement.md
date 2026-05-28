<!-- @file: src/fn11_notification_reminder/01_requirement.md | @role: SSOT FN — REQ-11 -->

# Notification Reminder — Yêu cầu chức năng

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-11 |
| STT (bảng tổng hợp) | 11 |
| Nguồn | [`00_requirement_business.md`](../../process/00_requirement_business.md) — §5 dòng 11, §6 REQ-11 |
| Function ID | FN-11 |
| Tên | Notification Reminder |
| Trạng thái | Draft |

## Tóm tắt (copy từ bảng nghiệp vụ)

| Biểu mẫu | Quy định | Ghi chú |
|----------|----------|---------|
| Local/push notification (platform) | Daily, review due, streak; không spam; tôn trọng cài đặt tắt thông báo | Offline: nhắc khi có lịch local |

## User story

- Là **người học**, tôi muốn **nhận nhắc ôn và streak** để **không bỏ lỡ lịch học**.

## Acceptance criteria

1. Given có từ đến hạn review hôm nay — When đến giờ nhắc đã cấu hình — Then thiết bị hiển thị thông báo review.
2. Given user tắt notification trong cài đặt — When đến giờ nhắc — Then không gửi thông báo.
3. Given offline và lịch ôn local — When đến giờ — Then vẫn nhắc được từ dữ liệu local (nếu platform hỗ trợ).

## Out of scope

- Push server phức tạp đa thiết bị; email/SMS.

## Liên kết

- `.feature`: [`docs/01_specification/features/notification_reminder.feature`](../../docs/01_specification/features/notification_reminder.feature)
- API / design: `docs/02_system_design/` (khi bootstrap contract)
- SSOT tổng: [`00_requirement_business.md`](../../process/00_requirement_business.md)
