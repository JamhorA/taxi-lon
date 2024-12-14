import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import toast from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Skapa Supabase-klienten
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Initialisera databasen
export async function initializeDatabase() {
  try {
    // Kontrollera om Companies-tabellen existerar
    const { data: companies, error: checkError } = await supabase
      .from('Companies')
      .select('id')
      .limit(1);

    if (!checkError) {
      // Tabeller finns redan
      return true;
    }

    // Skapa tabeller med RPC
    const { error: tablesError } = await supabase.rpc('create_tables');
    if (tablesError) {
      console.error('Error creating tables:', tablesError);
      return false;
    }

    // Sätt upp RLS-policys
    const { error: policiesError } = await supabase.rpc('setup_policies');
    if (policiesError) {
      console.error('Error setting up policies:', policiesError);
      return false;
    }

    toast.success('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    toast.error('Kunde inte initiera databasen');
    return false;
  }
}

// Kontrollera om databasen är korrekt konfigurerad
export async function checkDatabaseSetup() {
  try {
    const { data: companies, error: companiesError } = await supabase
      .from('Companies')
      .select('id')
      .limit(1);

    if (!companiesError) {
      return true;
    }

    // Om tabellerna inte existerar, initialisera databasen
    return await initializeDatabase();
  } catch (error) {
    console.error('Error checking database setup:', error);
    return false;
  }
}

// Funktion för att hantera fel i Supabase
export function handleError(error: any, message: string) {
  console.error(message, error);
  toast.error(message);
  throw new Error(message);
}

// Lägg till en funktion för att verifiera om användaren är admin
export async function checkAdminStatus(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('is_admin_base');
    if (error) throw error;

    return !!data; // Konvertera resultatet till boolean
  } catch (error) {
    return handleError(error, 'Failed to check admin status');
  }
}

// Funktion för att hämta användare med roller (exempel för integration)
export async function getUsersWithRoles() {
  try {
    const { data, error } = await supabase
      .from('auth.users')
      .select(`
        id,
        email,
        created_at,
        user_roles:User_Roles(
          id,
          role,
          company_id,
          is_active,
          created_at
        )
      `);

    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleError(error, 'Failed to fetch users with roles');
  }
}



// import { createClient } from '@supabase/supabase-js';
// import { Database } from '../types/supabase';
// import toast from 'react-hot-toast';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
//   auth: {
//     autoRefreshToken: true,
//     persistSession: true
//   }
// });

// // Initialize database tables
// export async function initializeDatabase() {
//   try {
//     // Check if tables exist first
//     const { data: companies, error: checkError } = await supabase
//       .from('Companies')
//       .select('id')
//       .limit(1);

//     if (!checkError) {
//       // Tables already exist
//       return true;
//     }

//     // Create tables
//     const { error: tablesError } = await supabase.rpc('create_tables');
//     if (tablesError) {
//       console.error('Error creating tables:', tablesError);
//       return false;
//     }

//     // Set up RLS policies
//     const { error: policiesError } = await supabase.rpc('setup_policies');
//     if (policiesError) {
//       console.error('Error setting up policies:', policiesError);
//       return false;
//     }

//     return true;
//   } catch (error) {
//     console.error('Error initializing database:', error);
//     toast.error('Kunde inte initiera databasen');
//     return false;
//   }
// }

// // Check if tables exist
// export async function checkDatabaseSetup() {
//   try {
//     const { data: companies, error: companiesError } = await supabase
//       .from('Companies')
//       .select('id')
//       .limit(1);

//     if (!companiesError) {
//       return true;
//     }

//     // If tables don't exist, initialize the database
//     return await initializeDatabase();
//   } catch (error) {
//     console.error('Error checking database setup:', error);
//     return false;
//   }
// }