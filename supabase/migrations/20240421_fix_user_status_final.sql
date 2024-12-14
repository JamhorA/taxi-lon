-- Drop existing objects
drop view if exists user_roles_with_email;
drop function if exists update_user_status cascade;
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

-- Create admin check function
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

-- Create function to update user status
create function update_user_status(target_user_id uuid, new_status boolean)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    success boolean;
begin
    -- Check if executing user is an active admin
    if not (select is_admin_base()) then
        raise exception 'Unauthorized: Only active admins can update user status';
    end if;

    -- Update the user status
    update "User_Roles"
    set is_active = new_status
    where user_id = target_user_id
    returning true into success;

    if not success then
        raise exception 'User role not found';
    end if;

    return true;
exception
    when others then
        return false;
end;
$$;

-- Create simplified policies
create policy "user_roles_select_policy" on "User_Roles"
    for select using (true);

create policy "user_roles_insert_policy" on "User_Roles"
    for insert with check (
        not exists (select 1 from "User_Roles") or
        (select is_admin_base())
    );

create policy "user_roles_update_policy" on "User_Roles"
    for update using ((select is_admin_base()));

create policy "user_roles_delete_policy" on "User_Roles"
    for delete using ((select is_admin_base()));

-- Grant permissions
grant select on user_roles_with_email to authenticated;
grant execute on function is_admin_base to authenticated;
grant execute on function update_user_status(uuid, boolean) to authenticated;

-- Create optimized indexes
create index if not exists idx_user_roles_user_id on "User_Roles"(user_id);
create index if not exists idx_user_roles_admin_check 
    on "User_Roles"(user_id, role, is_active) 
    where role = 'admin' and is_active = true;