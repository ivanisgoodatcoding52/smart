-- Create notes table for storing shared study materials
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  author_name text not null,
  author_contact text,
  file_url text,
  external_link text,
  file_type text,
  file_size bigint,
  tags text[] default '{}',
  subject text,
  category text,
  view_count integer default 0,
  download_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index for faster searches
create index if not exists notes_tags_idx on public.notes using gin(tags);
create index if not exists notes_subject_idx on public.notes(subject);
create index if not exists notes_category_idx on public.notes(category);
create index if not exists notes_created_at_idx on public.notes(created_at desc);

-- Enable RLS (but allow public read access)
alter table public.notes enable row level security;

-- Allow anyone to read notes
create policy "notes_select_all"
  on public.notes for select
  using (true);

-- Allow anyone to insert notes (no auth required)
create policy "notes_insert_all"
  on public.notes for insert
  with check (true);

-- Allow anyone to update view/download counts
create policy "notes_update_counts"
  on public.notes for update
  using (true)
  with check (true);
