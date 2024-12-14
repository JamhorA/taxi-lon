import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import toast from 'react-hot-toast';

type CompanyRow = Database['public']['Tables']['Companies']['Row'];

interface CreateCompanyParams {
  name: string;
  org_nr: string;
  address: string;
  postal_code: string;
  city: string;
}

export function useCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyRow[]>([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('Companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Kunde inte hämta företag');
      return [];
    }
  };

  const createCompany = async ({ name, org_nr, address, postal_code, city }: CreateCompanyParams) => {
    setIsLoading(true);
    try {
      // Hämta nuvarande inloggad användare
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user found');

      // 1. Skapa en adresspost
      const { data: newAddress, error: addressError } = await supabase
        .from('Addresses')
        .insert({
          address: address.trim(),
          postal_code: postal_code.trim(),
          city: city.trim()
        })
        .select()
        .single();

      if (addressError) {
        throw new Error('Kunde inte skapa adress: ' + addressError.message);
      }

      // 2. Skapa företaget
      const { data: newCompany, error: companyError } = await supabase
        .from('Companies')
        .insert({
          name: name.trim(),
          org_nr: org_nr.trim()
        })
        .select()
        .single();

      if (companyError) throw new Error('Kunde inte skapa företag: ' + companyError.message);

      // 3. Koppla företaget till adressen i Company_Addresses
      const { error: companyAddressError } = await supabase
        .from('Company_Addresses')
        .insert({
          company_id: newCompany.id,
          address_id: newAddress.id
        });

      if (companyAddressError) {
        throw new Error('Kunde inte koppla företag och adress: ' + companyAddressError.message);
      }

      // 4. Skapa adminroll för den nuvarande användaren
      const { error: roleError } = await supabase
        .from('User_Roles')
        .insert({
          user_id: user.id,
          company_id: newCompany.id,
          role: 'admin'
        });

      if (roleError) {
        throw new Error('Kunde inte skapa adminroll: ' + roleError.message);
      }

      // Uppdatera listan av företag
      await fetchCompanies();

      return newCompany;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCompany, fetchCompanies, companies, isLoading };
}



// import { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabase';
// import { Database } from '../types/supabase';
// import toast from 'react-hot-toast';

// type Company = Database['public']['Tables']['Companies']['Insert'];

// interface CreateCompanyParams extends Omit<Company, 'id' | 'created_at'> {
//   adminEmail: string;
// }

// export function useCompany() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [companies, setCompanies] = useState<Array<Database['public']['Tables']['Companies']['Row']>>([]);

//   useEffect(() => {
//     fetchCompanies();
//   }, []);

//   const fetchCompanies = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('Companies')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setCompanies(data || []);
//       return data;
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//       toast.error('Kunde inte hämta företag');
//       return [];
//     }
//   };

//   const createCompany = async ({ adminEmail, ...companyData }: CreateCompanyParams) => {
//     setIsLoading(true);
//     try {
//       // Get the current user
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;
//       if (!user) throw new Error('No authenticated user found');

//       // Create the company
//       const { data: company, error: companyError } = await supabase
//         .from('Companies')
//         .insert(companyData)
//         .select()
//         .single();

//       if (companyError) throw companyError;

//       // Create admin role
//       const { error: roleError } = await supabase
//         .from('User_Roles')
//         .insert({
//           user_id: user.id,
//           company_id: company.id,
//           role: 'admin'
//         });

//       if (roleError) throw roleError;

//       await fetchCompanies();
//       return company;
//     } catch (error) {
//       console.error('Error creating company:', error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { createCompany, fetchCompanies, companies, isLoading };
// }