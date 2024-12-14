import { supabase } from '../../lib/supabase';
import { AppError } from '../../utils/error';
import { withRetry } from '../../utils/async';

export async function updateUserStatus(userId: string, isActive: boolean): Promise<boolean> {
  try {
    const { data, error } = await withRetry(async () => {
      return await supabase.rpc('update_user_status', {
        target_user_id: userId,
        new_status: isActive
      });
    }, 3, 1000);

    if (error) {
      console.error('Status update error:', error);
      throw new Error(error.message);
    }

    return !!data;
  } catch (error) {
    throw new AppError('Failed to update user status', error);
  }
}

export async function getUserStatus(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_roles_with_email')
      .select('is_active')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.is_active ?? false;
  } catch (error) {
    throw new AppError('Failed to get user status', error);
  }
}