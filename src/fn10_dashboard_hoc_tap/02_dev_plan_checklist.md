<!-- @file: src/fn10_dashboard_hoc_tap/02_dev_plan_checklist.md | @role: Dev plan — REQ-10 -->

# Dev plan — Dashboard học tập

> Luồng: [`.cursor/rules/06-dev-plan-workflow.mdc`](../../.cursor/rules/06-dev-plan-workflow.mdc)

## Metadata

| Field | Value |
|-------|-------|
| FN | fn10_dashboard_hoc_tap — Dashboard học tập |
| REQ | REQ-10 |
| `01_requirement` | [`01_requirement.md`](01_requirement.md) |
| Trạng thái | Draft |
| Đồng bộ lần cuối | 2026-05-28 |

---

## Todo — gate trước khi code

**Quy tắc:** Chỉ bắt đầu **Task — Implementation** khi tất cả **Bắt buộc** đã `[x]`.

### Bắt buộc

- [ ] `01_requirement.md` chốt AC (in-scope rõ).
- [ ] Đã đọc `00_requirement_business.md` (REQ-10), `00_global_lesson_learn.md`, `00_global_issue_log.md`.
- [ ] `docs/01_specification/features/dashboard_hoc_tap.feature` có scenario cho AC chính (hoặc defer có lý do trong `03_debate.md`).
- [ ] Rà `docs/02_system_design/` — cập nhật hoặc ghi **no contract change — ngày 2026-05-28**.
- [ ] (Khi có `src/`) Biết module/layer sẽ sửa: Màn Progress Dashboard, aggregate từ `learning_progress`, conversation logs, gamification XP/streak..
- [ ] Branch/issue gắn REQ-10.

### Tuỳ chọn

- [ ] Task Lõi→Vỏ: [`docs/04_delivery_tasks/task_template.md`](../../docs/04_delivery_tasks/task_template.md).
- [ ] Spike xong → kết luận trong `03_debate.md`.

**Được phép code:** _chưa — chờ gate_

---

## Task 1 — Chuẩn bị SSOT & tránh lặp

**Checklist**

- [ ] Đã đọc đủ nguồn Input bên dưới.
- [ ] Ghi chú rủi ro / GISS liên quan (nếu có).
- [ ] Xác nhận phụ thuộc FN khác (nếu có trong `01_requirement`).

**Step-by-step**

1. Mở [`01_requirement.md`](01_requirement.md) + dòng REQ-10 trong [`00_requirement_business.md`](../../process/00_requirement_business.md).
2. Rà [`00_global_lesson_learn.md`](../../process/00_global_lesson_learn.md), [`00_global_issue_log.md`](../../process/00_global_issue_log.md) (keyword: fn10_dashboard_hoc_tap).
3. Liệt kê entity/API: Màn Progress Dashboard, aggregate từ `learning_progress`, conversation logs, gamification XP/streak..

| | |
|--|--|
| **Input** | `01_requirement.md`, `00_requirement_business.md` (REQ-10), global lesson/issue |
| **Output** | Không mâu thuẫn AC; ghi chú phụ thuộc FN (nếu có) |
| **Next step** | Task 2 — BDD & contract |

---

## Task 2 — BDD & contract

**Checklist**

- [ ] File `.feature` cho Dashboard học tập (scenario từ §6 Gherkin).
- [ ] Contract/design đã rà hoặc ghi no-change.

**Step-by-step**

1. Sinh/sửa [`docs/01_specification/features/dashboard_hoc_tap.feature`](../../docs/01_specification/features/dashboard_hoc_tap.feature) (`01-bdd-spec.mdc`).
2. Rà `docs/02_system_design/` — API/DB cho REQ-10.
3. Review nhanh AC với Gherkin trong `00_requirement_business` §6.

| | |
|--|--|
| **Input** | `01_requirement.md`, Gherkin REQ-10, `docs/02_system_design/*` |
| **Output** | `.feature`: `docs/01_specification/features/dashboard_hoc_tap.feature`; contract updated hoặc **no contract change — 2026-05-28** |
| **Next step** | Task 2.5 — TDD (Cucumber + Serenity) **trước** Task 3 |

---

## Task 2.5 — TDD (Cucumber.js + Serenity/JS) — **trước** Implementation

**Quy tắc:** Viết `tests/features/fn10/*.feature` + step defs **trước** Task 3.

**Checklist**

- [ ] Mirror `docs/01_specification/features/dashboard_hoc_tap.feature` → `tests/features/fn10/`
- [ ] Step defs + Serenity actor: `tests/step-definitions/fn10/`
- [ ] Domain/use case assertions pass
- [ ] `npm run test:bdd` với tag `@FN-10`
- [ ] CI hook `npm run test:bdd` (tuỳ pipeline)

---

## Task 3 — Implementation

**Checklist**

- [ ] Domain / Application / Infra / UI theo Clean Architecture.
- [ ] PR nhỏ, link REQ-10 + `.feature`.

**Step-by-step**

1. Entity, use case, ports (`02-clean-solid.mdc`) — Màn Progress Dashboard, aggregate từ `learning_progress`, conversation logs, gamification XP/streak..
2. Adapter (API/local DB), UI màn hình chính của FN.
3. Unit test logic cốt lõi (`03-tdd-execute.mdc`).
4. Wire với FN phụ thuộc (nếu có) theo contract đã chốt.

| | |
|--|--|
| **Input** | `01_requirement`, `.feature`, design đã chốt; branch |
| **Output** | PR/commit; test pass locally |
| **Next step** | Task 4 — QA & E2E |

---

## Task 4 — QA & E2E

**Checklist**

- [ ] Unit/integration theo chiến lược team.
- [ ] E2E map `.feature` (`04-ta-verify.mdc`, `data-testid`).

**Step-by-step**

1. Chạy test theo `docs/03_quality_assurance/`.
2. E2E cho luồng chính Dashboard học tập; cover AC trong ma trận DoD.

| | |
|--|--|
| **Input** | `.feature`, build ổn định, môi trường test |
| **Output** | Kết quả test; AC đã cover |
| **Next step** | `DONE` — cập nhật ma trận bên dưới |

---

## Ma trận DoD (verify cuối FN)

| AC / rủi ro (trích `01_requirement`) | Chứng cứ (test / PR / demo) | Pass |
|---------------------------------------|------------------------------|------|
| Streak và XP đúng dữ liệu | _(test / PR / demo)_ | [ ] |
| Thống kê tuần/tháng | _(test / PR / demo)_ | [ ] |
| Speaking score từ FN-08/09 | _(test / PR / demo)_ | [ ] |

**Xác nhận Done FN:** _chưa / —_

---

> **Đồng bộ:** Mỗi phiên sửa `src/`, `tests/`, `.feature` → tick file này trước khi kết thúc (`06-dev-plan-workflow.mdc` §5).
