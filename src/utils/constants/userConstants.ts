export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

export const USER_STATUS = {
  ACTIVE: true,
  INACTIVE: false
} as const;

export const ERROR_MESSAGES = {
  FETCH_USERS: 'Failed to fetch users',
  UPDATE_STATUS: 'Failed to update user status',
  CHECK_ADMIN: 'Failed to check admin status',
  INVALID_USER: 'Invalid user data',
  INVALID_ROLE: 'Invalid user role'
} as const;