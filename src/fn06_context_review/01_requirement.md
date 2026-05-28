<!-- @file: src/fn06_context_review/01_requirement.md | @role: SSOT FN — REQ-06 -->

# Context Review Mode — Yêu cầu chức năng

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-06 |
| STT (bảng tổng hợp) | 6 |
| Nguồn | [`00_requirement_business.md`](../../process/00_requirement_business.md) — §5 dòng 6, §6 REQ-06 |
| Function ID | FN-06 |
| Tên | Context Review Mode |
| Trạng thái | Draft |

## Tóm tắt (copy từ bảng nghiệp vụ)

| Biểu mẫu | Quy định | Ghi chú |
|----------|----------|---------|
| Màn **Context Review** | Hiển thị đoạn hội thoại/ngữ cảnh; hỗ trợ đoán nghĩa, điền từ, trả lời theo context; kết quả ghi vào progress | Phụ thuộc REQ-01, REQ-05 |

## User story

- Là **người học**, tôi muốn **luyện từ trong đoạn hội thoại thật** để **nhớ nghĩa trong ngữ cảnh**.

## Acceptance criteria

1. Given đoạn "The backend team deployed the hotfix yesterday" — When tôi trả lời nghĩa của "deploy" — Then hệ thống chấm đúng/sai và ghi kết quả ôn.
2. Given chế độ điền từ — When tôi điền đúng từ thiếu — Then được ghi nhận đúng và cập nhật progress.
3. Given kết quả sai — When hoàn thành bài — Then vẫn ghi vào `learning_progress` theo quy tắc FN-05.

## Out of scope

- Tạo nội dung từ gốc (FN-01); thuật toán lịch ôn chi tiết (FN-05) — chỉ gọi API.

## Liên kết

- `.feature`: [`docs/01_specification/features/context_review.feature`](../../docs/01_specification/features/context_review.feature)
- API / design: `docs/02_system_design/` (khi bootstrap contract)
- SSOT tổng: [`00_requirement_business.md`](../../process/00_requirement_business.md)
