<!-- @file: process/templates/feature_template.md | @role: TPL — tạo bộ 5 file trong features/fnxx/ (01, 02_dev_plan_checklist, 03–05) | @related: process/00_file_manifest.md, README.md -->

# Template — Phát triển Feature (Function)

> **Trước khi dùng template này:** REQ phải có trong [`00_requirement_business.md`](../00_requirement_business.md) (bảng STT | Tên | Biểu mẫu | Quy định | Ghi chú) — đó là **file requirement nghiệp vụ tổng (BDD)** sau `requirement_base.md`.  
> Luồng: `requirement_base.md` → **`00_requirement_business.md`** (tổng) → **`01_requirement.md`** (từng FN) → **`02_dev_plan_checklist.md`** (dev plan). Chi tiết quy trình: [`requirement_business_template.md`](requirement_business_template.md).

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

- `.feature`: `docs/01_specification/features/<name>.feature`
- API: `docs/02_system_design/api_specs/`

---

## 02_dev_plan_checklist.md

> **Luồng & luật (thứ tự bước, gate trước code, ý nghĩa (3)–(6)):** [`.cursor/rules/06-dev-plan-workflow.mdc`](../../.cursor/rules/06-dev-plan-workflow.mdc).  
> **Trong file instance chỉ ghi:** Todo checkbox, từng **Task** với step-by-step cụ thể của FN + bảng **Input / Output / Next step** + ma trận DoD — mẫu [`dev_plan_checklist_template.md`](dev_plan_checklist_template.md).  
> **Task Lõi→Vỏ:** [`docs/04_delivery_tasks/task_template.md`](../docs/04_delivery_tasks/task_template.md).  
> Tranh luận dài → `03_debate.md` (trong file dev plan chỉ **Next step** hoặc một dòng tóm tắt).

---

## 03_debate.md

> Ghi lại tranh luận / quyết định kỹ thuật (ADR ngắn).

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
