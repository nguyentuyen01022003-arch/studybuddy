-- Migration 004: chat features (reply, image, unsend, reactions)

-- Messages: reply, image, unsend
alter table public.messages add column if not exists reply_to uuid references public.messages(id) on delete set null;
alter table public.messages add column if not exists image_url text;
alter table public.messages add column if not exists deleted boolean not null default false;

-- Sender co the sua tin nhan cua minh (thu hoi)
drop policy if exists "messages_update_own" on public.messages;
create policy "messages_update_own" on public.messages
  for update to authenticated
  using (sender_id = auth.uid())
  with check (sender_id = auth.uid());

-- Reactions
create table if not exists public.message_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (message_id, user_id, emoji)
);
create index if not exists idx_reactions_message on public.message_reactions (message_id);
alter table public.message_reactions enable row level security;

drop policy if exists "reactions_select_member" on public.message_reactions;
create policy "reactions_select_member" on public.message_reactions
  for select to authenticated
  using (
    exists (
      select 1 from public.messages m
      join public.connections c on c.id = m.connection_id
      where m.id = message_id
        and (c.requester_id = auth.uid() or c.receiver_id = auth.uid())
    )
  );

drop policy if exists "reactions_insert_own" on public.message_reactions;
create policy "reactions_insert_own" on public.message_reactions
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.messages m
      join public.connections c on c.id = m.connection_id
      where m.id = message_id
        and (c.requester_id = auth.uid() or c.receiver_id = auth.uid())
    )
  );

drop policy if exists "reactions_delete_own" on public.message_reactions;
create policy "reactions_delete_own" on public.message_reactions
  for delete to authenticated
  using (user_id = auth.uid());

do $$ begin
  alter publication supabase_realtime add table public.message_reactions;
exception when duplicate_object then null; end $$;

-- Storage bucket cho anh trong chat
insert into storage.buckets (id, name, public)
values ('chat-images', 'chat-images', true)
on conflict (id) do nothing;

drop policy if exists "chatimg_read_public" on storage.objects;
create policy "chatimg_read_public" on storage.objects
  for select to public using (bucket_id = 'chat-images');
drop policy if exists "chatimg_insert_own" on storage.objects;
create policy "chatimg_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'chat-images' and (storage.foldername(name))[1] = auth.uid()::text);
