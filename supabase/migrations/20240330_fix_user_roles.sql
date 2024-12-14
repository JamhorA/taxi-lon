-- Drop existing policies
drop policy if exists "user_roles_select_policy" on "User_Roles";
drop policy if exists "user_roles_insert_policy" on "User_Roles";
drop policy if exists "user_roles_update_policy" on "User_Roles";
drop policy if exists "user_roles_delete_policy" on "User_Roles";

-- Create new policies without recursion
create policy "user_roles_select_policy" on "User_Roles"
    for select using (true);

create policy "user_roles_insert_policy" on "User_Roles"
    for insert with check (
        -- First user can become admin
        (
            not exists (select 1 from "User_Roles")
            and auth.uid() = user_id
            and role = 'admin'
        )
        or
        -- Existing admin can create roles
        exists (
            select 1 from "User_Roles"
            where user_id = auth.uid()
            and role = 'admin'
        )
    );

create policy "user_roles_update_policy" on "User_Roles"
    for update using (
        exists (
            select 1 from "User_Roles"
            where user_id = auth.uid()
            and role = 'admin'
        )
    );

create policy "user_roles_delete_policy" on "User_Roles"
    for delete using (
        exists (
            select 1 from "User_Roles"
            where user_id = auth.uid()
            and role = 'admin'
        )
    );

-- Add is_active column if it doesn't exist
do $$ 
begin
    if not exists (select 1 from information_schema.columns 
                  where table_name = 'User_Roles' and column_name = 'is_active') then
        alter table "User_Roles" add column is_active boolean default true;
    end if;
end $$;

-- Create function to get user roles with email
create or replace function get_user_roles_with_email()
returns table (
    id uuid,
    user_id uuid,
    role text,
    company_id uuid,
    is_active boolean,
    email text
)
language plpgsql
security definer
set search_path = public
as $$
begin
    return query
    select 
        ur.id,
        ur.user_id,
        ur.role,
        ur.company_id,
        ur.is_active,
        au.email
    from "User_Roles" ur
    join auth.users au on au.id = ur.user_id;
end;
$$;

-- Grant execute permission on the function
grant execute on function get_user_roles_with_email to authenticated;