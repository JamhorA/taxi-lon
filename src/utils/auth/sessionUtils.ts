import { Session } from '@supabase/supabase-js';
import { parseJwt } from '../../services/auth/jwtService';

export function isSessionValid(session: Session | null): boolean {
  if (!session?.access_token) return false;

  try {
    const decoded = parseJwt(session.access_token);
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() < expirationTime;
  } catch {
    return false;
  }
}

export function getSessionExpiration(session: Session | null): Date | null {
  if (!session?.access_token) return null;

  try {
    const decoded = parseJwt(session.access_token);
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}

export function shouldRefreshSession(session: Session | null): boolean {
  if (!session?.access_token) return false;

  try {
    const decoded = parseJwt(session.access_token);
    const expirationTime = decoded.exp * 1000;
    const refreshThreshold = 5 * 60 * 1000; // 5 minutes before expiration
    return Date.now() > (expirationTime - refreshThreshold);
  } catch {
    return false;
  }
}