import { supabase } from '../../lib/supabase';
import { AppError } from '../error';

/**
 * Checks if the current user has admin privileges
 * @returns Promise<boolean>
 * @throws {AppError} If the check fails
 */
export async function checkAdminStatus(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('is_admin_base');
    
    if (error) {
      throw new AppError('Failed to check admin status', error);
    }

    return !!data;
  } catch (error) {
    console.error('Admin check failed:', error);
    throw new AppError('Failed to verify admin status', error);
  }
}

/**
 * Higher-order function that wraps an async function with admin check
 * @param fn Function to protect with admin check
 * @returns Protected function that only executes if user is admin
 */
export function withAdminCheck<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const isAdmin = await checkAdminStatus();
    
    if (!isAdmin) {
      throw new AppError('Unauthorized: Admin access required');
    }
    
    return fn(...args);
  };
}