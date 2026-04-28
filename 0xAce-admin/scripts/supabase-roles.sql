SELECT rolname
FROM pg_roles
WHERE rolname IN ('admin','authenticated','anon','service_role','authenticated')
ORDER BY 1;

-- Ensure RLS is enabled on the target tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on these tables (so reruns are safe)
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "anon can read products" ON public.products;
DROP POLICY IF EXISTS "authenticated can read products" ON public.products;
DROP POLICY IF EXISTS "Public can read visible products" ON public.products;
DROP POLICY IF EXISTS "Authenticated full access products" ON public.products;

DROP POLICY IF EXISTS "Public read drops" ON public.drops;
DROP POLICY IF EXISTS "anon can read drops" ON public.drops;
DROP POLICY IF EXISTS "authenticated can read drops" ON public.drops;
DROP POLICY IF EXISTS "Public can read visible drops" ON public.drops;
DROP POLICY IF EXISTS "Authenticated full access drops" ON public.drops;

DROP POLICY IF EXISTS "Public read product_variants" ON public.product_variants;
DROP POLICY IF EXISTS "anon can read product variants" ON public.product_variants;
DROP POLICY IF EXISTS "authenticated can read product variants" ON public.product_variants;
DROP POLICY IF EXISTS "Public can read visible variants" ON public.product_variants;
DROP POLICY IF EXISTS "Authenticated full access product_variants" ON public.product_variants;

DROP POLICY IF EXISTS "Public read product_images" ON public.product_images;
DROP POLICY IF EXISTS "anon can read product image" ON public.product_images;
DROP POLICY IF EXISTS "authenticated can read product image" ON public.product_images;
DROP POLICY IF EXISTS "Public can read images for visible products" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated full access product_images" ON public.product_images;

-- Admin: read/write all
CREATE POLICY "Admin full access products" ON public.products
  FOR ALL TO admin
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access drops" ON public.drops
  FOR ALL TO admin
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access product_variants" ON public.product_variants
  FOR ALL TO admin
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access product_images" ON public.product_images
  FOR ALL TO admin
  USING (true)
  WITH CHECK (true);

-- anon & authenticated: read drops/products/images/variants only
-- (Your requirement says: only be able to read these tables. We interpret that as unconditional SELECT on each table.)
CREATE POLICY "Public read products" ON public.products
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Public read drops" ON public.drops
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Public read product_variants" ON public.product_variants
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Public read product_images" ON public.product_images
  FOR SELECT TO anon, authenticated
  USING (true);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Remove any existing anon/authenticated policies on orders/order_items
DROP POLICY IF EXISTS "Authenticated full access orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated full access order_items" ON public.order_items;

-- Also defensively drop any public/other known policies (if present)
DROP POLICY IF EXISTS "Public read orders" ON public.orders;
DROP POLICY IF EXISTS "Public read order_items" ON public.order_items;

-- Allow only service_role (admin/server) full access
CREATE POLICY "Admin full access orders" ON public.orders
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access order_items" ON public.order_items
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);