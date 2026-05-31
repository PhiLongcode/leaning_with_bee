# Import templates (mẫu)

> **Mục đích:** Format chuẩn khi dự án có chức năng import dữ liệu học từ CSV/JSON (tuỳ domain).  
> **Instance:** Repo mẫu có thêm Excel + validate dialogue — xem `requirement_base` § FN-16.

| File | Ghi chú |
|------|---------|
| [`vocabulary_import_template.csv`](vocabulary_import_template.csv) | Header flat + cột dialogue_line_N |
| [`vocabulary_import_template.json`](vocabulary_import_template.json) | Wrapper `version` + `items[]` + `dialogue.lines` |

Fork dự án mới: đổi tên cột / schema theo domain; giữ quy ước **validate trước import** + **báo lỗi theo dòng**.
