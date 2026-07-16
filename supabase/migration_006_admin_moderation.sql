-- ===========================================================
-- Migration 006: admin moderation
-- Admin (allowlist email) duoc xem toan bo reports va danh dau da xu ly.
-- Chay toan bo file nay trong SQL Editor cua Supabase.
-- ===========================================================

-- Ham kiem tra admin theo allowlist email (them email vao list neu can)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() ->> 'email') in ('nguyentuyen01022003@gmail.com'),
    false
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Trang thai xu ly bao cao
alter table public.reports
  add column if not exists status text not null default 'open';

-- Policy: admin doc toan bo reports
drop policy if exists "reports_select_admin" on public.reports;
create policy "reports_select_admin" on public.reports
  for select to authenticated using (public.is_admin());

-- Policy: admin cap nhat trang thai reports
drop policy if exists "reports_update_admin" on public.reports;
create policy "reports_update_admin" on public.reports
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
