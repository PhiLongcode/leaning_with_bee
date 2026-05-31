<!-- @file: src/fn05_spaced_repetition/02_dev_plan_checklist.md | @role: Dev plan — REQ-05 -->

# Dev plan — Spaced Repetition

## Metadata

| Field | Value |
|-------|-------|
| FN | fn05_spaced_repetition — REQ-05 |
| Trạng thái | **Done (DoD)** |
| Đồng bộ lần cuối | 2026-05-31 |

## Task 3 — Implementation

- [x] Leitner intervals — `src/shared/srs.ts`
- [x] `learningProgressRepository` + mock/Supabase
- [x] `SpacedRepetitionScreen` + luồng [`learningFlow.ts`](../../shared/learningFlow.ts)

## Task — Test

- [x] Unit: `tests/fn05/srs.spec.ts` + `spacedRepetitionUseCases.spec.ts` — **6 pass**
- [x] API integration: P0 learning loop (submitReview)
- [ ] BDD `.feature` (tùy pipeline)

## Ma trận DoD

| AC | Pass |
|----|------|
| Again/Hard/Good/Easy → next_review | [x] unit |
| Due queue / submitReview | [x] code + mobile |

**Xác nhận Done FN:** **có** (2026-05-31) — unit SRS; báo cáo [`process/00_global_test_report.md`](../../process/00_global_test_report.md).
