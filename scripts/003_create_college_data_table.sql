-- Create college data table for admissions calculator
create table if not exists public.colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  acceptance_rate numeric,
  avg_gpa numeric,
  avg_sat integer,
  avg_act integer,
  location text,
  type text,
  size integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index for faster searches
create index if not exists colleges_name_idx on public.colleges(name);

-- Enable RLS (public read access)
alter table public.colleges enable row level security;

-- Allow anyone to read college data
create policy "colleges_select_all"
  on public.colleges for select
  using (true);
