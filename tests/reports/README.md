# Test reports

| File | Nguồn | Nội dung |
|------|--------|----------|
| [`cucumber-report.html`](cucumber-report.html) | Cucumber formatter `html` | **Tất cả scenario BDD** lần chạy gần nhất (domain + UI + perf nếu cùng lệnh) |
| [`k6/vocab-enrich-smoke-summary.json`](k6/vocab-enrich-smoke-summary.json) | `npm run test:perf` | p95, error rate, iterations (FN-17) |

**SSOT bảng theo FN:** [`process/00_global_test_report.md`](../../process/00_global_test_report.md)

Tạo lại HTML:

```bash
cd tests
npm run test          # @not @ui and not @perf → 12 scenarios
# hoặc
npm run test:all      # mọi tag (gồm @ui, @perf nếu có)
```
