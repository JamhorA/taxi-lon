-- Drop existing objects
drop policy if exists "user_roles_update_policy" on "User_Roles";
drop function if exists update_user_status cascade;
drop function if exists is_admin_base cascade;

-- Create base admin check function
create or replace function is_admin_base()
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
create or replace function update_user_status(target_user_id uuid, new_status boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
    -- Check if executing user is an active admin
    if not (select is_admin_base()) then
        raise exception 'Unauthorized: Only active admins can update user status';
    end if;

    -- Update the user status
    update "User_Roles"
    set is_active = new_status
    where user_id = target_user_id;

    if not found then
        raise exception 'User role not found';
    end if;
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
grant execute on function is_admin_base to authenticated;
grant execute on function update_user_status to authenticated;