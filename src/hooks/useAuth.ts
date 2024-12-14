import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { signIn, signOut, signUp } from '../services/auth';
import { AuthState } from '../types/auth';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    initialized: false
  });

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (mounted) {
          setState({
            user: session?.user ?? null,
            loading: false,
            initialized: true
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            initialized: true 
          }));
        }
      }
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setState(prev => ({
          ...prev,
          user: session?.user ?? null,
          loading: false
        }));
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async (email: string, password: string) => {
    try {
      await signUp(email, password);
      toast.success('Account created! Please check your email for verification.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create account';
      toast.error(message);
      throw error;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      toast.success('Signed in successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      toast.error(message);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign out';
      toast.error(message);
      throw error;
    }
  };

  return {
    ...state,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut
  };
}