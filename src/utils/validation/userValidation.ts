import { UserWithRole, UserRole } from '../../types/user';

export function validateUserRole(role: UserRole): boolean {
  return (
    typeof role.id === 'string' &&
    typeof role.user_id === 'string' &&
    (role.role === 'admin' || role.role === 'user') &&
    typeof role.is_active === 'boolean'
  );
}

export function validateUser(user: UserWithRole): boolean {
  return (
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.created_at === 'string' &&
    Array.isArray(user.user_roles) &&
    user.user_roles.every(validateUserRole)
  );
}