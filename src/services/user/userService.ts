import { supabase } from '../../lib/supabase';
import { UserWithRole } from '../../types/user';
import { AppError } from '../../utils/error';
import { transformUserData } from '../../utils/transforms/userTransforms';
import { withAdminCheck } from '../auth/adminService';

export const getUsers = withAdminCheck(async (): Promise<UserWithRole[]> => {
  try {
    const { data, error } = await supabase
      .from('user_roles_with_email')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformUserData);
  } catch (error) {
    throw new AppError('Failed to fetch users', error);
  }
});

export const updateUserStatus = withAdminCheck(async (userId: string, isActive: boolean): Promise<void> => {
  try {
    const { data, error } = await supabase.rpc('update_user_status', {
      target_user_id: userId,
      new_status: isActive
    });

    if (error) throw error;
    if (!data) {
      throw new Error('Failed to update user status');
    }
  } catch (error) {
    throw new AppError('Failed to update user status', error);
  }
});