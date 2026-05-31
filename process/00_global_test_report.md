<!-- @file: process/00_global_test_report.md | @role: SSOT báo cáo test theo FN -->
<!-- @related: process/00_global_task_list.md, tests/reports/cucumber-report.html -->

# 00_global_test_report — Báo cáo test đầy đủ theo FN

> **Cập nhật lần chạy:** 2026-05-31 — ma trận §2 **Done** (unit + BDD + UI + API P0/P1)  
> **Trang mở báo cáo:** [`tests/reports/index.html`](../tests/reports/index.html)  
> **Cucumber chi tiết:** [`tests/reports/cucumber-report.html`](../tests/reports/cucumber-report.html)  
> **Serenity dashboard:** [`tests/reports/serenity/index.html`](../tests/reports/serenity/index.html) (sau `npm run test:bdd:report` + Java)  
> **Integration:** [`tests/integration/README.md`](../tests/integration/README.md)

---

## 1. Tiêu chí Done of Done (G2)

| Loại | Công cụ | Thư mục | Lệnh (repo root) |
|------|---------|---------|------------------|
| **Unit** | Vitest | `tests/fn**/*.spec.ts`, `tests/shared/*.spec.ts` | `npm run test:unit` |
| **BDD domain** | Cucumber + Serenity | `tests/features/fn**/` | `npm run test:bdd:fnXX` |
| **UI** | Cucumber `@ui` + Playwright | `tests/features/fn01/*_ui.feature` | `npm run test:bdd:fn01:ui` |
| **API integration** | Vitest + Supabase | `tests/integration/*.api.spec.ts` | `npm run test:api` |
| **Performance** | k6 + Cucumber `@perf` | `tests/perf/k6/` | `npm run test:perf` |

**Gate CI ngắn:** `npm run test:verify` = unit (49) + BDD domain fn01, fn02, fn17.

**Gate UI (Expo Web, chậm hơn):** `npm run test:verify:ui` = build web + Playwright FN01 (3 scenario).

**Gate đầy đủ (local có Supabase):** `npm run test:api:full` = `test:verify` + `test:api`.

---

## 2. Ma trận tổng hợp theo FN (`src/`) — **Done Phase 1 + P0/P1 API**

| FN | REQ | Unit Vitest | BDD domain | UI | API integration | Perf |
|----|-----|-------------|------------|-----|-----------------|------|
| fn01 | 01 | ✅ 7 | ✅ 3/3 | ✅ 3/3 | ✅ 2 | — |
| fn02 | 02 | ✅ 3 | ✅ 2/2 | — | ✅ 1 | — |
| fn03 | 03 | ✅ 2 | — | — | ✅ 1 | — |
| fn04 | 04 | ✅ 2 | — | — | ✅ 1 | — |
| fn05 | 05 | ✅ 6 | — | — | ✅ P0 | — |
| fn06 | 06 | ✅ 4 | — | — | ✅ P0 | — |
| fn07 | 07 | ✅ 4 | — | — | ✅ 1 | — |
| fn08 | 08 | ✅ 1 | — | — | ✅ 2 | — |
| fn09 | 09 | ✅ 2 | — | — | ✅ 2 | — |
| fn10 | 10 | ✅ 2 | — | — | ✅ P0 | — |
| fn11 | 11 | ✅ 6 | — | — | ✅ 1 | — |
| fn12 | 12 | — | — | — | — | — |
| fn15 | 15 | ✅ 2 | — | — | ✅ 1 | — |
| fn16 | 16 | — | — | — | — | — |
| fn17 | 17 | ✅ 6 | ✅ 7/7 | — | ✅ 1 | ✅ k6 |
| **shared** | cross | ✅ 2 | — | — | ✅ P0 | — |

**Chú thích cột**

| Ký hiệu | Ý nghĩa |
|---------|---------|
| **—** (BDD/UI) | Không yêu cầu Phase 1 — chỉ fn01/fn02/fn17 có Gherkin domain; UI chỉ fn01 |
| **✅ P0** | Nằm trong `p0-learning-loop.api.spec.ts` |
| **✅ N** | Số test riêng trong `tests/integration/*.api.spec.ts` |
| fn12 / fn16 | Chưa có `src/` application — bỏ qua |

**Gate ma trận (2026-05-31):** Unit 49/49 · BDD 12 · UI 3 · API 16+ (Supabase dev) · Perf k6 fn17.

---

## 3. Unit test (Vitest) — chi tiết file

| FN | File | Tests |
|----|------|-------|
| fn01 | `tests/fn01/vocabularyDomain.spec.ts`, `getVocabularyLesson.spec.ts` | 7 |
| fn02 | `tests/fn02/userVocabulary.spec.ts` | 3 |
| fn03 | `tests/fn03/sentence.spec.ts` | 2 |
| fn04 | `tests/fn04/collection.spec.ts` | 2 |
| fn05 | `tests/fn05/srs.spec.ts`, `spacedRepetitionUseCases.spec.ts` | 6 |
| fn06 | `tests/fn06/contextReview.spec.ts` | 4 |
| fn07 | `tests/fn07/conversationMock.spec.ts` | 4 |
| fn08 | `tests/fn08/speech.spec.ts` | 1 |
| fn09 | `tests/fn09/pronunciation.spec.ts` | 2 |
| fn10 | `tests/fn10/dashboard.spec.ts` | 2 |
| fn11 | `tests/fn11/reminderSchedule.spec.ts`, `notificationSettings.spec.ts` | 6 |
| fn15 | `tests/fn15/brandConfig.spec.ts` | 2 |
| fn17 | `tests/fn17/vocabValidation.spec.ts`, `vocabEnrichUseCases.spec.ts` | 6 |
| shared | `tests/shared/learningFlow.spec.ts` | 2 |

