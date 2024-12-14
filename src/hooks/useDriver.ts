import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Driver = Database['public']['Tables']['Drivers']['Insert'];

export function useDriver() {
  const [isLoading, setIsLoading] = useState(false);

  const createDriver = async (driver: Driver) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('Drivers')
        .insert(driver)
        .select()
        .single();

      if (error) throw error;
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  return { createDriver, isLoading };
}