export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.USER]: 'Användare'
} as const;

export const ROLE_ERRORS = {
  INVALID_ROLE: 'Invalid role type',
  UPDATE_FAILED: 'Failed to update role',
  FETCH_FAILED: 'Failed to fetch roles',
  CREATE_FAILED: 'Failed to create role',
  DELETE_FAILED: 'Failed to delete role'
} as const;