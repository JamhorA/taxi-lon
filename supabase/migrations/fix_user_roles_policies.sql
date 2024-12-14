-- Drop existing policies
drop policy if exists "user_roles_select_policy" on "User_Roles";
drop policy if exists "user_roles_insert_policy" on "User_Roles";
drop policy if exists "user_roles_update_policy" on "User_Roles";
drop policy if exists "user_roles_delete_policy" on "User_Roles";

-- Create new policies without recursion
create policy "user_roles_select_policy" on "User_Roles"
    for select using (
        -- Users can see their own roles
        auth.uid() = user_id
        or (
            -- Admins can see roles for their company
            exists (
                select 1 from "User_Roles" ur
                where ur.user_id = auth.uid()
                and ur.role = 'admin'
                and ur.company_id is not null
                and ur.company_id = "User_Roles".company_id
            )
        )
    );

create policy "user_roles_insert_policy" on "User_Roles"
    for insert with check (
        -- First user can create their admin role
        (
            not exists (
                select 1 from "User_Roles"
            )
            and auth.uid() = user_id
            and role = 'admin'
        )
        or
        -- Existing admins can create new roles for their company
        (
            exists (
                select 1 from "User_Roles" ur
                where ur.user_id = auth.uid()
                and ur.role = 'admin'
                and ur.company_id is not null
                and ur.company_id = company_id
            )
        )
    );

create policy "user_roles_update_policy" on "User_Roles"
    for update using (
        exists (
            select 1 from "User_Roles" ur
            where ur.user_id = auth.uid()
            and ur.role = 'admin'
            and ur.company_id is not null
            and ur.company_id = "User_Roles".company_id
        )
    );

create policy "user_roles_delete_policy" on "User_Roles"
    for delete using (
        exists (
            select 1 from "User_Roles" ur
            where ur.user_id = auth.uid()
            and ur.role = 'admin'
            and ur.company_id is not null
            and ur.company_id = "User_Roles".company_id
        )
    );