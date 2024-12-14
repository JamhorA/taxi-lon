import { supabase } from '../../lib/supabase';
import { AppError } from '../../utils/error';
import { withAdminCheck } from '../auth/adminService';
import { UserRole } from '../../types/user';

export const getUserRoles = withAdminCheck(async (): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from('user_roles_with_email')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw new AppError('Failed to fetch user roles', error);
  }
});

export const updateUserRole = withAdminCheck(async (
  userId: string, 
  role: 'admin' | 'user'
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('User_Roles')
      .update({ role })
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    throw new AppError('Failed to update user role', error);
  }
});