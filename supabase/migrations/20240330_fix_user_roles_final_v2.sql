-- Drop existing policies
drop policy if exists "user_roles_select_policy" on "User_Roles";
drop policy if exists "user_roles_insert_policy" on "User_Roles";
drop policy if exists "user_roles_update_policy" on "User_Roles";
drop policy if exists "user_roles_delete_policy" on "User_Roles";

-- Add is_active column if it doesn't exist
alter table "User_Roles" add column if not exists is_active boolean default true;

-- Create new simplified policies
create policy "user_roles_select_policy" on "User_Roles"
    for select using (true);

create policy "user_roles_insert_policy" on "User_Roles"
    for insert with check (
        -- First user becomes admin automatically
        (
            not exists (select 1 from "User_Roles")
            and auth.uid() = user_id
            and role = 'admin'
        )
        or
        -- Only active admins can create new users
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

-- Create function to check if user is active admin
create or replace function is_active_admin(user_id uuid)
returns boolean
language plpgsql
security definer
as $$
begin
    return exists (
        select 1 
        from "User_Roles" 
        where user_id = $1 
        and role = 'admin'
        and is_active = true
    );
end;
$$;

-- Create function to get user roles with email
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
language plpgsql
security definer
as $$
begin
    -- Check if requesting user is an active admin
    if not is_active_admin(auth.uid()) then
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

-- Grant execute permissions
grant execute on function is_active_admin to authenticated;
grant execute on function get_user_roles_with_email to authenticated;

-- Add indexes for performance
create index if not exists idx_user_roles_user_id on "User_Roles"(user_id);
create index if not exists idx_user_roles_role on "User_Roles"(role);
create index if not exists idx_user_roles_is_active on "User_Roles"(is_active);
create index if not exists idx_user_roles_company_id on "User_Roles"(company_id);