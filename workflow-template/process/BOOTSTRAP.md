# process — Bootstrap checklist (dự án mới)

Sau khi copy khung, tạo đủ **meta** trong `process/` (lấy mẫu từ repo gốc [`../../process/`](../../process/), bỏ nội dung F&B):

- [ ] `00_cursorrules.md` — thứ tự đọc AI (đường dẫn `docs/00_input_raw/…`)
- [ ] `00_requirement_business.md` — SSOT BDD + bảng REQ (domain mới)
- [ ] `00_system_requirement.md`
- [ ] `00_global_lesson_learn.md`, `00_global_issue_log.md`
- [ ] `00_file_manifest.md`, `00_directory_contract.md` (có thể copy từ repo gốc rồi sửa tên sản phẩm)
- [ ] `00_process_compliance_checklist.md` (tuỳ team)
- [ ] `templates/*.md` đầy đủ (kể cả `dev_plan_checklist_template.md`)
- [ ] `features/fn01_*/` đầu tiên: `01_requirement.md`, `02_dev_plan_checklist.md`, `03`–`05`
- [ ] `prompt_history/00_index.md` + `README.md`
- [ ] `docs/02_system_design/src_module_structure.md`, `solid_guidelines.md`, `extensibility_integration.md` (copy từ repo mẫu; **không** scaffold `src/` sẵn)
- [ ] Đọc [`../TEMPLATE_PLAYBOOK.md`](../TEMPLATE_PLAYBOOK.md) **Playbook A** khi khởi tạo; maintainer dùng **B** sau mỗi đổi rule/template ở repo mẫu
