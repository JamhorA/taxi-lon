import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface CarData {
  company_id: string;
  regnr: string;
  drosknr: string;
}

export async function createCar(carData: CarData) {
  try {
    console.log('Creating car with data:', carData);

    // Validate required fields
    if (!carData.company_id || !carData.regnr || !carData.drosknr) {
      throw new Error('Företags-ID, registreringsnummer och drosknummer krävs');
    }

    // Format registration number
    const formattedRegNr = carData.regnr.trim().toUpperCase();

    // Insert new car with conflict handling
    const { data: car, error } = await supabase
      .from('Cars')
      .insert({
        company_id: carData.company_id,
        regnr: formattedRegNr,
        drosknr: carData.drosknr
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('En bil med detta registreringsnummer eller drosknummer finns redan');
      }
      console.error('Error creating car:', error);
      throw error;
    }

    console.log('Car created successfully:', car);
    toast.success('Bilen har lagts till');
    return car;
  } catch (error) {
    console.error('Error in createCar:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Ett oväntat fel inträffade');
    }
    throw error;
  }
}