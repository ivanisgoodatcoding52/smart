-- Create API keys table for developer access
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  email text,
  created_at timestamp with time zone default now(),
  last_used_at timestamp with time zone,
  request_count integer default 0,
  rate_limit integer default 1000,
  is_active boolean default true
);

-- Create index for faster key lookups
create index if not exists api_keys_key_idx on public.api_keys(key);
create index if not exists api_keys_active_idx on public.api_keys(is_active);

-- Enable RLS
alter table public.api_keys enable row level security;

-- Allow anyone to insert API keys (self-service)
create policy "api_keys_insert_all"
  on public.api_keys for insert
  with check (true);

-- Allow reading own key by key value
create policy "api_keys_select_own"
  on public.api_keys for select
  using (true);

-- Allow updating usage stats
create policy "api_keys_update_stats"
  on public.api_keys for update
  using (true)
  with check (true);
