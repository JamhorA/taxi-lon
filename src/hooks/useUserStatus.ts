import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useUserStatus() {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUserStatus() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles_with_email')
          .select('is_active')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setIsActive(!!data?.is_active);
      } catch (error) {
        console.error('Error checking user status:', error);
        setIsActive(false);
      } finally {
        setLoading(false);
      }
    }

    checkUserStatus();
  }, [user]);

  return { isActive, loading };
}