-- Theo dõi migration đã apply (db-sync)
create table if not exists public.schema_deployments (
  name text primary key,
  applied_at timestamptz not null default now()
);
