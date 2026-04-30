# Supabase Auth Setup

This admin app now signs users in with Supabase email/password auth and then checks `public.admin_users` to decide whether the signed-in user is allowed into the dashboard.

## 1. Add frontend environment variables

Create `.env.local` in the project root with:

```bash
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-public-anon-key
```

You can copy the variable names from `.env.example`.

## 2. Enable email/password auth in Supabase

In Supabase Dashboard:

1. Go to Authentication > Providers.
2. Enable Email.
3. Keep email/password sign-in enabled.

## 3. Create your admin user

In Supabase Dashboard:

1. Go to Authentication > Users.
2. Create a user with the email and password you want to use for the admin app.
3. Confirm the email if your project requires confirmed users before sign-in.

## 4. Run the SQL setup

Run [scripts/supabase-roles.sql](/Users/emman/Code/admin-dashboard/0xAce-admin/scripts/supabase-roles.sql) in the Supabase SQL editor.

What it does:

1. Creates `public.admin_users`.
2. Adds an `is_admin_user()` helper for RLS.
3. Lets admins read their own profile row.
4. Keeps public read access for catalog tables.
5. Grants authenticated admins full access to admin-managed tables.

After running the script, update the example `INSERT` at the bottom so it points at your real admin email if you did not already change it before executing.

## 5. Add each dashboard user to `admin_users`

The app will reject login unless the authenticated user exists in `public.admin_users` with `is_active = true`.

Example:

```sql
INSERT INTO public.admin_users (user_id, email, full_name, role, permissions)
SELECT id, email, 'Your Name', 'owner', ARRAY['dashboard:access']::text[]
FROM auth.users
WHERE email = 'you@example.com'
ON CONFLICT (user_id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    is_active = true;
```

## 6. Verify locally

1. Start the app.
2. Open the login page.
3. Sign in with the Supabase user you created.
4. Confirm the header shows the admin profile details.
5. Confirm a non-admin authenticated user is denied access.

## Notes

1. The frontend should only use the anon key, never the service role key.
2. `admin_users` is the authorization source for dashboard access.
3. If you want password resets or invite flows later, those can be added on top of this without changing the table model.