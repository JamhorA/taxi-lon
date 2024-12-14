-- Drop existing policies
drop policy if exists "user_roles_select_policy" on "User_Roles";
drop policy if exists "user_roles_insert_policy" on "User_Roles";
drop policy if exists "user_roles_update_policy" on "User_Roles";
drop policy if exists "user_roles_delete_policy" on "User_Roles";

-- Create new policies for User_Roles
create policy "user_roles_select_policy" on "User_Roles"
    for select using (
        auth.uid() = user_id
    );

create policy "user_roles_insert_policy" on "User_Roles"
    for insert with check (
        -- Allow first user to become admin
        (
            not exists (select 1 from "User_Roles")
            and auth.uid() = user_id
            and role = 'admin'
        )
        or
        -- Allow existing admin to create roles
        (
            exists (
                select 1 from "User_Roles" ur
                where ur.user_id = auth.uid()
                and ur.role = 'admin'
            )
        )
    );

create policy "user_roles_update_policy" on "User_Roles"
    for update using (
        auth.uid() = user_id
        or exists (
            select 1 from "User_Roles" ur
            where ur.user_id = auth.uid()
            and ur.role = 'admin'
        )
    );

create policy "user_roles_delete_policy" on "User_Roles"
    for delete using (
        auth.uid() = user_id
        or exists (
            select 1 from "User_Roles" ur
            where ur.user_id = auth.uid()
            and ur.role = 'admin'
        )
    );

-- Create function to check if user is first user
create or replace function is_first_user()
returns boolean
language sql
security definer
as $$
    select not exists (select 1 from "User_Roles");
$$;