create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

 drop trigger if exists trg_site_content_updated_at on public.site_content;
create trigger trg_site_content_updated_at
before update on public.site_content
for each row
execute function public.set_updated_at();

alter table public.site_content enable row level security;

create policy "public can read site content"
on public.site_content
for select
using (true);

create policy "authenticated users can insert site content"
on public.site_content
for insert
to authenticated
with check (true);

create policy "authenticated users can update site content"
on public.site_content
for update
to authenticated
using (true)
with check (true);

create policy "authenticated users can delete site content"
on public.site_content
for delete
to authenticated
using (true);

insert into public.site_content(key, value)
values
  ('settings', '{}'::jsonb),
  ('stats', '[]'::jsonb),
  ('portfolio', '[]'::jsonb),
  ('reasons', '[]'::jsonb)
on conflict (key) do nothing;
