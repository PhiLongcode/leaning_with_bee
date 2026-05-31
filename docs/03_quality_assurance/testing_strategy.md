# Chiến lược kiểm thử — Quy trình SIFI (7 bước)

> SSOT: [`.cursor/rules/13-spec-driven-bdd-ddd.mdc`](../../.cursor/rules/13-spec-driven-bdd-ddd.mdc)  
> Performance: [`performance_testing.md`](performance_testing.md)

## SIFI — tuần tự

| # | Bước | Đầu ra test |
|---|------|-------------|
| 1 | **Speculate** | Backlog, `01_requirement.md` |
| 2 | **Illustrate** | Example Mapping (`03_debate.md`) |
| 3 | **Formulate** | `.feature` + tags |
| 4 | **Design + unit TDD** | `*.spec.ts` xanh |
| 5 | **Automate** | Cucumber/Serenity, `@ui`, `@perf` |
| 6 | **CI** | Pipeline + living docs |
| 7 | **Release & monitor** | NFR, feedback → Illustrate |

## Thứ tự ưu tiên (2026-05)

| Phase | Phạm vi | Công cụ | Gate |
|-------|---------|---------|------|
| **1** | `src/fn**` + `src/shared` | Vitest `tests/fn**/*.spec.ts`, `tests/shared/*.spec.ts` | `npm run test:unit` (49 case) |
| **1b** | Domain BDD (fn01, fn02, fn17) | Cucumber `tests/features/fn**/` | `npm run test:verify` = unit + BDD |
| **2** | PostgREST + Edge (Supabase dev) | `tests/integration/*.api.spec.ts` | `npm run test:api` (skip nếu thiếu `TEST_SUPABASE_*`) |
| **2b** | UI / perf | `@ui`, k6 | `test:bdd:fn01:ui`, `test:perf` |

**Quy ước:** mock repository trong unit — **không** gọi Supabase ở Phase 1. Phase 2 bắt buộc sau khi Phase 1 gate xanh.

SSOT ma trận FN: [`process/00_global_test_report.md`](../../process/00_global_test_report.md).

## 4 layer công cụ (bước 4–5)

| Layer | Tag | Tool | Lệnh |
|-------|-----|------|------|
| Unit | — | Vitest `tests/fn**`, `tests/shared` | `npm run test:unit` |
| Domain acceptance | `@smoke` `@regression` | Cucumber + Serenity | `npm run test:bdd:fnXX` |
| API integration | — | Vitest + `@supabase/supabase-js` | `npm run test:api` |
| UI | `@ui` | Playwright + Screenplay | `npm run test:bdd:ui` |
| Performance | `@perf` | k6 | `npm run test:bdd:perf` |

## CI pipeline (bước 6)

```text
test:unit → test:verify (unit + BDD core) → test:api (optional, có env) → static analysis → publish reports
```

Dừng nếu **unit** hoặc **verify** fail. `test:api` chỉ chạy trên job có secret Supabase dev/staging.

## Living documentation

- `tests/reports/cucumber-report.html`
- `tests/reports/k6/*`
- Example Mapping + traceability templates trong `process/templates/`

## Three Amigos

BA · Dev · Test — bước **2 Illustrate**; sign-off trước **3 Formulate**.
