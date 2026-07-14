-- ===========================================================
-- StudyMate - Supabase schema
-- Chay toan bo file nay trong SQL Editor cua Supabase
-- ===========================================================

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  school text,
  major text,
  subjects text[] default '{}',
  study_goals text,
  available_time text[] default '{}',
  study_mode text check (study_mode in ('online', 'offline', 'both')),
  city text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated using (true);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Tu dong tao profile khi co user moi dang ky
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- CONNECTIONS ----------
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  receiver_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  constraint no_self_connection check (requester_id <> receiver_id),
  constraint unique_pair unique (requester_id, receiver_id)
);

create index if not exists idx_connections_requester on public.connections (requester_id);
create index if not exists idx_connections_receiver on public.connections (receiver_id);

alter table public.connections enable row level security;

create policy "connections_select_member" on public.connections
  for select to authenticated
  using (auth.uid() = requester_id or auth.uid() = receiver_id);

create policy "connections_insert_requester" on public.connections
  for insert to authenticated
  with check (auth.uid() = requester_id);

create policy "connections_update_member" on public.connections
  for update to authenticated
  using (auth.uid() = requester_id or auth.uid() = receiver_id);

create policy "connections_delete_member" on public.connections
  for delete to authenticated
  using (auth.uid() = requester_id or auth.uid() = receiver_id);

-- ---------- MESSAGES ----------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.connections (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_connection on public.messages (connection_id, created_at);

alter table public.messages enable row level security;

create policy "messages_select_member" on public.messages
  for select to authenticated
  using (
    exists (
      select 1 from public.connections c
      where c.id = connection_id
        and c.status = 'accepted'
        and (c.requester_id = auth.uid() or c.receiver_id = auth.uid())
    )
  );

create policy "messages_insert_member" on public.messages
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.connections c
      where c.id = connection_id
        and c.status = 'accepted'
        and (c.requester_id = auth.uid() or c.receiver_id = auth.uid())
    )
  );

-- ---------- STUDY SESSIONS ----------
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.connections (id) on delete cascade,
  creator_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  subject text,
  scheduled_at timestamptz not null,
  duration_minutes int not null default 60,
  mode text not null default 'online' check (mode in ('online', 'offline')),
  location text,
  notes text,
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists idx_sessions_connection on public.study_sessions (connection_id);

alter table public.study_sessions enable row level security;

create policy "sessions_select_member" on public.study_sessions
  for select to authenticated
  using (
    exists (
      select 1 from public.connections c
      where c.id = connection_id
        and (c.requester_id = auth.uid() or c.receiver_id = auth.uid())
    )
  );

create policy "sessions_insert_member" on public.study_sessions
  for insert to authenticated
  with check (
    creator_id = auth.uid()
    and exists (
      select 1 from public.connections c
      where c.id = connection_id
        and c.status = 'accepted'
        and (c.requester_id = auth.uid() or c.receiver_id = auth.uid())
    )
  );

create policy "sessions_update_member" on public.study_sessions
  for update to authenticated
  using (
    exists (
      select 1 from public.connections c
      where c.id = connection_id
        and (c.requester_id = auth.uid() or c.receiver_id = auth.uid())
    )
  );

-- ---------- REALTIME ----------
alter publication supabase_realtime add table public.messages;
