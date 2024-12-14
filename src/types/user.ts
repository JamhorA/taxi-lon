export interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  company_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserWithRole extends User {
  user_roles: UserRole[];
}

export interface UserState {
  users: UserWithRole[];
  loading: boolean;
  error: string | null;
}

export interface UserActions {
  fetchUsers: () => Promise<void>;
  updateUserStatus: (userId: string, isActive: boolean) => Promise<void>;
}