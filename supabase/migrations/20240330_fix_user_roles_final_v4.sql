-- Drop existing functions and policies
drop function if exists is_admin_base(uuid);
drop function if exists get_user_roles_with_email();
drop policy if exists "user_roles_select_policy" on "User_Roles";
drop policy if exists "user_roles_insert_policy" on "User_Roles";
drop policy if exists "user_roles_update_policy" on "User_Roles";
drop policy if exists "user_roles_delete_policy" on "User_Roles";

-- Ensure is_active column exists
alter table "User_Roles" add column if not exists is_active boolean default true;

-- Create admin check function
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
    -- Check if requesting user is an admin
    if not (select is_admin_base()) then
        raise exception 'Unauthorized: Only admins can view user roles';
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

-- Create policies
create policy "user_roles_select_policy" on "User_Roles"
    for select using (
        auth.uid() = user_id or (select is_admin_base())
    );

create policy "user_roles_insert_policy" on "User_Roles"
    for insert with check (
        not exists (select 1 from "User_Roles") or (select is_admin_base())
    );

create policy "user_roles_update_policy" on "User_Roles"
    for update using (
        (select is_admin_base())
    );

create policy "user_roles_delete_policy" on "User_Roles"
    for delete using (
        (select is_admin_base())
    );

-- Grant execute permissions
grant execute on function is_admin_base to authenticated;
grant execute on function get_user_roles_with_email to authenticated;

-- Add indexes
create index if not exists idx_user_roles_user_id on "User_Roles"(user_id);
create index if not exists idx_user_roles_role on "User_Roles"(role);
create index if not exists idx_user_roles_is_active on "User_Roles"(is_active);
create index if not exists idx_user_roles_company_id on "User_Roles"(company_id);