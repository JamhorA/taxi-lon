import { supabase } from '../../lib/supabase';
import { AppError } from '../../utils/error';
import { AUTH_ERRORS } from '../../constants/auth';
import { refreshSession, getAccessToken } from './jwtService';

export async function initializeSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Failed to initialize session:', error);
    throw new AppError(AUTH_ERRORS.SESSION_INIT_FAILED, error);
  }
}

export async function validateSession() {
  try {
    const token = await getAccessToken();
    if (!token) {
      return false;
    }

    // Check if token is expired
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      // Try to refresh the session
      const refreshedSession = await refreshSession();
      return !!refreshedSession;
    }

    return true;
  } catch (error) {
    console.error('Session validation failed:', error);
    return false;
  }
}

export async function getSessionUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Failed to get session user:', error);
    throw new AppError(AUTH_ERRORS.USER_RETRIEVAL_FAILED, error);
  }
}