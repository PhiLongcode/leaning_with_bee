# Môi trường Dev / Prod — Học cùng Bee Mobile

## Phiên bản app

**Nguồn:** [`version.json`](version.json) — `version`, `iosBuildNumber`, `androidVersionCode`.

- Store / `app.config.ts`: đọc `version.json` (iOS build, Android `versionCode`).
- Trong app: Home hiển thị `v1.0.0 (build 1)` qua `src/config/version.ts`.

Tăng build khi release:

```json
{ "version": "1.0.1", "iosBuildNumber": "2", "androidVersionCode": 2 }
```

Đồng bộ `package.json` → `"version"` cùng semver (tuỳ chọn).

## Biến môi trường (Expo)

| Biến | Dev | Prod | Mô tả |
|------|-----|------|--------|
| `EXPO_PUBLIC_APP_ENV` | `development` | `production` | Badge trên Home + logic môi trường |
| `EXPO_PUBLIC_APP_NAME` | `Học cùng Bee (Dev)` | `Học cùng Bee` | Tên hiển thị (app.config) |
| `EXPO_PUBLIC_SUPABASE_URL` | URL project **dev** | URL project **prod** | Khuyến nghị **2 project Supabase** |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Anon/publishable **dev** | Anon/publishable **prod** | Không dùng `service_role` trên app |

File mẫu:

- [`.env.development.example`](.env.development.example)
- [`.env.production.example`](.env.production.example)

## Thiết lập lần đầu

```bash
cd apps/mobile
cp .env.development.example .env.development
# Sửa URL + anon key project DEV
cp .env.production.example .env.production
# Sửa URL + anon key project PROD (khi có)
```

## Chạy app

```bash
# Dev (mặc định)
npm run start:dev
# hoặc từ root: npm run mobile:dev

# Prod local (kiểm tra trước release)
npm run start:prod

# Build web production
npm run build:web:prod
```

## Kiểm tra kết nối database

Trên **Home** có card **Trạng thái hệ thống**:

| Trạng thái | Ý nghĩa |
|------------|---------|
| Cấu hình Supabase: OK | `.env` có URL + key hợp lệ |
| Đã kết nối DB | Query `vocabulary` thành công |
| Thiếu schema | Chưa chạy `supabase/apply-all.sql` hoặc `npm run db:push` |
| Chưa cấu hình | Copy/sửa file `.env.*` |

Bấm **Kiểm tra lại kết nối DB** để refresh.

## Supabase CLI theo môi trường

```bash
# Dev
npx supabase link --project-ref YOUR_DEV_REF
npm run db:push

# Prod — sau khi tạo project prod riêng
npx supabase link --project-ref YOUR_PROD_REF
npm run db:push
```

Schema: [`../../supabase/migrations/`](../../supabase/migrations/) hoặc [`../../supabase/apply-all.sql`](../../supabase/apply-all.sql).

## EAS / release

Đặt secrets trên EAS theo `production`:

- `EXPO_PUBLIC_APP_ENV=production`
- `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` của project prod
