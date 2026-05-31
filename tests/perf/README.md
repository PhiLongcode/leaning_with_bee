# Performance tests — k6 + BDD

## Quick start

```bash
# Cài k6: https://grafana.com/docs/k6/latest/set-up/install-k6/

# Env (dev/staging — không prod)
set PERF_SUPABASE_URL=https://xxx.supabase.co
set PERF_SUPABASE_ANON_KEY=eyJ...

# Chạy trực tiếp k6
npm run test:perf

# Cucumber @perf + Serenity (assert SLA trong Gherkin)
npm run test:bdd:perf
```

## Báo cáo

- k6 summary JSON: `tests/reports/k6/vocab-enrich-smoke-summary.json`
- Cucumber HTML: `tests/reports/cucumber-report.html`

## Map BDD → k6

| Gherkin | k6 |
|---------|-----|
| `tests/features/perf/vocab_enrich_load.feature` | `perf/k6/vocab-enrich-smoke.js` |
| Step `When k6 chạy script "…"` | `perf/runK6.ts` |

JMeter / Gatling / Locust: xem [`docs/03_quality_assurance/performance_testing.md`](../../docs/03_quality_assurance/performance_testing.md).
