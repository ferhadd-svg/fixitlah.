-- kerjakita — admin capabilities (pro verification)
-- Lets a user with profiles.role = 'admin' see and verify pending pros.
-- To make someone an admin: update their profiles row's role to 'admin'
-- directly in the Supabase dashboard (Table editor) — there is no
-- self-service way to grant this, by design.

create or replace function is_admin()
returns boolean
language sql stable security definer as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create policy "admin reads all pros" on pros for select using (is_admin());
create policy "admin updates all pros" on pros for update using (is_admin());
create policy "admin reads all profiles" on profiles for select using (is_admin());
