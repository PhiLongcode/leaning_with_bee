<!-- @file: src/fn07_ai_conversation/02_dev_plan_checklist.md | @role: Dev plan — REQ-07 -->

# Dev plan — AI Conversation Practice

## Metadata

| Field | Value |
|-------|-------|
| FN | fn07_ai_conversation — REQ-07 |
| Trạng thái | **Done (DoD)** |
| Đồng bộ lần cuối | 2026-05-29 |

## Task 3 — Implementation

- [x] Edge `supabase/functions/ai-conversation` (start / message / history + LLM gateway)
- [x] `createSupabaseConversationRepository` gọi Edge qua `functions.invoke`
- [x] Mobile `AiChatScreen` + `getConversationRepository(deviceId)`
- [ ] Lưu `conversation_logs` qua authenticated client (hiện Edge + service role)
- [x] Unit mock: `tests/fn07/conversationMock.spec.ts`

## Ma trận DoD

| AC | Pass |
|----|------|
| Chọn scenario + chat | [x] Edge LLM |
| Transcript lưu DB | [x] |
| Score conversation | [ ] phase 2 |

**Xác nhận Done FN:** **có** (2026-05-31) — MVP chat + persist; score defer.

**Deploy:** `npm run ai:secrets` (cần `supabase link` trước)
