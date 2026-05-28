<!-- @file: src/fn07_ai_conversation/01_requirement.md | @role: SSOT FN — REQ-07 -->

# AI Conversation Practice — Yêu cầu chức năng

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-07 |
| STT (bảng tổng hợp) | 7 |
| Nguồn | [`00_requirement_business.md`](../../process/00_requirement_business.md) — §5 dòng 7, §6 REQ-07 |
| Function ID | FN-07 |
| Tên | AI Conversation Practice |
| Trạng thái | Draft |

## Tóm tắt (copy từ bảng nghiệp vụ)

| Biểu mẫu | Quy định | Ghi chú |
|----------|----------|---------|
| Màn **AI Chat**; `conversation_scenarios`, `conversation_logs` | Chọn scenario (Interview, Scrum, Team, Presentation, Customer…); POST start/message; lưu transcript + score | OpenAI / backend proxy |

## User story

- Là **người học**, tôi muốn **luyện hội thoại với AI theo kịch bản công việc** để **tự tin giao tiếp**.

## Acceptance criteria

1. Given scenario "Technical Interview" — When tôi gửi tin nhắn đầu tiên — Then AI phản hồi theo ngữ cảnh interview.
2. Given phiên chat đang mở — When tôi gửi thêm tin — Then transcript được append và lưu.
3. Given phiên kết thúc — When xem lịch sử — Then thấy transcript và score (nếu có) trong log.

## Out of scope

- STT/pronunciation (FN-08, FN-09); dashboard tổng hợp (FN-10).

## Liên kết

- `.feature`: [`docs/01_specification/features/ai_conversation.feature`](../../docs/01_specification/features/ai_conversation.feature)
- API / design: `docs/02_system_design/` (khi bootstrap contract)
- SSOT tổng: [`00_requirement_business.md`](../../process/00_requirement_business.md)
