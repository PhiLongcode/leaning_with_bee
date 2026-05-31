<!-- @file: src/fn15_brand_config/01_requirement.md | @role: SSOT FN — REQ-15 -->

# Cấu hình thương hiệu & quyền — Yêu cầu chức năng

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-15 |
| Function ID | FN-15 |
| Tên | Brand & system permissions (Admin only) |
| Trạng thái | In Progress |

## Tóm tắt

| Biểu mẫu | Quy định |
|----------|----------|
| `app_brand_config`, Storage `brand-assets` | Logo, tên, màu — **admin sửa**, learner đọc |
| `app_system_config.permissions` | Feature flags — **admin sửa**, app ẩn/hiện tính năng |
| `app_admins` | Danh sách admin; RLS `is_app_admin()` |

## Acceptance criteria

1. Given learner — When mở Cài đặt — Then **không** có UI đổi logo/màu brand.
2. Given admin trong `app_admins` — When update `brand_primary_hex` — Then learner thấy màu mới sau fetch.
3. Given `allow_ai_tutor = false` — When learner mở app — Then Gia sư AI không khả dụng.

## Liên kết

- Admin guide: [`supabase/ADMIN_BRAND.md`](../../supabase/ADMIN_BRAND.md)
- Migrations: `20260531140000_app_brand_config.sql`, `20260531150000_app_admin_brand_policies.sql`
