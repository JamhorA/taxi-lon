-- Drop existing objects
drop view if exists user_roles_with_email;
drop function if exists is_admin_base;
drop policy if exists "user_roles_select_policy" on "User_Roles";
drop policy if exists "user_roles_insert_policy" on "User_Roles";
drop policy if exists "user_roles_update_policy" on "User_Roles";
drop policy if exists "user_roles_delete_policy" on "User_Roles";

-- Create materialized view for better performance
create materialized view user_roles_with_email as
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

-- Create index on materialized view
create unique index idx_user_roles_with_email_id on user_roles_with_email (id);
create index idx_user_roles_with_email_user_id on user_roles_with_email (user_id);

-- Create function to refresh materialized view
create or replace function refresh_user_roles_view()
returns trigger
language plpgsql
security definer
as $$
begin
    refresh materialized view concurrently user_roles_with_email;
    return null;
end;
$$;

-- Create trigger to refresh view
create trigger refresh_user_roles_view_trigger
after insert or update or delete on "User_Roles"
for each statement
execute function refresh_user_roles_view();

-- Create simplified admin check function
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

-- Create simplified policies
create policy "user_roles_select_policy" on "User_Roles"
    for select using (true);

create policy "user_roles_insert_policy" on "User_Roles"
    for insert with check (
        not exists (select 1 from "User_Roles") 
        or (select is_admin_base())
    );

create policy "user_roles_update_policy" on "User_Roles"
    for update using ((select is_admin_base()));

create policy "user_roles_delete_policy" on "User_Roles"
    for delete using ((select is_admin_base()));

-- Grant permissions
grant select on user_roles_with_email to authenticated;
grant execute on function is_admin_base to authenticated;
grant execute on function refresh_user_roles_view to authenticated;

-- Create indexes
create index if not exists idx_user_roles_user_id on "User_Roles"(user_id);
create index if not exists idx_user_roles_admin_check on "User_Roles"(user_id, role, is_active) 
where role = 'admin' and is_active = true;