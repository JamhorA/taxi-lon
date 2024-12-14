import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { initializeSession, validateSession } from '../services/auth/sessionService';
import { AUTH_ERRORS } from '../constants/auth';
import toast from 'react-hot-toast';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        setLoading(true);
        setError(null);

        const currentSession = await initializeSession();
        if (!mounted) return;

        if (currentSession) {
          const isValid = await validateSession();
          if (!isValid) {
            setError(AUTH_ERRORS.SESSION_EXPIRED);
            toast.error(AUTH_ERRORS.SESSION_EXPIRED);
            return;
          }
        }

        setSession(currentSession);
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : AUTH_ERRORS.SESSION_INIT_FAILED;
        setError(message);
        toast.error(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  return { session, loading, error };
}