<!-- @file: src/fn11_notification_reminder/02_dev_plan_checklist.md | @role: Dev plan — REQ-11 -->

# Dev plan — Notification Reminder

> Luồng: [`.cursor/rules/06-dev-plan-workflow.mdc`](../../.cursor/rules/06-dev-plan-workflow.mdc)

## Metadata

| Field | Value |
|-------|-------|
| FN | fn11_notification_reminder — Notification Reminder |
| REQ | REQ-11 |
| `01_requirement` | [`01_requirement.md`](01_requirement.md) |
| Trạng thái | Draft |
| Đồng bộ lần cuối | 2026-05-28 |

---

## Todo — gate trước khi code

**Quy tắc:** Chỉ bắt đầu **Task — Implementation** khi tất cả **Bắt buộc** đã `[x]`.

### Bắt buộc

- [ ] `01_requirement.md` chốt AC (in-scope rõ).
- [ ] Đã đọc `00_requirement_business.md` (REQ-11), `00_global_lesson_learn.md`, `00_global_issue_log.md`.
- [ ] `docs/01_specification/features/notification_reminder.feature` có scenario cho AC chính (hoặc defer có lý do trong `03_debate.md`).
- [ ] Rà `docs/02_system_design/` — cập nhật hoặc ghi **no contract change — ngày 2026-05-28**.
- [ ] (Khi có `src/`) Biết module/layer sẽ sửa: Local/push scheduling, daily/review/streak triggers, respect OS notification settings, offline queue..
- [ ] Branch/issue gắn REQ-11.

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

1. Mở [`01_requirement.md`](01_requirement.md) + dòng REQ-11 trong [`00_requirement_business.md`](../../process/00_requirement_business.md).
2. Rà [`00_global_lesson_learn.md`](../../process/00_global_lesson_learn.md), [`00_global_issue_log.md`](../../process/00_global_issue_log.md) (keyword: fn11_notification_reminder).
3. Liệt kê entity/API: Local/push scheduling, daily/review/streak triggers, respect OS notification settings, offline queue..

| | |
|--|--|
| **Input** | `01_requirement.md`, `00_requirement_business.md` (REQ-11), global lesson/issue |
| **Output** | Không mâu thuẫn AC; ghi chú phụ thuộc FN (nếu có) |
| **Next step** | Task 2 — BDD & contract |

---

## Task 2 — BDD & contract

**Checklist**

- [ ] File `.feature` cho Notification Reminder (scenario từ §6 Gherkin).
- [ ] Contract/design đã rà hoặc ghi no-change.

**Step-by-step**

1. Sinh/sửa [`docs/01_specification/features/notification_reminder.feature`](../../docs/01_specification/features/notification_reminder.feature) (`01-bdd-spec.mdc`).
2. Rà `docs/02_system_design/` — API/DB cho REQ-11.
3. Review nhanh AC với Gherkin trong `00_requirement_business` §6.

| | |
|--|--|
| **Input** | `01_requirement.md`, Gherkin REQ-11, `docs/02_system_design/*` |
| **Output** | `.feature`: `docs/01_specification/features/notification_reminder.feature`; contract updated hoặc **no contract change — 2026-05-28** |
| **Next step** | Task 2.5 — TDD (Cucumber + Serenity) **trước** Task 3 |

---

## Task 2.5 — TDD (Cucumber.js + Serenity/JS) — **trước** Implementation

**Quy tắc:** Viết `tests/features/fn11/*.feature` + step defs **trước** Task 3.

**Checklist**

- [ ] Mirror `docs/01_specification/features/notification_reminder.feature` → `tests/features/fn11/`
- [ ] Step defs + Serenity actor: `tests/step-definitions/fn11/`
- [ ] Domain/use case assertions pass
- [ ] `npm run test:bdd` với tag `@FN-11`
- [ ] CI hook `npm run test:bdd` (tuỳ pipeline)

---

## Task 3 — Implementation

**Checklist**

- [ ] Domain / Application / Infra / UI theo Clean Architecture.
- [ ] PR nhỏ, link REQ-11 + `.feature`.

**Step-by-step**

1. Entity, use case, ports (`02-clean-solid.mdc`) — Local/push scheduling, daily/review/streak triggers, respect OS notification settings, offline queue..
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
2. E2E cho luồng chính Notification Reminder; cover AC trong ma trận DoD.

| | |
|--|--|
| **Input** | `.feature`, build ổn định, môi trường test |
| **Output** | Kết quả test; AC đã cover |
| **Next step** | `DONE` — cập nhật ma trận bên dưới |

---

## Ma trận DoD (verify cuối FN)

| AC / rủi ro (trích `01_requirement`) | Chứng cứ (test / PR / demo) | Pass |
|---------------------------------------|------------------------------|------|
| Nhắc review đúng hạn | _(test / PR / demo)_ | [ ] |
| Tôn trọng tắt thông báo | _(test / PR / demo)_ | [ ] |
| Không spam (rate limit) | _(test / PR / demo)_ | [ ] |

**Xác nhận Done FN:** _chưa / —_

---

> **Đồng bộ:** Mỗi phiên sửa `src/`, `tests/`, `.feature` → tick file này trước khi kết thúc (`06-dev-plan-workflow.mdc` §5).
