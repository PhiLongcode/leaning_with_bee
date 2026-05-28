# Học cùng Bee

Ứng dụng học tiếng Anh giao tiếp công việc (React Native + **Supabase only**). Khung workflow: `process/` (nghiệp vụ) và `docs/` (kỹ thuật + QA). Thiết kế: [UX](docs/02_system_design/sys_design_ux_ui.md) · [Tech stack](docs/02_system_design/sys_design_techstack.md) · [API](docs/02_system_design/api_specs/api_design.md).

## Cấu trúc

| Thư mục | Vai trò |
|---------|---------|
| `.cursor/rules/` | Rule AI (copy từ `workflow-template/`) |
| `docs/00_input_raw/` | Input thô (`requirement_base.md`) |
| `docs/01_specification/` | REF + `features/*.feature` |
| `docs/02_system_design/` | Thiết kế hệ thống, `api_specs/` |
| `docs/03_quality_assurance/` | Chiến lược test, E2E |
| `docs/04_delivery_tasks/` | Task implement |
| `docs/05_engineering_standards/` | Chuẩn code |
| `process/` | SSOT BDD tổng, prompt history, templates |
| `apps/mobile/` | **Expo app** — Học cùng Bee (Splash, Home, theme, Supabase client) |
| `supabase/` | Migrations SQL + Edge Functions (Supabase-only) |
| `src/fn**/` | Module chức năng — **5 file doc** + code (rule `12`); app import qua `@hoc-cung-bee/features` |
| `workflow-template/` | Pack template upstream (không sửa domain tại đây) |

## Yêu cầu

| File | Vai trò |
|------|---------|
| [`docs/00_input_raw/requirement_base.md`](docs/00_input_raw/requirement_base.md) | SSOT thô (SRS) |
| [`process/00_requirement_business.md`](process/00_requirement_business.md) | SSOT BDD — REQ-01…11 |

## Chạy app

```bash
# Cấu hình Supabase (copy .env.example → apps/mobile/.env)
npm run install:mobile
npm run mobile          # Expo dev server
npm run mobile:typecheck
npm run mobile:build:web
```

Code FN chỉ sửa trong `src/` (package `@hoc-cung-bee/features`, symlink trong `apps/mobile/node_modules`). **Không** copy sang `apps/mobile/src/fn*/`.

Schema Supabase: `supabase/migrations/` — `supabase db push` sau khi `supabase link`.

## Bước tiếp theo

Tài liệu FN: [`src/fn01_hoc_tu_vung_ngu_canh/`](src/fn01_hoc_tu_vung_ngu_canh/) … `fn11_*`. Rule: [`.cursor/rules/12-src-feature-docs.mdc`](.cursor/rules/12-src-feature-docs.mdc).
