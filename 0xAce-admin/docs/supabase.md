# Supabase Reference

This document captures the current public-schema tables used by the admin dashboard and the recommended RLS model for browser-based admin access.

## Recommended RLS Model

The dashboard frontend uses the Supabase browser client with the anon key, so admin writes must target the `authenticated` role, not `service_role`.

Use this SQL block to replace the old `service_role` admin policies with authenticated admin policies backed by `public.admin_users`.

```sql
begin;

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.drops enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Admin users can read their own profile" on public.admin_users;
drop policy if exists "Public read products" on public.products;
drop policy if exists "Public read drops" on public.drops;
drop policy if exists "Public read product_variants" on public.product_variants;
drop policy if exists "Public read product_images" on public.product_images;
drop policy if exists "Admin full access products" on public.products;
drop policy if exists "Admin full access drops" on public.drops;
drop policy if exists "Admin full access product_variants" on public.product_variants;
drop policy if exists "Admin full access product_images" on public.product_images;
drop policy if exists "Admin full access orders" on public.orders;
drop policy if exists "Admin full access order_items" on public.order_items;

create policy "Admin users can read their own profile" on public.admin_users
	for select to authenticated
	using (user_id = auth.uid());

create policy "Public read products" on public.products
	for select to anon, authenticated
	using (true);

create policy "Public read drops" on public.drops
	for select to anon, authenticated
	using (true);

create policy "Public read product_variants" on public.product_variants
	for select to anon, authenticated
	using (true);

create policy "Public read product_images" on public.product_images
	for select to anon, authenticated
	using (true);

create policy "Admin full access products" on public.products
	for all to authenticated
	using (
		exists (
			select 1
			from public.admin_users
			where user_id = auth.uid()
				and is_active = true
		)
	)
	with check (
		exists (
			select 1
			from public.admin_users
			where user_id = auth.uid()
				and is_active = true
		)
	);

create policy "Admin full access drops" on public.drops
	for all to authenticated
	using (
		exists (
			select 1
			from public.admin_users
			where user_id = auth.uid()
				and is_active = true
		)
	)
	with check (
		exists (
			select 1
			from public.admin_users
			where user_id = auth.uid()
				and is_active = true
		)
	);

create policy "Admin full access product_variants" on public.product_variants
	for all to authenticated
	using (
		exists (
			select 1
			from public.admin_users
			where user_id = auth.uid()
				and is_active = true
		)
	)
	with check (
		exists (
			select 1
			from public.admin_users
			where user_id = auth.uid()
				and is_active = true
		)
	);

create policy "Admin full access product_images" on public.product_images
	for all to authenticated
	using (
		exists (
			select 1
			from public.admin_users
			where user_id = auth.uid()
				and is_active = true
		)
	)
	with check (
		exists (
			select 1
			from public.admin_users
			where user_id = auth.uid()
				and is_active = true
		)
	);

create policy "Admin full access orders" on public.orders
	for all to authenticated
	using (
		exists (
			select 1
			from public.admin_users
			where user_id = auth.uid()
				and is_active = true
		)
	)
	with check (
		exists (
			select 1
			from public.admin_users
			where user_id = auth.uid()
				and is_active = true
		)
	);

create policy "Admin full access order_items" on public.order_items
	for all to authenticated
	using (
		exists (
			select 1
			from public.admin_users
			where user_id = auth.uid()
				and is_active = true
		)
	)
	with check (
		exists (
			select 1
			from public.admin_users
			where user_id = auth.uid()
				and is_active = true
		)
	);

commit;
```

## Expected Policies

### admin_users

- `Admin users can read their own profile`
	Roles: `authenticated`
	Command: `SELECT`
	Rule: `user_id = auth.uid()`

### products

- `Public read products`
	Roles: `anon`, `authenticated`
	Command: `SELECT`
	Rule: `true`
- `Admin full access products`
	Roles: `authenticated`
	Command: `ALL`
	Rule: `exists (select 1 from public.admin_users where user_id = auth.uid() and is_active = true)`

### drops

- `Public read drops`
	Roles: `anon`, `authenticated`
	Command: `SELECT`
	Rule: `true`
- `Admin full access drops`
	Roles: `authenticated`
	Command: `ALL`
	Rule: `exists (select 1 from public.admin_users where user_id = auth.uid() and is_active = true)`

### product_variants

- `Public read product_variants`
	Roles: `anon`, `authenticated`
	Command: `SELECT`
	Rule: `true`
- `Admin full access product_variants`
	Roles: `authenticated`
	Command: `ALL`
	Rule: `exists (select 1 from public.admin_users where user_id = auth.uid() and is_active = true)`

