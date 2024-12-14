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

-- Create admin check function without recursion
create function is_admin_base()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
    select exists (
        select 1 
        from "User_Roles" 
        where user_id = auth.uid() 
        and role = 'admin'
        and is_active = true
        limit 1
    );
$$;

-- Create non-recursive policies
create policy "user_roles_select_policy" on "User_Roles"
    for select using (
        -- Users can always see their own roles
        auth.uid() = user_id
        or
        -- Active admins can see all roles
        auth.uid() in (
            select user_id 
            from "User_Roles" 
            where role = 'admin' 
            and is_active = true
            limit 1
        )
    );

create policy "user_roles_insert_policy" on "User_Roles"
    for insert with check (
        -- First user becomes admin
        (not exists (select 1 from "User_Roles") and auth.uid() = user_id and role = 'admin')
        or
        -- Active admins can create new roles
        auth.uid() in (
            select user_id 
            from "User_Roles" 
            where role = 'admin' 
            and is_active = true
            limit 1
        )
    );

create policy "user_roles_update_policy" on "User_Roles"
    for update using (
        auth.uid() in (
            select user_id 
            from "User_Roles" 
            where role = 'admin' 
            and is_active = true
            limit 1
        )
    );

create policy "user_roles_delete_policy" on "User_Roles"
    for delete using (
        auth.uid() in (
            select user_id 
            from "User_Roles" 
            where role = 'admin' 
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