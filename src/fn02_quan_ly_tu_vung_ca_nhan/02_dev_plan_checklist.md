<!-- @file: src/fn02_quan_ly_tu_vung_ca_nhan/02_dev_plan_checklist.md | @role: Dev plan — REQ-02 -->

# Dev plan — Quản lý từ vựng cá nhân

> Luồng: [`.cursor/rules/06-dev-plan-workflow.mdc`](../../.cursor/rules/06-dev-plan-workflow.mdc)

## Metadata

| Field | Value |
|-------|-------|
| FN | fn02_quan_ly_tu_vung_ca_nhan — Quản lý từ vựng cá nhân |
| REQ | REQ-02 |
| `01_requirement` | [`01_requirement.md`](01_requirement.md) |
| Trạng thái | Draft |
| Đồng bộ lần cuối | 2026-05-28 |

---

## Todo — gate trước khi code

**Quy tắc:** Chỉ bắt đầu **Task — Implementation** khi tất cả **Bắt buộc** đã `[x]`.

### Bắt buộc

- [ ] `01_requirement.md` chốt AC (in-scope rõ).
- [ ] Đã đọc `00_requirement_business.md` (REQ-02), `00_global_lesson_learn.md`, `00_global_issue_log.md`.
- [ ] `docs/01_specification/features/quan_ly_tu_vung_ca_nhan.feature` có scenario cho AC chính (hoặc defer có lý do trong `03_debate.md`).
- [ ] Rà `docs/02_system_design/` — cập nhật hoặc ghi **no contract change — ngày 2026-05-28**.
- [ ] (Khi có `src/`) Biết module/layer sẽ sửa: CRUD `user_vocabulary`, form thêm/sửa, filter favorite/difficult, sync local theo device_id..
- [ ] Branch/issue gắn REQ-02.

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

1. Mở [`01_requirement.md`](01_requirement.md) + dòng REQ-02 trong [`00_requirement_business.md`](../../process/00_requirement_business.md).
2. Rà [`00_global_lesson_learn.md`](../../process/00_global_lesson_learn.md), [`00_global_issue_log.md`](../../process/00_global_issue_log.md) (keyword: fn02_quan_ly_tu_vung_ca_nhan).
3. Liệt kê entity/API: CRUD `user_vocabulary`, form thêm/sửa, filter favorite/difficult, sync local theo device_id..

| | |
|--|--|
| **Input** | `01_requirement.md`, `00_requirement_business.md` (REQ-02), global lesson/issue |
| **Output** | Không mâu thuẫn AC; ghi chú phụ thuộc FN (nếu có) |
| **Next step** | Task 2 — BDD & contract |

---

## Task 2 — BDD & contract

**Checklist**

- [ ] File `.feature` cho Quản lý từ vựng cá nhân (scenario từ §6 Gherkin).
- [ ] Contract/design đã rà hoặc ghi no-change.

**Step-by-step**

1. Sinh/sửa [`docs/01_specification/features/quan_ly_tu_vung_ca_nhan.feature`](../../docs/01_specification/features/quan_ly_tu_vung_ca_nhan.feature) (`01-bdd-spec.mdc`).
2. Rà `docs/02_system_design/` — API/DB cho REQ-02.
3. Review nhanh AC với Gherkin trong `00_requirement_business` §6.

| | |
|--|--|
| **Input** | `01_requirement.md`, Gherkin REQ-02, `docs/02_system_design/*` |
| **Output** | `.feature`: `docs/01_specification/features/quan_ly_tu_vung_ca_nhan.feature`; contract updated hoặc **no contract change — 2026-05-28** |
| **Next step** | Task 3 — Implementation *(chỉ khi Todo gate xong)* |

---

## Task 3 — Implementation

**Checklist**

- [ ] Domain / Application / Infra / UI theo Clean Architecture.
- [ ] PR nhỏ, link REQ-02 + `.feature`.

**Step-by-step**

1. Entity, use case, ports (`02-clean-solid.mdc`) — CRUD `user_vocabulary`, form thêm/sửa, filter favorite/difficult, sync local theo device_id..
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
2. E2E cho luồng chính Quản lý từ vựng cá nhân; cover AC trong ma trận DoD.

| | |
|--|--|
| **Input** | `.feature`, build ổn định, môi trường test |
| **Output** | Kết quả test; AC đã cover |
| **Next step** | `DONE` — cập nhật ma trận bên dưới |

---

## Ma trận DoD (verify cuối FN)

| AC / rủi ro (trích `01_requirement`) | Chứng cứ (test / PR / demo) | Pass |
|---------------------------------------|------------------------------|------|
| CRUD từ cá nhân theo device_id | _(test / PR / demo)_ | [ ] |
| Favorite/difficult realtime | _(test / PR / demo)_ | [ ] |
| Xóa không ảnh hưởng catalog chung | _(test / PR / demo)_ | [ ] |

**Xác nhận Done FN:** _chưa / —_

---

> **Đồng bộ:** Mỗi phiên sửa `src/`, `tests/`, `.feature` → tick file này trước khi kết thúc (`06-dev-plan-workflow.mdc` §5).
