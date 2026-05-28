# Workflow — Thiết lập Supabase DB

> Skill: [`.agents/skills/supabase/SKILL.md`](../skills/supabase/SKILL.md)

## Khi nào chạy

- Lần đầu có project Supabase
- Sau khi thêm/sửa file trong `supabase/migrations/`
- User yêu cầu "setup db" / "push schema"

## Checklist

1. [ ] `.env` / `apps/mobile/.env` có URL + anon key thật (không còn `YOUR_PROJECT`)
2. [ ] Dashboard: **Anonymous sign-ins** = ON
3. [ ] `npx supabase link --project-ref <ref>`
4. [ ] `npx supabase db push`
5. [ ] Verify: `select count(*) from vocabulary` ≥ 5
6. [ ] App: anonymous login + đọc được `vocabulary`

## Tạo migration mới

```bash
npx supabase migration new <ten_mo_ta>
```

Chỉnh SQL trong `supabase/migrations/`, rồi `db push`. **Không** đoán tên file timestamp.

## Bảo mật (bắt buộc)

- RLS bật trên mọi bảng `public`
- `vocabulary` / `conversation_scenarios`: SELECT cho `anon` + `authenticated`; dữ liệ user theo `device_id` + `profiles`
- Không dùng `user_metadata` trong policy; `device_id` lưu trong `profiles`
- Sau đổi schema: `npx supabase db advisors` (CLI ≥ 2.81.3) hoặc MCP `get_advisors`

## App ↔ DB

- `AppRoot`: `signInAnonymously({ options: { data: { device_id } } })`
- Trigger `handle_new_user` tạo `profiles` row
- FN-01: `GET vocabulary` qua `@hoc-cung-bee/features` + Supabase client
