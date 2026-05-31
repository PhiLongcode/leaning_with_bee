# Integration API tests (Phase 2)

Vitest gọi **Supabase dev/staging thật** qua repository trong `src/fn**/infrastructure/`.

## Env

```bash
TEST_SUPABASE_URL=https://xxx.supabase.co
TEST_SUPABASE_ANON_KEY=eyJ...
TEST_DEVICE_ID=test-device-optional
```

Hoặc map từ `EXPO_PUBLIC_SUPABASE_*` (apps/mobile/.env.development).

Nếu thiếu env → suite **skip** (không fail CI local).

**Rate limit auth:** Vitest dùng **một** session/worker (`getIntegrationContext`). Nếu Supabase báo rate limit, đặt `TEST_SUPABASE_ACCESS_TOKEN` (JWT từ app dev) hoặc chờ vài phút rồi chạy lại.

## Chạy

```bash
npm run test:api
npm run test:api:full   # unit + BDD gate + API
```

## Phạm vi

| File | Mô tả |
|------|--------|
| `fn01-vocabulary.api.spec.ts` | `learning_days`, `getVocabularyLesson` |
| `p0-learning-loop.api.spec.ts` | FN01 → learningFlow → FN06 → FN05 → FN10 |
| `p1-fns.api.spec.ts` | FN02,03,04,07,11,15 list/read |
| `rls-negative.api.spec.ts` | wrong `device_id` isolation |

| `fn08-fn09-speech.api.spec.ts` | Edge `speech-practice` |
| `fn17-vocab-enrich.api.spec.ts` | Edge `vocab-enrich` |

Ma trận đầy đủ: [`process/00_global_test_report.md`](../../process/00_global_test_report.md).
