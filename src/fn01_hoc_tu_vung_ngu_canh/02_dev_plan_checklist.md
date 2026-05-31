<!-- @file: src/fn01_hoc_tu_vung_ngu_canh/02_dev_plan_checklist.md | @role: Dev plan — REQ-01 -->

> **SIFI map (instance legacy):** Task 2.5 ≈ Task 3 Formulate + Task 5 Automate; Task 3 ≈ Task 4 Design. Checklist mới Task 1–7: [`dev_plan_checklist_template.md`](../../process/templates/dev_plan_checklist_template.md).

# Dev plan — Học từ vựng theo ngữ cảnh

## Metadata

| Field | Value |
|-------|-------|
| FN | fn01_hoc_tu_vung_ngu_canh — REQ-01 |
| Trạng thái | **Done (DoD)** |
| Đồng bộ lần cuối | 2026-05-31 |

## Todo — gate

### Bắt buộc

- [x] `01_requirement.md` — dialogue 2–5 câu + explanation
- [x] `hoc_tu_vung_ngu_canh.feature` + `tests/features/fn01/vocab_dialogue.feature`
- [x] Contract: `dialogue`, `explanation_native` trên `vocabulary`

**Được phép code:** 2026-05-31

---

## Task 2.5 — TDD (Cucumber.js + Serenity/JS)

- [x] Scenarios: dialogue hợp lệ, highlight từ, strict dialogue
- [x] `isValidVocabularyWithDialogue`, `highlightWordInLine`
- [x] `npm run test:bdd:fn01` (tags `@FN-01`) — domain 3/3 pass
- [x] Unit Vitest: `tests/fn01/vocabularyDomain.spec.ts`, `getVocabularyLesson.spec.ts`
- [x] API integration: `tests/integration/fn01-vocabulary.api.spec.ts`, P0 loop
- [x] UI `@ui`: `tests/features/fn01/vocab_learning_ui.feature` — Serenity + Playwright (3 scenarios)

---

## Task 3 — Implementation

- [x] `Vocabulary` type + repository map `dialogue`, `explanation_native`
- [x] `VocabularyLearningScreen`: bubbles + explanation card
- [x] Seed `deploy` có dialogue mẫu

---

## Ma trận DoD

| AC | Chứng cứ | Pass |
|----|----------|------|
| Hiển thị hội thoại chat | UI + manual | [x] |
| Giải thích tiếng mẹ đẻ | ExplanationNativeCard | [x] |
| Validate 2–5 câu | Cucumber fn01/fn17 | [x] |

**Xác nhận Done FN:** **có** (2026-05-31) — `npm run test:bdd:fn01` 3/3 pass; báo cáo [`process/00_global_test_report.md`](../../process/00_global_test_report.md). G4 schema remote: INF-01.
