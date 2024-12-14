import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useInitialization() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkTables() {
      try {
        // Try to select from the Companies table to check if it exists
        const { error: checkError } = await supabase
          .from('Companies')
          .select('id')
          .limit(1);

        if (!checkError) {
          setInitialized(true);
          setLoading(false);
          return;
        }

        // If there's an error and it's because the table doesn't exist,
        // we'll create the tables using our migration SQL
        const { error: initError } = await supabase.rpc('initialize_database');
        
        if (initError) {
          console.error('Database initialization error:', initError);
          toast.error('Kunde inte initiera databasen');
          return;
        }

        setInitialized(true);
      } catch (error) {
        console.error('Initialization error:', error);
        toast.error('Ett fel uppstod vid initiering');
      } finally {
        setLoading(false);
      }
    }

    checkTables();
  }, []);

  return { initialized, loading };
}