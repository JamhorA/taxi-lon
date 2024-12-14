import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface CompanyData {
  name: string;
  org_nr: string;
  address: string;
  postal_code: string;
  city: string;
}

export async function createCompany(companyData: CompanyData) {
  try {
    console.log('Creating company with data:', companyData);

    // Validera nödvändiga fält
    if (
      !companyData.name ||
      !companyData.org_nr ||
      !companyData.address ||
      !companyData.postal_code ||
      !companyData.city
    ) {
      throw new Error('Alla fält måste vara ifyllda.');
    }

    // 1. Skapa adressen i Addresses-tabellen
    const { data: newAddress, error: addressError } = await supabase
      .from('Addresses')
      .insert({
        address: companyData.address.trim(),
        postal_code: companyData.postal_code.trim(),
        city: companyData.city.trim()
      })
      .select()
      .single();

    if (addressError) {
      throw new Error('Kunde inte skapa adressen: ' + addressError.message);
    }

    // 2. Skapa företaget i Companies-tabellen
    const { data: newCompany, error: companyError } = await supabase
      .from('Companies')
      .insert({
        name: companyData.name.trim(),
        org_nr: companyData.org_nr.trim()
      })
      .select()
      .single();

    if (companyError) {
      throw new Error('Kunde inte skapa företag: ' + companyError.message);
    }

    // Kontrollera att både ny adress och nytt företag finns
    if (!newAddress || !newCompany) {
      throw new Error('Kunde inte skapa adress eller företag korrekt.');
    }

    // 3. Skapa relationen i Company_Addresses-tabellen
    const { data: companyAddress, error: companyAddressError } = await supabase
      .from('Company_Addresses')
      .insert({
        company_id: newCompany.id,
        address_id: newAddress.id
      })
      .select()
      .single();

    if (companyAddressError) {
      console.error('Error creating company-address relation:', companyAddressError);
      throw new Error('Kunde inte koppla företag till adress: ' + companyAddressError.message);
    }

    console.log('Company and address created successfully with a relation:', {
      company: newCompany,
      address: newAddress,
      relation: companyAddress
    });

    toast.success('Företaget har lagts till med adress!');
    return { company: newCompany, address: newAddress, relation: companyAddress };

  } catch (error) {
    console.error('Error in createCompany:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Ett oväntat fel inträffade');
    }
    throw error;
  }
}




// interface CompanyData {
//   name: string;
//   org_nr: string;
//   address: string;
//   postal_code: string;
//   city: string;
// }


// async function createCompany(companyData: CompanyData) {
//   // 1. Skapa adress
//   const { data: newAddress, error: addressError } = await supabase
//     .from('Addresses')
//     .insert({ address, postal_code, city })
//     .select()
//     .single();

//   if (addressError) {
//     throw new Error('Kunde inte skapa adress: ' + addressError.message);
//   }

//   // 2. Skapa företag
//   const { data: newCompany, error: companyError } = await supabase
//     .from('Companies')
//     .insert({ name, org_nr })
//     .select()
//     .single();

//   if (companyError) {
//     throw new Error('Kunde inte skapa företag: ' + companyError.message);
//   }

//   // 3. Koppla ihop företag och adress i Company_Addresses
//   const { data: companyAddress, error: companyAddressError } = await supabase
//     .from('Company_Addresses')
//     .insert({ company_id: newCompany.id, address_id: newAddress.id })
//     .select()
//     .single();

//   if (companyAddressError) {
//     throw new Error('Kunde inte koppla företag och adress: ' + companyAddressError.message);
//   }

//   return newCompany; // returnera företaget (eller det du behöver)
// }
