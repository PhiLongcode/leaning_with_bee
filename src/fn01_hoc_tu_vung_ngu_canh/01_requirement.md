<!-- @file: src/fn01_hoc_tu_vung_ngu_canh/01_requirement.md | @role: SSOT FN — REQ-01 -->

# Học từ vựng theo ngữ cảnh — Yêu cầu chức năng

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-01 |
| STT (bảng tổng hợp) | 1 |
| Nguồn | [`00_requirement_business.md`](../../process/00_requirement_business.md) — §5 dòng 1, §6 REQ-01 |
| Function ID | FN-01 |
| Tên | Học từ vựng theo ngữ cảnh |
| Trạng thái | Draft |

## Tóm tắt (copy từ bảng nghiệp vụ)

| Biểu mẫu | Quy định | Ghi chú |
|----------|----------|---------|
| Màn **Vocabulary Learning**; entity `vocabulary` (word, meaning, pronunciation, part_of_speech, context, example, topic, difficulty_level) | Mỗi từ **bắt buộc** có context + example + topic; **không** hiển thị học từ đơn lẻ không ngữ cảnh; hỗ trợ audio phát âm | Nền tảng cho FN-05, FN-06 |

## User story

- Là **người học**, tôi muốn **xem từ trong ngữ cảnh công việc** để **hiểu cách dùng thực tế**.

## Acceptance criteria

1. Given từ "deploy" có context, example và topic Software Development — When tôi mở bài học từ đó — Then tôi thấy nghĩa, phát âm, loại từ, ví dụ và ngữ cảnh.
2. Given màn học từ — When hiển thị nội dung — Then không có màn chỉ hiển thị từ đơn lẻ không context.
3. Given từ có pronunciation — When tôi bấm nghe phát âm — Then audio phát đúng từ đó.

## Out of scope

- Catalog từ hệ thống (seed/admin); spaced repetition (FN-05); context review quiz (FN-06).

## Liên kết

- `.feature`: [`docs/01_specification/features/hoc_tu_vung_ngu_canh.feature`](../../docs/01_specification/features/hoc_tu_vung_ngu_canh.feature)
- API / design: `docs/02_system_design/` (khi bootstrap contract)
- SSOT tổng: [`00_requirement_business.md`](../../process/00_requirement_business.md)
