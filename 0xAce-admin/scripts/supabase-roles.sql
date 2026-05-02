-- Create a durable list of dashboard users.
-- Add one row per Supabase auth user that should be allowed into the admin app.
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  role text NOT NULL DEFAULT 'admin',
  permissions text[] NOT NULL DEFAULT '{}'::text[],
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_admin_users_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_admin_users_updated_at ON public.admin_users;

CREATE TRIGGER set_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.set_admin_users_updated_at();

-- Remove old policies so the script can be re-run safely.
DROP POLICY IF EXISTS "Admin users can read their own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Public read drops" ON public.drops;
DROP POLICY IF EXISTS "Public read product_variants" ON public.product_variants;
DROP POLICY IF EXISTS "Public read product_images" ON public.product_images;
DROP POLICY IF EXISTS "Admin full access products" ON public.products;
DROP POLICY IF EXISTS "Admin full access drops" ON public.drops;
DROP POLICY IF EXISTS "Admin full access product_variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admin full access product_images" ON public.product_images;
DROP POLICY IF EXISTS "Admin full access orders" ON public.orders;
DROP POLICY IF EXISTS "Admin full access order_items" ON public.order_items;

CREATE POLICY "Admin users can read their own profile" ON public.admin_users
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

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

CREATE POLICY "Admin full access products" ON public.products
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

CREATE POLICY "Admin full access drops" ON public.drops
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

CREATE POLICY "Admin full access product_variants" ON public.product_variants
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

CREATE POLICY "Admin full access product_images" ON public.product_images
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

CREATE POLICY "Admin full access orders" ON public.orders
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

CREATE POLICY "Admin full access order_items" ON public.order_items
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- Example: after creating a user in Supabase Auth, register them here.
-- Replace the email and values below with your real admin user.
INSERT INTO public.admin_users (user_id, email, full_name, role, permissions)
SELECT id, email, 'Ace Studio', 'owner', ARRAY['products:read', 'orders:read', 'dashboard:access']::text[]
FROM auth.users
WHERE email = 'admin@example.com'
ON CONFLICT (user_id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    is_active = true;