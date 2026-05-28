<!-- @file: src/fn05_spaced_repetition/01_requirement.md | @role: SSOT FN — REQ-05 -->

# Học theo Spaced Repetition — Yêu cầu chức năng

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-05 |
| STT (bảng tổng hợp) | 5 |
| Nguồn | [`00_requirement_business.md`](../../process/00_requirement_business.md) — §5 dòng 5, §6 REQ-05 |
| Function ID | FN-05 |
| Tên | Học theo Spaced Repetition |
| Trạng thái | Draft |

## Tóm tắt (copy từ bảng nghiệp vụ)

| Biểu mẫu | Quy định | Ghi chú |
|----------|----------|---------|
| Flashcard / queue ôn; `learning_progress` (repetition_level, next_review, accuracy, review_count) | Thuật toán **Leitner hoặc SM-2**; sau học user chọn Again/Hard/Good/Easy → hệ thống tính `next_review`; GET `/learning/schedule` trả việc hôm nay | POST `/learning/review` |

## User story

- Là **người học**, tôi muốn **ôn từ theo lịch spaced repetition** để **nhớ lâu hơn**.

## Acceptance criteria

1. Given từ đang trong hàng đợi ôn — When tôi chọn mức "Good" — Then hệ thống cập nhật next_review sau khoảng thời gian chuẩn thuật toán.
2. Given đã ôn Good — When tôi xem lịch ôn — Then từ xuất hiện trong lịch ôn tương ứng.
3. Given có việc đến hạn hôm nay — When gọi GET `/learning/schedule` — Then API trả danh sách ôn trong ngày.

## Out of scope

- Context review UI (FN-06); notification nhắc (FN-11) — chỉ tích hợp sau.

## Liên kết

- `.feature`: [`docs/01_specification/features/spaced_repetition.feature`](../../docs/01_specification/features/spaced_repetition.feature)
- API / design: `docs/02_system_design/` (khi bootstrap contract)
- SSOT tổng: [`00_requirement_business.md`](../../process/00_requirement_business.md)
