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

## Kim tự tháp (Spec-driven)

| Tầng | Nội dung |
|------|----------|
| **Goal** | Người học hiểu và dùng từ vựng tiếng Anh IT trong ngữ cảnh công việc thực tế — không học từ đơn lẻ. |
| **Actor** | Người học (learner) |
| **Capability** | Hệ thống hiển thị từ kèm context, example, topic và hội thoại workplace 2–5 câu. |
| **Feature** | FN-01 — Học từ vựng theo ngữ cảnh |
| **User Story** | (xem § User story bên dưới) |
| **Scenario** | [`hoc_tu_vung_ngu_canh.feature`](../../docs/01_specification/features/hoc_tu_vung_ngu_canh.feature), [`tests/features/fn01/`](../../tests/features/fn01/) |

## Ubiquitous Language (DDD)

| Thuật ngữ | Ý nghĩa | Domain type |
|-----------|---------|-------------|
| vocabulary | Một mục từ trong bài học | `Vocabulary` |
| dialogue | Hội thoại workplace 2–5 câu, ≥2 speaker | `VocabularyDialogue` |
| explanationNative | Giải thích một khối bằng ngôn ngữ mẹ đẻ | `ExplanationNative` |
| context / example / topic | Ngữ cảnh, ví dụ, chủ đề bắt buộc mỗi từ | fields trên `Vocabulary` |

## Tóm tắt (copy từ bảng nghiệp vụ)

| Biểu mẫu | Quy định | Ghi chú |
|----------|----------|---------|
| Màn **Vocabulary Learning**; entity `vocabulary` (+ `dialogue` jsonb) | Mỗi từ **bắt buộc** context + example + topic + **hội thoại 2–5 câu** (≥2 vai: BA, Tester, PM, DEV, Customer, DevOps, Network…); từ mục tiêu trong dialogue; **không** học từ đơn lẻ; audio phát âm | Nền tảng FN-05, FN-06; import FN-16 |

## User story

- Là **người học**, tôi muốn **xem từ kèm đoạn hội thoại công việc ngắn** để **hiểu cách dùng thực tế trong team phát triển phần mềm**.

## Acceptance criteria

1. Given từ "deploy" có context, example, topic và dialogue 3 câu (PM ↔ DEV) — When mở bài học — Then thấy nghĩa, phát âm, hội thoại dạng chat và từ "deploy" trong dialogue.
2. Given dialogue — Then có **2–5 câu**, **≥2 speaker**, ngữ cảnh workplace IT.
3. Given màn học — Then **không** chỉ hiển thị từ đơn lẻ không context/dialogue.
4. Given pronunciation — When bấm nghe — Then audio phát đúng.

## Out of scope

- Import file (FN-16); spaced repetition (FN-05); context review quiz (FN-06).

## Liên kết

- `.feature`: [`docs/01_specification/features/hoc_tu_vung_ngu_canh.feature`](../../docs/01_specification/features/hoc_tu_vung_ngu_canh.feature)
- Import format: `requirement_base.md` § FN-16
- SSOT tổng: [`00_requirement_business.md`](../../process/00_requirement_business.md)
