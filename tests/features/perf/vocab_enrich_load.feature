@REQ-17 @FN-17 @perf
Feature: Performance — AI vocab-enrich API

  Là vận hành, tôi muốn API enrich chịu tải smoke với latency trong ngưỡng SLA dev.

  Scenario: Smoke load vocab-enrich — p95 và error rate
    Given ngưỡng p95 latency 2000 ms
    And PERF_SUPABASE_URL đã cấu hình
    When k6 chạy script "vocab-enrich-smoke.js"
    Then k6 thỏa ngưỡng latency và error rate
