# Workflow template — khởi tạo dự án cùng khung

Mục tiêu: nhân bản **cấu trúc hai tầng** `process/` (quy trình + nghiệp vụ) và `docs/` (artifact kỹ thuật + QA + chuẩn code) kèm rule Cursor, **không** copy nội dung domain F&B của repo mẫu.

## Đọc trước (SSOT)

- [`../process/00_directory_contract.md`](../process/00_directory_contract.md) — hợp đồng tên thư mục, luồng dữ liệu, điều cấm duplicate lesson/issue/PRD trong `docs/`.
- [`../process/00_naming_convention.md`](../process/00_naming_convention.md) — quy ước `NN_snake_case` (mẫu `00_input_raw`) cho `docs/` và `process/`.
- [`TEMPLATE_PLAYBOOK.md`](TEMPLATE_PLAYBOOK.md) — **prompt tái sử dụng**: bootstrap, sync pack, issue→template, gate release.
- [`ISSUES_TO_TEMPLATE.md`](ISSUES_TO_TEMPLATE.md) — anti-pattern & cải tiến rút từ dự án mẫu (roll-up từ issue/PRM).
- [`TEMPLATE_CHANGELOG.md`](TEMPLATE_CHANGELOG.md) — lịch sử phiên bản pack.
- [`PROJECT_STAMPS.md`](PROJECT_STAMPS.md) — ghi nhận phiên bản gói template khi bạn fork.
- Rule AI: [`.cursor/rules/07-template-pack-maintenance.mdc`](.cursor/rules/07-template-pack-maintenance.mdc) — **tự check** thay đổi lớn cuối task → **AskQuestion** (Có/ Không) trước khi cập nhật pack.

## Cách dùng nhanh

1. **Copy cây thư mục** từ thư mục này vào repo dự án mới (hoặc merge vào monorepo con):
   - `workflow-template/.cursor/rules/` → `.cursor/rules/` (đã copy sẵn từ repo mẫu; cập nhật lại khi rule gốc đổi)
   - `workflow-template/docs/` (đã có `README` + placeholder) — bổ sung file kỹ thuật thật theo từng dự án
   - `workflow-template/process/` — chỉ placeholder; **copy đầy đủ** `process/templates/`, `process/00_cursorrules.md`, các file `process/00_*.md` (snake_case) từ repo mẫu rồi xóa/rút nội dung domain.
2. Chỉnh root `README.md` theo sản phẩm; giữ liên kết tới `process/00_directory_contract.md`, `process/00_naming_convention.md` và `process/00_file_manifest.md` sau khi tạo manifest thật.
3. Điền `docs/00_input_raw/requirement_base.md` bằng input thô dự án mới; BDD SSOT vẫn nằm trong `process/00_requirement_business.md`.

## Nội dung gói này

| Thành phần | Ghi chú |
|------------|---------|
| `.cursor/rules/*.mdc` | **`13`** = SSOT quy trình **SIFI 7 bước**; `01` Formulate, `03` unit TDD, `04` Automate, `06` dev plan Task 1–7 |
| `process/templates/example_mapping_template.md` | Bước 2 Illustrate (Three Amigos) |
| `process/templates/bdd_traceability_template.md` | Illustrate → Formulate → Automate |
| `docs/03_quality_assurance/` | `testing_strategy.md`, `performance_testing.md` — domain, UI, **k6 perf** |
| `TEMPLATE_PLAYBOOK.md` | Playbook A–E (bootstrap, sync, issue→template, gate, pull upstream) |
| `ISSUES_TO_TEMPLATE.md` | Lesson/issue → tránh lặp khi fork |
| `TEMPLATE_CHANGELOG.md` | Version pack |
| `docs/README.md` | Pipeline A–F ngắn; chi tiết đầy đủ trên repo mẫu [`../docs/README.md`](../docs/README.md) |
| `docs/00_input_raw/` | Placeholder cho input thô |
| `docs/01_specification/features/README.md` | Gợi ý đặt `.feature` |
| `docs/templates/` | Mẫu import CSV/JSON (vocabulary + dialogue) — tuỳ domain |
| `process/BOOTSTRAP.md` | Checklist file meta cần copy từ repo mẫu |

Không commit secret (`.env`, token). Không đặt **GISS** hay **lesson learn toàn dự án** vào `docs/`.
