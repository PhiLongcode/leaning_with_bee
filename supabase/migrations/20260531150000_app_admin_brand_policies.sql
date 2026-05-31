-- FN-15 — Admin-only brand & system permissions (learners read-only)

-- Danh sách admin (gán user_id sau khi tạo tài khoản admin trên Supabase Auth)
create table if not exists public.app_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'brand_admin'
    check (role in ('super_admin', 'brand_admin', 'ops_admin')),
  created_at timestamptz not null default now()
);

comment on table public.app_admins is 'Admin app — chỉ user trong bảng mới được sửa brand/logo/quyền';

create table if not exists public.app_system_config (
  id smallint primary key default 1 check (id = 1),
  permissions jsonb not null default jsonb_build_object(
    'allow_user_vocab_crud', true,
    'allow_quick_capture', true,
    'allow_ai_tutor', true,
    'allow_social_rank', false,
    'allow_web_sync', false
  ),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

comment on table public.app_system_config is 'Feature flags / quyền hệ thống — chỉ admin sửa; app learner đọc';

insert into public.app_system_config (id)
values (1)
on conflict (id) do nothing;

-- Helper: kiểm tra admin (authenticated + có dòng app_admins)
create or replace function public.is_app_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.app_admins a
    where a.user_id = auth.uid()
  );
$$;

revoke all on function public.is_app_admin() from public;
grant execute on function public.is_app_admin() to authenticated;

-- app_brand_config: learner/anon chỉ SELECT (giữ policy cũ); admin được UPDATE
drop policy if exists app_brand_config_admin_update on public.app_brand_config;
create policy app_brand_config_admin_update on public.app_brand_config
  for update
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

grant update on table public.app_brand_config to authenticated;

-- app_system_config: read all, update admin
alter table public.app_system_config enable row level security;

drop policy if exists app_system_config_select_all on public.app_system_config;
create policy app_system_config_select_all on public.app_system_config
  for select
  to anon, authenticated
  using (true);

drop policy if exists app_system_config_admin_update on public.app_system_config;
create policy app_system_config_admin_update on public.app_system_config
  for update
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

revoke insert, update, delete on public.app_system_config from anon;
grant select on table public.app_system_config to anon, authenticated;
grant update on table public.app_system_config to authenticated;

-- app_admins: chỉ admin xem danh sách (hoặc service_role quản lý)
alter table public.app_admins enable row level security;

drop policy if exists app_admins_select_admin on public.app_admins;
create policy app_admins_select_admin on public.app_admins
  for select
  to authenticated
  using (public.is_app_admin() or user_id = auth.uid());

revoke insert, update, delete on public.app_admins from anon, authenticated;
grant select on table public.app_admins to authenticated;

-- Storage brand-assets: public read; ghi/xóa chỉ admin
drop policy if exists brand_assets_admin_insert on storage.objects;
create policy brand_assets_admin_insert on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'brand-assets' and public.is_app_admin());

drop policy if exists brand_assets_admin_update on storage.objects;
create policy brand_assets_admin_update on storage.objects
  for update
  to authenticated
  using (bucket_id = 'brand-assets' and public.is_app_admin())
  with check (bucket_id = 'brand-assets' and public.is_app_admin());

drop policy if exists brand_assets_admin_delete on storage.objects;
create policy brand_assets_admin_delete on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'brand-assets' and public.is_app_admin());
