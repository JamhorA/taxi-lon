import { supabase } from '../../lib/supabase';
import { AppError } from '../../utils/error';
import { AUTH_ERRORS } from '../../constants/auth';

export async function updateEmail(newEmail: string, password: string): Promise<void> {
  try {
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating email:', error);
    throw new AppError(AUTH_ERRORS.EMAIL_UPDATE_FAILED, error);
  }
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating password:', error);
    throw new AppError(AUTH_ERRORS.PASSWORD_UPDATE_FAILED, error);
  }
}