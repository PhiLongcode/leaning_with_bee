# Template pack — Changelog

| Version | Ngày | Thay đổi |
|---------|------|----------|
| `1.4.0` | 2026-05-31 | **SIFI 7 bước** tuần tự: Speculate → Illustrate → Formulate → Design/unit TDD → Automate → CI → Release; rewrite `13`, `06`, `01`, `03`, `04`, `08`, `12`, `14`; template `dev_plan_checklist` Task 1–7, `example_mapping_template`, `bdd_traceability` Illustrate→Formulate; `testing_strategy` |
| `1.3.0` | 2026-05-31 | Rule `14-performance-bdd.mdc` (k6 + Gherkin @perf); mở rộng `13`, `04-ta-verify`; `performance_scenario_template.md`; Task 4.5 dev plan; docs QA perf |
| `1.2.0` | 2026-05-31 | Rule `13-spec-driven-bdd-ddd.mdc` (Goal→Scenario, SSOT requirement, Cucumber/Serenity, DDD UL); mở rộng `01`/`03`/`06`/`08`/`12`; template `bdd_traceability_template.md`; Task 2.5 trong `dev_plan_checklist_template`; `docs/03_quality_assurance/testing_strategy.md` |
| `1.1.4` | 2026-05-31 | Thêm `docs/templates/` — mẫu import vocabulary CSV/JSON (dialogue 2–5 câu); README pack cập nhật |
| `1.1.3` | 2026-05-21 | Rule `11-lesson-learn-gate.mdc` (alwaysApply): nháp lesson sau lỗi/RCA → AskQuestion → ghi `05_lesson_learn`; `feature_template` + `issue_loop_template` |
| `1.1.2` | 2026-05-21 | Rule `06` §5: bắt buộc đồng bộ tick `02_dev_plan_checklist` khi đổi `src/`/`tests/`/`.feature`; template + globs mở rộng |
| `1.1.1` | 2026-05-21 | Rule `07`: `alwaysApply` + tự check L1–L7 + **AskQuestion** xác nhận trước sync pack |
| `1.1.0` | 2026-05-21 | Rule `07-template-pack-maintenance.mdc`; `TEMPLATE_PLAYBOOK.md`, `ISSUES_TO_TEMPLATE.md`, `TEMPLATE_CHANGELOG.md`; gate đồng bộ pack |
| `1.0.0` | 2026-05-20 | Khung ban đầu: rules, docs stub, BOOTSTRAP, PROJECT_STAMPS (PRM-002) |

> Tăng version trong [`PROJECT_STAMPS.md`](PROJECT_STAMPS.md) mỗi lần sync có ý nghĩa (minor = cấu trúc/rule; patch = copy template/text).
