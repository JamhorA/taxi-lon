import { supabase } from '../../lib/supabase';
import { AppError } from '../../utils/error';
import { AUTH_ERRORS } from '../../constants/auth';

export async function refreshSession() {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Failed to refresh session:', error);
    throw new AppError(AUTH_ERRORS.SESSION_REFRESH_FAILED, error);
  }
}

export async function getAccessToken(): Promise<string | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session?.access_token ?? null;
  } catch (error) {
    console.error('Failed to get access token:', error);
    throw new AppError(AUTH_ERRORS.TOKEN_RETRIEVAL_FAILED, error);
  }
}

export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    throw new AppError(AUTH_ERRORS.TOKEN_PARSE_FAILED, error);
  }
}