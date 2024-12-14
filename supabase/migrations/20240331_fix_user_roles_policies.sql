-- Drop existing policies and functions
drop policy if exists "user_roles_select_policy" on "User_Roles";
drop policy if exists "user_roles_insert_policy" on "User_Roles";
drop policy if exists "user_roles_update_policy" on "User_Roles";
drop policy if exists "user_roles_delete_policy" on "User_Roles";
drop function if exists is_admin_base;
drop function if exists get_user_roles_with_email;

-- Create view for user roles with email
create or replace view user_roles_with_email as
select 
    ur.id,
    ur.user_id,
    au.email,
    ur.role,
    ur.company_id,
    ur.is_active,
    ur.created_at
from "User_Roles" ur
join auth.users au on au.id = ur.user_id;

-- Create base admin check function
create or replace function is_admin_base()
returns boolean
language sql
security definer
stable
as $$
    select exists (
        select 1 
        from "User_Roles" 
        where user_id = auth.uid() 
        and role = 'admin'
        and is_active = true
    );
$$;

-- Create simplified policies
create policy "user_roles_select_policy" on "User_Roles"
    for select using (
        -- Users can see their own roles or admins can see all
        auth.uid() = user_id or 
        exists (
            select 1 
            from "User_Roles" 
            where user_id = auth.uid() 
            and role = 'admin'
            and is_active = true
        )
    );

create policy "user_roles_insert_policy" on "User_Roles"
    for insert with check (
        -- First user becomes admin
        (not exists (select 1 from "User_Roles") and auth.uid() = user_id and role = 'admin')
        or 
        -- Admins can create new roles
        exists (
            select 1 
            from "User_Roles" 
            where user_id = auth.uid() 
            and role = 'admin'
            and is_active = true
        )
    );

create policy "user_roles_update_policy" on "User_Roles"
    for update using (
        exists (
            select 1 
            from "User_Roles" 
            where user_id = auth.uid() 
            and role = 'admin'
            and is_active = true
        )
    );

create policy "user_roles_delete_policy" on "User_Roles"
    for delete using (
        exists (
            select 1 
            from "User_Roles" 
            where user_id = auth.uid() 
            and role = 'admin'
            and is_active = true
        )
    );

-- Grant necessary permissions
grant select on user_roles_with_email to authenticated;
grant execute on function is_admin_base to authenticated;