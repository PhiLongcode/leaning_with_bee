<!-- @file: process/templates/performance_scenario_template.md | @role: TPL — SLA perf + map k6 | @related: 14-performance-bdd.mdc -->

# Template — Performance scenario (BDD + k6)

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-XX |
| FN | fn##_… |
| Endpoint | `POST /functions/v1/…` |
| Môi trường | dev / staging only |

## SLA (từ requirement / API)

| Metric | Ngưỡng |
|--------|--------|
| p95 latency | ≤ ___ ms |
| Error rate | ≤ ___ % |
| Throughput | ≥ ___ req/s (tuỳ chọn) |
| VUs | ___ |
| Duration | ___ |

## Gherkin (`tests/features/perf/`)

```gherkin
@perf @REQ-XX @FN-XX
Feature: Performance — …

  Scenario: Smoke load
    Given ngưỡng p95 latency … ms
    And PERF_SUPABASE_URL đã cấu hình
    When k6 chạy script "….js"
    Then k6 thỏa ngưỡng latency và error rate
```

## k6 script (`tests/perf/k6/`)

- File: `….js`
- `options.thresholds` khớp SLA trên
- Headers/auth theo `api_design.md`

## Traceability

| SLA | Gherkin step | k6 threshold |
|-----|--------------|--------------|
| p95 ≤ X ms | Then latency | `http_req_duration: ['p(95)<X']` |

## Sign-off

| Vai | OK |
|-----|-----|
| BA — SLA hợp lý | [ ] |
| Dev — endpoint + env | [ ] |
| Test — script + CI | [ ] |
