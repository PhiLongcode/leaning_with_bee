<!-- @file: process/templates/dev_plan_checklist_template.md | @role: TPL — sinh `features/fnxx/02_dev_plan_checklist.md` (instance gọn) | @related: .cursor/rules/06-dev-plan-workflow.mdc -->

# Template — `02_dev_plan_checklist.md` (instance)

> **Luồng & luật (3)(4)(5)(6), thứ tự bước:** xem [`.cursor/rules/06-dev-plan-workflow.mdc`](../../.cursor/rules/06-dev-plan-workflow.mdc) — **không** nhồi quy trình dài vào file này.  
> **File này chỉ chứa:** metadata, **todo gate**, các **Task** với checklist + step-by-step + **Input / Output / Next step**.  
> **Debate dài:** [`03_debate.md`](../features/fn01_phan_loai_khach/03_debate.md).

---

## Metadata

| Field | Value |
|-------|-------|
| FN | fnxx — … |
| REQ | REQ-XX |
| `01_requirement` | _(link)_ |
| Trạng thái | Draft / In Progress / Done |
| Đồng bộ lần cuối | _(YYYY-MM-DD — bắt buộc cập nhật khi tick; rule `06` §5)_ |

---

## Todo — gate trước khi code

**Quy tắc:** Chỉ bắt đầu **Task — Implementation** khi tất cả **Bắt buộc** đã `[x]`.

### Bắt buộc

- [ ] `01_requirement.md` chốt AC (in-scope rõ).
- [ ] Đã đọc `00_requirement_business.md` (đúng REQ), `00_global_lesson_learn.md`, `00_global_issue_log.md`.
- [ ] `docs/01_specification/features/*.feature` có scenario cho AC chính (hoặc defer có lý do trong `03_debate.md`).
- [ ] Rà `docs/02_system_design/` — cập nhật hoặc ghi **no contract change — ngày …**.
- [ ] (Khi có `src/`) Biết module/layer sẽ sửa.
- [ ] Branch/issue gắn REQ.

### Tuỳ chọn

- [ ] Task Lõi→Vỏ: [`docs/04_delivery_tasks/task_template.md`](../../docs/04_delivery_tasks/task_template.md).
- [ ] Spike xong → kết luận trong `03_debate.md`.

**Được phép code:** _tên / ngày_

---

## Task 1 — Chuẩn bị SSOT & tránh lặp

**Checklist**

- [ ] Đã đọc đủ nguồn Input bên dưới.
- [ ] Ghi chú rủi ro / GISS liên quan (nếu có).

**Step-by-step**

1. Mở `01_requirement` + dòng REQ trong `00_requirement_business`.
2. Rà `00_global_lesson_learn`, `00_global_issue_log` (keyword / module FN).
3. (Có `src/`) Ghi package hoặc layer dự kiến chạm.

| | |
|--|--|
| **Input** | `01_requirement.md`, `00_requirement_business.md` (REQ-XX), `00_global_lesson_learn.md`, `00_global_issue_log.md` |
| **Output** | Đã rà global; không mâu thuẫn AC; (tuỳ chọn) link issue/note 1 dòng |
| **Next step** | Task 2 — BDD & contract |

---

## Task 2 — BDD & contract

**Checklist**

- [ ] File `.feature` cập nhật.
- [ ] Contract/design đã rà hoặc ghi no-change.

**Step-by-step**

1. Sinh/sửa `docs/01_specification/features/<tên>.feature` (`01-bdd-spec.mdc`).
2. Rà và cập nhật `docs/02_system_design/` nếu đổi API/DB.
3. Review nhanh với peer/BA.

| | |
|--|--|
| **Input** | `01_requirement.md`, scenario tham chiếu, `docs/02_system_design/*` |
| **Output** | `.feature` path: `…`; contract updated hoặc **no contract change — ngày** |
| **Next step** | Task 3 — Implementation *(chỉ khi Todo gate xong)* |

---

## Task 3 — Implementation

**Checklist**

- [ ] Domain / Application / Infra / UI theo Clean Architecture.
- [ ] PR nhỏ, link REQ + `.feature`.

**Step-by-step**

1. Entity, use case, ports (`02-clean-solid.mdc`).
2. Adapter, UI/API.
3. Test trước logic nơi áp dụng (`03-tdd-execute.mdc`).
4. (FN lớn) Chia task theo `docs/04_delivery_tasks/task_template.md`.

| | |
|--|--|
| **Input** | `01_requirement`, `.feature`, design đã chốt; branch |
| **Output** | PR/link commit; test pass locally/CI |
| **Next step** | Task 4 — QA & E2E |

---

## Task 4 — QA & E2E

**Checklist**

- [ ] Unit/integration theo chiến lược team.
- [ ] E2E map `.feature` (`04-ta-verify.mdc`, `data-testid`).

**Step-by-step**

1. Chạy test theo `docs/03_quality_assurance/`.
2. E2E cho luồng chính; bổ sung nếu AC risk cao.

| | |
|--|--|
| **Input** | `.feature`, build ổn định, môi trường test |
| **Output** | Kết quả test (lệnh / link CI); danh sách AC đã cover |
| **Next step** | `DONE` — cập nhật ma trận bên dưới |

---

## Ma trận DoD (verify cuối FN)

| AC / rủi ro (trích `01_requirement`) | Chứng cứ (test / PR / demo) | Pass |
|---------------------------------------|------------------------------|------|
| | | [ ] |
| | | [ ] |

**Xác nhận Done FN:** _… / ngày_

---

> **Đồng bộ:** Mỗi phiên sửa `src/fn##_*/`, `tests/fn##_*/`, `.feature` → tick `02_dev_plan_checklist.md` trước khi kết thúc ([`06-dev-plan-workflow.mdc`](../../.cursor/rules/06-dev-plan-workflow.mdc) §5).
