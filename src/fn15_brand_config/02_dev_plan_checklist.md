<!-- @file: src/fn15_brand_config/02_dev_plan_checklist.md | @role: Dev plan — REQ-15 -->

# Dev plan — Cấu hình thương hiệu & quyền (Admin)

## Metadata

| Field | Value |
|-------|-------|
| FN | fn15_brand_config — REQ-15 |
| Trạng thái | In Progress |
| Đồng bộ lần cuối | 2026-05-31 |

## Todo — gate

### Bắt buộc

- [x] `01_requirement.md` — admin-only brand + permissions
- [ ] `docs/01_specification/features/brand_config.feature` (hoặc defer ghi trong `03_debate.md`)
- [x] Migration RLS `is_app_admin()`, `app_brand_config`, `app_system_config`

**Được phép code:** 2026-05-31 (domain + mobile read)

---

## Task 2.5 — TDD (Cucumber.js + Serenity/JS) — **trước** Implementation

**Quy tắc:** Viết scenarios domain **trước** khi mở rộng admin portal.

**Checklist**

- [ ] `tests/features/fn15/brand_config.feature` — learner không sửa brand; admin merge permissions
- [ ] Step defs: mock `BrandConfigRepository`, `SystemConfigRepository`
- [ ] Assert `allowAiVocabEnrich` và flags khác trong `systemConfig`
- [ ] `npm run test:bdd` với tag `@FN-15`
- [ ] CI hook `npm run test:bdd` (tuỳ pipeline)

**Chạy:** `npm run test:bdd` (repo root)

---

## Task 3 — Implementation

- [x] `src/fn15_brand_config/` domain + repos
- [x] Mobile: fetch brand theme, learner read-only Settings
- [ ] Admin portal UI (Supabase / web admin)

---

## Ma trận DoD

| AC | Pass |
|----|------|
| Learner không đổi logo/màu | [x] |
| Admin cập nhật brand → app reflect | [ ] (portal) |
| Feature flags ẩn/hiện tính năng | [ ] |

**Xác nhận Done FN:** chưa