### product_images

- `Public read product_images`
	Roles: `anon`, `authenticated`
	Command: `SELECT`
	Rule: `true`
- `Admin full access product_images`
	Roles: `authenticated`
	Command: `ALL`
	Rule: `exists (select 1 from public.admin_users where user_id = auth.uid() and is_active = true)`

### orders

- `Admin full access orders`
	Roles: `authenticated`
	Command: `ALL`
	Rule: `exists (select 1 from public.admin_users where user_id = auth.uid() and is_active = true)`

### order_items

- `Admin full access order_items`
	Roles: `authenticated`
	Command: `ALL`
	Rule: `exists (select 1 from public.admin_users where user_id = auth.uid() and is_active = true)`

## Tables

### public.admin_users

- RLS: enabled
- PK: `user_id`
- FK: `user_id -> auth.users.id`
- Columns:
	`user_id uuid`, `full_name text nullable`, `role text default 'admin'`, `permissions jsonb default '[]'`, `is_active boolean default true`

### public.drops

- RLS: enabled
- PK: `id`
- Referenced by: `products.drop_id`
- Columns:
	`id uuid default gen_random_uuid()`, `slug text unique`, `name text`, `description text nullable`, `state drop_state default 'draft'`, `launch_at timestamptz nullable`, `archive_at timestamptz nullable`, `hero_image_url text nullable`, `featured_on_home boolean default false`, `created_at timestamptz default timezone('utc', now())`

### public.products

- RLS: enabled
- PK: `id`
- FK: `drop_id -> drops.id`
- Referenced by: `product_images.product_id`, `product_variants.product_id`, `order_items.product_id`
- Columns:
	`id uuid default gen_random_uuid()`, `drop_id uuid nullable`, `slug text unique`, `name text`, `subtitle text nullable`, `description text nullable`, `category text nullable`, `product_type text nullable`, `status product_status default 'draft'`, `size_guide jsonb nullable`, `created_at timestamptz default timezone('utc', now())`

### public.product_variants

- RLS: enabled
- PK: `id`
- FK: `product_id -> products.id`
- Referenced by: `order_items.variant_id`
- Columns:
	`id uuid default gen_random_uuid()`, `product_id uuid`, `sku text unique`, `color text nullable`, `size text nullable`, `price_aud numeric check >= 0`, `compare_at_price_aud numeric nullable`, `inventory_quantity int default 0 check >= 0`, `inventory_status variant_inventory_status default 'out_of_stock'`, `restock_expected_at timestamptz nullable`, `weight_grams int nullable check >= 0`, `active boolean default true`

### public.product_images

- RLS: enabled
- PK: `id`
- FK: `product_id -> products.id`
- Columns:
	`id uuid default gen_random_uuid()`, `product_id uuid`, `image_url text`, `alt_text text nullable`, `image_type text nullable`, `sort_order int default 0 check >= 0`

### public.orders

- RLS: enabled
- PK: `id`
- Referenced by: `order_items.order_id`
- Columns:
	`id uuid default gen_random_uuid()`, `stripe_checkout_session_id text nullable unique`, `stripe_payment_intent_id text nullable unique`, `customer_email text`, `shipping_name text`, `shipping_address_json jsonb`, `subtotal_aud numeric check >= 0`, `shipping_aud numeric default 0 check >= 0`, `total_aud numeric check >= 0`, `currency text default 'AUD'`, `payment_status order_payment_status default 'pending'`, `fulfillment_status order_fulfillment_status default 'unfulfilled'`, `tracking_number text nullable`, `tracking_url text nullable`, `receipt_sent_at timestamptz nullable`, `shipped_at timestamptz nullable`, `created_at timestamptz default timezone('utc', now())`

### public.order_items

- RLS: enabled
- PK: `id`
- FK: `order_id -> orders.id`, `product_id -> products.id`, `variant_id -> product_variants.id`
- Columns:
	`id uuid default gen_random_uuid()`, `order_id uuid`, `product_id uuid nullable`, `variant_id uuid nullable`, `product_name text`, `variant_label text nullable`, `sku text nullable`, `quantity int check > 0`, `unit_price_aud numeric check >= 0`, `line_total_aud numeric check >= 0`

## Operational Checks

Use these queries when debugging admin access.

```sql
select user_id, full_name, role, is_active
from public.admin_users;

select count(*) as orders_count from public.orders;
select count(*) as order_items_count from public.order_items;
```

If the frontend is authenticated, the signed-in user's `auth.uid()` must match a row in `public.admin_users` where `is_active = true`.