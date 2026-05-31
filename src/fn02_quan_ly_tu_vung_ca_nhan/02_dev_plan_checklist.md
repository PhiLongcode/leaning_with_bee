<!-- @file: src/fn02_quan_ly_tu_vung_ca_nhan/02_dev_plan_checklist.md | @role: Dev plan — REQ-02 -->

# Dev plan — Quản lý từ vựng cá nhân

## Metadata

| Field | Value |
|-------|-------|
| FN | fn02_quan_ly_tu_vung_ca_nhan — REQ-02 |
| Trạng thái | **Done (DoD)** |
| Đồng bộ lần cuối | 2026-05-31 |

## Task 2.5 — TDD (Cucumber.js + Serenity/JS)

- [x] `tests/features/fn02/add_vocabulary_ai.feature`
- [x] Mock enrich + save flow step defs
- [x] `npm run test:bdd:fn02` — pass (2026-05-31)
- [x] Unit Vitest: `tests/fn02/userVocabulary.spec.ts` (mock repo)
- [x] API integration: P0 + `p1-fns` FN02 list

## Task 3 — Implementation

- [x] `UserVocabularyScreen` — form full/enrich, AI preview, lưu
- [x] Tích hợp FN-17 `enrichVocabulary`, `saveEnrichedVocabulary`

## Ma trận DoD

| AC | Pass |
|----|------|
| Form thêm từ + preview AI | [x] |
| Lưu vào user_vocabulary | [x] |

**Xác nhận Done FN:** **có** (2026-05-31) — `npm run test:bdd:fn02` 2/2 pass; [`00_global_test_report.md`](../../process/00_global_test_report.md).
