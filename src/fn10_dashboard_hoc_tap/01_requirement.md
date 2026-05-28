<!-- @file: src/fn10_dashboard_hoc_tap/01_requirement.md | @role: SSOT FN — REQ-10 -->

# Dashboard học tập — Yêu cầu chức năng

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-10 |
| STT (bảng tổng hợp) | 10 |
| Nguồn | [`00_requirement_business.md`](../../process/00_requirement_business.md) — §5 dòng 10, §6 REQ-10 |
| Function ID | FN-10 |
| Tên | Dashboard học tập |
| Trạng thái | Draft |

## Tóm tắt (copy từ bảng nghiệp vụ)

| Biểu mẫu | Quy định | Ghi chú |
|----------|----------|---------|
| Màn **Progress Dashboard** | Hiển thị streak, XP, thống kê tuần/tháng, speaking score; đồng bộ từ progress & conversation logs | Gamification: achievement — base § Gamification |

## User story

- Là **người học**, tôi muốn **xem tiến độ học và streak** để **duy trì động lực**.

## Acceptance criteria

1. Given tôi đã học liên tục 3 ngày — When tôi mở dashboard — Then tôi thấy streak = 3 và XP tích lũy.
2. Given có speaking score từ FN-09 — When mở dashboard — Then thống kê speaking hiển thị trong kỳ tuần/tháng.
3. Given chưa có dữ liệu — When mở dashboard — Then hiển thị trạng thái empty hợp lý, không lỗi.

## Out of scope

- Achievement đầy đủ (phase sau); push notification (FN-11).

## Liên kết

- `.feature`: [`docs/01_specification/features/dashboard_hoc_tap.feature`](../../docs/01_specification/features/dashboard_hoc_tap.feature)
- API / design: `docs/02_system_design/` (khi bootstrap contract)
- SSOT tổng: [`00_requirement_business.md`](../../process/00_requirement_business.md)
