<!-- @file: src/fn04_learning_collection/01_requirement.md | @role: SSOT FN — REQ-04 -->

# Learning Collection — Yêu cầu chức năng

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-04 |
| STT (bảng tổng hợp) | 4 |
| Nguồn | [`00_requirement_business.md`](../../process/00_requirement_business.md) — §5 dòng 4, §6 REQ-04 |
| Function ID | FN-04 |
| Tên | Learning Collection |
| Trạng thái | Draft |

## Tóm tắt (copy từ bảng nghiệp vụ)

| Biểu mẫu | Quy định | Ghi chú |
|----------|----------|---------|
| Màn **Collection**; `learning_collections`, `collection_items` (item_type, item_id) | Tạo/sửa/xóa bộ học; thêm từ hoặc câu vào bộ; một item thuộc đúng một collection tại thời điểm thêm | — |

## User story

- Là **người học**, tôi muốn **gom từ và câu vào bộ học theo chủ đề** để **học có hệ thống**.

## Acceptance criteria

1. Given tôi tạo collection "Scrum Vocabulary" — When tôi thêm từ vào collection — Then collection hiển thị đúng số item.
2. Given collection có câu — When tôi thêm từ cùng loại item_type — Then danh sách hiển thị cả từ và câu đúng loại.
3. Given item đã trong collection A — When thêm vào collection B (nếu policy một collection) — Then tuân thủ quy tắc một item một collection tại thời điểm thêm.

## Out of scope

- Thuật toán spaced repetition (FN-05); CRUD từ/câu gốc (FN-02, FN-03).

## Liên kết

- `.feature`: [`docs/01_specification/features/learning_collection.feature`](../../docs/01_specification/features/learning_collection.feature)
- API / design: `docs/02_system_design/` (khi bootstrap contract)
- SSOT tổng: [`00_requirement_business.md`](../../process/00_requirement_business.md)
