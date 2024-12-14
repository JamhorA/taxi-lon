-- Drop existing function if it exists
drop function if exists is_admin_base;
drop function if exists validate_admin_role;

-- Create helper function to validate admin role
create or replace function validate_admin_role(role_record "User_Roles")
returns boolean
language plpgsql
security definer
stable
as $$
begin
  return (
    role_record.role = 'admin' and
    role_record.is_active = true and
    role_record.user_id = auth.uid()
  );
end;
$$;

-- Create main admin check function with improved security
create or replace function is_admin_base()
returns boolean
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  user_role "User_Roles"%rowtype;
  is_admin boolean;
begin
  -- Check if user is authenticated
  if auth.uid() is null then
    return false;
  end if;

  -- Get user role with a single query
  select *
  into user_role
  from "User_Roles"
  where user_id = auth.uid()
  limit 1;

  -- If no role found, return false
  if user_role is null then
    return false;
  end if;

  -- Validate admin role
  is_admin := validate_admin_role(user_role);

  -- Log admin check (optional, remove in production if not needed)
  if is_admin then
    raise notice 'Admin check passed for user %', auth.uid();
  end if;

  return is_admin;
exception
  when others then
    -- Log error and return false for safety
    raise warning 'Error in is_admin_base: %', SQLERRM;
    return false;
end;
$$;

-- Grant necessary permissions
grant execute on function validate_admin_role to authenticated;
grant execute on function is_admin_base to authenticated;

-- Create index for performance
create index if not exists idx_user_roles_admin_check
  on "User_Roles" (user_id, role, is_active)
  where role = 'admin' and is_active = true;

-- Add comment for documentation
comment on function is_admin_base() is 'Checks if the current user has an active admin role';
comment on function validate_admin_role(role_record "User_Roles") is 'Validates if a user role record represents an active admin';