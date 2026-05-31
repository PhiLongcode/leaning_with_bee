<!-- @file: src/fn08_speech_to_text/02_dev_plan_checklist.md | @role: Dev plan — REQ-08 -->

# Dev plan — Speech-to-Text

## Metadata

| Field | Value |
|-------|-------|
| FN | fn08 — REQ-08 |
| Trạng thái | **Done (DoD)** MVP |
| Đồng bộ | 2026-05-31 |

## Implementation

- [x] Edge `speech-practice` — chấm + lưu `speech_sessions`
- [x] Mobile nhập transcript + gọi Edge (fallback local)
- [ ] Whisper audio STT — phase 2

## Test

- [x] `tests/fn08/speech.spec.ts`

**Xác nhận Done FN:** **có** (2026-05-31) — MVP text-in; STT audio sau.
