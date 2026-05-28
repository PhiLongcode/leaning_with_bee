# Issue & lesson → cải tiến workflow-template

> Tổng hợp từ dự án mẫu (PRM-20260520-001…004, đổi tên `MD`→`process`, prompt history).  
> **Mục đích:** Khi fork repo mới, tránh lặp lỗi quy trình — **không** thay cho `process/00_global_issue_log.md` (runtime).

## Anti-patterns (đã gặp — áp dụng mọi fork)

| # | Vấn đề | Cách tránh (pack / quy trình) |
|---|--------|------------------------------|
| 1 | Duplicate GISS, lesson, PRD dài trong `docs/` | Chỉ `process/00_global_*` + `features/*/04–05`; `docs/` = kỹ thuật + input thô |
| 2 | Tách FN trước khi có REQ tổng | Luồng: `requirement_base.md` → `00_requirement_business.md` → rồi mới `features/fnxx/` |
| 3 | Rule AI trỏ path cũ (`MD/`, `Features/`, PascalCase file) | Sau rename: `grep` toàn repo + sync `workflow-template/.cursor/rules/` |
| 4 | Pack template lệch rule gốc | Mọi đổi `.cursor/rules/` → checklist rule `07-template-pack-maintenance.mdc` |
| 5 | Ghi PRM không hỏi user | Rule `05-prompt-history`: Yes/No (AskQuestion) trước khi ghi file |
| 6 | Windows: đổi tên chỉ hoa/thường fail | Đổi qua tên tạm (`_rename_tmp`) rồi tên đích |
| 7 | Copy cả domain F&B vào dự án mới | Pack chỉ khung; xóa/rút `00_requirement_business`, FN mẫu sau bootstrap |
| 8 | Sync pack im lặng, pack lệch rule gốc | Rule `07`: tự check cuối task + **AskQuestion** trước khi đồng bộ |

## Cải tiến đã đưa vào pack

| Phiên / nguồn | Cải tiến template |
|---------------|-------------------|
| PRM-20260520-002 | Hai tầng `process/` + `docs/`; Directory Contract; `workflow-template/` skeleton |
| PRM-20260520-003 | Yes/No lưu PRM; sync rule 05 vào pack |
| PRM-20260520-004 | `00_naming_convention.md`; `NN_snake_case`; manifest + rules đồng bộ |
| PRM (prompt history) | `prompt_history_template`: Chế độ `tao_file` \| `sua_file` \| `hon_hop` \| `tu_van` |
| Rule 07 (này) | Playbook + changelog + gate đồng bộ pack |
| Rule 07 v1.1.1 | `alwaysApply` + tự check L1–L7 + AskQuestion Có/Không trước sync |
| `src_module_structure.md` | `src/fn##_*/` feature-first + Clean bên trong; cấm `src/domain/` phẳng |

## Khi thêm dòng mới

1. Đóng issue có lesson **áp dụng rộng** (không chỉ 1 FN).
2. Thêm 1 dòng **Anti-patterns** hoặc **Cải tiến đã đưa vào pack**.
3. Nếu cần sửa file trong `workflow-template/` → chạy checklist trong `07-template-pack-maintenance.mdc` §2.
