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

## 3. Link & push migrations (CLI)

Cần [Supabase CLI](https://supabase.com/docs/guides/cli) (hoặc `npx supabase`):

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

`db push` áp dụng lần lượt:

| Migration | Nội dung |
|-----------|----------|
| `20260528160000_initial_schema.sql` | Bảng, RLS, policies |
| `20260528210000_grants_and_profile_bootstrap.sql` | GRANT, trigger profile, sửa policies |
| `20260528210100_seed_catalog.sql` | Từ vựng + conversation scenarios mẫu |

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
