-- Grants (Data API) + profile bootstrap + policy fixes
-- Ref: .agents/skills/supabase/SKILL.md

grant usage on schema public to anon, authenticated;

grant select on table public.vocabulary to anon, authenticated;
grant select on table public.conversation_scenarios to anon, authenticated;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.user_vocabulary to authenticated;
grant select, insert, update, delete on table public.user_sentences to authenticated;
grant select, insert, update, delete on table public.learning_progress to authenticated;
grant select, insert, update, delete on table public.learning_collections to authenticated;
grant select, insert, update, delete on table public.collection_items to authenticated;
grant select, insert, update, delete on table public.conversation_logs to authenticated;

grant insert on table public.vocabulary to authenticated;

-- Profile row when auth user is created (device_id from signInAnonymously options.data)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_device_id text;
begin
  v_device_id := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'device_id'), ''),
    new.id::text
  );

  insert into public.profiles (id, device_id)
  values (new.id, v_device_id)
  on conflict (id) do update
    set device_id = excluded.device_id
    where public.profiles.device_id is distinct from excluded.device_id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

revoke all on function public.handle_new_user() from public;
grant execute on function public.handle_new_user() to service_role;

-- Safer device helper (must be signed in)
create or replace function public.current_device_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select device_id
  from public.profiles
  where id = auth.uid();
$$;

revoke all on function public.current_device_id() from public;
grant execute on function public.current_device_id() to authenticated;

-- collection_items: WITH CHECK was missing on ALL policy
drop policy if exists collection_items_via_collection on public.collection_items;
create policy collection_items_via_collection on public.collection_items
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.learning_collections c
      where c.id = collection_id
        and c.device_id = public.current_device_id()
    )
  )
  with check (
    exists (
      select 1
      from public.learning_collections c
      where c.id = collection_id
        and c.device_id = public.current_device_id()
    )
  );

-- Catalog readable before full session (optional pre-auth)
drop policy if exists vocabulary_select_all on public.vocabulary;
create policy vocabulary_select_all on public.vocabulary
  for select
  to anon, authenticated
  using (true);

drop policy if exists conversation_scenarios_read on public.conversation_scenarios;
create policy conversation_scenarios_read on public.conversation_scenarios
  for select
  to anon, authenticated
  using (true);
