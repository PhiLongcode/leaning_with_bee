<!-- @file: src/fn17_vocab_ai_enrich/01_requirement.md | @role: SSOT FN — REQ-17 -->

# AI enrich hội thoại — Yêu cầu chức năng

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-17 |
| Function ID | FN-17 |
| Tên | AI sinh dialogue + giải thích tiếng mẹ đẻ |
| Trạng thái | In Progress |

## Tóm tắt

| Biểu mẫu | Quy định |
|----------|----------|
| Edge `vocab-enrich`; form FN-02 preview | Mode `full` / `enrich`; dialogue 2–5 câu; explanation_native; `profiles.native_language` |

## Test (TDD)

- Cucumber + Serenity/JS: [`tests/features/fn17/`](../../tests/features/fn17/)
- Chạy: `npm run test:bdd:fn17` từ repo root

## Liên kết

- [`docs/01_specification/features/vocab_ai_enrich.feature`](../../docs/01_specification/features/vocab_ai_enrich.feature)
- Edge: [`supabase/functions/vocab-enrich/`](../../supabase/functions/vocab-enrich/)
