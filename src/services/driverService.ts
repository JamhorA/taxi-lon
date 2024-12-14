import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface DriverData {
  company_id: string;
  forarid: string;
  name: string;
  efternamn: string;
  personnummer: string;
  address: string;
  postal_code: string;
  city: string;
}

export async function createDriver(driverData: DriverData) {
  try {
    console.log('Creating driver with data:', driverData);

    // Validera nödvändiga fält
    if (
      !driverData.company_id ||
      !driverData.forarid ||
      !driverData.name ||
      !driverData.efternamn ||
      !driverData.personnummer ||
      !driverData.address ||
      !driverData.postal_code ||
      !driverData.city
    ) {
      throw new Error('Alla fält måste vara ifyllda.');
    }

    // 1. Skapa adressen i Addresses-tabellen
    const { data: newAddress, error: addressError } = await supabase
      .from('Addresses')
      .insert({
        address: driverData.address.trim(),
        postal_code: driverData.postal_code.trim(),
        city: driverData.city.trim()
      })
      .select()
      .single();

    if (addressError) {
      throw new Error('Kunde inte skapa adressen: ' + addressError.message);
    }

    // 2. Skapa föraren i Drivers-tabellen (obs: ingen address_id här längre)
    const { data: newDriver, error: driverError } = await supabase
      .from('Drivers')
      .insert({
        company_id: driverData.company_id,
        forarid: driverData.forarid.trim(),
        name: driverData.name.trim(),
        efternamn: driverData.efternamn.trim(),
        personnummer: driverData.personnummer.trim()
      })
      .select()
      .single();

    if (driverError) {
      if (driverError.code === '23505') {
        throw new Error('En förare med detta förar-ID finns redan');
      }
      console.error('Error creating driver:', driverError);
      throw driverError;
    }

    // Kontrollera att både ny adress och ny förare finns
    if (!newAddress || !newDriver) {
      throw new Error('Kunde inte skapa adress eller förare korrekt.');
    }

    // 3. Skapa relationen i Driver_Addresses-tabellen
    const { data: driverAddress, error: driverAddressError } = await supabase
      .from('Driver_Addresses')
      .insert({
        driver_id: newDriver.id,
        address_id: newAddress.id
      })
      .select()
      .single();

    if (driverAddressError) {
      console.error('Error creating driver-address relation:', driverAddressError);
      throw new Error('Kunde inte koppla förare till adress: ' + driverAddressError.message);
    }

    console.log('Driver and address created successfully with a relation:', {
      driver: newDriver,
      address: newAddress,
      relation: driverAddress
    });

    toast.success('Föraren har lagts till med adress!');
    return { driver: newDriver, address: newAddress, relation: driverAddress };

  } catch (error) {
    console.error('Error in createDriver:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Ett oväntat fel inträffade');
    }
    throw error;
  }
}




// import { supabase } from '../lib/supabase';
// import { toast } from 'react-hot-toast';

// interface DriverData {
//   company_id: string;
//   forarid: string;
//   name: string;
//   efternamn: string;
//   personnummer: string;
//   address: string;
//   postal_code: string;
//   city: string;
// }

// export async function createDriver(driverData: DriverData) {
//   try {
//     console.log('Creating driver with data:', driverData);

//     // Validate required fields
//     if (
//       !driverData.company_id ||
//       !driverData.forarid ||
//       !driverData.name ||
//       !driverData.efternamn ||
//       !driverData.personnummer ||
//       !driverData.address ||
//       !driverData.postal_code ||
//       !driverData.city
//     ) {
//       throw new Error('Alla fält måste vara ifyllda.');
//     }

//     // Skapa först adressen
//     const { data: newAddress, error: addressError } = await supabase
//       .from('Addresses')
//       .insert({
//         address: driverData.address.trim(),
//         postal_code: driverData.postal_code.trim(),
//         city: driverData.city.trim()
//       })
//       .select()
//       .single();

//     if (addressError) {
//       throw new Error('Kunde inte skapa adressen: ' + addressError.message);
//     }

//     // Skapa sedan föraren och referera till adressen
//     const { data: driver, error: driverError } = await supabase
//       .from('Drivers')
//       .insert({
//         company_id: driverData.company_id,
//         forarid: driverData.forarid.trim(),
//         name: driverData.name.trim(),
//         efternamn: driverData.efternamn.trim(),
//         personnummer: driverData.personnummer.trim(),
//         address_id: newAddress.id
//       })
//       .select()
//       .single();

//     if (driverError) {
//       if (driverError.code === '23505') {
//         throw new Error('En förare med detta förar-ID finns redan');
//       }
//       console.error('Error creating driver:', driverError);
//       throw driverError;
//     }

//     console.log('Driver created successfully:', driver);
//     toast.success('Föraren har lagts till');
//     return driver;

//   } catch (error) {
//     console.error('Error in createDriver:', error);
//     if (error instanceof Error) {
//       toast.error(error.message);
//     } else {
//       toast.error('Ett oväntat fel inträffade');
//     }
//     throw error;
//   }
// }





// import { supabase } from '../lib/supabase';
// import { toast } from 'react-hot-toast';

// interface DriverData {
//   company_id: string;
//   forarid: string;
//   name: string;
// }

// export async function createDriver(driverData: DriverData) {
//   try {
//     console.log('Creating driver with data:', driverData);

//     // Validate required fields
//     if (!driverData.company_id || !driverData.forarid || !driverData.name) {
//       throw new Error('Företags-ID, förar-ID och namn krävs');
//     }

//     // Format driver ID and name
//     const formattedForarId = driverData.forarid.trim();
//     const formattedName = driverData.name.trim();

//     // Insert new driver with conflict handling
//     const { data: driver, error } = await supabase
//       .from('Drivers')
//       .insert({
//         company_id: driverData.company_id,
//         forarid: formattedForarId,
//         name: formattedName
//       })
//       .select()
//       .single();

//     if (error) {
//       if (error.code === '23505') { // Unique violation
//         throw new Error('En förare med detta förar-ID finns redan');
//       }
//       console.error('Error creating driver:', error);
//       throw error;
//     }

//     console.log('Driver created successfully:', driver);
//     toast.success('Föraren har lagts till');
//     return driver;
//   } catch (error) {
//     console.error('Error in createDriver:', error);
//     if (error instanceof Error) {
//       toast.error(error.message);
//     } else {
//       toast.error('Ett oväntat fel inträffade');
//     }
//     throw error;
//   }
// }