<!-- @file: process/templates/feature_template.md | @role: TPL — tạo bộ 5 file trong src/fnxx/ (01, 02_dev_plan_checklist, 03–05) | @related: 12-src-feature-docs.mdc -->

# Template — Phát triển Feature (Function)

> **Trước khi dùng template này:** REQ phải có trong [`00_requirement_business.md`](../00_requirement_business.md) (bảng STT | Tên | Biểu mẫu | Quy định | Ghi chú) — đó là **file requirement nghiệp vụ tổng (BDD)** sau `requirement_base.md`.  
> Luồng SIFI: `requirement_base` → R1 → **`01_requirement.md`** (Task 1) → **Example Mapping** (Task 2) → **`.feature`** (Task 3) → unit TDD (Task 4) → automate (Task 5).

---

## 01_requirement.md

### Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-XX |
| STT (bảng tổng hợp) | |
| Nguồn | Link section trong `00_requirement_business.md` |
| Function ID | FN-XXX |
| Tên | |
| Trạng thái | Draft / In Progress / Done |

### Kim tự tháp (Spec-driven — bắt buộc)

| Tầng | Bước SIFI | Nội dung |
|------|-----------|----------|
| **Goal** | 1 Speculate | Mục tiêu kinh doanh — *tại sao* |
| **Actor** | 1 Speculate | Ai tương tác |
| **Capability** | 1 Speculate | Khả năng hệ thống (REQ-XX) |
| **Feature** | 1 Speculate | FN-XXX — nhóm chức năng |
| **User Story** | 1 Speculate | As a [actor], I want … so that [goal] |
| **Examples** | 2 Illustrate | Example Mapping → `03_debate.md` |
| **Scenario** | 3 Formulate | Given–When–Then → `.feature` |

### Backlog item (bước 1 Speculate)

| Field | Value |
|-------|-------|
| Tiêu đề | |
| Mô tả ngắn | |
| Ưu tiên | Must / Should / Could |
| REQ / FN | REQ-XX / FN-XXX |

### Ubiquitous Language (DDD)

| Thuật ngữ | Ý nghĩa | Domain type |
|-----------|---------|-------------|
| | | |

> Dùng **đúng** thuật ngữ này trong Gherkin, step defs và `src/fnxx/domain/`.

### Tóm tắt (copy từ bảng nghiệp vụ)

| Biểu mẫu | Quy định | Ghi chú |
|----------|----------|---------|
| | | |

### User story

- Là **[role]**, tôi muốn **[action]** để **[benefit]**.

### Acceptance criteria

1. Given … When … Then …
2. …

### Out of scope

- …

### Liên kết

- `.feature` (R3): `docs/01_specification/features/<name>.feature`
- Automation (R4): `tests/features/fnxx/`
- Traceability: [`process/templates/bdd_traceability_template.md`](../templates/bdd_traceability_template.md)
- API: `docs/02_system_design/api_specs/`

---

## 02_dev_plan_checklist.md

> **Luồng & luật (thứ tự bước, gate trước code, ý nghĩa (3)–(6)):** [`.cursor/rules/06-dev-plan-workflow.mdc`](../../.cursor/rules/06-dev-plan-workflow.mdc).  
> **Trong file instance chỉ ghi:** Todo checkbox, từng **Task** với step-by-step cụ thể của FN + bảng **Input / Output / Next step** + ma trận DoD — mẫu [`dev_plan_checklist_template.md`](dev_plan_checklist_template.md).  
> **Task Lõi→Vỏ:** [`docs/04_delivery_tasks/task_template.md`](../docs/04_delivery_tasks/task_template.md).  
> Tranh luận dài → `03_debate.md` (trong file dev plan chỉ **Next step** hoặc một dòng tóm tắt).

---

## 03_debate.md

> **Bước 2 Illustrate:** Example Mapping (Three Amigos) + ADR kỹ thuật.  
> Template: [`example_mapping_template.md`](example_mapping_template.md)

### Example Mapping

| Rule | Example (happy) | Example (edge/negative) | Question |
|------|-----------------|-------------------------|----------|
| | | | |

### ADR / tranh luận

| # | Câu hỏi | Phương án A | Phương án B | Quyết định | Lý do |
|---|---------|-------------|-------------|------------|-------|
| 1 | | | | | |

---

## 04_issue_log.md

> Dùng `issue_loop_template.md` cho từng issue (ISS-xxx).  
> **Đóng issue có lesson cho toàn dự án:** thêm dòng **GISS** vào [`00_global_issue_log.md`](../00_global_issue_log.md).

### Issue index

| ID | Mô tả | Trạng thái | Link chi tiết |
|----|-------|------------|---------------|
| ISS-001 | | Open / Closed | _(section bên dưới)_ |

---

## 05_lesson_learn.md

> **Gate ghi file:** [`.cursor/rules/11-lesson-learn-gate.mdc`](../../.cursor/rules/11-lesson-learn-gate.mdc) — sau lỗi/kinh nghiệm AI **nháp → AskQuestion (Có/Không)** → mới sửa file (không tự ghi im lặng).

| Đã làm tốt | Cần cải thiện | Đề xuất Global |
|------------|---------------|----------------|
| | | _(sau xác nhận Có → `00_global_lesson_learn.md`)_ |
