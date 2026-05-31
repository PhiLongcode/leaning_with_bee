# Admin — Brand, màu & quyền hệ thống

> **FN-15 / REQ-15** — Chỉ user trong `app_admins` được **sửa** logo, màu brand, tên app và `app_system_config.permissions`.  
> Learner app: **read-only**.

## 1. Tạo tài khoản admin

1. Supabase Dashboard → **Authentication** → **Users** → Add user (email + password).
2. Copy `user_id` (UUID).
3. SQL Editor:

```sql
insert into public.app_admins (user_id, email, role)
values ('YOUR-USER-UUID', 'admin@example.com', 'super_admin')
on conflict (user_id) do nothing;
```

## 2. Cập nhật logo

1. Upload `brand/logo/AvataApp.png` → Storage → bucket **`brand-assets`** → path `logo/AvataApp.png`  
   (hoặc `.\scripts\upload-brand-logo.ps1` với CLI admin đã login)
2. Kiểm tra `app_brand_config`:

```sql
update public.app_brand_config
set logo_storage_path = 'logo/AvataApp.png',
    updated_at = now()
where id = 1;
```

Hoặc set `logo_url` = URL HTTPS tuyệt đối nếu host ngoài Supabase.

## 3. Cập nhật màu & tên brand

```sql
update public.app_brand_config
set brand_name = 'Developer Cuder',
    brand_primary_hex = '#27AE60',
    brand_primary_light_hex = '#E8F5E9',
    updated_at = now()
where id = 1;
```

## 4. Cấu hình quyền tính năng

```sql
update public.app_system_config
set permissions = jsonb_build_object(
  'allow_user_vocab_crud', true,
  'allow_quick_capture', true,
  'allow_ai_tutor', true,
  'allow_social_rank', false,
  'allow_web_sync', false
),
updated_at = now(),
updated_by = 'YOUR-ADMIN-UUID'
where id = 1;
```

## 5. RLS tóm tắt

| Tài nguyên | Learner (anon/auth) | Admin |
|------------|---------------------|-------|
| `app_brand_config` SELECT | Có | Có |
| `app_brand_config` UPDATE | Không | Có (`is_app_admin()`) |
| `app_system_config` SELECT | Có | Có |
| `app_system_config` UPDATE | Không | Có |
| Storage `brand-assets` read | Có (public) | Có |
| Storage `brand-assets` write | Không | Có |

## 6. Phase sau

Web **Admin portal** (REQ-13 mở rộng): form brand + permissions, JWT admin, không cần SQL tay.
