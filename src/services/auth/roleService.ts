import { supabase } from '../../lib/supabase';
import { AppError } from '../../utils/error';
import { AUTH_ERRORS } from '../../constants/auth';

export async function checkUserRole(userId: string): Promise<{role: string; isActive: boolean}> {
  try {
    const { data, error } = await supabase
      .from('user_roles_with_email')
      .select('role, is_active')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('No role found');

    return {
      role: data.role,
      isActive: data.is_active
    };
  } catch (error) {
    throw new AppError(AUTH_ERRORS.ROLE_CHECK_FAILED, error);
  }
}

export async function createUserRole(userId: string, role: 'admin' | 'user', isActive: boolean = true) {
  try {
    const { error } = await supabase
      .from('User_Roles')
      .insert({
        user_id: userId,
        role,
        is_active: isActive
      });

    if (error) throw error;
  } catch (error) {
    throw new AppError(AUTH_ERRORS.ROLE_CREATE_FAILED, error);
  }
}