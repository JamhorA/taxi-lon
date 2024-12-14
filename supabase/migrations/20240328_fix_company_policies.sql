-- Drop existing policies for Companies
drop policy if exists "companies_select_policy" on "Companies";
drop policy if exists "companies_insert_policy" on "Companies";
drop policy if exists "companies_update_policy" on "Companies";
drop policy if exists "companies_delete_policy" on "Companies";

-- Create new policies for Companies
create policy "companies_select_policy" on "Companies"
    for select using (
        exists (
            select 1 from "User_Roles"
            where "User_Roles".user_id = auth.uid()
            and "User_Roles".company_id = "Companies".id
        )
    );

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

-- Update User_Roles policies
drop policy if exists "user_roles_insert_policy" on "User_Roles";

create policy "user_roles_insert_policy" on "User_Roles"
    for insert with check (true);