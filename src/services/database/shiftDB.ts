import { supabase } from '../../lib/supabase';
import type { ShiftData, VATDetailData, BOMDetailData } from '../validation/shiftValidation';

/**
 * Inserts a new shift into the database.
 */
export async function insertShift(shiftData: ShiftData) {
  try {
    const { data: shift, error } = await supabase
      .from('Shifts')
      .insert(shiftData)
      .select()
      .single();

    if (error) {
      console.error('Database error inserting shift:', error);
      throw new Error(`Failed to insert shift: ${error.message}`);
    }

    console.log('Shift successfully inserted:', shift);
    return shift;
  } catch (error) {
    console.error('Error in insertShift:', error);
    throw error;
  }
}

/**
 * Inserts VAT details into the database.
 */
export async function insertVATDetails(vatDetails: VATDetailData[]) {
  if (!vatDetails || vatDetails.length === 0) {
    console.warn('No VAT details to insert.');
    return;
  }

  try {
    const { error } = await supabase.from('VAT_Details').insert(vatDetails);

    if (error) {
      console.error('Database error inserting VAT details:', error);
      throw new Error(`Failed to insert VAT details: ${error.message}`);
    }

    console.log('VAT details successfully inserted.');
  } catch (error) {
    console.error('Error in insertVATDetails:', error);
    throw error;
  }
}

/**
 * Inserts BOM details into the database.
 */
export async function insertBOMDetails(bomDetails: BOMDetailData[]) {
  if (!bomDetails || bomDetails.length === 0) {
    console.warn('No BOM details to insert.');
    return;
  }

  try {
    const { error } = await supabase.from('BOM_Details').insert(bomDetails);

    if (error) {
      console.error('Database error inserting BOM details:', error);
      throw new Error(`Failed to insert BOM details: ${error.message}`);
    }

    console.log('BOM details successfully inserted.');
  } catch (error) {
    console.error('Error in insertBOMDetails:', error);
    throw error;
  }
}

/**
 * Checks if a shift with the specified details already exists.
 */
export async function checkShiftExists(shiftData: ShiftData) {
  try {
    const { data, error } = await supabase
      .from('Shifts')
      .select('id')
      .eq('car_id', shiftData.car_id)
      .eq('driver_id', shiftData.driver_id)
      .eq('start_time', shiftData.start_time)
      .eq('end_time', shiftData.end_time)
      .eq('report_nr', shiftData.report_nr)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Database error checking shift:', error);
      throw new Error(`Failed to check shift existence: ${error.message}`);
    }

    const exists = !!data;
    console.log('Shift exists:', exists);
    return exists;
  } catch (error) {
    console.error('Error in checkShiftExists:', error);
    throw error;
  }
}

/**
 * Retrieves a shift along with all its associated details.
 */
export async function getShiftById(shiftId: string) {
  try {
    const { data, error } = await supabase
      .from('Shifts')
      .select(`
        *,
        car:car_id(*),
        driver:driver_id(*),
        vat_details:VAT_Details(*),
        bom_details:BOM_Details(*),
        total_inkort_details:Total_Inkort_Details(*)
      `)
      .eq('id', shiftId)
      .single();

    if (error) {
      console.error('Database error fetching shift:', error);
      throw new Error(`Failed to fetch shift: ${error.message}`);
    }

    console.log('Fetched shift with details:', data);
    return data;
  } catch (error) {
    console.error('Error in getShiftById:', error);
    throw error;
  }
}
