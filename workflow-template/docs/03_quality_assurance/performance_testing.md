# Performance testing — Spec-driven + BDD

> Rule: [`.cursor/rules/14-performance-bdd.mdc`](../../.cursor/rules/14-performance-bdd.mdc)  
> Functional/UI: [`testing_strategy.md`](testing_strategy.md)

## Framework phổ biến

| Framework | Ngôn ngữ | Điểm mạnh | CI/CD | Dự án này |
|-----------|----------|-----------|-------|-----------|
| **JMeter** | Java/GUI | Mạnh, plugin, dashboard HTML | Jenkins, GitHub Actions | Tuỳ chọn — team quen GUI |
| **Gatling** | Scala/Java | Kịch bản code, report HTML đẹp | Maven/Gradle | Tuỳ chọn — service Java |
| **Locust** | Python | User behavior dễ mở rộng | Python pipeline | Tuỳ chọn — spike Python |
| **k6** | JavaScript | Hiện đại, script JS, Grafana Cloud | Native CLI, Docker | **Mặc định** |

**Lựa chọn repo:** **k6** — cùng ecosystem JS với Cucumber/Serenity; script version control; threshold trong code.

## Kết hợp BDD (Cucumber/Serenity)

Performance cũng là **executable specification**:

```text
Requirement (SLA / rate limit)
  → tests/features/perf/*.feature  (@perf)
  → tests/perf/k6/*.js
  → step-definitions/perf/  (chạy k6, assert p95)
  → tests/reports/k6/summary.json
  → tests/reports/cucumber-report.html (functional + perf cùng pipeline)
```

Ví dụ Gherkin:

```gherkin
@perf @FN-17 @REQ-17
Scenario: vocab-enrich smoke — p95 dưới 2s
  Given ngưỡng p95 latency 2000 ms
  And PERF_SUPABASE_URL đã cấu hình
  When k6 chạy script "vocab-enrich-smoke.js"
  Then k6 thỏa ngưỡng latency và error rate
```

Map step → script: một scenario = một file k6 (hoặc shared `options` + profile).

## Báo cáo & Living Documentation

| Nguồn | Output |
|-------|--------|
| k6 | `tests/reports/k6/<run>-summary.json`, stdout metrics |
| Cucumber/Serenity | `tests/reports/cucumber-report.html` |
| Gatling (nếu dùng) | `target/gatling/*/index.html` |
| JMeter (nếu dùng) | Dashboard HTML plugin |

**Gom báo cáo:** CI artifact upload cả `tests/reports/`; Cucumber scenario `@perf` pass/fail = gate SLA.

## Cài k6

```bash
# Windows (chocolatey)
choco install k6

# macOS
brew install k6

# Docker
docker run -i grafana/k6 run - <tests/perf/k6/vocab-enrich-smoke.js
```

## Biến môi trường

| Biến | Mô tả |
|------|--------|
| `PERF_SUPABASE_URL` | Base URL Supabase (dev/staging only) |
| `PERF_SUPABASE_ANON_KEY` | Anon key |
| `PERF_VUS` | Virtual users (override, tuỳ chọn) |
| `PERF_DURATION` | Thời lượng (vd. `30s`) |

## Lệnh

```bash
npm run test:perf              # k6 trực tiếp (smoke)
npm run test:bdd:perf          # Cucumber @perf + Serenity
```

## Non-functional trong dev plan

Task **4.5 — Performance** (tuỳ FN có SLA): mirror template [`process/templates/performance_scenario_template.md`](../../process/templates/performance_scenario_template.md).
