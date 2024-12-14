export interface UserRoleWithEmail {
  user_id: string;
  email: string;
  created_at: string;
  id: string;
  role: 'admin' | 'user';
  company_id: string | null;
  is_active: boolean;
}

export interface UpdateUserStatusParams {
  userId: string;
  isActive: boolean;
}

export interface UserServiceResponse<T> {
  data: T | null;
  error: Error | null;
}