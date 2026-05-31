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
| Màn **Cài đặt → Thông báo** + **Âm thanh nhắc nhở**; local notification; file `reminder_*.mp3` | **Nhắc ngắt quãng theo giờ:** khung giờ/ngày + khoảng cách hoặc số lần; mốc chia đều; ưu tiên từ đến hạn ôn (FN-05); habit/streak; không spam; tắt được | [`brand/AUDIO_MANIFEST.md`](../../brand/AUDIO_MANIFEST.md) |

## User story

- Là **người học**, tôi muốn **nhận nhắc ôn và streak theo giờ trong ngày** để **không bỏ lỡ lịch học**.

## Acceptance criteria

1. Given tôi cấu hình khung 08:00–20:00 và khoảng 3 giờ — When đến mốc nhắc — Then thiết bị hiển thị thông báo (ưu tiên từ đến hạn ôn từ FN-05).
2. Given user tắt notification trong cài đặt — When đến giờ nhắc — Then không gửi thông báo.
3. Given offline và lịch ôn local — When đến giờ — Then vẫn nhắc được từ dữ liệu local (nếu platform hỗ trợ).
4. Given nhiều từ đến hạn cùng khung — When gửi nhắc — Then gộp một thông báo, không spam.
5. Given bật «Âm thanh nhắc nhở» — When user mở app từ notification — Then phát `reminder_default.mp3` (hoặc biến thể đã chọn).

## Out of scope

- Push server phức tạp đa thiết bị; email/SMS.

## Liên kết

- `.feature`: [`docs/01_specification/features/notification_reminder.feature`](../../docs/01_specification/features/notification_reminder.feature)
- API / design: `docs/02_system_design/` (khi bootstrap contract)
- SSOT tổng: [`00_requirement_business.md`](../../process/00_requirement_business.md)
