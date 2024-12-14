import { supabase } from '../../lib/supabase';
import { AppError } from '../../utils/error';
import { AUTH_ERRORS } from '../../constants/auth';

export async function checkAdminStatus(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('is_admin_base');
    
    if (error) {
      throw new AppError(AUTH_ERRORS.ADMIN_CHECK_FAILED, error);
    }

    return !!data;
  } catch (error) {
    console.error('Admin check failed:', error);
    throw new AppError(AUTH_ERRORS.ADMIN_CHECK_FAILED, error);
  }
}

export function withAdminCheck<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const isAdmin = await checkAdminStatus();
    
    if (!isAdmin) {
      throw new AppError(AUTH_ERRORS.UNAUTHORIZED);
    }
    
    return fn(...args);
  };
}