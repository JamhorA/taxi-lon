-- Drop existing policies
drop policy if exists "companies_select_policy" on "Companies";
drop policy if exists "companies_insert_policy" on "Companies";
drop policy if exists "companies_update_policy" on "Companies";
drop policy if exists "companies_delete_policy" on "Companies";
drop policy if exists "user_roles_select_policy" on "User_Roles";
drop policy if exists "user_roles_insert_policy" on "User_Roles";
drop policy if exists "user_roles_update_policy" on "User_Roles";
drop policy if exists "user_roles_delete_policy" on "User_Roles";

-- Companies policies
create policy "companies_select_policy" on "Companies"
    for select using (true);

create policy "companies_insert_policy" on "Companies"
    for insert with check (true);

create policy "companies_update_policy" on "Companies"
    for update using (
        exists (
            select 1 from "User_Roles"
            where "User_Roles".user_id = auth.uid()
            and "User_Roles".company_id = "Companies".id
            and "User_Roles".role = 'admin'
        )
    );

create policy "companies_delete_policy" on "Companies"
    for delete using (
        exists (
            select 1 from "User_Roles"
            where "User_Roles".user_id = auth.uid()
            and "User_Roles".company_id = "Companies".id
            and "User_Roles".role = 'admin'
        )
    );

-- User_Roles policies
create policy "user_roles_select_policy" on "User_Roles"
    for select using (true);

create policy "user_roles_insert_policy" on "User_Roles"
    for insert with check (true);

create policy "user_roles_update_policy" on "User_Roles"
    for update using (
        auth.uid() = user_id
        or exists (
            select 1 from "User_Roles"
            where "User_Roles".user_id = auth.uid()
            and "User_Roles".role = 'admin'
        )
    );

create policy "user_roles_delete_policy" on "User_Roles"
    for delete using (
        auth.uid() = user_id
        or exists (
            select 1 from "User_Roles"
            where "User_Roles".user_id = auth.uid()
            and "User_Roles".role = 'admin'
        )
    );