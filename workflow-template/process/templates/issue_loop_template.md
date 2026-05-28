<!-- @file: process/templates/issue_loop_template.md | @role: TPL — block issue cho features/04_issue_log và bugs/02_ai_analysis | @related: process/00_global_issue_log.md (roll-up GISS), process/00_file_manifest.md, README.md -->

# Template — Issue Loop

> Paste block này vào `features/<fn>/04_issue_log.md` hoặc `bugs/<bug>/02_ai_analysis.md` khi xử lý issue.  
> **Khi đóng (Closed):** nếu issue có giá trị cho FN khác → thêm **1 dòng** vào [`process/00_global_issue_log.md`](../00_global_issue_log.md) (GISS) — xem mục 6 bên dưới.

---

## ISS-___ : [Tiêu đề ngắn]

| Field | Value |
|-------|-------|
| Ngày mở | YYYY-MM-DD |
| Người báo | |
| Mức độ | P0 / P1 / P2 / P3 |
| Trạng thái | Open → Investigating → Fixed → Verified → Closed |

### 1. Hiện tượng (Symptom)

- Mô tả lỗi / hành vi sai:
- Môi trường: local / staging / prod
- Steps to reproduce:
  1. …
  2. …

### 2. Giả thuyết (Hypothesis)

| # | Giả thuyết | Cách kiểm tra | Kết quả |
|---|------------|---------------|---------|
| H1 | | | ☐ Đúng ☐ Sai |

### 3. Root cause

- **Nguyên nhân gốc:**
- **File / module liên quan:**

### 4. Fix

- **Thay đổi:**
- **PR / commit:**

### 5. Verify

- [ ] Unit test
- [ ] E2E / manual
- [ ] Regression checklist

### 6. Lesson & roll-up toàn dự án (sau khi đóng)

- Tránh lặp lại bằng cách:
- Cập nhật [`process/00_global_issue_log.md`](../00_global_issue_log.md) (bảng GISS — **bắt buộc** nếu lesson áp dụng cho FN khác / toàn repo): ☐ Có ☐ Không (chỉ nội bộ FN)
  - Ghi: GISS mới, Nguồn = `FNxx`, link tới section ISS tương ứng trong `04_issue_log.md`
- **`05_lesson_learn.md` (FN):** AI chạy gate [`.cursor/rules/11-lesson-learn-gate.mdc`](../../.cursor/rules/11-lesson-learn-gate.mdc) — nháp bài học → **hỏi user Có/Không** → mới ghi file (không tự ghi).
- `00_global_lesson_learn.md` (insight tổng quát): ☐ Có ☐ Không — **sau** user xác nhận gate lesson, cột «Đề xuất Global».
