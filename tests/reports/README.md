# Test reports

| File / thư mục | Nguồn | Nội dung |
|----------------|--------|----------|
| [`serenity/index.html`](serenity/index.html) | `npm run test:bdd:report` | **Serenity BDD dashboard** (donut, capability FN-01/02/17) — mở bằng trình duyệt |
| [`cucumber-report.html`](cucumber-report.html) | Cucumber formatter `html` | Scenario BDD **lần chạy gần nhất** (ghi đè mỗi lần chạy) |
| [`k6/vocab-enrich-smoke-summary.json`](k6/vocab-enrich-smoke-summary.json) | `npm run test:perf` | p95, error rate (FN-17) |

**SSOT bảng theo FN:** [`process/00_global_test_report.md`](../../process/00_global_test_report.md)

## Tạo lại báo cáo (repo root)

```bash
# Domain BDD 12 scenario + Serenity HTML
npm run test:bdd:report

# Gồm @ui + @perf (nếu có) rồi aggregate Serenity
npm run test:bdd:report:all

# Unit + BDD + Serenity
npm run test:verify:report
```

Chỉ aggregate HTML (đã có JSON trong `tests/target/site/serenity/`):

```bash
cd tests
npm run report:serenity
```

Lần đầu / sau cập nhật `@serenity-js/serenity-bdd`:

```bash
cd tests
npm run report:serenity:update
```

**Lưu ý:** Serenity BDD CLI cần **Java** (JRE 11+). Nếu `report:serenity` lỗi Java, cài JDK hoặc dùng `cucumber-report.html`.

**Không** mở file demo «Release: Iteration-1 / frequent flyer» — đó là ví dụ Serenity cũ, không thuộc repo này.
