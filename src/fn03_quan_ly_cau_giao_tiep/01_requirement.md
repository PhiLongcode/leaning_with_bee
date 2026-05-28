<!-- @file: src/fn03_quan_ly_cau_giao_tiep/01_requirement.md | @role: SSOT FN — REQ-03 -->

# Quản lý câu giao tiếp — Yêu cầu chức năng

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-03 |
| STT (bảng tổng hợp) | 3 |
| Nguồn | [`00_requirement_business.md`](../../process/00_requirement_business.md) — §5 dòng 3, §6 REQ-03 |
| Function ID | FN-03 |
| Tên | Quản lý câu giao tiếp |
| Trạng thái | Draft |

## Tóm tắt (copy từ bảng nghiệp vụ)

| Biểu mẫu | Quy định | Ghi chú |
|----------|----------|---------|
| Màn quản lý câu; `user_sentences` (sentence, translation, context, topic) | CRUD câu theo chủ đề (Standup, Scrum, Interview, Team, Email…); câu có context | Liên kết collection FN-04 |

## User story

- Là **người học**, tôi muốn **lưu câu giao tiếp theo chủ đề công việc** để **dùng lại khi học và ôn**.

## Acceptance criteria

1. Given tôi nhập câu tiếng Anh, bản dịch và context Daily Standup — When tôi lưu — Then câu hiển thị trong danh sách theo chủ đề Standup.
2. Given câu đã lưu — When tôi sửa translation hoặc topic — Then thay đổi phản ánh ngay trên thiết bị.
3. Given câu trong sổ — When tôi xóa — Then câu không còn trong danh sách chủ đề tương ứng.

## Out of scope

- Thêm câu vào collection (FN-04); AI conversation (FN-07).

## Liên kết

- `.feature`: [`docs/01_specification/features/quan_ly_cau_giao_tiep.feature`](../../docs/01_specification/features/quan_ly_cau_giao_tiep.feature)
- API / design: `docs/02_system_design/` (khi bootstrap contract)
- SSOT tổng: [`00_requirement_business.md`](../../process/00_requirement_business.md)
