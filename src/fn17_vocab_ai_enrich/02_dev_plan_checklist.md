<!-- @file: src/fn17_vocab_ai_enrich/02_dev_plan_checklist.md | @role: Dev plan — REQ-17 -->

# Dev plan — AI enrich hội thoại (FN-17)

## Metadata

| Field | Value |
|-------|-------|
| FN | fn17_vocab_ai_enrich |
| REQ | REQ-17 |
| Trạng thái | **Done (DoD)** |
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
- [x] Domain validate: `validateDialogue`, `validateEnrichRequest` — **7 scenarios pass**
- [x] Unit Vitest: `tests/fn17/vocabValidation.spec.ts`, `vocabEnrichUseCases.spec.ts`
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
| Preview + lưu từ | FN-02 UI + Edge deploy | [x] |
| Giải thích tiếng mẹ đẻ | Settings + explanation card | [x] |

**Xác nhận Done FN:** **có** (2026-05-31) — `npm run test:bdd:fn17` 7/7; [`00_global_test_report.md`](../../process/00_global_test_report.md).
