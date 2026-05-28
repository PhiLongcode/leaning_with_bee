# Supabase — Học cùng Bee

Schema và seed theo SRS + [api_design.md](../docs/02_system_design/api_specs/api_design.md). Agent workflow: [.agents/workflows/supabase-db-setup.md](../.agents/workflows/supabase-db-setup.md).

## 1. Tạo project (Dashboard)

1. [supabase.com/dashboard](https://supabase.com/dashboard) → New project.
2. **Authentication → Providers** → bật **Anonymous sign-ins**.
3. **Project Settings → API** → copy **Project URL** và **anon public** key.

## 2. Env app

```bash
cp .env.example apps/mobile/.env
```

Điền `EXPO_PUBLIC_SUPABASE_URL` và `EXPO_PUBLIC_SUPABASE_ANON_KEY` (không commit `.env`).

## 3. Đồng bộ schema tự động (khuyến nghị)

```bash
# Một lần: đăng nhập CLI
npx supabase login

# Đồng bộ migrations lên project remote
npm run db:sync
```

Khi chạy `npm run mobile:dev` / `npm run web` (trong `apps/mobile`), script **`db-sync --auto`** chạy trước Expo — bỏ qua nếu chưa có token/DB password.

**Xác thực** (chọn một, thêm vào `.env` hoặc `apps/mobile/.env.development`):

| Biến | Mô tả |
|------|--------|
| `SUPABASE_ACCESS_TOKEN` | Token từ `npx supabase login` hoặc Dashboard → Account |
| `SUPABASE_DB_PASSWORD` | Mật khẩu DB (Settings → Database) — dùng pooler |
| `SUPABASE_DB_REGION` | Region pooler (vd. `ap-southeast-1`) — xem Connect trong Dashboard |
| `DATABASE_URL` | URL pooler đầy đủ (ưu tiên nếu `npm run db:sync` báo ENOTFOUND) |

**Nếu `db:sync` lỗi ENOTFOUND / pooler:** host `db.*.supabase.co` thường chỉ có IPv6; máy không ra IPv6 thì copy **Session pooler** URL từ Dashboard → Database → Connect vào `DATABASE_URL`, hoặc chạy SQL thủ công:

1. `npm run db:compose` (tạo `supabase/apply-all.sql`)
2. Dashboard → **SQL Editor** → dán `apply-all.sql` → **Run**
3. Kiểm tra: `select lesson_day, count(*) from vocabulary group by 1 order by 1;` → 7 ngày × 10 từ

Script theo dõi migration đã chạy qua bảng `public.schema_deployments` (không apply trùng).

| Lệnh | Mô tả |
|------|--------|
| `npm run db:sync` | Gộp migrations → `apply-all.sql` + push |
| `npm run db:sync:force` | Chạy lại tất cả migrations |
| `npm run db:compose` | Chỉ gộp file SQL |

Migrations:

| File | Nội dung |
|------|----------|
| `20260528160000_initial_schema.sql` | Bảng, RLS, policies |
| `20260528210000_grants_and_profile_bootstrap.sql` | GRANT, trigger profile |
| `20260528210100_seed_catalog.sql` | Seed từ + scenarios |
| `20260529000000_fn08_10_11_tables.sql` | learner_stats, speech, notifications |
| `20260529120000_vocabulary_lesson_days.sql` | learning_days, lesson_day/order |
| `20260529120100_seed_7_day_vocabulary.sql` | 70 từ (7×10) |

## 3b. Link & push thủ công (CLI)

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

## 4. Local (tuỳ chọn, cần Docker)

```bash
npx supabase start
npx supabase db reset   # migrate + seed local
```

Studio: http://localhost:54323

## 5. Kiểm tra

SQL Editor hoặc:

```bash
npx supabase db query --linked "select count(*) from public.vocabulary;"
```

Kỳ vọng ≥ 5 từ sau seed.

## 6. MCP (Cursor)

File mẫu [`.mcp.json.example`](../.mcp.json.example) — bật Supabase MCP và OAuth theo [skill Supabase](.agents/skills/supabase/SKILL.md).
