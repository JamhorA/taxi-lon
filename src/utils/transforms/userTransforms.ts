import { UserWithRole } from '../../types/user';

interface RawUserData {
  user_id: string;
  email: string;
  created_at: string;
  id: string;
  role: 'admin' | 'user';
  company_id: string | null;
  is_active: boolean;
}

export function transformUserData(rawData: RawUserData): UserWithRole {
  return {
    id: rawData.user_id,
    email: rawData.email,
    created_at: rawData.created_at,
    user_roles: [{
      id: rawData.id,
      user_id: rawData.user_id,
      role: rawData.role,
      company_id: rawData.company_id,
      is_active: rawData.is_active,
      created_at: rawData.created_at
    }]
  };
}