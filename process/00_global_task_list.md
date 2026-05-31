<!-- @file: process/00_global_task_list.md | @role: SSOT task list toàn dự án -->
<!-- @related: process/00_global_test_report.md, process/00_requirement_business.md -->

# 00_global_task_list — Task list toàn dự án

> **Cập nhật:** 2026-05-31 — sau `apply-all.sql` + API Edge + unit tests  
> **Test DoD (đầy đủ unit / BDD / UI / perf):** [`00_global_test_report.md`](00_global_test_report.md)  
> **Cucumber HTML:** [`tests/reports/cucumber-report.html`](../tests/reports/cucumber-report.html)  
> **Gate CI:** `npm run test:verify` · **Tái tạo báo cáo:** `npm run test:report`

### Chú giải

| Ký hiệu | Ý nghĩa |
|--------|---------|
| ✅ **Done (DoD)** | G1 + G2 test PASS + G3 dev plan |
| 🟡 Partial | Thiếu test hoặc phase 2 |
| 📝 Spec only | Chưa code |

---

## 1. Bảng chức năng

| REQ | FN | Tên | % | Trạng thái | DoD test | API / Edge |
|-----|-----|------|---|------------|----------|------------|
| 01 | fn01 | Học từ ngữ cảnh | 95% | ✅ DoD | BDD 3/3 | Supabase `vocabulary` |
| 02 | fn02 | Sổ từ + AI | 92% | ✅ DoD | BDD 2/2 | `vocab-enrich` |
| 03 | fn03 | Câu giao tiếp | 85% | ✅ DoD | Unit 2/2 | `user_sentences` |
| 04 | fn04 | Collection | 85% | ✅ DoD | Unit 2/2 | `learning_collections` |
| 05 | fn05 | SRS | 88% | ✅ DoD | Unit 3/3 | `learning_progress` |
| 06 | fn06 | Context review | 90% | ✅ DoD | Unit 2/2 | flow + SRS |
| 07 | fn07 | AI chat | 85% | ✅ DoD | Unit 1/1 + Edge | `ai-conversation` |
| 08 | fn08 | Speaking STT | 70% | ✅ DoD MVP | Unit 1/1 | `speech-practice` (text-in) |
| 09 | fn09 | Pronunciation | 70% | ✅ DoD MVP | (fn08 test) | `pronunciation_scores` |
| 10 | fn10 | Dashboard | 85% | ✅ DoD | Unit 2/2 | `learner_stats` + due count |
| 11 | fn11 | Push nhắc | 90% | ✅ DoD | Unit 3/3 | `notification_settings` |
| 12 | fn12 | Quick capture | 5% | 📝 | — | P3 |
| 15 | fn15 | Brand | 60% | 🟡 | ❌ | read-only; chưa admin |
| 16 | fn16 | Import | 10% | 📝 | — | P3 |
| 17 | fn17 | AI enrich | 92% | ✅ DoD | BDD 7/7 | `vocab-enrich` |

**Edge Functions (deployed):** `vocab-enrich`, `ai-conversation`, `speech-practice`

---

## 2. Hạ tầng

| ID | Task | Trạng thái | Ghi chú |
|----|------|------------|---------|
| INF-01 | Schema remote | ✅ **Done** | User đã chạy `apply-all.sql` |
| INF-02 | Mobile navigator | ✅ | FN-01…11 |
| INF-03 | APK debug | ✅ | `mobile:build:apk` |
| INF-04 | AI Edge | ✅ | 3 functions deployed |
| INF-05 | Test gate | ✅ | Unit 16 + BDD 12 → [`cucumber-report.html`](../tests/reports/cucumber-report.html); UI/perf xem [test report](00_global_test_report.md) |
| INF-06 | Typecheck | 🟡 | `mobile:typecheck` |

---

## 3. Backlog còn lại

| Ưu tiên | Task |
|---------|------|
| P2 | FN-08 Whisper audio STT |
| P2 | FN-07 conversation score |
| P2 | FN-15 admin portal |
| P3 | FN-12, FN-16 |
| P3 | INF-06 typecheck sạch |

---

## 4. Lịch sử

| Ngày | Thay đổi |
|------|----------|
| 2026-05-31 | Post apply-all: API Supabase thật, speech-practice, tests fn03–10, nâng Partial → DoD |
