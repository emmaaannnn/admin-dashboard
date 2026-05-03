begin;

alter table public.product_images
  add column if not exists storage_bucket text,
  add column if not exists storage_path text,
  add column if not exists mime_type text,
  add column if not exists file_size integer,
  add column if not exists width integer,
  add column if not exists height integer;

create index if not exists product_images_product_id_sort_order_idx
  on public.product_images (product_id, sort_order);

create unique index if not exists product_images_storage_bucket_path_idx
  on public.product_images (storage_bucket, storage_path)
  where storage_bucket is not null and storage_path is not null;

commit;