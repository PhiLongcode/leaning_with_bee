# src/ — module chức năng + tài liệu FN

Mỗi thư mục `fn##_*/` gồm **5 file markdown** (spec, dev plan, debate, issue, lesson) **cùng chỗ** với mã nguồn — không tách riêng `process/features/`.

**Một nguồn code:** package `@hoc-cung-bee/features` (`src/package.json`). App mobile import từ package này — **không** copy sang `apps/mobile/src/fn*/`.

| File | Vai trò |
|------|---------|
| `01_requirement.md` | SSOT yêu cầu FN |
| `02_dev_plan_checklist.md` | Dev plan (rule `06-dev-plan-workflow.mdc`) |
| `03_debate.md` | ADR |
| `04_issue_log.md` | Issue log |
| `05_lesson_learn.md` | Lesson learn (rule `11-lesson-learn-gate.mdc`) |

**Rule:** [`.cursor/rules/12-src-feature-docs.mdc`](../.cursor/rules/12-src-feature-docs.mdc)  
**Map REQ:** [`process/00_requirement_business.md`](../process/00_requirement_business.md) §2

## Modules

| REQ | Thư mục |
|-----|----------|
| REQ-01 | `fn01_hoc_tu_vung_ngu_canh/` |
| REQ-02 | `fn02_quan_ly_tu_vung_ca_nhan/` |
| REQ-03 | `fn03_quan_ly_cau_giao_tiep/` |
| REQ-04 | `fn04_learning_collection/` |
| REQ-05 | `fn05_spaced_repetition/` |
| REQ-06 | `fn06_context_review/` |
| REQ-07 | `fn07_ai_conversation/` |
| REQ-08 | `fn08_speech_to_text/` |
| REQ-09 | `fn09_pronunciation_scoring/` |
| REQ-10 | `fn10_dashboard_hoc_tap/` |
| REQ-11 | `fn11_notification_reminder/` |
