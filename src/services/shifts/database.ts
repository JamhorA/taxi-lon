import { supabase } from '../../lib/supabase';
import { ShiftInput } from './types';

export async function insertShift(data: ShiftInput) {
  try {
    console.log('Inserting shift with data:', JSON.stringify(data, null, 2));

    // Explicitly map all fields to ensure nothing is missed
    const shiftData = {
      car_id: data.car_id,
      driver_id: data.driver_id,
      start_time: data.start_time,
      end_time: data.end_time,
      taxi_km: Number(data.taxi_km) || 0,
      paid_km: Number(data.paid_km) || 0,
      trips: Number(data.trips) || 0,
      report_nr: data.report_nr,
      cash: Number(data.cash) || 0,
      to_report: Number(data.to_report) || 0,
      total_credit: Number(data.total_credit) || 0,
      drikskredit: Number(data.drikskredit) || 0,
      lonegr_ex_moms: Number(data.lonegr_ex_moms) || 0
    };

    console.log('Database Insert - Financial Values:', {
      cash: shiftData.cash,
      total_credit: shiftData.total_credit,
      drikskredit: shiftData.drikskredit,
      to_report: shiftData.to_report,
      lonegr_ex_moms: shiftData.lonegr_ex_moms
    });

    const { data: shift, error } = await supabase
      .from('Shifts')
      .insert([shiftData])
      .select(`
        *,
        car:Cars(*),
        driver:Drivers(*),
        vat_details:VAT_Details(*),
        bom_details:BOM_Details(*),
        total_inkort_details:Total_Inkort_Details(*)
      `)
      .single();

    if (error) {
      console.error('Error inserting shift:', error);
      throw new Error(`Failed to insert shift: ${error.message}`);
    }

    console.log('Successfully inserted shift:', shift);
    return shift;
  } catch (error) {
    console.error('Unexpected error in insertShift:', error);
    throw error;
  }
}

export async function checkShiftExists(data: Partial<ShiftInput>) {
  try {
    console.log('Checking for existing shift with:', {
      car_id: data.car_id,
      driver_id: data.driver_id,
      report_nr: data.report_nr,
      start_time: data.start_time,
      end_time: data.end_time,
    });
    const { data: existingShift, error } = await supabase
      .from('Shifts')
      .select('id')
      .eq('car_id', data.car_id)
      .eq('driver_id', data.driver_id)
      .eq('report_nr', data.report_nr)
      .eq('start_time', data.start_time)
      .eq('end_time', data.end_time)
      .limit(1);

    if (error) {
      console.error('Error checking shift existence:', error);
      throw new Error(`Failed to check shift existence: ${error.message}`);
    }

    const exists = existingShift && existingShift.length > 0;
    console.log('Shift exists:', exists);
    return exists;
  } catch (error) {
    console.error('Error in checkShiftExists:', error);
    return false;
  }
}

export async function insertVatDetails(details: {
  shift_id: string;
  vat_rate: number;
  gross_income: number;
  net_income: number;
  vat_amount: number;
  type: 'kontant' | 'kredit';
}[]) {
  if (!details || details.length === 0) {
    console.log('No VAT details to insert.');
    return;
  }

  try {
    console.log('Inserting VAT details:', JSON.stringify(details, null, 2));

    const { error } = await supabase
      .from('VAT_Details')
      .insert(details);

    if (error) {
      console.error('Error inserting VAT details:', error);
      throw new Error(`Failed to insert VAT details: ${error.message}`);
    }

    console.log('Successfully inserted VAT details.');
  } catch (error) {
    console.error('Unexpected error in insertVatDetails:', error);
    throw error;
  }
}

export async function insertTotalInkortDetails(details: {
  shift_id: string;
  total_inkort: number;
  moms_percentage: number;
  brutto: number;
  netto: number;
  moms_kr: number;
}[]) {
  if (!details || details.length === 0) {
    console.log('No total inkört details to insert.');
    return;
  }

  try {
    console.log('Inserting total inkört details:', JSON.stringify(details, null, 2));

    const { error } = await supabase
      .from('Total_Inkort_Details')
      .insert(details);

    if (error) {
      console.error('Error inserting total inkört details:', error);
      throw new Error(`Failed to insert total inkört details: ${error.message}`);
    }

    console.log('Successfully inserted total inkört details.');
  } catch (error) {
    console.error('Unexpected error in insertTotalInkortDetails:', error);
    throw error;
  }
}

export async function insertBomDetails(details: {
  shift_id: string;
  moms_percentage: number;
  brutto: number;
  netto: number;
  moms_kr: number;
}[]) {
  if (!details || details.length === 0) {
    console.log('No BOM details to insert.');
    return;
  }

  try {
    console.log('Inserting BOM details:', JSON.stringify(details, null, 2));

    const { error } = await supabase
      .from('BOM_Details')
      .insert(details);

    if (error) {
      console.error('Error inserting BOM details:', error);
      throw new Error(`Failed to insert BOM details: ${error.message}`);
    }

    console.log('Successfully inserted BOM details.');
  } catch (error) {
    console.error('Unexpected error in insertBomDetails:', error);
    throw error;
  }
}