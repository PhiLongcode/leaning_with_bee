# Template Playbook — prompt tái sử dụng

> Copy-paste **một block** (hoặc tối đa 2 bước) cho từng tình huống.  
> Rule AI: [`/.cursor/rules/07-template-pack-maintenance.mdc`](.cursor/rules/07-template-pack-maintenance.mdc) · Issue roll-up: [`ISSUES_TO_TEMPLATE.md`](ISSUES_TO_TEMPLATE.md)

---

## A — Bootstrap dự án mới (fork pack)

**Chế độ:** `hon_hop` · **Khi:** Repo trống / dự án mới, cần khung `process/` + `docs/` + rules.

```
Mục tiêu: Khởi tạo dự án mới từ workflow-template (không copy domain F&B).
SSOT: @workflow-template/README.md, @process/00_directory_contract.md, @process/00_naming_convention.md
Bước:
  1. Copy workflow-template/.cursor/rules/ → .cursor/rules/
  2. Copy workflow-template/docs/ (README, 00_input_raw placeholder) → docs/
  3. Từ repo mẫu copy process/templates/, process/00_*.md (meta), process/00_cursorrules.md — xóa nội dung F&B trong 00_requirement_business.md
  4. Điền docs/00_input_raw/requirement_base.md (input thô); tạo process/00_requirement_business.md từ templates/requirement_business_template.md
  5. Tạo features/fn01_* đầu tiên: 01_requirement.md, 02_dev_plan_checklist.md (từ templates)
  6. prompt_history/00_index.md + README; cập nhật root README.md link contract/manifest
  7. Điền PROJECT_STAMPS.md (tên sản phẩm, ngày fork)
Không: GISS/lesson trong docs/; không ghi PRM trước Yes user
Output: Cây thư mục đủ BOOTSTRAP.md; manifest thật (process/00_file_manifest.md)
```

---

## B — Đồng bộ pack từ repo mẫu (maintainer)

**Chế độ:** `sua_file` hoặc `hon_hop` · **Khi:** Đã sửa rule, template, contract, naming ở repo gốc.

> **Gate tự động:** Rule `07-template-pack-maintenance.mdc` (`alwaysApply`) — cuối task, nếu phát hiện thay đổi lớn (L1–L7), AI **AskQuestion** 2 lựa chọn (*Có — đồng bộ* / *Không — bỏ qua*) **trước** khi sửa `workflow-template/`. Chỉ chạy checklist dưới sau khi user chọn **Có**.

```
Mục tiêu: workflow-template/ khớp thay đổi process/templates và .cursor/rules ở repo mẫu.
SSOT: @.cursor/rules/07-template-pack-maintenance.mdc (checklist §2)
Việc:
  - Diff .cursor/rules/*.mdc ↔ workflow-template/.cursor/rules/
  - Copy process/templates/* đã đổi
  - Cập nhật workflow-template/README.md, process/BOOTSTRAP.md nếu thêm meta file
  - Tăng PROJECT_STAMPS.md + 1 dòng TEMPLATE_CHANGELOG.md
  - grep trong workflow-template/ path cũ (MD/, Features/, PascalCase)
Không: Copy 00_requirement_business nội dung domain
Output: Pack version bump; maintainer có thể tag/release pack
```

---

## C — Issue / lesson → cải tiến template

**Chế độ:** `hon_hop` · **Khi:** Đóng GISS/ISS có lesson cho mọi dự án fork.

```
Mục tiêu: Rút kinh nghiệm từ process/features/*/04_issue_log.md hoặc 00_global_issue_log.md vào pack.
SSOT: @workflow-template/ISSUES_TO_TEMPLATE.md
Bước:
  1. Đọc ISSUES_TO_TEMPLATE — trùng anti-pattern thì bỏ qua
  2. Thêm 1 dòng anti-pattern hoặc «Cải tiến đã đưa vào pack»
  3. Nếu cần đổi rule/template/stub → chạy Playbook B
  4. (Tuỳ) Playbook mới vào TEMPLATE_PLAYBOOK.md nếu lặp lại ≥2 lần
Output: ISSUES_TO_TEMPLATE.md (+ file pack nếu có)
```

---

## D — Gate release pack (trước khi chia sẻ template)

**Chế độ:** `tu_van` (review) hoặc `sua_file` · **Khi:** Chuẩn bị tag `workflow_template_pack`.

```
Mục tiêu: Xác nhận pack fork được không lỗi path/rule.
Checklist:
  [ ] Mọi .mdc trong pack trỏ docs/01_specification, process/features/**/02_dev_plan_checklist.md
  [ ] BOOTSTRAP.md liệt kê đủ templates từ repo mẫu
  [ ] Không file REQ/F&B trong pack (chỉ SAMPLE requirement_base)
  [ ] PROJECT_STAMPS + TEMPLATE_CHANGELOG khớp version
  [ ] ISSUES_TO_TEMPLATE có anti-pattern tối thiểu §1–7
  [ ] README pack link 00_directory_contract, 00_naming_convention
Output: Pass gate hoặc danh sách file cần sync (Playbook B)
```

---

## E — Cập nhật dự án đã fork (pull cải tiến pack)

**Chế độ:** `hon_hop` · **Khi:** Dự án cũ muốn nhận rule/template mới từ upstream.

```
Mục tiêu: Merge thay đổi pack mà không ghi đè domain đã có.
SSOT: TEMPLATE_CHANGELOG.md (upstream), PROJECT_STAMPS của dự án
Bước:
  1. Đọc CHANGELOG từng version — chỉ merge .cursor/rules/, process/templates/, meta contract/naming nếu team đồng ý
  2. Không merge 00_requirement_business, features/fn*/ từ mẫu
  3. Sau merge: grep path; chạy process/00_process_compliance_checklist.md (nếu có)
Output: Dự án giữ domain; rule/template mới nhất
```
