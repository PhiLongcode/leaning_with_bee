# UI automation — Serenity/JS + Playwright

Target: **Expo Web** (`apps/mobile/dist`) — `testID` → `data-testid`.

## Cấu trúc (Screenplay)

| Path | Vai trò |
|------|---------|
| `ui/cast/UiActors.ts` | Cast + `BrowseTheWebWithPlaywright` |
| `ui/pages/` | Page objects (`PageElement`) |
| `ui/tasks/` | Tasks (When) |
| `ui/questions/` | Questions (Then) |
| `features/fn##/*_ui.feature` | Gherkin tag `@ui` |
| `step-definitions/ui/` | Step defs → tasks/questions |

## Chạy

```bash
# Build web + UI tests (tự serve port 8081)
npm run test:bdd:ui

# Chỉ FN-01 UI
npm run test:bdd:fn01:ui

# Xem browser (headed)
cd tests && set HEADED=true && npm run test:ui
```

Domain tests (`not @ui`): `npm run test:bdd`

Config Cucumber UI: `cucumber.fn01-ui.js` / `cucumber.ui.js` — runner `scripts/run-ui-tests.mjs --suite fn01` (tránh `--tags` trên Windows).

## Deep link E2E (web)

`/?e2e=1&screen=fn01_vocabulary` — xem `apps/mobile/src/lib/e2eBootstrap.web.ts`

## Báo cáo

`tests/reports/cucumber-report.html` (mở bằng trình duyệt)

## Native (Android/iOS)

Chưa cover — cần Detox/Appium riêng; UI layer này là acceptance trên web.
