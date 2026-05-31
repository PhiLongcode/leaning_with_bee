<!-- @file: process/templates/dev_plan_checklist_template.md | @role: TPL — SIFI Task 1–7 | @related: 06-dev-plan-workflow.mdc, 13-spec-driven-bdd-ddd.mdc -->

# Template — `02_dev_plan_checklist.md` (SIFI 7 bước)

> **SSOT quy trình:** [`.cursor/rules/13-spec-driven-bdd-ddd.mdc`](../../.cursor/rules/13-spec-driven-bdd-ddd.mdc)  
> **Map Task ↔ bước:** [`.cursor/rules/06-dev-plan-workflow.mdc`](../../.cursor/rules/06-dev-plan-workflow.mdc)  
> Instance chỉ gồm: metadata, gate, Task 1–7 (checklist + Input/Output/Next), DoD.

---

## Metadata

| Field | Value |
|-------|-------|
| FN | fnxx — … |
| REQ | REQ-XX |
| Trạng thái | Draft / In Progress / Done |
| Đồng bộ lần cuối | YYYY-MM-DD |

---

## Todo — gate trước Task 4 (Design/unit)

**Quy tắc:** Task **4–5** chỉ khi Task **1–3** xong.

- [ ] Task 1 Speculate — Goal, Actor, Capability trong `01_requirement.md`
- [ ] Task 2 Illustrate — Example Mapping + Three Amigos (`03_debate.md`)
- [ ] Task 3 Formulate — R3 `.feature` + tags (`@smoke` / `@regression` / `@ui` / `@api`)
- [ ] Rà `docs/02_system_design/` — update hoặc **no contract change — ngày …**

**Được phép Design/unit (Task 4):** _tên / ngày_

---

## Task 1 — Speculate

- [ ] Business goal (1–3 câu)
- [ ] Actors / persona
- [ ] Capability + FN-XX; backlog item (tiêu đề, ưu tiên)
- [ ] `01_requirement.md` + R1 dedup (`10-requirement-dedup.mdc`)

| **Input** | R0/R1, `00_global_*` |
| **Output** | `01_requirement.md` § Goal/Actor/Capability |
| **Next step** | Task 2 — Illustrate |

---

## Task 2 — Illustrate

- [ ] Workshop Three Amigos (BA · Dev · Test)
- [ ] Example Mapping: rules, examples (happy/edge/negative), questions
- [ ] Questions blocker → resolved hoặc defer `03_debate.md`

Template: [`example_mapping_template.md`](example_mapping_template.md)

| **Input** | Task 1 output |
| **Output** | Example mapping trong `03_debate.md` |
| **Next step** | Task 3 — Formulate |

---

## Task 3 — Formulate

- [ ] Gherkin R3: `docs/01_specification/features/*.feature`
- [ ] Tags: `@REQ-XX` `@FN-XX` + `@smoke` | `@regression` | `@ui` | `@api` | `@perf`
- [ ] AC đo lường được; UL = domain terms

| **Input** | Example mapping, `01_requirement.md` |
| **Output** | `.feature` R3 |
| **Next step** | Task 4 — Design + unit TDD |

---

## Task 4 — Design + unit TDD

- [ ] Domain / use case / ports (`02-clean-solid.mdc`)
- [ ] `*.spec.ts` — Red → Green → Refactor
- [ ] Unit suite xanh locally

| **Input** | R3 scenarios, design |
| **Output** | `src/fn##/` domain + unit pass |
| **Next step** | Task 5 — Automate |

---

## Task 5 — Automate acceptance & integration

- [ ] Mirror R3 → `tests/features/fn##/`
- [ ] Step defs → domain; `@ui`: Screenplay (`tests/ui/`)
- [ ] `@perf`: k6 nếu có SLA (`14-performance-bdd.mdc`)
- [ ] `npm run test:bdd` / `test:bdd:ui` pass

Traceability: [`bdd_traceability_template.md`](bdd_traceability_template.md)

| **Input** | R3, unit xanh (Task 4) |
| **Output** | Acceptance pass; `tests/reports/` |
| **Next step** | Task 6 — CI |

---

## Task 6 — CI pipeline & quality gates

- [ ] Pipeline: unit → lint/typecheck → integration → acceptance → publish report
- [ ] Fail fast: unit fail → dừng pipeline
- [ ] Artifact: `cucumber-report.html`, k6 summary

| **Input** | Task 5 green |
| **Output** | CI green + living docs |
| **Next step** | Task 7 — Release & monitor |

---

## Task 7 — Release, monitor & feedback

- [ ] Deploy staging/prod (theo policy)
- [ ] Monitor NFR (error rate, perf)
- [ ] Feedback → backlog; quay Task 2 nếu AC sai

| **Input** | Release runbook |
| **Output** | Metrics; `04_issue_log` / `05_lesson_learn` |
| **Next step** | `DONE` hoặc quay Illustrate |

---

## Ma trận DoD

| AC (trích `01_requirement`) | Chứng cứ (unit / acceptance / CI) | Pass |
|-----------------------------|-------------------------------------|------|
| | | [ ] |

**Xác nhận Done FN:** _… / ngày_

---

> **Đồng bộ:** Mỗi phiên sửa code/test → tick Task tương ứng (`06` §5).
