-- Drop existing policies
drop policy if exists "user_roles_select_policy" on "User_Roles";
drop policy if exists "user_roles_insert_policy" on "User_Roles";
drop policy if exists "user_roles_update_policy" on "User_Roles";
drop policy if exists "user_roles_delete_policy" on "User_Roles";

-- Create new simplified policies
create policy "user_roles_select_policy" on "User_Roles"
    for select using (true);

create policy "user_roles_insert_policy" on "User_Roles"
    for insert with check (
        -- Allow first user to become admin
        (
            not exists (select 1 from "User_Roles")
            and auth.uid() = user_id
            and role = 'admin'
        )
        or
        -- Allow existing admins to create new users
        exists (
            select 1 
            from "User_Roles" ur_admin 
            where ur_admin.user_id = auth.uid() 
            and ur_admin.role = 'admin'
            and ur_admin.is_active = true
        )
    );

create policy "user_roles_update_policy" on "User_Roles"
    for update using (
        -- Only active admins can update
        exists (
            select 1 
            from "User_Roles" ur_admin 
            where ur_admin.user_id = auth.uid() 
            and ur_admin.role = 'admin'
            and ur_admin.is_active = true
        )
    );

create policy "user_roles_delete_policy" on "User_Roles"
    for delete using (
        -- Only active admins can delete
        exists (
            select 1 
            from "User_Roles" ur_admin 
            where ur_admin.user_id = auth.uid() 
            and ur_admin.role = 'admin'
            and ur_admin.is_active = true
        )
    );

-- Create or replace the function to get user roles with email
create or replace function get_user_roles_with_email()
returns table (
    id uuid,
    user_id uuid,
    role text,
    company_id uuid,
    is_active boolean,
    email text,
    created_at timestamptz
)
security definer
set search_path = public
language plpgsql
as $$
begin
    -- Check if the requesting user is an admin
    if not exists (
        select 1 
        from "User_Roles" 
        where user_id = auth.uid() 
        and role = 'admin'
        and is_active = true
    ) then
        raise exception 'Unauthorized: Only active admins can view user roles';
    end if;

    return query
    select 
        ur.id,
        ur.user_id,
        ur.role,
        ur.company_id,
        ur.is_active,
        au.email,
        ur.created_at
    from "User_Roles" ur
    join auth.users au on au.id = ur.user_id
    order by ur.created_at desc;
end;
$$;

-- Grant execute permission on the function
grant execute on function get_user_roles_with_email to authenticated;

-- Add indexes for better performance
create index if not exists idx_user_roles_user_id on "User_Roles"(user_id);
create index if not exists idx_user_roles_role on "User_Roles"(role);
create index if not exists idx_user_roles_is_active on "User_Roles"(is_active);