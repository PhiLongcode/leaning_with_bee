<!-- @file: src/fn02_quan_ly_tu_vung_ca_nhan/01_requirement.md | @role: SSOT FN — REQ-02 -->

# Quản lý từ vựng cá nhân — Yêu cầu chức năng

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-02 |
| STT (bảng tổng hợp) | 2 |
| Nguồn | [`00_requirement_business.md`](../../process/00_requirement_business.md) — §5 dòng 2, §6 REQ-02 |
| Function ID | FN-02 |
| Tên | Quản lý từ vựng cá nhân |
| Trạng thái | Draft |

## Tóm tắt (copy từ bảng nghiệp vụ)

| Biểu mẫu | Quy định | Ghi chú |
|----------|----------|---------|
| Form thêm/sửa từ; danh sách từ; `user_vocabulary` (favorite, difficult) | CRUD từ gắn `device_id`; favorite/difficult cập nhật realtime trên thiết bị; xóa không ảnh hưởng từ hệ thống chung nếu tách catalog | — |

## User story

- Là **người học**, tôi muốn **thêm và quản lý từ trong sổ cá nhân** để **ôn theo nhu cầu riêng**.

## Acceptance criteria

1. Given từ đã có trong sổ của tôi — When tôi đánh dấu favorite — Then từ xuất hiện trong danh sách yêu thích.
2. Given form thêm từ hợp lệ — When tôi lưu — Then từ gắn `device_id` và hiển thị trong danh sách.
3. Given từ cá nhân — When tôi xóa — Then từ biến mất khỏi sổ; catalog hệ thống (nếu tách) không đổi.

## Out of scope

- Học theo ngữ cảnh màn chính (FN-01); thuật toán ôn (FN-05).

## Liên kết

- `.feature`: [`docs/01_specification/features/quan_ly_tu_vung_ca_nhan.feature`](../../docs/01_specification/features/quan_ly_tu_vung_ca_nhan.feature)
- API / design: `docs/02_system_design/` (khi bootstrap contract)
- SSOT tổng: [`00_requirement_business.md`](../../process/00_requirement_business.md)
