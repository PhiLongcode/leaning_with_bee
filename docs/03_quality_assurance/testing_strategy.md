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

## 4 layer công cụ (bước 4–5)

| Layer | Tag | Tool | Lệnh |
|-------|-----|------|------|
| Unit | — | `*.spec.ts` | (theo FN) |
| Domain acceptance | `@smoke` `@regression` | Cucumber + Serenity | `npm run test:bdd` |
| UI | `@ui` | Playwright + Screenplay | `npm run test:bdd:ui` |
| Performance | `@perf` | k6 | `npm run test:bdd:perf` |

## CI pipeline (bước 6)

```text
unit → static analysis → integration → acceptance → publish reports
```

Dừng nếu **unit** fail.

## Living documentation

- `tests/reports/cucumber-report.html`
- `tests/reports/k6/*`
- Example Mapping + traceability templates trong `process/templates/`

## Three Amigos

BA · Dev · Test — bước **2 Illustrate**; sign-off trước **3 Formulate**.
