export const AUTH_ERRORS = {
  INITIALIZATION_FAILED: 'Failed to initialize authentication',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  SESSION_INIT_FAILED: 'Failed to initialize session',
  SESSION_REFRESH_FAILED: 'Failed to refresh session',
  TOKEN_RETRIEVAL_FAILED: 'Failed to retrieve access token',
  TOKEN_PARSE_FAILED: 'Failed to parse JWT token',
  USER_RETRIEVAL_FAILED: 'Failed to retrieve user information',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INACTIVE_ACCOUNT: 'Your account is inactive. Please contact an administrator.',
  SIGNUP_FAILED: 'Failed to create account',
  SIGNIN_FAILED: 'Failed to sign in',
  SIGNOUT_FAILED: 'Failed to sign out',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  ADMIN_CHECK_FAILED: 'Failed to verify admin status',
  ROLE_CHECK_FAILED: 'Failed to check user role',
  ROLE_CREATE_FAILED: 'Failed to create user role',
} as const;

export const AUTH_EVENTS = {
  SIGNED_IN: 'SIGNED_IN',
  SIGNED_OUT: 'SIGNED_OUT',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',
  PASSWORD_RECOVERY: 'PASSWORD_RECOVERY',
} as const;

export const AUTH_STATES = {
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  LOADING: 'LOADING',
  ERROR: 'ERROR',
} as const;