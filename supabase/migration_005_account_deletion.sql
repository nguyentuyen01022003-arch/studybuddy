-- ===========================================================
-- Migration 005: self-serve account deletion
-- Cho phep nguoi dung tu xoa tai khoan cua chinh minh (GDPR / App Store).
-- Chay toan bo file nay trong SQL Editor cua Supabase.
-- ===========================================================

create or replace function public.delete_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  -- Xoa file cua user trong storage (avatars, chat-images) - khong tu cascade
  delete from storage.objects
  where bucket_id in ('avatars', 'chat-images')
    and (storage.foldername(name))[1] = uid::text;

  -- Xoa user trong auth.users -> cascade toan bo du lieu lien quan:
  -- profiles, connections, messages, study_sessions, reports, blocks, message_reactions
  delete from auth.users where id = uid;
end;
$$;

-- Chi cho phep user da dang nhap goi ham nay (tu xoa chinh minh qua auth.uid())
revoke all on function public.delete_user() from public, anon;
grant execute on function public.delete_user() to authenticated;
