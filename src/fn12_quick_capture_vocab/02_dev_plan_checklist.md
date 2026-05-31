<!-- @file: src/fn12_quick_capture_vocab/02_dev_plan_checklist.md | @role: Dev plan — REQ-12 -->

# Dev plan — Quick Capture từ vựng (Share & Overlay)

## Metadata

| Field | Value |
|-------|-------|
| FN | fn12_quick_capture_vocab — REQ-12 |
| Trạng thái | Draft |
| Đồng bộ lần cuối | 2026-05-31 |

## Todo — gate

### Bắt buộc

- [ ] `01_requirement.md` chốt AC (share sheet, overlay, context bắt buộc)
- [ ] `docs/01_specification/features/quick_capture_vocab.feature`
- [ ] Rà contract API/metadata nguồn capture

**Được phép code:** _chưa_

---

## Task 2.5 — TDD (Cucumber.js + Serenity/JS) — **trước** Implementation

**Quy tắc:** Viết `tests/features/fn12/*.feature` + step defs **trước** Task 3.

**Checklist**

- [ ] Mirror `docs/01_specification/features/quick_capture_vocab.feature` → `tests/features/fn12/`
- [ ] Step defs + Serenity actor: `tests/step-definitions/fn12/`
- [ ] Scenarios: share text → form thu gọn → chọn collection → lưu / trùng từ
- [ ] Tích hợp mock FN-17 enrich khi cần AI (optional path)
- [ ] `npm run test:bdd` với tag `@FN-12`
- [ ] CI hook `npm run test:bdd` (tuỳ pipeline)

**Chạy:** `npm run test:bdd` (repo root)

---

## Task 3 — Implementation

- [ ] Native share extension / overlay panel (Android/iOS)
- [ ] Form thu gọn + metadata nguồn
- [ ] Lưu `user_vocabulary` + collection (FN-04)

---

## Ma trận DoD

| AC | Pass |
|----|------|
| Share sheet mở app capture | [ ] |
| Bắt buộc context trước lưu | [ ] |
| Trùng từ → cập nhật hoặc bỏ qua | [ ] |

**Xác nhận Done FN:** chưa
