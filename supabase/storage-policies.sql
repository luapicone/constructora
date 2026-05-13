-- Bucket esperado: site-media
-- Ajustá el nombre si usás otro bucket.

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "public can view site media"
on storage.objects
for select
using (bucket_id = 'site-media');

create policy "authenticated users can upload site media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'site-media');

create policy "authenticated users can update site media"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-media')
with check (bucket_id = 'site-media');

create policy "authenticated users can delete site media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-media');
