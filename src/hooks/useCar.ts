import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Car = Database['public']['Tables']['Cars']['Insert'];

export function useCar() {
  const [isLoading, setIsLoading] = useState(false);

  const createCar = async (car: Car) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('Cars')
        .insert(car)
        .select()
        .single();

      if (error) throw error;
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCar, isLoading };
}