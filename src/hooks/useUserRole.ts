import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ROLES } from '../constants/roles';
import toast from 'react-hot-toast';

export function useUserRole() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const { data, error } = await supabase.rpc('is_admin_base');
        
        if (error) {
          console.error('Error checking admin status:', error);
          toast.error('Could not verify admin status');
          return;
        }

        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, []);

  return { isAdmin, loading };
}