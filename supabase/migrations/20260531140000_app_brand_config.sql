-- FN-15 — Global app brand (logo, name, colors) — singleton config, read by all clients

create table if not exists public.app_brand_config (
  id smallint primary key default 1 check (id = 1),
  brand_name text not null default 'Developer Cuder',
  brand_tagline text not null default 'APP HỌC TIẾNG ANH',
  brand_subtitle text default 'ENGLISH LEARNING',
  logo_url text,
  logo_storage_path text default 'logo/AvataApp.png',
  brand_primary_hex text not null default '#27AE60',
  brand_primary_light_hex text default '#E8F5E9',
  updated_at timestamptz not null default now()
);

comment on table public.app_brand_config is 'Singleton SSOT branding — logo URL/path, tên app; admin cập nhật qua DB/Storage';
comment on column public.app_brand_config.logo_url is 'URL tuyệt đối HTTPS; ưu tiên hơn logo_storage_path';
comment on column public.app_brand_config.logo_storage_path is 'Path trong bucket brand-assets, vd. logo/AvataApp.png';

insert into public.app_brand_config (
  id,
  brand_name,
  brand_tagline,
  brand_subtitle,
  logo_storage_path,
  brand_primary_hex,
  brand_primary_light_hex
)
values (
  1,
  'Developer Cuder',
  'APP HỌC TIẾNG ANH',
  'ENGLISH LEARNING',
  'logo/AvataApp.png',
  '#27AE60',
  '#E8F5E9'
)
on conflict (id) do update set
  brand_name = excluded.brand_name,
  brand_tagline = excluded.brand_tagline,
  brand_subtitle = excluded.brand_subtitle,
  logo_storage_path = coalesce(public.app_brand_config.logo_storage_path, excluded.logo_storage_path),
  updated_at = now();

alter table public.app_brand_config enable row level security;

drop policy if exists app_brand_config_select_all on public.app_brand_config;
create policy app_brand_config_select_all on public.app_brand_config
  for select
  to anon, authenticated
  using (true);

-- Chỉ service_role / dashboard admin sửa (không policy insert/update cho anon)
revoke insert, update, delete on public.app_brand_config from anon, authenticated;
grant select on table public.app_brand_config to anon, authenticated;

-- Storage bucket cho logo & assets thương hiệu
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brand-assets',
  'brand-assets',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists brand_assets_public_read on storage.objects;
create policy brand_assets_public_read on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'brand-assets');
