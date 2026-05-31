<!-- @file: process/templates/bdd_traceability_template.md | @role: TPL — truy xuất SIFI Illustrate → Formulate → Automate | @related: 13-spec-driven-bdd-ddd.mdc -->

# Template — Ma trận truy xuất BDD (SIFI)

> Điền sau **2 Illustrate**; cập nhật sau **3 Formulate** và **5 Automate**.  
> **SSOT:** chỉ từ `01_requirement.md` + Example Mapping — không thêm scenario ngoài AC.

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-XX |
| FN | fn##_ten |
| Goal (tóm tắt) | _(§ Goal)_ |
| Actor chính | _(§ Actor)_ |

---

## Ubiquitous Language (DDD)

| Thuật ngữ (Gherkin) | Ý nghĩa | Domain type |
|---------------------|---------|-------------|
| | | |

---

## Illustrate → Formulate → Automate

| ID AC | Example (Illustrate) | Scenario R3 (Formulate) | Tags | Step def / Task (Automate) | Domain / use case |
|-------|----------------------|-------------------------|------|----------------------------|-------------------|
| AC-1 | _(happy path row)_ | `Scenario: …` | `@smoke` | `tests/step-definitions/…` | `validateX` |
| AC-2 | _(edge case)_ | | `@regression` | | |
| AC-3 | _(negative)_ | | `@ui` | `tests/ui/tasks/…` | |

---

## Three Amigos sign-off (trước Formulate)

| Vai | Xác nhận | Ngày |
|-----|----------|------|
| BA — Goal / US / UL | [ ] | |
| Dev — Capability / contract | [ ] | |
| Test — Examples cover AC | [ ] | |

---

## Chạy test (bước 5–6)

```bash
npm run test:bdd          # domain (@smoke, @regression)
npm run test:bdd:ui       # @ui
npm run test:bdd:perf     # @perf (env + k6)
npm run test:bdd:fnXX     # tag @FN-XX
```

Báo cáo: `tests/reports/cucumber-report.html`
