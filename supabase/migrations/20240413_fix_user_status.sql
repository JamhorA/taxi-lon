-- Drop existing update policy
drop policy if exists "user_roles_update_policy" on "User_Roles";

-- Create new update policy without recursion
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

-- Create function to update user status
create or replace function update_user_status(target_user_id uuid, new_status boolean)
returns void
language plpgsql
security definer
as $$
begin
    -- Check if the executing user is an active admin
    if not exists (
        select 1 
        from "User_Roles"
        where user_id = auth.uid()
        and role = 'admin'
        and is_active = true
    ) then
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

-- Grant execute permission
grant execute on function update_user_status to authenticated;