**Tổng unit:** **49/49 PASS** (2026-05-31) · Config: [`vitest.config.ts`](../vitest.config.ts)

---

## 4. BDD domain (12 scenarios)

| FN | Lệnh | Kết quả |
|----|------|---------|
| fn01 | `npm run test:bdd:fn01` | ✅ 3/3 |
| fn02 | `npm run test:bdd:fn02` | ✅ 2/2 |
| fn17 | `npm run test:bdd:fn17` | ✅ 7/7 |

---

## 4b. BDD UI — Expo Web + Playwright (FN-01)

| Thành phần | Đường dẫn |
|------------|-----------|
| Feature Gherkin | [`tests/features/fn01/vocab_learning_ui.feature`](../tests/features/fn01/vocab_learning_ui.feature) (`@ui`) |
| Step defs | [`tests/step-definitions/ui/fn01-vocab-ui.steps.ts`](../tests/step-definitions/ui/fn01-vocab-ui.steps.ts) |
| Screenplay | [`tests/ui/`](../tests/ui/) (pages, tasks, questions) |
| Hướng dẫn | [`tests/ui/README.md`](../tests/ui/README.md) |

**Lệnh (repo root):**

```bash
npm run test:bdd:fn01:ui    # build web + 3 scenario UI
npm run test:bdd:ui         # mọi *_ui.feature (hiện chỉ fn01)
npm run test:verify:ui      # alias gate UI
```

**Kết quả 2026-05-31:** ✅ **3/3** — màn học từ + dialogue, context/example, điều hướng splash → bài học.

**Lưu ý:** `test:verify` **không** gồm UI (cần build `apps/mobile/dist` + Chromium). Báo cáo HTML: [`tests/reports/cucumber-report.html`](../tests/reports/cucumber-report.html).

**Windows:** dùng `cucumber.fn01-ui.js` (không truyền `--tags` CLI — tránh lỗi parse `@ui`).

---

## 5. API integration (Phase 2 scaffold)

| File | Mô tả | 2026-05-31 |
|------|--------|------------|
| `tests/integration/fn01-vocabulary.api.spec.ts` | `listLearningDays`, `getVocabularyLesson` | ✅ PASS |
| `tests/integration/p0-learning-loop.api.spec.ts` | FN01 → learningFlow → FN06 → FN05 → FN10 | ✅ PASS |
| `tests/integration/p1-fns.api.spec.ts` | FN02,03,04,07,11,15 read | ✅ PASS |
| `tests/integration/rls-negative.api.spec.ts` | wrong `device_id` isolation | ✅ PASS |
| `tests/integration/fn08-fn09-speech.api.spec.ts` | Edge `speech-practice` + FN08/09 smoke | ✅ PASS |
| `tests/integration/fn17-vocab-enrich.api.spec.ts` | Edge `vocab-enrich` (+ mock fallback) | ✅ PASS |

Env: `TEST_SUPABASE_*` hoặc `EXPO_PUBLIC_*` từ `apps/mobile/.env.development` (chỉ biến chưa set). Thiếu env → **skip** (không fail).

**Ghi chú:** `vocab-enrich` có thể trả mock fallback nếu Edge/AI lỗi — test vẫn assert cấu trúc dialogue hợp lệ.

---

## 6. Lệnh tái tạo

```bash
npm run test:unit          # 49 tests Vitest
npm run test:verify        # unit + BDD domain 12 scenario
npm run test:bdd:living    # chạy BDD + tạo tests/reports/index.html
npm run test:bdd:report    # BDD + Serenity HTML (cần Java; JSON → target/site/serenity)
npm run test:bdd:fn01:ui   # UI 3 scenario (Expo web)
npm run test:api           # integration 15 (Supabase)
npm run test:perf          # k6 fn17
```

**Mở báo cáo:** file `tests/reports/index.html` trong trình duyệt (không phải demo Serenity «frequent flyer»).

---

## 7. Lịch sử chạy

| Ngày | Lệnh | Kết quả |
|------|------|---------|
| 2026-05-31 | `npm run test:unit` | 49/49 PASS |
| 2026-05-31 | `npm run test:verify` | PASS |
| 2026-05-31 | `npm run test:api` | 15/15 PASS (Supabase dev) |
| 2026-05-31 | BDD domain gộp | 12 scenarios PASS |
| 2026-05-31 | `npm run test:bdd:fn01:ui` | 3/3 UI PASS (Expo Web) |

---

## 8. Liên kết

- Task list: [`00_global_task_list.md`](00_global_task_list.md)
- Chiến lược: [`docs/03_quality_assurance/testing_strategy.md`](../docs/03_quality_assurance/testing_strategy.md)
- Luồng học (P0 API): [`src/LEARNING_FLOW.md`](../src/LEARNING_FLOW.md)
