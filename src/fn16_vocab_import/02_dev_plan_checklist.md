<!-- @file: src/fn16_vocab_import/02_dev_plan_checklist.md | @role: Dev plan — REQ-16 -->

# Dev plan — Import bộ từ vựng (CSV / JSON / Excel)

## Metadata

| Field | Value |
|-------|-------|
| FN | fn16_vocab_import — REQ-16 |
| Trạng thái | Draft |
| Đồng bộ lần cuối | 2026-05-31 |

## Todo — gate

### Bắt buộc

- [x] `01_requirement.md` + template [`docs/templates/vocabulary_import_template.*`](../../docs/templates/)
- [ ] `docs/01_specification/features/vocab_import.feature`
- [ ] Contract API `POST /vocabularies/import`

**Được phép code:** _chưa — chờ TDD gate_

---

## Task 2.5 — TDD (Cucumber.js + Serenity/JS) — **trước** Implementation

**Quy tắc:** Viết scenarios validate file import **trước** parser/API.

**Checklist**

- [ ] `tests/features/fn16/vocab_import.feature`
- [ ] Step defs: parse CSV/JSON mẫu từ `docs/templates/`
- [ ] Reuse `validateDialogue` (FN-17) cho từng dòng import
- [ ] Scenarios: file hợp lệ, thiếu cột, dialogue <2 hoặc >5 câu, admin vs learner scope
- [ ] `npm run test:bdd` với tag `@FN-16`
- [ ] CI hook `npm run test:bdd` (tuỳ pipeline)

**Chạy:** `npm run test:bdd` (repo root)

---

## Task 3 — Implementation

- [ ] Parser CSV/JSON (+ Excel adapter)
- [ ] API import + batch insert
- [ ] UI Collection → Import

---

## Ma trận DoD

| AC | Pass |
|----|------|
| Import template CSV/JSON | [ ] |
| Validate dialogue 2–5 câu | [ ] |
| Admin → catalog; learner → user_vocab | [ ] |

**Xác nhận Done FN:** chưa
