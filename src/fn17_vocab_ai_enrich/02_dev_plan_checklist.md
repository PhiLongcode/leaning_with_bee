<!-- @file: src/fn17_vocab_ai_enrich/02_dev_plan_checklist.md | @role: Dev plan — REQ-17 -->

# Dev plan — AI enrich hội thoại (FN-17)

## Metadata

| Field | Value |
|-------|-------|
| FN | fn17_vocab_ai_enrich |
| REQ | REQ-17 |
| Trạng thái | In Progress |
| Đồng bộ lần cuối | 2026-05-31 |

## Todo — gate

### Bắt buộc

- [x] `01_requirement.md` chốt AC
- [x] `.feature` + Cucumber/Serenity scenarios (`tests/features/fn17/`)
- [x] Contract `api_design.md` § vocab-enrich
- [x] Migration `20260531160000_vocab_dialogue_native_lang.sql`

**Được phép code:** 2026-05-31

---

## Task 2.5 — TDD (Cucumber.js + Serenity/JS) — **trước** Implementation

**Checklist**

- [x] Cài `tests/` package: `@cucumber/cucumber`, `@serenity-js/*`
- [x] Feature: `tests/features/fn17/vocab_ai_enrich.feature`
- [x] Step defs + Serenity actor: `tests/step-definitions/fn17/`
- [x] Domain validate: `validateDialogue`, `validateEnrichRequest` — **12 scenarios pass**
- [ ] CI hook `npm run test:bdd` (tuỳ pipeline)

**Chạy:** `npm run test:bdd:fn17` (repo root)

---

## Task 3 — Implementation

- [x] Edge Function `supabase/functions/vocab-enrich`
- [x] `src/fn17_vocab_ai_enrich/` domain + repo + use cases
- [x] Mobile: form preview FN-02, Settings ngôn ngữ mẹ đẻ
- [x] FN-01 UI: `DialogueBubbleList`, `ExplanationNativeCard`

---

## Task 4.5 — Performance (k6 + BDD `@perf`)

- [x] Gherkin: `tests/features/perf/vocab_enrich_load.feature`
- [x] Script: `tests/perf/k6/vocab-enrich-smoke.js`
- [ ] Chạy pass trên dev/staging (`PERF_SUPABASE_*` + k6 CLI)

**Chạy:** `npm run test:bdd:perf` hoặc `npm run test:perf`

---

## Ma trận DoD

| AC | Chứng cứ | Pass |
|----|----------|------|
| Validate dialogue 2–5 câu | `npm run test:bdd:fn17` | [x] |
| Preview + lưu từ | Manual / mock enrich test | [ ] |
| Giải thích tiếng mẹ đẻ | Settings + explanation card | [ ] |

**Xác nhận Done FN:** chưa
