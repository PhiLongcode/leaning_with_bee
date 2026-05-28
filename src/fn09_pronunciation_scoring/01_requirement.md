<!-- @file: src/fn09_pronunciation_scoring/01_requirement.md | @role: SSOT FN — REQ-09 -->

# Pronunciation Scoring — Yêu cầu chức năng

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-09 |
| STT (bảng tổng hợp) | 9 |
| Nguồn | [`00_requirement_business.md`](../../process/00_requirement_business.md) — §5 dòng 9, §6 REQ-09 |
| Function ID | FN-09 |
| Tên | Pronunciation Scoring |
| Trạng thái | Draft |

## Tóm tắt (copy từ bảng nghiệp vụ)

| Biểu mẫu | Quy định | Ghi chú |
|----------|----------|---------|
| Kết quả speaking sau STT; POST `/pronunciation-score` | AI trả điểm/theo tiêu chí: pronunciation, fluency, accuracy, confidence; lưu vào log/dashboard | Liên FN-08, FN-10 |

## User story

- Là **người học**, tôi muốn **nhận điểm phát âm sau khi nói** để **biết cần cải thiện gì**.

## Acceptance criteria

1. Given đã có text nhận dạng và câu mẫu — When tôi yêu cầu chấm điểm — Then tôi thấy điểm và các tiêu chí pronunciation, fluency, accuracy.
2. Given điểm đã tính — When lưu phiên — Then score ghi vào log phục vụ dashboard.
3. Given thiếu input STT — When gọi chấm điểm — Then trả lỗi validation, không chấm ảo.

## Out of scope

- Ghi âm/STT (FN-08); widget dashboard đầy đủ (FN-10).

## Liên kết

- `.feature`: [`docs/01_specification/features/pronunciation_scoring.feature`](../../docs/01_specification/features/pronunciation_scoring.feature)
- API / design: `docs/02_system_design/` (khi bootstrap contract)
- SSOT tổng: [`00_requirement_business.md`](../../process/00_requirement_business.md)
