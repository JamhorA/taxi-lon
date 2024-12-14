-- Drop existing objects
drop view if exists user_roles_with_email;
drop function if exists is_admin_base cascade;

-- Create base view for user roles
create view user_roles_with_email as
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

-- Create admin check function with caching
create function is_admin_base()
returns boolean
language plpgsql
security definer
stable
set search_path = public
as $$
declare
    admin_status boolean;
begin
    -- Check if user is authenticated
    if auth.uid() is null then
        return false;
    end if;

    -- Cache admin status in a variable
    select exists (
        select 1 
        from "User_Roles" 
        where user_id = auth.uid() 
        and role = 'admin'
        and is_active = true
        limit 1
    ) into admin_status;
    
    return admin_status;
end;
$$;

-- Create optimized policies
create policy "user_roles_select_policy" on "User_Roles"
    for select using (
        -- Allow users to see their own roles
        user_id = auth.uid()
    );

create policy "user_roles_admin_select_policy" on "User_Roles"
    for select using (
        -- Allow admins to see all roles
        exists (
            select 1 
            from "User_Roles" 
            where user_id = auth.uid() 
            and role = 'admin' 
            and is_active = true
            limit 1
        )
    );

create policy "user_roles_insert_policy" on "User_Roles"
    for insert with check (
        -- First user becomes admin
        (not exists (select 1 from "User_Roles") and user_id = auth.uid() and role = 'admin')
        or
        -- Active admins can create roles
        exists (
            select 1 
            from "User_Roles" 
            where user_id = auth.uid() 
            and role = 'admin' 
            and is_active = true
            limit 1
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
            limit 1
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
            limit 1
        )
    );

-- Grant permissions
grant select on user_roles_with_email to authenticated;
grant execute on function is_admin_base to authenticated;

-- Create optimized indexes
create index if not exists idx_user_roles_user_id on "User_Roles"(user_id);
create index if not exists idx_user_roles_admin_check 
    on "User_Roles"(user_id, role, is_active) 
    where role = 'admin' and is_active = true;

-- Add comments for documentation
comment on view user_roles_with_email is 'View that joins User_Roles with auth.users to get email addresses';
comment on function is_admin_base() is 'Function to check if current user is an active admin';