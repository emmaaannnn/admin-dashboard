begin;

-- Ensure the product-media bucket exists with the same browser-friendly limits as the admin app.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-media',
  'product-media',
  true,
  524288,
  array['image/webp', 'image/png', 'image/jpeg']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Remove old policies so the script can be re-run safely.
drop policy if exists "Public read product-media objects" on storage.objects;
drop policy if exists "Admin read product-media objects" on storage.objects;
drop policy if exists "Admin insert product-media objects" on storage.objects;
drop policy if exists "Admin update product-media objects" on storage.objects;
drop policy if exists "Admin delete product-media objects" on storage.objects;

create policy "Public read product-media objects" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'product-media');

create policy "Admin read product-media objects" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'product-media'
    and exists (
      select 1
      from public.admin_users
      where user_id = auth.uid()
        and is_active = true
    )
  );

create policy "Admin insert product-media objects" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'product-media'
    and exists (
      select 1
      from public.admin_users
      where user_id = auth.uid()
        and is_active = true
    )
  );

create policy "Admin update product-media objects" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'product-media'
    and exists (
      select 1
      from public.admin_users
      where user_id = auth.uid()
        and is_active = true
    )
  )
  with check (
    bucket_id = 'product-media'
    and exists (
      select 1
      from public.admin_users
      where user_id = auth.uid()
        and is_active = true
    )
  );

create policy "Admin delete product-media objects" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'product-media'
    and exists (
      select 1
      from public.admin_users
      where user_id = auth.uid()
        and is_active = true
    )
  );

commit;