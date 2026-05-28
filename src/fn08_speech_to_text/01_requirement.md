<!-- @file: src/fn08_speech_to_text/01_requirement.md | @role: SSOT FN — REQ-08 -->

# Speech-to-Text — Yêu cầu chức năng

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-08 |
| STT (bảng tổng hợp) | 8 |
| Nguồn | [`00_requirement_business.md`](../../process/00_requirement_business.md) — §5 dòng 8, §6 REQ-08 |
| Function ID | FN-08 |
| Tên | Speech-to-Text |
| Trạng thái | Draft |

## Tóm tắt (copy từ bảng nghiệp vụ)

| Biểu mẫu | Quy định | Ghi chú |
|----------|----------|---------|
| Màn **Speaking Practice**; API POST `/speech-to-text` | Ghi âm → text; so sánh với mẫu; highlight lỗi (UI) | Whisper hoặc tương đương |

## User story

- Là **người học**, tôi muốn **nói và nhận bản text nhận dạng** để **so với câu mẫu**.

## Acceptance criteria

1. Given tôi ghi âm câu mẫu — When tôi gửi audio lên server — Then tôi nhận được bản text nhận dạng.
2. Given text nhận dạng và câu mẫu — When hiển thị kết quả — Then UI highlight phần khác biệt (lỗi).
3. Given mạng lỗi — When gửi audio — Then hiển thị lỗi rõ ràng, không crash app.

## Out of scope

- Chấm điểm phát âm chi tiết (FN-09); lưu dashboard (FN-10).

## Liên kết

- `.feature`: [`docs/01_specification/features/speech_to_text.feature`](../../docs/01_specification/features/speech_to_text.feature)
- API / design: `docs/02_system_design/` (khi bootstrap contract)
- SSOT tổng: [`00_requirement_business.md`](../../process/00_requirement_business.md)
