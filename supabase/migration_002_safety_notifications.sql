-- ===========================================================
-- Migration 002: reports, blocks, unread messages, avatars
-- ===========================================================

-- ---------- REPORTS ----------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reported_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null default '',
  created_at timestamptz not null default now(),
  constraint no_self_report check (reporter_id <> reported_id)
);
alter table public.reports enable row level security;
drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own" on public.reports
  for insert to authenticated with check (auth.uid() = reporter_id);
drop policy if exists "reports_select_own" on public.reports;
create policy "reports_select_own" on public.reports
  for select to authenticated using (auth.uid() = reporter_id);

-- ---------- BLOCKS ----------
create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint no_self_block check (blocker_id <> blocked_id),
  constraint unique_block unique (blocker_id, blocked_id)
);
alter table public.blocks enable row level security;
drop policy if exists "blocks_select_own" on public.blocks;
create policy "blocks_select_own" on public.blocks
  for select to authenticated using (auth.uid() = blocker_id);
drop policy if exists "blocks_insert_own" on public.blocks;
create policy "blocks_insert_own" on public.blocks
  for insert to authenticated with check (auth.uid() = blocker_id);
drop policy if exists "blocks_delete_own" on public.blocks;
create policy "blocks_delete_own" on public.blocks
  for delete to authenticated using (auth.uid() = blocker_id);

-- ---------- UNREAD MESSAGES ----------
alter table public.messages add column if not exists read boolean not null default false;

-- Nguoi nhan duoc phep danh dau tin cua doi phuong la da doc
drop policy if exists "messages_update_read" on public.messages;
create policy "messages_update_read" on public.messages
  for update to authenticated
  using (
    sender_id <> auth.uid()
    and exists (
      select 1 from public.connections c
      where c.id = connection_id
        and (c.requester_id = auth.uid() or c.receiver_id = auth.uid())
    )
  )
  with check (sender_id <> auth.uid());

-- ---------- AVATARS ----------
alter table public.profiles add column if not exists avatar_url text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars_read_public" on storage.objects;
create policy "avatars_read_public" on storage.objects
  for select to public using (bucket_id = 'avatars');
drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
